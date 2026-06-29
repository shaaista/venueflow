import { Router } from "express";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere, getOrgId } from "../../lib/tenant.js";
import { NotFoundError } from "../../lib/errors.js";
import { sendSuccess, asyncHandler } from "../../lib/http.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";

const TriggerEnum = z.enum([
  "NEW_ENQUIRY", "LEAD_CREATED", "EVENT_CONFIRMED", "DEPOSIT_PAID", "PAYMENT_FAILED",
  "EVENT_COMPLETED", "CUSTOMER_INACTIVE", "BIRTHDAY", "QUOTE_VIEWED", "INVOICE_OVERDUE",
]);
const createSchema = z.object({
  name: z.string().min(1),
  trigger: TriggerEnum,
  actions: z.array(z.object({ type: z.string() }).passthrough()).default([]),
  enabled: z.boolean().optional(),
});
const updateSchema = createSchema.partial();

export const automationsService = {
  list: (orgId: string) => prisma.automation.findMany({ where: { organizationId: orgId }, orderBy: { createdAt: "desc" } }),
  async get(orgId: string, id: string) {
    const a = await prisma.automation.findFirst({ where: { id, organizationId: orgId }, include: { runs: { orderBy: { createdAt: "desc" }, take: 20 } } });
    if (!a) throw new NotFoundError("Automation not found");
    return a;
  },
  create: (orgId: string, data: z.infer<typeof createSchema>) =>
    prisma.automation.create({ data: { organizationId: orgId, name: data.name, trigger: data.trigger, actions: data.actions as unknown as Prisma.InputJsonValue, enabled: data.enabled ?? true } }),
  async update(orgId: string, id: string, data: z.infer<typeof updateSchema>) {
    await this.get(orgId, id);
    return prisma.automation.update({
      where: { id },
      data: { name: data.name, trigger: data.trigger, enabled: data.enabled, ...(data.actions ? { actions: data.actions as unknown as Prisma.InputJsonValue } : {}) },
    });
  },
  async toggle(orgId: string, id: string) {
    const a = await this.get(orgId, id);
    return prisma.automation.update({ where: { id }, data: { enabled: !a.enabled } });
  },
  async remove(orgId: string, id: string) {
    await this.get(orgId, id);
    await prisma.automation.delete({ where: { id } });
    return { ok: true };
  },
};

export const automationsRouter: Router = Router();
automationsRouter.use(authenticate, requireOrg);
automationsRouter.get("/", asyncHandler(async (req, res) => sendSuccess(res, await automationsService.list(getOrgId(req)))));
automationsRouter.get("/:id", asyncHandler(async (req, res) => sendSuccess(res, await automationsService.get(getOrgId(req), req.params.id))));
automationsRouter.post("/", requirePermission("create"), validate({ body: createSchema }), asyncHandler(async (req, res) => sendSuccess(res, await automationsService.create(getOrgId(req), req.body), 201)));
automationsRouter.patch("/:id", requirePermission("update"), validate({ body: updateSchema }), asyncHandler(async (req, res) => sendSuccess(res, await automationsService.update(getOrgId(req), req.params.id, req.body))));
automationsRouter.post("/:id/toggle", requirePermission("update"), asyncHandler(async (req, res) => sendSuccess(res, await automationsService.toggle(getOrgId(req), req.params.id))));
automationsRouter.delete("/:id", requirePermission("delete"), asyncHandler(async (req, res) => { await automationsService.remove(getOrgId(req), req.params.id); sendSuccess(res, { ok: true }); }));
