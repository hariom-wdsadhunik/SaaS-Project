"use client";

import * as React from "react";
import { SystemRole } from "./RoleDefinitions";
import { SystemPermission } from "./PermissionDefinitions";
import { PolicyEngine } from "./PolicyEngine";

interface AuthorizationContextValue {
  userRole: SystemRole;
  setUserRole: (role: SystemRole) => void;
  hasPermission: (permission: SystemPermission) => boolean;
  hasAnyPermission: (permissions: SystemPermission[]) => boolean;
}

const AuthorizationContext = React.createContext<AuthorizationContextValue | null>(null);

export function AuthorizationProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = React.useState<SystemRole>("SUPER_ADMIN");

  const value = React.useMemo(
    () => ({
      userRole,
      setUserRole,
      hasPermission: (permission: SystemPermission) => PolicyEngine.hasPermission(userRole, permission),
      hasAnyPermission: (permissions: SystemPermission[]) =>
        PolicyEngine.hasAnyPermission(userRole, permissions),
    }),
    [userRole]
  );

  return (
    <AuthorizationContext.Provider value={value}>
      {children}
    </AuthorizationContext.Provider>
  );
}

export function useAuthorization() {
  const context = React.useContext(AuthorizationContext);
  if (!context) {
    throw new Error("useAuthorization must be used within an AuthorizationProvider");
  }
  return context;
}
