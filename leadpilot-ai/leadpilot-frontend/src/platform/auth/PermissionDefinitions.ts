export type SystemPermission =
  | "VIEW"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "ARCHIVE"
  | "RESTORE"
  | "EXPORT"
  | "IMPORT"
  | "ASSIGN"
  | "APPROVE"
  | "MANAGE_USERS"
  | "MANAGE_SETTINGS"
  | "MANAGE_ROLES"
  | "VIEW_ANALYTICS"
  | "MANAGE_AI";

export const ROLE_PERMISSIONS_MAP: Record<string, SystemPermission[]> = {
  SUPER_ADMIN: [
    "VIEW",
    "CREATE",
    "UPDATE",
    "DELETE",
    "ARCHIVE",
    "RESTORE",
    "EXPORT",
    "IMPORT",
    "ASSIGN",
    "APPROVE",
    "MANAGE_USERS",
    "MANAGE_SETTINGS",
    "MANAGE_ROLES",
    "VIEW_ANALYTICS",
    "MANAGE_AI",
  ],
  ADMIN: [
    "VIEW",
    "CREATE",
    "UPDATE",
    "DELETE",
    "ARCHIVE",
    "EXPORT",
    "IMPORT",
    "ASSIGN",
    "APPROVE",
    "MANAGE_USERS",
    "MANAGE_SETTINGS",
    "VIEW_ANALYTICS",
  ],
  MANAGER: [
    "VIEW",
    "CREATE",
    "UPDATE",
    "DELETE",
    "ARCHIVE",
    "EXPORT",
    "ASSIGN",
    "APPROVE",
    "VIEW_ANALYTICS",
  ],
  SALES_AGENT: ["VIEW", "CREATE", "UPDATE", "EXPORT", "ASSIGN"],
  SUPPORT_AGENT: ["VIEW", "UPDATE"],
  VIEWER: ["VIEW"],
};
