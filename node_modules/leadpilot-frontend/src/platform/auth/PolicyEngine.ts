import { SystemPermission, ROLE_PERMISSIONS_MAP } from "./PermissionDefinitions";
import { SystemRole } from "./RoleDefinitions";

export const PolicyEngine = {
  hasPermission(userRole: SystemRole, permission: SystemPermission): boolean {
    const permissions = ROLE_PERMISSIONS_MAP[userRole] || [];
    return permissions.includes(permission);
  },

  hasAnyPermission(userRole: SystemRole, permissions: SystemPermission[]): boolean {
    return permissions.some((p) => this.hasPermission(userRole, p));
  },

  hasAllPermissions(userRole: SystemRole, permissions: SystemPermission[]): boolean {
    return permissions.every((p) => this.hasPermission(userRole, p));
  },

  canAccessRoute(userRole: SystemRole, routePath: string): boolean {
    if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") return true;
    if (routePath.startsWith("/dashboard")) return this.hasPermission(userRole, "VIEW");
    return true;
  },
};
