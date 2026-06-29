import type { Prisma, LeadStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere } from "../../lib/tenant.js";
import { NotFoundError } from "../../lib/errors.js";
import { emitTrigger } from "../automations/automation.engine.js";

type ListParams = {
  status?: LeadStatus;
  temperature?: string;
  assignedToId?: string;
  search?: string;
  skip: number;
  take: number;
  sortBy: string;
  sortDir: "asc" | "desc";
};

const include = { assignedTo: { select: { id: true, name: true, avatarUrl: true } }, customer: { select: { id: true, name: true } } };

export const leadsService = {
  async list(orgId: string, p: ListParams) {
    const where: Prisma.LeadWhereInput = {
      ...tenantWhere(orgId),
      ...(p.status ? { status: p.status } : {}),
      ...(p.temperature ? { temperature: p.temperature as never } : {}),
      ...(p.assignedToId ? { assignedToId: p.assignedToId } : {}),
      ...(p.search
        ? {
            OR: [
              { name: { contains: p.search, mode: "insensitive" } },
              { contactName: { contains: p.search, mode: "insensitive" } },
              { email: { contains: p.search, mode: "insensitive" } },
              { eventType: { contains: p.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      prisma.lead.findMany({ where, include, orderBy: { [p.sortBy]: p.sortDir }, skip: p.skip, take: p.take }),
      prisma.lead.count({ where }),
    ]);
    return { items, total };
  },

  async get(orgId: string, id: string) {
    const lead = await prisma.lead.findFirst({
      where: { id, ...tenantWhere(orgId) },
      include: { ...include, activities: { orderBy: { createdAt: "desc" } }, notesRel: { orderBy: { createdAt: "desc" } } },
    });
    if (!lead) throw new NotFoundError("Lead not found");
    return lead;
  },

  async create(orgId: string, data: Prisma.LeadUncheckedCreateInput) {
    const lead = await prisma.lead.create({ data: { ...data, organizationId: orgId } });
    await prisma.activity.create({ data: { leadId: lead.id, kind: "note", title: "Lead created", actor: "System" } });
    await emitTrigger(orgId, "LEAD_CREATED", { leadId: lead.id });
    await emitTrigger(orgId, "NEW_ENQUIRY", { leadId: lead.id });
    return lead;
  },

  async update(orgId: string, id: string, data: Prisma.LeadUncheckedUpdateInput) {
    await this.get(orgId, id);
    return prisma.lead.update({ where: { id }, data });
  },

  async remove(orgId: string, id: string) {
    await this.get(orgId, id);
    await prisma.lead.update({ where: { id }, data: { deletedAt: new Date() } });
    return { ok: true };
  },

  async updateStatus(orgId: string, id: string, status: LeadStatus) {
    const lead = await this.get(orgId, id);
    const updated = await prisma.lead.update({ where: { id }, data: { status } });
    await prisma.activity.create({
      data: { leadId: id, kind: "stage", title: `Stage changed to ${status}`, body: `from ${lead.status}`, actor: "System" },
    });
    return updated;
  },

  async assign(orgId: string, id: string, assignedToId: string | null) {
    await this.get(orgId, id);
    return prisma.lead.update({ where: { id }, data: { assignedToId } });
  },

  async addNote(orgId: string, id: string, body: string, authorId?: string) {
    await this.get(orgId, id);
    const note = await prisma.note.create({ data: { leadId: id, body, authorId } });
    await prisma.activity.create({ data: { leadId: id, kind: "note", title: "Note added", body, actor: "User" } });
    return note;
  },

  async convertToCustomer(orgId: string, id: string) {
    const lead = await this.get(orgId, id);
    let customerId = lead.customerId;
    if (!customerId) {
      const customer = await prisma.customer.create({
        data: {
          organizationId: orgId,
          name: lead.contactName,
          company: lead.company,
          email: lead.email,
          phone: lead.phone,
          location: lead.location,
          tags: lead.tags,
        },
      });
      customerId = customer.id;
    }
    await prisma.lead.update({ where: { id }, data: { customerId, status: "QUALIFIED" } });
    return { customerId };
  },

  async bulk(orgId: string, body: { ids: string[]; action: string; status?: LeadStatus; assignedToId?: string | null; tag?: string }) {
    const where = { id: { in: body.ids }, ...tenantWhere(orgId) };
    if (body.action === "delete") {
      await prisma.lead.updateMany({ where, data: { deletedAt: new Date() } });
    } else if (body.action === "status" && body.status) {
      await prisma.lead.updateMany({ where, data: { status: body.status } });
    } else if (body.action === "assign") {
      await prisma.lead.updateMany({ where, data: { assignedToId: body.assignedToId ?? null } });
    } else if (body.action === "tag" && body.tag) {
      const leads = await prisma.lead.findMany({ where, select: { id: true, tags: true } });
      await Promise.all(
        leads.map((l) =>
          prisma.lead.update({ where: { id: l.id }, data: { tags: Array.from(new Set([...l.tags, body.tag!])) } }),
        ),
      );
    }
    return { count: body.ids.length };
  },

  async importRows(orgId: string, rows: Array<Record<string, unknown>>) {
    const data = rows
      .filter((r) => r.email)
      .map((r) => ({
        organizationId: orgId,
        name: String(r.name ?? r.contactName ?? "Imported lead"),
        contactName: String(r.contactName ?? r.name ?? "Unknown"),
        email: String(r.email),
        phone: r.phone ? String(r.phone) : undefined,
        eventType: r.eventType ? String(r.eventType) : undefined,
        value: r.value ? Number(r.value) : 0,
      }));
    const result = await prisma.lead.createMany({ data });
    return { imported: result.count };
  },

  async exportCsv(orgId: string) {
    const leads = await prisma.lead.findMany({ where: tenantWhere(orgId), orderBy: { createdAt: "desc" } });
    const header = ["id", "name", "contactName", "email", "phone", "status", "eventType", "value", "createdAt"];
    const rows = leads.map((l) =>
      [l.id, l.name, l.contactName, l.email, l.phone ?? "", l.status, l.eventType ?? "", l.value.toString(), l.createdAt.toISOString()]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    return [header.join(","), ...rows].join("\n");
  },

  async stats(orgId: string) {
    const grouped = await prisma.lead.groupBy({
      by: ["status"],
      where: tenantWhere(orgId),
      _count: true,
      _sum: { value: true },
    });
    const open = await prisma.lead.aggregate({
      where: { ...tenantWhere(orgId), status: { notIn: ["COMPLETED", "LOST"] } },
      _sum: { value: true },
      _count: true,
    });
    return {
      byStatus: grouped.map((g) => ({ status: g.status, count: g._count, value: g._sum.value })),
      openValue: open._sum.value ?? 0,
      openCount: open._count,
    };
  },
};
