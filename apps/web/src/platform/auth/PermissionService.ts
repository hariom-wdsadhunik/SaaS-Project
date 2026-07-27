import { PolicyEngine } from "./PolicyEngine";
import { SystemPermission } from "./PermissionDefinitions";
import { SystemRole } from "./RoleDefinitions";
import { platformAuditLogger } from "@/platform/audit";

export const PermissionService = {
  checkAndAudit(userRole: SystemRole, permission: SystemPermission, resourceName: string): boolean {
    const allowed = PolicyEngine.hasPermission(userRole, permission);
    if (!allowed) {
      platformAuditLogger.log({
        action: "UPDATE",
        entityType: "SYSTEM",
        entityIds: [resourceName],
        payload: { userRole, attemptedPermission: permission, result: "DENIED" },
        timestamp: new Date().toISOString(),
      });
    }
    return allowed;
  },
};
