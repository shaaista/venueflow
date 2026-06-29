import { Router } from "express";
import { z } from "zod";
import type { Prisma, EventStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere, getOrgId } from "../../lib/tenant.js";
import { NotFoundError } from "../../lib/errors.js";
import { sendSuccess, getPagination, getListQuery, paginatedMeta, asyncHandler } from "../../lib/http.js";
import { auditFromReq } from "../../lib/audit.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { emitTrigger } from "../automations/automation.engine.js";

const EventStatusEnum = z.enum(["INQUIRY", "PROPOSAL_SENT", "AWAITING_DEPOSIT", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);
const createSchema = z.object({
  title: z.string().min(1),
  type: z.string().optional(),
  customerId: z.string().optional(),
  spaceId: z.string().optional(),
  date: z.coerce.date(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  guests: z.coerce.number().int().nonnegative().optional(),
  budget: z.coerce.number().nonnegative().optional(),
  value: z.coerce.number().nonnegative().optional(),
  status: EventStatusEnum.optional(),
  coordinatorId: z.string().optional(),
  notes: z.string().optional(),
});
const updateSchema = createSchema.partial();
const scheduleSchema = z.object({ time: z.string(), title: z.string(), note: z.string().optional() });
const guestSchema = z.object({ name: z.string(), role: z.string().optional(), rsvp: z.string().optional(), meal: z.string().optional() });
const checklistSchema = z.object({ label: z.string() });

const include = {
  customer: { select: { id: true, name: true, email: true } },
  space: { select: { id: true, name: true } },
  coordinator: { select: { id: true, name: true, avatarUrl: true } },
};

export const eventsService = {
  async list(orgId: string, opts: { status?: EventStatus; from?: Date; to?: Date; search?: string; skip: number; take: number; sortBy: string; sortDir: "asc" | "desc" }) {
    const where: Prisma.EventWhereInput = {
      ...tenantWhere(orgId),
      ...(opts.status ? { status: opts.status } : {}),
      ...(opts.from || opts.to ? { date: { gte: opts.from, lte: opts.to } } : {}),
      ...(opts.search ? { title: { contains: opts.search, mode: "insensitive" } } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.event.findMany({ where, include, orderBy: { [opts.sortBy]: opts.sortDir }, skip: opts.skip, take: opts.take }),
      prisma.event.count({ where }),
    ]);
    return { items, total };
  },
  async get(orgId: string, id: string) {
    const event = await prisma.event.findFirst({
      where: { id, ...tenantWhere(orgId) },
      include: { ...include, scheduleItems: { orderBy: { order: "asc" } }, guestList: true, checklist: { orderBy: { order: "asc" } }, tasks: true },
    });
    if (!event) throw new NotFoundError("Event not found");
    return event;
  },
  async create(orgId: string, data: Prisma.EventUncheckedCreateInput) {
    return prisma.event.create({ data: { ...data, organizationId: orgId } });
  },
  async update(orgId: string, id: string, data: Prisma.EventUncheckedUpdateInput) {
    await this.get(orgId, id);
    const event = await prisma.event.update({ where: { id }, data });
    if (data.status === "CONFIRMED") await emitTrigger(orgId, "EVENT_CONFIRMED", { eventId: id });
    if (data.status === "COMPLETED") await emitTrigger(orgId, "EVENT_COMPLETED", { eventId: id });
    return event;
  },
  async remove(orgId: string, id: string) {
    await this.get(orgId, id);
    await prisma.event.update({ where: { id }, data: { deletedAt: new Date(), status: "CANCELLED" } });
    return { ok: true };
  },
  async duplicate(orgId: string, id: string) {
    const e = await this.get(orgId, id);
    return prisma.event.create({
      data: {
        organizationId: orgId, title: `${e.title} (copy)`, type: e.type, customerId: e.customerId, spaceId: e.spaceId,
        date: e.date, startTime: e.startTime, endTime: e.endTime, guests: e.guests, budget: e.budget, value: e.value,
        status: "INQUIRY", coordinatorId: e.coordinatorId,
      },
    });
  },
  async addSchedule(orgId: string, id: string, data: z.infer<typeof scheduleSchema>) {
    await this.get(orgId, id);
    const count = await prisma.scheduleItem.count({ where: { eventId: id } });
    return prisma.scheduleItem.create({ data: { eventId: id, ...data, order: count } });
  },
  async addGuest(orgId: string, id: string, data: z.infer<typeof guestSchema>) {
    await this.get(orgId, id);
    return prisma.guest.create({ data: { eventId: id, ...data } });
  },
  async addChecklist(orgId: string, id: string, label: string) {
    await this.get(orgId, id);
    const count = await prisma.checklistItem.count({ where: { eventId: id } });
    return prisma.checklistItem.create({ data: { eventId: id, label, order: count } });
  },
  async toggleChecklist(orgId: string, eventId: string, itemId: string) {
    await this.get(orgId, eventId);
    const item = await prisma.checklistItem.findFirst({ where: { id: itemId, eventId } });
    if (!item) throw new NotFoundError("Checklist item not found");
    return prisma.checklistItem.update({ where: { id: itemId }, data: { done: !item.done } });
  },
};

export const eventsRouter: Router = Router();
eventsRouter.use(authenticate, requireOrg);

eventsRouter.get("/", asyncHandler(async (req, res) => {
  const orgId = getOrgId(req);
  const pg = getPagination(req);
  const lq = getListQuery(req);
  const { items, total } = await eventsService.list(orgId, {
    status: req.query.status as EventStatus,
    from: req.query.from ? new Date(req.query.from as string) : undefined,
    to: req.query.to ? new Date(req.query.to as string) : undefined,
    search: lq.search, skip: pg.skip, take: pg.take, sortBy: lq.sortBy === "createdAt" ? "date" : lq.sortBy, sortDir: lq.sortDir,
  });
  sendSuccess(res, items, 200, paginatedMeta(total, pg));
}));
eventsRouter.get("/:id", asyncHandler(async (req, res) => sendSuccess(res, await eventsService.get(getOrgId(req), req.params.id))));
eventsRouter.post("/", requirePermission("create"), validate({ body: createSchema }), asyncHandler(async (req, res) => {
  const e = await eventsService.create(getOrgId(req), req.body);
  auditFromReq(req, "event.create", { entity: "Event", entityId: e.id });
  sendSuccess(res, e, 201);
}));
eventsRouter.patch("/:id", requirePermission("update"), validate({ body: updateSchema }), asyncHandler(async (req, res) => sendSuccess(res, await eventsService.update(getOrgId(req), req.params.id, req.body))));
eventsRouter.delete("/:id", requirePermission("delete"), asyncHandler(async (req, res) => { await eventsService.remove(getOrgId(req), req.params.id); sendSuccess(res, { ok: true }); }));
eventsRouter.post("/:id/duplicate", requirePermission("create"), asyncHandler(async (req, res) => sendSuccess(res, await eventsService.duplicate(getOrgId(req), req.params.id), 201)));
eventsRouter.post("/:id/schedule", requirePermission("update"), validate({ body: scheduleSchema }), asyncHandler(async (req, res) => sendSuccess(res, await eventsService.addSchedule(getOrgId(req), req.params.id, req.body), 201)));
eventsRouter.post("/:id/guests", requirePermission("update"), validate({ body: guestSchema }), asyncHandler(async (req, res) => sendSuccess(res, await eventsService.addGuest(getOrgId(req), req.params.id, req.body), 201)));
eventsRouter.post("/:id/checklist", requirePermission("update"), validate({ body: checklistSchema }), asyncHandler(async (req, res) => sendSuccess(res, await eventsService.addChecklist(getOrgId(req), req.params.id, req.body.label), 201)));
eventsRouter.patch("/:id/checklist/:itemId", requirePermission("update"), asyncHandler(async (req, res) => sendSuccess(res, await eventsService.toggleChecklist(getOrgId(req), req.params.id, req.params.itemId))));
