import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere, getOrgId } from "../../lib/tenant.js";
import { NotFoundError } from "../../lib/errors.js";
import { sendSuccess, asyncHandler } from "../../lib/http.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { emitTrigger } from "../automations/automation.engine.js";

const createSchema = z.object({ name: z.string().min(1), schema: z.record(z.any()).optional(), isPublic: z.boolean().optional() });
const submitSchema = z.object({ data: z.record(z.any()) });

export const formsService = {
  list: (orgId: string) => prisma.form.findMany({ where: tenantWhere(orgId), orderBy: { createdAt: "desc" } }),
  async get(orgId: string, id: string) {
    const form = await prisma.form.findFirst({ where: { id, ...tenantWhere(orgId) }, include: { submissions: { orderBy: { createdAt: "desc" }, take: 20 } } });
    if (!form) throw new NotFoundError("Form not found");
    return form;
  },
  create: (orgId: string, data: z.infer<typeof createSchema>) => prisma.form.create({ data: { organizationId: orgId, name: data.name, schema: data.schema ?? {}, isPublic: data.isPublic ?? true } }),
  update: (orgId: string, id: string, data: Partial<z.infer<typeof createSchema>>) => prisma.form.updateMany({ where: { id, ...tenantWhere(orgId) }, data: { name: data.name, schema: data.schema, isPublic: data.isPublic } }),
  /** Public submission — creates a submission and a NEW lead, fires automations. */
  async submitPublic(formId: string, data: Record<string, unknown>) {
    const form = await prisma.form.findUnique({ where: { id: formId } });
    if (!form || !form.isPublic) throw new NotFoundError("Form not found");
    await prisma.formSubmission.create({ data: { formId, data: data as object } });
    await prisma.form.update({ where: { id: formId }, data: { submissionsCount: { increment: 1 } } });

    const email = String(data.email ?? "");
    if (email) {
      const lead = await prisma.lead.create({
        data: {
          organizationId: form.organizationId,
          name: String(data.eventType ?? data.name ?? "Website enquiry"),
          contactName: String(data.name ?? data.contactName ?? "Website visitor"),
          email,
          phone: data.phone ? String(data.phone) : undefined,
          eventType: data.eventType ? String(data.eventType) : undefined,
          guests: data.guests ? Number(data.guests) : undefined,
          source: `Form: ${form.name}`,
          status: "NEW",
        },
      });
      await emitTrigger(form.organizationId, "NEW_ENQUIRY", { leadId: lead.id, formId });
    }
    return { ok: true };
  },
};

export const formsRouter: Router = Router();
formsRouter.use(authenticate, requireOrg);
formsRouter.get("/", asyncHandler(async (req, res) => sendSuccess(res, await formsService.list(getOrgId(req)))));
formsRouter.get("/:id", asyncHandler(async (req, res) => sendSuccess(res, await formsService.get(getOrgId(req), req.params.id))));
formsRouter.post("/", requirePermission("create"), validate({ body: createSchema }), asyncHandler(async (req, res) => sendSuccess(res, await formsService.create(getOrgId(req), req.body), 201)));
formsRouter.patch("/:id", requirePermission("update"), asyncHandler(async (req, res) => sendSuccess(res, await formsService.update(getOrgId(req), req.params.id, req.body))));

/** Public, unauthenticated form submission endpoint. */
export const publicFormsRouter: Router = Router();
publicFormsRouter.post("/:id/submit", validate({ body: submitSchema }), asyncHandler(async (req, res) => sendSuccess(res, await formsService.submitPublic(req.params.id, req.body.data), 201)));
