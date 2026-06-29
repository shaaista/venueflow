import { Router } from "express";
import { leadsController } from "./leads.controller.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../lib/http.js";
import {
  createLeadSchema,
  updateLeadSchema,
  updateStatusSchema,
  assignSchema,
  noteSchema,
  bulkSchema,
  importSchema,
} from "./leads.validators.js";

/**
 * @openapi
 * tags:
 *   - name: Leads
 *     description: Lead & enquiry pipeline
 */
export const leadsRouter: Router = Router();

leadsRouter.use(authenticate, requireOrg);

leadsRouter.get("/", asyncHandler(leadsController.list));
leadsRouter.get("/stats", asyncHandler(leadsController.stats));
leadsRouter.get("/export", requirePermission("export"), asyncHandler(leadsController.exportCsv));
leadsRouter.post("/import", requirePermission("create"), validate({ body: importSchema }), asyncHandler(leadsController.importRows));
leadsRouter.post("/bulk", requirePermission("update"), validate({ body: bulkSchema }), asyncHandler(leadsController.bulk));

leadsRouter.get("/:id", asyncHandler(leadsController.get));
leadsRouter.post("/", requirePermission("create"), validate({ body: createLeadSchema }), asyncHandler(leadsController.create));
leadsRouter.patch("/:id", requirePermission("update"), validate({ body: updateLeadSchema }), asyncHandler(leadsController.update));
leadsRouter.delete("/:id", requirePermission("delete"), asyncHandler(leadsController.remove));
leadsRouter.patch("/:id/status", requirePermission("update"), validate({ body: updateStatusSchema }), asyncHandler(leadsController.updateStatus));
leadsRouter.patch("/:id/assign", requirePermission("update"), validate({ body: assignSchema }), asyncHandler(leadsController.assign));
leadsRouter.post("/:id/notes", requirePermission("update"), validate({ body: noteSchema }), asyncHandler(leadsController.addNote));
leadsRouter.post("/:id/convert", requirePermission("update"), asyncHandler(leadsController.convert));
