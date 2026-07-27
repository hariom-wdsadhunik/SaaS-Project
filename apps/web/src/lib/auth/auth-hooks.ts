import { useAuthContext } from "./auth-provider";
import { useAuthorization } from "@/platform/auth/AuthorizationContext";

export function useAuth() {
  return useAuthContext();
}

export function useUser() {
  const { user } = useAuthContext();
  return user;
}

export function useRole() {
  const { role } = useAuthContext();
  return role;
}

export function useSession() {
  const { isAuthenticated, isLoading } = useAuthContext();
  return { isAuthenticated, isLoading };
}

export function usePermissions() {
  const { hasPermission, hasAnyPermission } = useAuthorization();
  return { hasPermission, hasAnyPermission };
}
