import { Router } from "express";
import { z } from "zod";
import type { Prisma, BookingStatus } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere, getOrgId } from "../../lib/tenant.js";
import { NotFoundError, ConflictError } from "../../lib/errors.js";
import { sendSuccess, getPagination, paginatedMeta, asyncHandler } from "../../lib/http.js";
import { auditFromReq } from "../../lib/audit.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";

const createSchema = z.object({
  spaceId: z.string(),
  eventId: z.string().optional(),
  start: z.coerce.date(),
  end: z.coerce.date(),
  deposit: z.coerce.number().nonnegative().optional(),
  status: z.enum(["TENTATIVE", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
});
const updateSchema = createSchema.partial();

async function assertNoConflict(orgId: string, spaceId: string, start: Date, end: Date, excludeId?: string) {
  const conflict = await prisma.booking.findFirst({
    where: {
      ...tenantWhere(orgId), spaceId, status: { not: "CANCELLED" },
      ...(excludeId ? { id: { not: excludeId } } : {}),
      start: { lt: end }, end: { gt: start },
    },
  });
  if (conflict) throw new ConflictError("This space is already booked for the selected time");
}

export const bookingsService = {
  async list(orgId: string, opts: { status?: BookingStatus; spaceId?: string; skip: number; take: number }) {
    const where: Prisma.BookingWhereInput = { ...tenantWhere(orgId), ...(opts.status ? { status: opts.status } : {}), ...(opts.spaceId ? { spaceId: opts.spaceId } : {}) };
    const [items, total] = await Promise.all([
      prisma.booking.findMany({ where, include: { space: { select: { name: true } }, event: { select: { title: true } } }, orderBy: { start: "desc" }, skip: opts.skip, take: opts.take }),
      prisma.booking.count({ where }),
    ]);
    return { items, total };
  },
  async create(orgId: string, data: z.infer<typeof createSchema>) {
    await assertNoConflict(orgId, data.spaceId, data.start, data.end);
    return prisma.booking.create({ data: { ...data, organizationId: orgId } });
  },
  async update(orgId: string, id: string, data: z.infer<typeof updateSchema>) {
    const booking = await prisma.booking.findFirst({ where: { id, ...tenantWhere(orgId) } });
    if (!booking) throw new NotFoundError("Booking not found");
    if (data.start || data.end || data.spaceId) {
      await assertNoConflict(orgId, data.spaceId ?? booking.spaceId, data.start ?? booking.start, data.end ?? booking.end, id);
    }
    return prisma.booking.update({ where: { id }, data });
  },
  async cancel(orgId: string, id: string) {
    const booking = await prisma.booking.findFirst({ where: { id, ...tenantWhere(orgId) } });
    if (!booking) throw new NotFoundError("Booking not found");
    return prisma.booking.update({ where: { id }, data: { status: "CANCELLED" } });
  },
};

export const bookingsRouter: Router = Router();
bookingsRouter.use(authenticate, requireOrg);

bookingsRouter.get("/", asyncHandler(async (req, res) => {
  const pg = getPagination(req);
  const { items, total } = await bookingsService.list(getOrgId(req), { status: req.query.status as BookingStatus, spaceId: req.query.spaceId as string, skip: pg.skip, take: pg.take });
  sendSuccess(res, items, 200, paginatedMeta(total, pg));
}));
bookingsRouter.post("/", requirePermission("create"), validate({ body: createSchema }), asyncHandler(async (req, res) => {
  const b = await bookingsService.create(getOrgId(req), req.body);
  auditFromReq(req, "booking.create", { entity: "Booking", entityId: b.id });
  sendSuccess(res, b, 201);
}));
bookingsRouter.patch("/:id", requirePermission("update"), validate({ body: updateSchema }), asyncHandler(async (req, res) => sendSuccess(res, await bookingsService.update(getOrgId(req), req.params.id, req.body))));
bookingsRouter.post("/:id/cancel", requirePermission("update"), asyncHandler(async (req, res) => sendSuccess(res, await bookingsService.cancel(getOrgId(req), req.params.id))));
