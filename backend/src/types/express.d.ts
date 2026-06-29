import type { Role } from "@prisma/client";

export interface AuthContext {
  userId: string;
  email: string;
  isSuperAdmin: boolean;
  /** Active organization for this request (absent for super-admin-only routes). */
  organizationId?: string;
  role?: Role;
  membershipId?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthContext;
    }
  }
}

export {};
