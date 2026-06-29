import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { sendSuccess, getPagination, paginatedMeta, asyncHandler } from "../../lib/http.js";
import { authenticate, requireSuperAdmin } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { recordAudit } from "../../lib/audit.js";

export const superAdminService = {
  async overview() {
    const [tenants, users, activeSubs] = await Promise.all([
      prisma.organization.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.subscription.findMany({ where: { status: "ACTIVE" }, include: { plan: true } }),
    ]);
    const mrr = activeSubs.reduce((s, sub) => s + sub.plan.priceMonthly, 0);
    const trialing = await prisma.subscription.count({ where: { status: "TRIALING" } });
    return { tenants, users, mrr, activeSubscriptions: activeSubs.length, trialing };
  },
  tenants: (skip: number, take: number) =>
    prisma.organization.findMany({
      where: { deletedAt: null },
      include: { subscription: { include: { plan: true } }, _count: { select: { memberships: true, events: true } } },
      orderBy: { createdAt: "desc" }, skip, take,
    }),
  setTenantStatus: (id: string, status: "ACTIVE" | "SUSPENDED") => prisma.organization.update({ where: { id }, data: { status } }),
  users: (skip: number, take: number) =>
    prisma.user.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, email: true, avatarUrl: true, isSuperAdmin: true, lastLoginAt: true, createdAt: true, memberships: { include: { organization: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" }, skip, take,
    }),
  subscriptions: async () => {
    const grouped = await prisma.subscription.groupBy({ by: ["status"], _count: true });
    const byPlan = await prisma.plan.findMany({ include: { _count: { select: { subscriptions: true } } } });
    return { byStatus: grouped, byPlan };
  },
  flags: () => prisma.featureFlag.findMany({ orderBy: { key: "asc" } }),
  updateFlag: (id: string, data: { enabled?: boolean; rolloutPct?: number }) => prisma.featureFlag.update({ where: { id }, data }),
  auditLogs: (skip: number, take: number) =>
    prisma.auditLog.findMany({ include: { actor: { select: { name: true } }, organization: { select: { name: true } } }, orderBy: { createdAt: "desc" }, skip, take }),
};

export const superAdminRouter: Router = Router();
superAdminRouter.use(authenticate, requireSuperAdmin);

superAdminRouter.get("/overview", asyncHandler(async (_req, res) => sendSuccess(res, await superAdminService.overview())));
superAdminRouter.get("/tenants", asyncHandler(async (req, res) => {
  const pg = getPagination(req);
  const items = await superAdminService.tenants(pg.skip, pg.take);
  const total = await prisma.organization.count({ where: { deletedAt: null } });
  sendSuccess(res, items, 200, paginatedMeta(total, pg));
}));
superAdminRouter.post("/tenants/:id/suspend", asyncHandler(async (req, res) => {
  const org = await superAdminService.setTenantStatus(req.params.id, "SUSPENDED");
  await recordAudit({ action: "platform.tenant_suspend", actorId: req.auth!.userId, entity: "Organization", entityId: org.id });
  sendSuccess(res, org);
}));
superAdminRouter.post("/tenants/:id/activate", asyncHandler(async (req, res) => sendSuccess(res, await superAdminService.setTenantStatus(req.params.id, "ACTIVE"))));
superAdminRouter.get("/users", asyncHandler(async (req, res) => {
  const pg = getPagination(req);
  const items = await superAdminService.users(pg.skip, pg.take);
  sendSuccess(res, items, 200, paginatedMeta(await prisma.user.count({ where: { deletedAt: null } }), pg));
}));
superAdminRouter.get("/subscriptions", asyncHandler(async (_req, res) => sendSuccess(res, await superAdminService.subscriptions())));
superAdminRouter.get("/feature-flags", asyncHandler(async (_req, res) => sendSuccess(res, await superAdminService.flags())));
superAdminRouter.patch("/feature-flags/:id", validate({ body: z.object({ enabled: z.boolean().optional(), rolloutPct: z.number().min(0).max(100).optional() }) }), asyncHandler(async (req, res) => sendSuccess(res, await superAdminService.updateFlag(req.params.id, req.body))));
superAdminRouter.get("/audit-logs", asyncHandler(async (req, res) => {
  const pg = getPagination(req);
  sendSuccess(res, await superAdminService.auditLogs(pg.skip, pg.take), 200, paginatedMeta(await prisma.auditLog.count(), pg));
}));
