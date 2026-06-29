import { Router } from "express";
import { z } from "zod";
import type { Request, Response } from "express";
import type { Prisma, CustomerStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere, getOrgId } from "../../lib/tenant.js";
import { NotFoundError } from "../../lib/errors.js";
import { sendSuccess, getPagination, getListQuery, paginatedMeta, asyncHandler } from "../../lib/http.js";
import { auditFromReq } from "../../lib/audit.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";

const createSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  status: z.enum(["VIP", "ACTIVE", "PROSPECT", "INACTIVE"]).optional(),
  tags: z.array(z.string()).optional(),
});
const updateSchema = createSchema.partial();
const noteSchema = z.object({ body: z.string().min(1) });

export const customersService = {
  async list(orgId: string, opts: { search?: string; status?: CustomerStatus; skip: number; take: number; sortBy: string; sortDir: "asc" | "desc" }) {
    const where: Prisma.CustomerWhereInput = {
      ...tenantWhere(orgId),
      ...(opts.status ? { status: opts.status } : {}),
      ...(opts.search ? { OR: [{ name: { contains: opts.search, mode: "insensitive" } }, { email: { contains: opts.search, mode: "insensitive" } }, { company: { contains: opts.search, mode: "insensitive" } }] } : {}),
    };
    const [items, total] = await Promise.all([
      prisma.customer.findMany({ where, orderBy: { [opts.sortBy]: opts.sortDir }, skip: opts.skip, take: opts.take, include: { _count: { select: { events: true } } } }),
      prisma.customer.count({ where }),
    ]);
    return { items, total };
  },
  async get(orgId: string, id: string) {
    const customer = await prisma.customer.findFirst({
      where: { id, ...tenantWhere(orgId) },
      include: {
        contacts: true,
        events: { orderBy: { date: "desc" }, take: 10 },
        quotes: { orderBy: { createdAt: "desc" }, take: 10 },
        invoices: { orderBy: { createdAt: "desc" }, take: 10 },
        notesRel: { orderBy: { createdAt: "desc" } },
      },
    });
    if (!customer) throw new NotFoundError("Customer not found");
    return customer;
  },
  async create(orgId: string, data: Prisma.CustomerUncheckedCreateInput) {
    return prisma.customer.create({ data: { ...data, organizationId: orgId } });
  },
  async update(orgId: string, id: string, data: Prisma.CustomerUncheckedUpdateInput) {
    await this.get(orgId, id);
    return prisma.customer.update({ where: { id }, data });
  },
  async remove(orgId: string, id: string) {
    await this.get(orgId, id);
    await prisma.customer.update({ where: { id }, data: { deletedAt: new Date() } });
    return { ok: true };
  },
  async addNote(orgId: string, id: string, body: string, authorId?: string) {
    await this.get(orgId, id);
    return prisma.note.create({ data: { customerId: id, body, authorId } });
  },
  async stats(orgId: string) {
    const agg = await prisma.customer.aggregate({ where: tenantWhere(orgId), _sum: { lifetimeValue: true }, _count: true });
    const vip = await prisma.customer.count({ where: { ...tenantWhere(orgId), status: "VIP" } });
    return { total: agg._count, lifetimeValue: agg._sum.lifetimeValue ?? 0, vip };
  },
};

export const customersRouter: Router = Router();
customersRouter.use(authenticate, requireOrg);

customersRouter.get("/", asyncHandler(async (req: Request, res: Response) => {
  const orgId = getOrgId(req);
  const pg = getPagination(req);
  const lq = getListQuery(req);
  const { items, total } = await customersService.list(orgId, { search: lq.search, status: req.query.status as CustomerStatus, skip: pg.skip, take: pg.take, sortBy: lq.sortBy, sortDir: lq.sortDir });
  sendSuccess(res, items, 200, paginatedMeta(total, pg));
}));
customersRouter.get("/stats", asyncHandler(async (req, res) => sendSuccess(res, await customersService.stats(getOrgId(req)))));
customersRouter.get("/:id", asyncHandler(async (req, res) => sendSuccess(res, await customersService.get(getOrgId(req), req.params.id))));
customersRouter.post("/", requirePermission("create"), validate({ body: createSchema }), asyncHandler(async (req, res) => {
  const c = await customersService.create(getOrgId(req), req.body);
  auditFromReq(req, "customer.create", { entity: "Customer", entityId: c.id });
  sendSuccess(res, c, 201);
}));
customersRouter.patch("/:id", requirePermission("update"), validate({ body: updateSchema }), asyncHandler(async (req, res) => sendSuccess(res, await customersService.update(getOrgId(req), req.params.id, req.body))));
customersRouter.delete("/:id", requirePermission("delete"), asyncHandler(async (req, res) => {
  await customersService.remove(getOrgId(req), req.params.id);
  auditFromReq(req, "customer.delete", { entity: "Customer", entityId: req.params.id });
  sendSuccess(res, { ok: true });
}));
customersRouter.post("/:id/notes", requirePermission("update"), validate({ body: noteSchema }), asyncHandler(async (req, res) => sendSuccess(res, await customersService.addNote(getOrgId(req), req.params.id, req.body.body, req.auth?.userId), 201)));
