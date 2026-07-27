"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { Skeleton } from "@/components/ui/skeleton";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 p-6">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
