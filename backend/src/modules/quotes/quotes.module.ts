import { Router } from "express";
import { z } from "zod";
import type { Prisma, QuoteStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere, getOrgId } from "../../lib/tenant.js";
import { NotFoundError } from "../../lib/errors.js";
import { sendSuccess, getPagination, paginatedMeta, asyncHandler } from "../../lib/http.js";
import { auditFromReq } from "../../lib/audit.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { enqueueEmail } from "../../queues/index.js";
import { emailTemplate } from "../../lib/mailer.js";
import { env } from "../../config/env.js";

const lineItemSchema = z.object({ label: z.string(), detail: z.string().optional(), quantity: z.coerce.number().int().positive().default(1), unit: z.coerce.number().nonnegative().default(0) });
const createSchema = z.object({
  customerId: z.string().optional(),
  eventId: z.string().optional(),
  taxRate: z.coerce.number().nonnegative().optional(),
  discount: z.coerce.number().nonnegative().optional(),
  notes: z.string().optional(),
  validUntil: z.coerce.date().optional(),
  lineItems: z.array(lineItemSchema).default([]),
});
const updateSchema = createSchema.partial();

function computeTotals(items: { quantity: number; unit: number }[], taxRate = 0, discount = 0) {
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit, 0);
  const total = subtotal - discount + (subtotal - discount) * (taxRate / 100);
  return { subtotal, total: Math.round(total * 100) / 100 };
}

async function nextNumber(orgId: string) {
  const count = await prisma.quote.count({ where: { organizationId: orgId } });
  return `Q-${1000 + count + 1}`;
}

export const quotesService = {
  async list(orgId: string, opts: { status?: QuoteStatus; skip: number; take: number }) {
    const where: Prisma.QuoteWhereInput = { ...tenantWhere(orgId), ...(opts.status ? { status: opts.status } : {}) };
    const [items, total] = await Promise.all([
      prisma.quote.findMany({ where, include: { customer: { select: { name: true } } }, orderBy: { createdAt: "desc" }, skip: opts.skip, take: opts.take }),
      prisma.quote.count({ where }),
    ]);
    return { items, total };
  },
  async get(orgId: string, id: string) {
    const quote = await prisma.quote.findFirst({ where: { id, ...tenantWhere(orgId) }, include: { lineItems: { orderBy: { order: "asc" } }, customer: true, event: true } });
    if (!quote) throw new NotFoundError("Quote not found");
    return quote;
  },
  async create(orgId: string, data: z.infer<typeof createSchema>) {
    const { subtotal, total } = computeTotals(data.lineItems, data.taxRate, data.discount);
    const number = await nextNumber(orgId);
    return prisma.quote.create({
      data: {
        organizationId: orgId, number, customerId: data.customerId, eventId: data.eventId,
        taxRate: data.taxRate ?? 0, discount: data.discount ?? 0, subtotal, total, notes: data.notes, validUntil: data.validUntil,
        lineItems: { create: data.lineItems.map((li, i) => ({ ...li, order: i })) },
      },
      include: { lineItems: true },
    });
  },
  async update(orgId: string, id: string, data: z.infer<typeof updateSchema>) {
    await this.get(orgId, id);
    if (data.lineItems) {
      const { subtotal, total } = computeTotals(data.lineItems, data.taxRate, data.discount);
      await prisma.quoteLineItem.deleteMany({ where: { quoteId: id } });
      return prisma.quote.update({
        where: { id },
        data: { subtotal, total, taxRate: data.taxRate, discount: data.discount, notes: data.notes, validUntil: data.validUntil, lineItems: { create: data.lineItems.map((li, i) => ({ ...li, order: i })) } },
        include: { lineItems: true },
      });
    }
    return prisma.quote.update({ where: { id }, data: { notes: data.notes, validUntil: data.validUntil } });
  },
  async setStatus(orgId: string, id: string, status: QuoteStatus) {
    const quote = await this.get(orgId, id);
    const stamps: Prisma.QuoteUpdateInput = { status };
    if (status === "SENT") stamps.sentAt = new Date();
    if (status === "VIEWED") stamps.viewedAt = new Date();
    if (status === "ACCEPTED") stamps.acceptedAt = new Date();
    const updated = await prisma.quote.update({ where: { id }, data: stamps });
    if (status === "VIEWED") await import("../automations/automation.engine.js").then((m) => m.emitTrigger(orgId, "QUOTE_VIEWED", { quoteId: id }));
    if (status === "SENT" && quote.customerId) {
      const customer = await prisma.customer.findUnique({ where: { id: quote.customerId } });
      if (customer) await enqueueEmail({ to: customer.email, subject: `Your proposal ${quote.number}`, html: emailTemplate("Your proposal is ready", `View proposal ${quote.number}.`, { label: "View proposal", url: `${env.WEB_URL}/portal/quotes/${quote.id}` }) });
    }
    return updated;
  },
  async duplicate(orgId: string, id: string) {
    const q = await this.get(orgId, id);
    const number = await nextNumber(orgId);
    return prisma.quote.create({
      data: {
        organizationId: orgId, number, customerId: q.customerId, eventId: q.eventId, status: "DRAFT",
        subtotal: q.subtotal, discount: q.discount, taxRate: q.taxRate, total: q.total,
        lineItems: { create: q.lineItems.map((li, i) => ({ label: li.label, detail: li.detail, quantity: li.quantity, unit: li.unit, order: i })) },
      },
    });
  },
  async remove(orgId: string, id: string) {
    await this.get(orgId, id);
    await prisma.quote.update({ where: { id }, data: { deletedAt: new Date() } });
    return { ok: true };
  },
};

export const quotesRouter: Router = Router();
quotesRouter.use(authenticate, requireOrg);

quotesRouter.get("/", asyncHandler(async (req, res) => {
  const pg = getPagination(req);
  const { items, total } = await quotesService.list(getOrgId(req), { status: req.query.status as QuoteStatus, skip: pg.skip, take: pg.take });
  sendSuccess(res, items, 200, paginatedMeta(total, pg));
}));
quotesRouter.get("/:id", asyncHandler(async (req, res) => sendSuccess(res, await quotesService.get(getOrgId(req), req.params.id))));
quotesRouter.post("/", requirePermission("create"), validate({ body: createSchema }), asyncHandler(async (req, res) => {
  const q = await quotesService.create(getOrgId(req), req.body);
  auditFromReq(req, "quote.create", { entity: "Quote", entityId: q.id });
  sendSuccess(res, q, 201);
}));
quotesRouter.patch("/:id", requirePermission("update"), validate({ body: updateSchema }), asyncHandler(async (req, res) => sendSuccess(res, await quotesService.update(getOrgId(req), req.params.id, req.body))));
quotesRouter.post("/:id/status", requirePermission("update"), validate({ body: z.object({ status: z.enum(["DRAFT", "SENT", "VIEWED", "ACCEPTED", "REJECTED", "EXPIRED"]) }) }), asyncHandler(async (req, res) => sendSuccess(res, await quotesService.setStatus(getOrgId(req), req.params.id, req.body.status))));
quotesRouter.post("/:id/duplicate", requirePermission("create"), asyncHandler(async (req, res) => sendSuccess(res, await quotesService.duplicate(getOrgId(req), req.params.id), 201)));
quotesRouter.delete("/:id", requirePermission("delete"), asyncHandler(async (req, res) => { await quotesService.remove(getOrgId(req), req.params.id); sendSuccess(res, { ok: true }); }));
