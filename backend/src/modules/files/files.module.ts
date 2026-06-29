import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { prisma } from "../../lib/prisma.js";
import { tenantWhere, getOrgId } from "../../lib/tenant.js";
import { BadRequestError, NotFoundError } from "../../lib/errors.js";
import { sendSuccess, asyncHandler } from "../../lib/http.js";
import { authenticate, requireOrg } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/rbac.js";
import { validate } from "../../middleware/validate.js";
import { uploadFile } from "../../lib/storage.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
const folderSchema = z.object({ name: z.string().min(1), parentId: z.string().optional() });

export const filesService = {
  list: (orgId: string, folderId?: string) =>
    prisma.fileObject.findMany({ where: { ...tenantWhere(orgId), ...(folderId ? { folderId } : {}) }, include: { uploadedBy: { select: { name: true } } }, orderBy: { createdAt: "desc" } }),
  listFolders: (orgId: string) => prisma.folder.findMany({ where: { organizationId: orgId }, orderBy: { createdAt: "asc" }, include: { _count: { select: { files: true } } } }),
  createFolder: (orgId: string, data: z.infer<typeof folderSchema>) => prisma.folder.create({ data: { organizationId: orgId, name: data.name, parentId: data.parentId } }),
  async remove(orgId: string, id: string) {
    const file = await prisma.fileObject.findFirst({ where: { id, ...tenantWhere(orgId) } });
    if (!file) throw new NotFoundError("File not found");
    await prisma.fileObject.update({ where: { id }, data: { deletedAt: new Date() } });
    return { ok: true };
  },
};

export const filesRouter: Router = Router();
filesRouter.use(authenticate, requireOrg);

filesRouter.get("/", asyncHandler(async (req, res) => sendSuccess(res, await filesService.list(getOrgId(req), req.query.folderId as string))));
filesRouter.get("/folders", asyncHandler(async (req, res) => sendSuccess(res, await filesService.listFolders(getOrgId(req)))));
filesRouter.post("/folders", requirePermission("create"), validate({ body: folderSchema }), asyncHandler(async (req, res) => sendSuccess(res, await filesService.createFolder(getOrgId(req), req.body), 201)));

filesRouter.post("/upload", requirePermission("create"), upload.single("file"), asyncHandler(async (req, res) => {
  const orgId = getOrgId(req);
  if (!req.file) throw new BadRequestError("No file provided");
  const url = await uploadFile({ buffer: req.file.buffer, filename: req.file.originalname, mimeType: req.file.mimetype, orgId });
  const record = await prisma.fileObject.create({
    data: { organizationId: orgId, folderId: (req.body.folderId as string) || undefined, name: req.file.originalname, url, mimeType: req.file.mimetype, size: req.file.size, uploadedById: req.auth?.userId },
  });
  sendSuccess(res, record, 201);
}));

filesRouter.delete("/:id", requirePermission("delete"), asyncHandler(async (req, res) => { await filesService.remove(getOrgId(req), req.params.id); sendSuccess(res, { ok: true }); }));
