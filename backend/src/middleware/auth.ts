import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/tokens.js";
import { prisma } from "../lib/prisma.js";
import { UnauthorizedError, ForbiddenError } from "../lib/errors.js";
import type { AuthContext } from "../types/express.js";

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  if (req.cookies?.accessToken) return req.cookies.accessToken as string;
  return null;
}

/**
 * Authenticates the request and resolves the active organization + role.
 * The org is taken from the token, overridable by an `X-Organization-Id`
 * header (validated against the user's memberships).
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractToken(req);
    if (!token) throw new UnauthorizedError();

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }

    const ctx: AuthContext = {
      userId: payload.sub,
      email: payload.email,
      isSuperAdmin: Boolean(payload.isSuperAdmin),
    };

    const requestedOrg = (req.headers["x-organization-id"] as string) || payload.orgId;
    if (requestedOrg) {
      const membership = await prisma.membership.findUnique({
        where: { userId_organizationId: { userId: payload.sub, organizationId: requestedOrg } },
      });
      if (membership && membership.status === "ACTIVE") {
        ctx.organizationId = membership.organizationId;
        ctx.role = membership.role;
        ctx.membershipId = membership.id;
      } else if (!ctx.isSuperAdmin) {
        throw new ForbiddenError("You are not a member of this organization");
      } else {
        ctx.organizationId = requestedOrg;
      }
    }

    req.auth = ctx;
    next();
  } catch (err) {
    next(err);
  }
}

/** Requires an authenticated request with an active organization context. */
export function requireOrg(req: Request, _res: Response, next: NextFunction) {
  if (!req.auth) return next(new UnauthorizedError());
  if (!req.auth.organizationId) return next(new ForbiddenError("No active organization selected"));
  next();
}

/** Restricts a route to platform super admins. */
export function requireSuperAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.auth) return next(new UnauthorizedError());
  if (!req.auth.isSuperAdmin) return next(new ForbiddenError("Super admin access required"));
  next();
}
