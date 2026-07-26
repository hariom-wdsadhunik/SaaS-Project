"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "./auth-provider";
import { SystemPermission } from "@/platform/auth/PermissionDefinitions";
import { useAuthorization } from "@/platform/auth/AuthorizationContext";
import { platformAuditLogger } from "@/platform/audit";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: SystemPermission;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const { hasPermission } = useAuthorization();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 p-6 text-xs text-zinc-400 font-mono">
        Restoring LeadPilot session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [user?.id || "unknown"],
      payload: { event: "Permission Denied", requiredPermission, userRole: user?.role },
      timestamp: new Date().toISOString(),
    });

    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-950 p-6 space-y-3 text-center">
        <h2 className="text-lg font-bold text-rose-400">Permission Denied</h2>
        <p className="text-xs text-zinc-400 max-w-sm">
          Your current role does not have authorization to view this area (`{requiredPermission}`).
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
