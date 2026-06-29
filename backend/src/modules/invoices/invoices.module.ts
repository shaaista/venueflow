import { Router } from "express";
import { z } from "zod";
import type { Prisma, InvoiceStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere, getOrgId } from "../../lib/tenant.js";
import { NotFoundError } from "../../lib/errors.js";
import { sendSuccess, getPagination, paginatedMeta, asyncHandler } from "../../lib/http.js";
import { auditFromReq } from "../../lib/audit.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";

const lineItemSchema = z.object({ label: z.string(), detail: z.string().optional(), quantity: z.coerce.number().int().positive().default(1), unit: z.coerce.number().nonnegative().default(0) });
const createSchema = z.object({
  customerId: z.string().optional(),
  eventId: z.string().optional(),
  taxRate: z.coerce.number().nonnegative().optional(),
  dueAt: z.coerce.date().optional(),
  lineItems: z.array(lineItemSchema).default([]),
});
const paymentSchema = z.object({ amount: z.coerce.number().positive(), method: z.enum(["CARD", "BANK_TRANSFER", "CASH", "OTHER"]).optional(), reference: z.string().optional() });

function totals(items: { quantity: number; unit: number }[], taxRate = 0) {
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit, 0);
  return { subtotal, total: Math.round(subtotal * (1 + taxRate / 100) * 100) / 100 };
}
async function nextNumber(orgId: string) {
  const count = await prisma.invoice.count({ where: { organizationId: orgId } });
  return `INV-${1000 + count + 1}`;
}
function statusFor(total: number, paid: number, dueAt: Date | null): InvoiceStatus {
  if (paid >= total && total > 0) return "PAID";
  if (paid > 0) return "PARTIALLY_PAID";
  if (dueAt && dueAt < new Date()) return "OVERDUE";
  return "PENDING";
}

export const invoicesService = {
  async list(orgId: string, opts: { status?: InvoiceStatus; skip: number; take: number }) {
    const where: Prisma.InvoiceWhereInput = { ...tenantWhere(orgId), ...(opts.status ? { status: opts.status } : {}) };
    const [items, total] = await Promise.all([
      prisma.invoice.findMany({ where, include: { customer: { select: { name: true } } }, orderBy: { createdAt: "desc" }, skip: opts.skip, take: opts.take }),
      prisma.invoice.count({ where }),
    ]);
    return { items, total };
  },
  async get(orgId: string, id: string) {
    const inv = await prisma.invoice.findFirst({ where: { id, ...tenantWhere(orgId) }, include: { lineItems: { orderBy: { order: "asc" } }, payments: true, customer: true, event: true } });
    if (!inv) throw new NotFoundError("Invoice not found");
    return inv;
  },
  async create(orgId: string, data: z.infer<typeof createSchema>) {
    const { subtotal, total } = totals(data.lineItems, data.taxRate);
    const number = await nextNumber(orgId);
    return prisma.invoice.create({
      data: {
        organizationId: orgId, number, customerId: data.customerId, eventId: data.eventId, taxRate: data.taxRate ?? 0,
        subtotal, total, dueAt: data.dueAt, issuedAt: new Date(), status: "PENDING",
        lineItems: { create: data.lineItems.map((li, i) => ({ ...li, order: i })) },
      },
      include: { lineItems: true },
    });
  },
  async recordPayment(orgId: string, id: string, data: z.infer<typeof paymentSchema>) {
    const inv = await this.get(orgId, id);
    await prisma.payment.create({
      data: { organizationId: orgId, invoiceId: id, amount: data.amount, method: data.method ?? "CARD", status: "SUCCEEDED", reference: data.reference, paidAt: new Date() },
    });
    const newPaid = Number(inv.amountPaid) + data.amount;
    const status = statusFor(Number(inv.total), newPaid, inv.dueAt);
    const updated = await prisma.invoice.update({ where: { id }, data: { amountPaid: newPaid, status } });
    if (status === "PAID" && inv.eventId) {
      await prisma.event.update({ where: { id: inv.eventId }, data: { paid: { increment: data.amount } } }).catch(() => {});
      await import("../automations/automation.engine.js").then((m) => m.emitTrigger(orgId, "DEPOSIT_PAID", { invoiceId: id }));
    }
    return updated;
  },
  async setStatus(orgId: string, id: string, status: InvoiceStatus) {
    await this.get(orgId, id);
    return prisma.invoice.update({ where: { id }, data: { status } });
  },
  async remove(orgId: string, id: string) {
    await this.get(orgId, id);
    await prisma.invoice.update({ where: { id }, data: { deletedAt: new Date(), status: "CANCELLED" } });
    return { ok: true };
  },
};

export const invoicesRouter: Router = Router();
invoicesRouter.use(authenticate, requireOrg);

invoicesRouter.get("/", asyncHandler(async (req, res) => {
  const pg = getPagination(req);
  const { items, total } = await invoicesService.list(getOrgId(req), { status: req.query.status as InvoiceStatus, skip: pg.skip, take: pg.take });
  sendSuccess(res, items, 200, paginatedMeta(total, pg));
}));
invoicesRouter.get("/:id", asyncHandler(async (req, res) => sendSuccess(res, await invoicesService.get(getOrgId(req), req.params.id))));
invoicesRouter.post("/", requirePermission("create"), validate({ body: createSchema }), asyncHandler(async (req, res) => {
  const inv = await invoicesService.create(getOrgId(req), req.body);
  auditFromReq(req, "invoice.create", { entity: "Invoice", entityId: inv.id });
  sendSuccess(res, inv, 201);
}));
invoicesRouter.post("/:id/payments", requirePermission("update"), validate({ body: paymentSchema }), asyncHandler(async (req, res) => {
  const inv = await invoicesService.recordPayment(getOrgId(req), req.params.id, req.body);
  auditFromReq(req, "invoice.payment", { entity: "Invoice", entityId: req.params.id, meta: { amount: req.body.amount } });
  sendSuccess(res, inv);
}));
invoicesRouter.post("/:id/status", requirePermission("update"), validate({ body: z.object({ status: z.enum(["DRAFT", "PENDING", "PARTIALLY_PAID", "PAID", "OVERDUE", "CANCELLED"]) }) }), asyncHandler(async (req, res) => sendSuccess(res, await invoicesService.setStatus(getOrgId(req), req.params.id, req.body.status))));
invoicesRouter.delete("/:id", requirePermission("delete"), asyncHandler(async (req, res) => { await invoicesService.remove(getOrgId(req), req.params.id); sendSuccess(res, { ok: true }); }));
