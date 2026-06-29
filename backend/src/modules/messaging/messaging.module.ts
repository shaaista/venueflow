import { Router } from "express";
import { z } from "zod";
import type { Channel } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere, getOrgId } from "../../lib/tenant.js";
import { NotFoundError } from "../../lib/errors.js";
import { sendSuccess, asyncHandler } from "../../lib/http.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { enqueueEmail, enqueueSms } from "../../queues/index.js";
import { emailTemplate } from "../../lib/mailer.js";

const sendSchema = z.object({ body: z.string().min(1), channel: z.enum(["EMAIL", "SMS", "WHATSAPP", "INTERNAL"]).optional(), scheduledAt: z.coerce.date().optional() });
const templateSchema = z.object({ name: z.string(), channel: z.enum(["EMAIL", "SMS", "WHATSAPP", "INTERNAL"]).optional(), subject: z.string().optional(), body: z.string() });
const startSchema = z.object({ customerId: z.string(), channel: z.enum(["EMAIL", "SMS", "WHATSAPP", "INTERNAL"]).optional(), subject: z.string().optional() });

export const messagingService = {
  listConversations: (orgId: string) =>
    prisma.conversation.findMany({ where: tenantWhere(orgId), include: { customer: { select: { name: true, email: true, phone: true } }, messages: { orderBy: { createdAt: "desc" }, take: 1 } }, orderBy: { lastMessageAt: "desc" } }),
  async getConversation(orgId: string, id: string) {
    const conv = await prisma.conversation.findFirst({ where: { id, ...tenantWhere(orgId) }, include: { customer: true, messages: { orderBy: { createdAt: "asc" } } } });
    if (!conv) throw new NotFoundError("Conversation not found");
    return conv;
  },
  async start(orgId: string, data: z.infer<typeof startSchema>) {
    return prisma.conversation.create({ data: { organizationId: orgId, customerId: data.customerId, channel: (data.channel as Channel) ?? "EMAIL", subject: data.subject } });
  },
  async send(orgId: string, conversationId: string, data: z.infer<typeof sendSchema>) {
    const conv = await this.getConversation(orgId, conversationId);
    const channel = (data.channel as Channel) ?? conv.channel;
    const message = await prisma.message.create({
      data: { conversationId, direction: "OUTBOUND", channel, body: data.body, scheduledAt: data.scheduledAt, sentAt: data.scheduledAt ? null : new Date() },
    });
    await prisma.conversation.update({ where: { id: conversationId }, data: { lastMessageAt: new Date() } });
    if (!data.scheduledAt && conv.customer) {
      if (channel === "EMAIL") await enqueueEmail({ to: conv.customer.email, subject: conv.subject ?? "A message from your venue", html: emailTemplate("New message", data.body) });
      else if ((channel === "SMS" || channel === "WHATSAPP") && conv.customer.phone) await enqueueSms({ to: conv.customer.phone, body: data.body });
    }
    return message;
  },
  listTemplates: (orgId: string) => prisma.messageTemplate.findMany({ where: tenantWhere(orgId), orderBy: { createdAt: "desc" } }),
  createTemplate: (orgId: string, data: z.infer<typeof templateSchema>) =>
    prisma.messageTemplate.create({ data: { organizationId: orgId, name: data.name, channel: (data.channel as Channel) ?? "EMAIL", subject: data.subject, body: data.body } }),
};

export const messagingRouter: Router = Router();
messagingRouter.use(authenticate, requireOrg);

messagingRouter.get("/conversations", asyncHandler(async (req, res) => sendSuccess(res, await messagingService.listConversations(getOrgId(req)))));
messagingRouter.get("/conversations/:id", asyncHandler(async (req, res) => sendSuccess(res, await messagingService.getConversation(getOrgId(req), req.params.id))));
messagingRouter.post("/conversations", requirePermission("create"), validate({ body: startSchema }), asyncHandler(async (req, res) => sendSuccess(res, await messagingService.start(getOrgId(req), req.body), 201)));
messagingRouter.post("/conversations/:id/messages", requirePermission("update"), validate({ body: sendSchema }), asyncHandler(async (req, res) => sendSuccess(res, await messagingService.send(getOrgId(req), req.params.id, req.body), 201)));
messagingRouter.get("/templates", asyncHandler(async (req, res) => sendSuccess(res, await messagingService.listTemplates(getOrgId(req)))));
messagingRouter.post("/templates", requirePermission("create"), validate({ body: templateSchema }), asyncHandler(async (req, res) => sendSuccess(res, await messagingService.createTemplate(getOrgId(req), req.body), 201)));
