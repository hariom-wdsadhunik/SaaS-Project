"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Lock, Building, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { GuestRoute } from "@/components/auth/guest-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { acceptInviteSchema, AcceptInviteInput } from "@/lib/validations/auth";
import { authService } from "@/services/auth-service";
import { useAuthStore } from "@/store/use-auth-store";

function AcceptInviteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "inv-sample-token";
  const { setAuth } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteInput>({
    resolver: zodResolver(acceptInviteSchema),
  });

  const onSubmit = async (data: AcceptInviteInput) => {
    setIsSubmitting(true);
    try {
      const response = await authService.acceptInvite({
        name: data.name,
        password: data.password,
        token,
      });

      setAuth(response.user, response.token);
      toast.success("Team Onboarding Complete", {
        description: `Joined ${response.user.organizationName || "Agency Workspace"}`,
      });
      router.push("/dashboard");
    } catch {
      toast.error("Failed to accept team invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Organization Invitation Badge */}
      <div className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-3.5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white shrink-0">
          <Building className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-violet-200">Team Invitation</span>
          <span className="text-[11px] text-violet-400">Apex Real Estate Brokerage</span>
        </div>
      </div>

      {/* Header Title */}
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">Join Workspace</h1>
        <p className="text-sm text-zinc-400">
          Set up your profile to activate your broker account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Your Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Sarah Jenkins"
              className="pl-9"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Create Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-9"
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-9"
              {...register("confirmPassword")}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-10 mt-2"
          isLoading={isSubmitting}
        >
          <span>Activate Account & Enter OS</span>
          <CheckCircle2 className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <GuestRoute>
      <React.Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl" />}>
        <AcceptInviteForm />
      </React.Suspense>
    </GuestRoute>
  );
}
