import { Router } from "express";
import { z } from "zod";
import dayjs from "dayjs";
import type { Role } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { getOrgId } from "../../lib/tenant.js";
import { BadRequestError, ForbiddenError, NotFoundError } from "../../lib/errors.js";
import { sendSuccess, asyncHandler } from "../../lib/http.js";
import { auditFromReq } from "../../lib/audit.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { randomToken } from "../../lib/tokens.js";
import { enqueueEmail } from "../../queues/index.js";
import { emailTemplate } from "../../lib/mailer.js";
import { env } from "../../config/env.js";

const RoleEnum = z.enum(["OWNER", "ADMIN", "MANAGER", "COORDINATOR", "STAFF", "VIEWER", "CUSTOMER"]);
const updateOrgSchema = z.object({ name: z.string().min(1).optional(), logoUrl: z.string().optional(), brandColor: z.string().optional(), domain: z.string().optional(), settings: z.record(z.any()).optional() });
const inviteSchema = z.object({ email: z.string().email(), role: RoleEnum.default("STAFF") });
const roleSchema = z.object({ role: RoleEnum });

export const orgService = {
  current: (orgId: string) =>
    prisma.organization.findUnique({ where: { id: orgId }, include: { subscription: { include: { plan: true } }, featureFlags: { include: { flag: true } }, _count: { select: { memberships: true, events: true } } } }),
  update: (orgId: string, data: z.infer<typeof updateOrgSchema>) =>
    prisma.organization.update({ where: { id: orgId }, data: { name: data.name, logoUrl: data.logoUrl, brandColor: data.brandColor, domain: data.domain, settings: data.settings as object } }),
  members: (orgId: string) =>
    prisma.membership.findMany({ where: { organizationId: orgId }, include: { user: { select: { id: true, name: true, email: true, avatarUrl: true, lastLoginAt: true } } }, orderBy: { createdAt: "asc" } }),
  async invite(orgId: string, data: z.infer<typeof inviteSchema>) {
    const token = randomToken();
    const invite = await prisma.invitation.create({
      data: { organizationId: orgId, email: data.email, role: data.role as Role, token, expiresAt: dayjs().add(7, "day").toDate() },
    });
    await enqueueEmail({
      to: data.email,
      subject: "You've been invited to VenueFlow",
      html: emailTemplate("Join the team", "You've been invited to collaborate on VenueFlow.", { label: "Accept invitation", url: `${env.WEB_URL}/accept-invite?token=${token}` }),
    });
    return invite;
  },
  async acceptInvite(userId: string, userEmail: string, token: string) {
    const invite = await prisma.invitation.findUnique({ where: { token } });
    if (!invite || invite.status !== "INVITED" || invite.expiresAt < new Date()) throw new BadRequestError("Invalid or expired invitation");
    if (invite.email.toLowerCase() !== userEmail.toLowerCase()) throw new ForbiddenError("This invitation is for a different email");
    await prisma.membership.upsert({
      where: { userId_organizationId: { userId, organizationId: invite.organizationId } },
      update: { role: invite.role, status: "ACTIVE" },
      create: { userId, organizationId: invite.organizationId, role: invite.role, status: "ACTIVE" },
    });
    await prisma.invitation.update({ where: { id: invite.id }, data: { status: "ACTIVE" } });
    return { organizationId: invite.organizationId };
  },
  async changeRole(orgId: string, userId: string, role: Role) {
    const m = await prisma.membership.findUnique({ where: { userId_organizationId: { userId, organizationId: orgId } } });
    if (!m) throw new NotFoundError("Member not found");
    return prisma.membership.update({ where: { id: m.id }, data: { role } });
  },
  async removeMember(orgId: string, userId: string) {
    await prisma.membership.deleteMany({ where: { organizationId: orgId, userId, role: { not: "OWNER" } } });
    return { ok: true };
  },
};

export const orgRouter: Router = Router();
orgRouter.use(authenticate, requireOrg);

orgRouter.get("/current", asyncHandler(async (req, res) => sendSuccess(res, await orgService.current(getOrgId(req)))));
orgRouter.patch("/current", requirePermission("manage_settings"), validate({ body: updateOrgSchema }), asyncHandler(async (req, res) => {
  const org = await orgService.update(getOrgId(req), req.body);
  auditFromReq(req, "org.update", { entity: "Organization", entityId: org.id });
  sendSuccess(res, org);
}));
orgRouter.get("/members", asyncHandler(async (req, res) => sendSuccess(res, await orgService.members(getOrgId(req)))));
orgRouter.post("/invitations", requirePermission("manage_users"), validate({ body: inviteSchema }), asyncHandler(async (req, res) => {
  const invite = await orgService.invite(getOrgId(req), req.body);
  auditFromReq(req, "org.invite", { meta: { email: req.body.email } });
  sendSuccess(res, invite, 201);
}));
orgRouter.post("/invitations/accept", validate({ body: z.object({ token: z.string() }) }), asyncHandler(async (req, res) =>
  sendSuccess(res, await orgService.acceptInvite(req.auth!.userId, req.auth!.email, req.body.token)),
));
orgRouter.patch("/members/:userId/role", requirePermission("manage_users"), validate({ body: roleSchema }), asyncHandler(async (req, res) =>
  sendSuccess(res, await orgService.changeRole(getOrgId(req), req.params.userId, req.body.role)),
));
orgRouter.delete("/members/:userId", requirePermission("manage_users"), asyncHandler(async (req, res) => {
  await orgService.removeMember(getOrgId(req), req.params.userId);
  auditFromReq(req, "org.remove_member", { meta: { userId: req.params.userId } });
  sendSuccess(res, { ok: true });
}));
