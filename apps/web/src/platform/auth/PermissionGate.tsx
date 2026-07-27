"use client";

import * as React from "react";
import { SystemPermission } from "./PermissionDefinitions";
import { useAuthorization } from "./AuthorizationContext";

interface PermissionGateProps {
  permission: SystemPermission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGate({ permission, fallback = null, children }: PermissionGateProps) {
  const { hasPermission } = useAuthorization();
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }
  return <>{children}</>;
}
