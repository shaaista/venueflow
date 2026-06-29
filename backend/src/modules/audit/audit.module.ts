import { Router } from "express";
import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { getOrgId } from "../../lib/tenant.js";
import { sendSuccess, getPagination, paginatedMeta, asyncHandler } from "../../lib/http.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";

export const auditRouter: Router = Router();
auditRouter.use(authenticate, requireOrg, requireRole("ADMIN"));

auditRouter.get("/", asyncHandler(async (req, res) => {
  const orgId = getOrgId(req);
  const pg = getPagination(req);
  const where: Prisma.AuditLogWhereInput = {
    organizationId: orgId,
    ...(req.query.action ? { action: { contains: req.query.action as string } } : {}),
    ...(req.query.actorId ? { actorId: req.query.actorId as string } : {}),
  };
  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({ where, include: { actor: { select: { name: true, avatarUrl: true } } }, orderBy: { createdAt: "desc" }, skip: pg.skip, take: pg.take }),
    prisma.auditLog.count({ where }),
  ]);
  sendSuccess(res, items, 200, paginatedMeta(total, pg));
}));
