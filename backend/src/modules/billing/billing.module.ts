import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { getOrgId } from "../../lib/tenant.js";
import { NotFoundError } from "../../lib/errors.js";
import { sendSuccess, asyncHandler } from "../../lib/http.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";

export const billingService = {
  async overview(orgId: string) {
    const subscription = await prisma.subscription.findUnique({ where: { organizationId: orgId }, include: { plan: true } });
    const [members, events] = await Promise.all([
      prisma.membership.count({ where: { organizationId: orgId } }),
      prisma.event.count({ where: { organizationId: orgId, deletedAt: null } }),
    ]);
    return {
      subscription,
      usage: {
        members: { used: members, limit: subscription?.plan.maxUsers ?? 0 },
        events: { used: events, limit: subscription?.plan.maxEvents ?? 0 },
      },
    };
  },
  plans: () => prisma.plan.findMany({ orderBy: { priceMonthly: "asc" } }),
  async changePlan(orgId: string, tier: "STARTER" | "PROFESSIONAL" | "ENTERPRISE") {
    const plan = await prisma.plan.findUnique({ where: { tier } });
    if (!plan) throw new NotFoundError("Plan not found");
    return prisma.subscription.upsert({
      where: { organizationId: orgId },
      update: { planId: plan.id, status: "ACTIVE", cancelAtPeriodEnd: false },
      create: { organizationId: orgId, planId: plan.id, status: "ACTIVE" },
    });
  },
  async cancel(orgId: string) {
    return prisma.subscription.update({ where: { organizationId: orgId }, data: { cancelAtPeriodEnd: true } });
  },
};

export const billingRouter: Router = Router();
billingRouter.use(authenticate, requireOrg);

billingRouter.get("/", asyncHandler(async (req, res) => sendSuccess(res, await billingService.overview(getOrgId(req)))));
billingRouter.get("/plans", asyncHandler(async (_req, res) => sendSuccess(res, await billingService.plans())));
billingRouter.post("/subscribe", requirePermission("manage_billing"), validate({ body: z.object({ tier: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"]) }) }), asyncHandler(async (req, res) => sendSuccess(res, await billingService.changePlan(getOrgId(req), req.body.tier))));
billingRouter.post("/cancel", requirePermission("manage_billing"), asyncHandler(async (req, res) => sendSuccess(res, await billingService.cancel(getOrgId(req)))));
