import { Router } from "express";
import { z } from "zod";
import type { Prisma, PaymentStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere, getOrgId } from "../../lib/tenant.js";
import { NotFoundError, BadRequestError } from "../../lib/errors.js";
import { sendSuccess, getPagination, paginatedMeta, asyncHandler } from "../../lib/http.js";
import { auditFromReq } from "../../lib/audit.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { stripe } from "../../lib/stripe.js";

const intentSchema = z.object({ invoiceId: z.string(), amount: z.coerce.number().positive() });
const refundSchema = z.object({ amount: z.coerce.number().positive().optional() });

export const paymentsService = {
  async list(orgId: string, opts: { status?: PaymentStatus; skip: number; take: number }) {
    const where: Prisma.PaymentWhereInput = { ...tenantWhere(orgId), ...(opts.status ? { status: opts.status } : {}) };
    const [items, total] = await Promise.all([
      prisma.payment.findMany({ where, include: { invoice: { select: { number: true, customer: { select: { name: true } } } } }, orderBy: { createdAt: "desc" }, skip: opts.skip, take: opts.take }),
      prisma.payment.count({ where }),
    ]);
    return { items, total };
  },
  async createIntent(orgId: string, data: z.infer<typeof intentSchema>) {
    if (!stripe) throw new BadRequestError("Stripe is not configured");
    const invoice = await prisma.invoice.findFirst({ where: { id: data.invoiceId, ...tenantWhere(orgId) } });
    if (!invoice) throw new NotFoundError("Invoice not found");
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100),
      currency: "usd",
      metadata: { invoiceId: invoice.id, organizationId: orgId },
      automatic_payment_methods: { enabled: true },
    });
    await prisma.payment.create({
      data: { organizationId: orgId, invoiceId: invoice.id, amount: data.amount, method: "CARD", status: "PENDING", stripePaymentIntentId: intent.id },
    });
    return { clientSecret: intent.client_secret, paymentIntentId: intent.id };
  },
  async refund(orgId: string, id: string, amount?: number) {
    const payment = await prisma.payment.findFirst({ where: { id, ...tenantWhere(orgId) } });
    if (!payment) throw new NotFoundError("Payment not found");
    if (stripe && payment.stripePaymentIntentId) {
      await stripe.refunds.create({ payment_intent: payment.stripePaymentIntentId, ...(amount ? { amount: Math.round(amount * 100) } : {}) });
    }
    return prisma.payment.update({
      where: { id },
      data: { status: "REFUNDED", refundedAmount: amount ?? payment.amount },
    });
  },
  async stats(orgId: string) {
    const collected = await prisma.payment.aggregate({ where: { ...tenantWhere(orgId), status: "SUCCEEDED" }, _sum: { amount: true }, _count: true });
    const pending = await prisma.payment.aggregate({ where: { ...tenantWhere(orgId), status: "PENDING" }, _sum: { amount: true } });
    const refunded = await prisma.payment.aggregate({ where: { ...tenantWhere(orgId), status: "REFUNDED" }, _sum: { refundedAmount: true } });
    return { collected: collected._sum.amount ?? 0, transactions: collected._count, pending: pending._sum.amount ?? 0, refunded: refunded._sum.refundedAmount ?? 0 };
  },
};

export const paymentsRouter: Router = Router();
paymentsRouter.use(authenticate, requireOrg);

paymentsRouter.get("/", asyncHandler(async (req, res) => {
  const pg = getPagination(req);
  const { items, total } = await paymentsService.list(getOrgId(req), { status: req.query.status as PaymentStatus, skip: pg.skip, take: pg.take });
  sendSuccess(res, items, 200, paginatedMeta(total, pg));
}));
paymentsRouter.get("/stats", asyncHandler(async (req, res) => sendSuccess(res, await paymentsService.stats(getOrgId(req)))));
paymentsRouter.post("/intent", requirePermission("update"), validate({ body: intentSchema }), asyncHandler(async (req, res) => sendSuccess(res, await paymentsService.createIntent(getOrgId(req), req.body), 201)));
paymentsRouter.post("/:id/refund", requirePermission("update"), validate({ body: refundSchema }), asyncHandler(async (req, res) => {
  const p = await paymentsService.refund(getOrgId(req), req.params.id, req.body.amount);
  auditFromReq(req, "payment.refund", { entity: "Payment", entityId: req.params.id });
  sendSuccess(res, p);
}));
