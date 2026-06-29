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

const venueSchema = z.object({ name: z.string().min(1), address: z.string().optional(), description: z.string().optional() });
const spaceSchema = z.object({
  venueId: z.string(),
  name: z.string().min(1),
  slug: z.string().optional(),
  tagline: z.string().optional(),
  capacity: z.coerce.number().int().positive(),
  size: z.string().optional(),
  priceFrom: z.coerce.number().nonnegative().optional(),
  amenities: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
  availability: z.enum(["HIGH", "LIMITED", "BOOKED"]).optional(),
});
const blackoutSchema = z.object({ date: z.coerce.date(), reason: z.string().optional(), type: z.enum(["blackout", "maintenance"]).optional() });

export const venuesService = {
  async listVenues(orgId: string) {
    return prisma.venue.findMany({ where: tenantWhere(orgId), include: { spaces: { where: { deletedAt: null } } }, orderBy: { createdAt: "asc" } });
  },
  async listSpaces(orgId: string) {
    return prisma.space.findMany({ where: tenantWhere(orgId), orderBy: { createdAt: "asc" } });
  },
  async createVenue(orgId: string, data: Prisma.VenueUncheckedCreateInput) {
    return prisma.venue.create({ data: { ...data, organizationId: orgId } });
  },
  async createSpace(orgId: string, data: z.infer<typeof spaceSchema>) {
    const venue = await prisma.venue.findFirst({ where: { id: data.venueId, ...tenantWhere(orgId) } });
    if (!venue) throw new NotFoundError("Venue not found");
    return prisma.space.create({
      data: { ...data, slug: data.slug ?? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), amenities: data.amenities ?? [], organizationId: orgId },
    });
  },
  async updateSpace(orgId: string, id: string, data: Prisma.SpaceUncheckedUpdateInput) {
    const space = await prisma.space.findFirst({ where: { id, ...tenantWhere(orgId) } });
    if (!space) throw new NotFoundError("Space not found");
    return prisma.space.update({ where: { id }, data });
  },
  async addBlackout(orgId: string, spaceId: string, data: z.infer<typeof blackoutSchema>) {
    const space = await prisma.space.findFirst({ where: { id: spaceId, ...tenantWhere(orgId) } });
    if (!space) throw new NotFoundError("Space not found");
    return prisma.blackoutDate.create({ data: { spaceId, date: data.date, reason: data.reason, type: data.type ?? "blackout" } });
  },
  /** Returns spaces available on the given date for a guest count, with conflict info. */
  async checkAvailability(orgId: string, date: Date, guests?: number) {
    const spaces = await prisma.space.findMany({
      where: { ...tenantWhere(orgId), ...(guests ? { capacity: { gte: guests } } : {}) },
    });
    const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date); dayEnd.setHours(23, 59, 59, 999);
    const results = await Promise.all(
      spaces.map(async (space) => {
        const conflict = await prisma.booking.findFirst({
          where: { spaceId: space.id, status: { not: "CANCELLED" }, start: { lte: dayEnd }, end: { gte: dayStart } },
        });
        const blackout = await prisma.blackoutDate.findFirst({ where: { spaceId: space.id, date: { gte: dayStart, lte: dayEnd } } });
        return { space, available: !conflict && !blackout, reason: conflict ? "Booked" : blackout ? blackout.type : null };
      }),
    );
    return results;
  },
};

export const venuesRouter: Router = Router();
venuesRouter.use(authenticate, requireOrg);

venuesRouter.get("/", asyncHandler(async (req, res) => sendSuccess(res, await venuesService.listVenues(getOrgId(req)))));
venuesRouter.get("/spaces", asyncHandler(async (req, res) => sendSuccess(res, await venuesService.listSpaces(getOrgId(req)))));
venuesRouter.get("/availability", asyncHandler(async (req, res) => {
  const date = new Date((req.query.date as string) ?? Date.now());
  const guests = req.query.guests ? Number(req.query.guests) : undefined;
  sendSuccess(res, await venuesService.checkAvailability(getOrgId(req), date, guests));
}));
venuesRouter.post("/", requirePermission("create"), validate({ body: venueSchema }), asyncHandler(async (req, res) => sendSuccess(res, await venuesService.createVenue(getOrgId(req), req.body), 201)));
venuesRouter.post("/spaces", requirePermission("create"), validate({ body: spaceSchema }), asyncHandler(async (req, res) => sendSuccess(res, await venuesService.createSpace(getOrgId(req), req.body), 201)));
venuesRouter.patch("/spaces/:id", requirePermission("update"), asyncHandler(async (req, res) => sendSuccess(res, await venuesService.updateSpace(getOrgId(req), req.params.id, req.body))));
venuesRouter.post("/spaces/:id/blackout", requirePermission("update"), validate({ body: blackoutSchema }), asyncHandler(async (req, res) => sendSuccess(res, await venuesService.addBlackout(getOrgId(req), req.params.id, req.body), 201)));
