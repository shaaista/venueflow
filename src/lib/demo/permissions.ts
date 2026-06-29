import type { Role } from "./tenants";

export type Permission =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "export"
  | "manage_billing"
  | "manage_users"
  | "manage_settings";

const ALL: Permission[] = ["create", "read", "update", "delete", "export", "manage_billing", "manage_users", "manage_settings"];

/** Role → granted permissions within the current organization. */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  OWNER: ALL,
  ADMIN: ["create", "read", "update", "delete", "export", "manage_users", "manage_settings"],
  MANAGER: ["create", "read", "update", "delete", "export"],
  COORDINATOR: ["create", "read", "update"],
  STAFF: ["read", "update"],
  VIEWER: ["read"],
};

export function can(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
