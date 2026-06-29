import type { Request } from "express";
import { ForbiddenError } from "./errors.js";

/** Returns the active organization id or throws if the request has no org context. */
export function getOrgId(req: Request): string {
  const orgId = req.auth?.organizationId;
  if (!orgId) throw new ForbiddenError("No active organization");
  return orgId;
}

/** Standard tenant-scoped `where` fragment (excludes soft-deleted rows). */
export function tenantWhere(orgId: string) {
  return { organizationId: orgId, deletedAt: null };
}
