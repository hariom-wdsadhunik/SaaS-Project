"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { Skeleton } from "@/components/ui/skeleton";

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center p-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
