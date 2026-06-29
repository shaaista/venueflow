import { Router } from "express";
import { z } from "zod";
import type { Prisma, TaskStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere, getOrgId } from "../../lib/tenant.js";
import { NotFoundError } from "../../lib/errors.js";
import { sendSuccess, getPagination, paginatedMeta, asyncHandler } from "../../lib/http.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]).optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  dueAt: z.coerce.date().optional(),
  eventId: z.string().optional(),
  assignedToId: z.string().optional(),
});
const updateSchema = createSchema.partial();
const commentSchema = z.object({ body: z.string().min(1) });

export const tasksService = {
  async list(orgId: string, opts: { status?: TaskStatus; assignedToId?: string; skip: number; take: number }) {
    const where: Prisma.TaskWhereInput = { ...tenantWhere(orgId), ...(opts.status ? { status: opts.status } : {}), ...(opts.assignedToId ? { assignedToId: opts.assignedToId } : {}) };
    const [items, total] = await Promise.all([
      prisma.task.findMany({ where, include: { assignedTo: { select: { id: true, name: true, avatarUrl: true } }, event: { select: { title: true } } }, orderBy: { createdAt: "desc" }, skip: opts.skip, take: opts.take }),
      prisma.task.count({ where }),
    ]);
    return { items, total };
  },
  /** Grouped board view: { TODO: [...], IN_PROGRESS: [...], ... } */
  async board(orgId: string) {
    const tasks = await prisma.task.findMany({ where: tenantWhere(orgId), include: { assignedTo: { select: { id: true, name: true, avatarUrl: true } } }, orderBy: { createdAt: "desc" } });
    const cols: Record<string, typeof tasks> = { TODO: [], IN_PROGRESS: [], REVIEW: [], DONE: [] };
    for (const t of tasks) cols[t.status]?.push(t);
    return cols;
  },
  async create(orgId: string, data: Prisma.TaskUncheckedCreateInput) {
    return prisma.task.create({ data: { ...data, organizationId: orgId } });
  },
  async update(orgId: string, id: string, data: Prisma.TaskUncheckedUpdateInput) {
    const task = await prisma.task.findFirst({ where: { id, ...tenantWhere(orgId) } });
    if (!task) throw new NotFoundError("Task not found");
    return prisma.task.update({ where: { id }, data });
  },
  async remove(orgId: string, id: string) {
    await this.update(orgId, id, { deletedAt: new Date() });
    return { ok: true };
  },
  async addComment(orgId: string, id: string, body: string, authorId?: string) {
    const task = await prisma.task.findFirst({ where: { id, ...tenantWhere(orgId) } });
    if (!task) throw new NotFoundError("Task not found");
    return prisma.taskComment.create({ data: { taskId: id, body, authorId } });
  },
};

export const tasksRouter: Router = Router();
tasksRouter.use(authenticate, requireOrg);

tasksRouter.get("/", asyncHandler(async (req, res) => {
  const pg = getPagination(req);
  const { items, total } = await tasksService.list(getOrgId(req), { status: req.query.status as TaskStatus, assignedToId: req.query.assignedToId as string, skip: pg.skip, take: pg.take });
  sendSuccess(res, items, 200, paginatedMeta(total, pg));
}));
tasksRouter.get("/board", asyncHandler(async (req, res) => sendSuccess(res, await tasksService.board(getOrgId(req)))));
tasksRouter.post("/", requirePermission("create"), validate({ body: createSchema }), asyncHandler(async (req, res) => sendSuccess(res, await tasksService.create(getOrgId(req), req.body), 201)));
tasksRouter.patch("/:id", requirePermission("update"), validate({ body: updateSchema }), asyncHandler(async (req, res) => sendSuccess(res, await tasksService.update(getOrgId(req), req.params.id, req.body))));
tasksRouter.delete("/:id", requirePermission("delete"), asyncHandler(async (req, res) => { await tasksService.remove(getOrgId(req), req.params.id); sendSuccess(res, { ok: true }); }));
tasksRouter.post("/:id/comments", requirePermission("update"), validate({ body: commentSchema }), asyncHandler(async (req, res) => sendSuccess(res, await tasksService.addComment(getOrgId(req), req.params.id, req.body.body, req.auth?.userId), 201)));
