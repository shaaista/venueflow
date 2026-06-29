import type { Request, Response, NextFunction } from "express";
import type { Role } from "@prisma/client";
import { roleHasPermission, ROLE_RANK, type Permission } from "../config/permissions.js";
import { ForbiddenError, UnauthorizedError } from "../lib/errors.js";

/** Require a specific permission for the active organization role. */
export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(new UnauthorizedError());
    if (req.auth.isSuperAdmin) return next();
    if (!req.auth.role) return next(new ForbiddenError("No role in this organization"));
    if (!roleHasPermission(req.auth.role, permission)) {
      return next(new ForbiddenError(`Missing permission: ${permission}`));
    }
    next();
  };
}

/** Require the caller's role to rank at or above `minRole`. */
export function requireRole(minRole: Role) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) return next(new UnauthorizedError());
    if (req.auth.isSuperAdmin) return next();
    const rank = req.auth.role ? ROLE_RANK[req.auth.role] : 0;
    if (rank < ROLE_RANK[minRole]) return next(new ForbiddenError("Insufficient role"));
    next();
  };
}
