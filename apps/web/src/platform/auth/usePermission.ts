import { useAuthorization } from "./AuthorizationContext";
import { SystemPermission } from "./PermissionDefinitions";

export function usePermission(permission: SystemPermission) {
  const { hasPermission, userRole } = useAuthorization();
  return {
    allowed: hasPermission(permission),
    userRole,
  };
}
