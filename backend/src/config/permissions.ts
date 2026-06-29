import type { Role } from "@prisma/client";

/**
 * Permission catalogue. Routes declare the permission they need and the RBAC
 * middleware checks it against the caller's role for the active organization.
 */
export const PERMISSIONS = [
  "create",
  "read",
  "update",
  "delete",
  "export",
  "manage_billing",
  "manage_users",
  "manage_settings",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const ALL: Permission[] = [...PERMISSIONS];

/** Role → granted permissions, within a single organization. */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: ALL,
  OWNER: ALL,
  ADMIN: ["create", "read", "update", "delete", "export", "manage_users", "manage_settings"],
  MANAGER: ["create", "read", "update", "delete", "export"],
  COORDINATOR: ["create", "read", "update"],
  STAFF: ["read", "update"],
  VIEWER: ["read"],
  CUSTOMER: ["read"],
};

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/** Simple role ranking for "at least" checks. */
export const ROLE_RANK: Record<Role, number> = {
  SUPER_ADMIN: 100,
  OWNER: 90,
  ADMIN: 80,
  MANAGER: 60,
  COORDINATOR: 40,
  STAFF: 20,
  VIEWER: 10,
  CUSTOMER: 5,
};
