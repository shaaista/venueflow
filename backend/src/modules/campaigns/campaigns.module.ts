import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere, getOrgId } from "../../lib/tenant.js";
import { NotFoundError } from "../../lib/errors.js";
import { sendSuccess, asyncHandler } from "../../lib/http.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { enqueueCampaign } from "../../queues/index.js";

const createSchema = z.object({
  name: z.string().min(1),
  subject: z.string().optional(),
  body: z.string().optional(),
  audience: z.record(z.any()).optional(),
  scheduledAt: z.coerce.date().optional(),
});
const updateSchema = createSchema.partial();

export const campaignsService = {
  list: (orgId: string) => prisma.campaign.findMany({ where: tenantWhere(orgId), orderBy: { createdAt: "desc" } }),
  async get(orgId: string, id: string) {
    const c = await prisma.campaign.findFirst({ where: { id, ...tenantWhere(orgId) } });
    if (!c) throw new NotFoundError("Campaign not found");
    return c;
  },
  create: (orgId: string, data: z.infer<typeof createSchema>) =>
    prisma.campaign.create({ data: { organizationId: orgId, name: data.name, subject: data.subject, body: data.body, audience: data.audience ?? {}, scheduledAt: data.scheduledAt, status: data.scheduledAt ? "SCHEDULED" : "DRAFT" } }),
  async update(orgId: string, id: string, data: z.infer<typeof updateSchema>) {
    await this.get(orgId, id);
    return prisma.campaign.update({ where: { id }, data });
  },
  async send(orgId: string, id: string) {
    const c = await this.get(orgId, id);
    await prisma.campaign.update({ where: { id }, data: { status: "SENDING" } });
    await enqueueCampaign({ campaignId: c.id });
    return { ok: true, queued: true };
  },
  stats: async (orgId: string) => {
    const subscribers = await prisma.customer.count({ where: tenantWhere(orgId) });
    const sent = await prisma.campaign.count({ where: { ...tenantWhere(orgId), status: "SENT" } });
    return { subscribers, sentCampaigns: sent };
  },
};

export const campaignsRouter: Router = Router();
campaignsRouter.use(authenticate, requireOrg);
campaignsRouter.get("/", asyncHandler(async (req, res) => sendSuccess(res, await campaignsService.list(getOrgId(req)))));
campaignsRouter.get("/stats", asyncHandler(async (req, res) => sendSuccess(res, await campaignsService.stats(getOrgId(req)))));
campaignsRouter.get("/:id", asyncHandler(async (req, res) => sendSuccess(res, await campaignsService.get(getOrgId(req), req.params.id))));
campaignsRouter.post("/", requirePermission("create"), validate({ body: createSchema }), asyncHandler(async (req, res) => sendSuccess(res, await campaignsService.create(getOrgId(req), req.body), 201)));
campaignsRouter.patch("/:id", requirePermission("update"), validate({ body: updateSchema }), asyncHandler(async (req, res) => sendSuccess(res, await campaignsService.update(getOrgId(req), req.params.id, req.body))));
campaignsRouter.post("/:id/send", requirePermission("update"), asyncHandler(async (req, res) => sendSuccess(res, await campaignsService.send(getOrgId(req), req.params.id))));
