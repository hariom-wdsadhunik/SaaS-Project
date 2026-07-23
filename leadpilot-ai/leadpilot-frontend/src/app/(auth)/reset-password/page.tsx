"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { GuestRoute } from "@/components/auth/guest-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPasswordSchema, ResetPasswordInput } from "@/lib/validations/auth";
import { authService } from "@/services/auth-service";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isComplete, setIsComplete] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch("password", "");

  const getStrengthLevel = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrengthLevel(newPassword);

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsSubmitting(true);
    try {
      await authService.resetPassword(data.password, "token-placeholder");
      setIsComplete(true);
      toast.success("Password Updated", {
        description: "Your credentials have been securely updated.",
      });
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      toast.error("Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GuestRoute>
      <div className="space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Create New Password</h1>
          <p className="text-sm text-zinc-400">
            Set your new strong password for LeadPilot AI CRM
          </p>
        </div>

        {isComplete ? (
          <div className="space-y-6 text-center animate-in fade-in duration-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">Password Updated</h3>
              <p className="text-xs text-zinc-400">Redirecting to login workspace...</p>
            </div>
            <Link href="/login">
              <Button className="w-full h-10">Proceed to Login Now</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password.message}</p>
              )}

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex h-1.5 w-full gap-1 overflow-hidden rounded-full bg-zinc-800">
                    <div className={`h-full flex-1 transition-all ${strength >= 1 ? "bg-red-500" : "bg-transparent"}`} />
                    <div className={`h-full flex-1 transition-all ${strength >= 2 ? "bg-amber-500" : "bg-transparent"}`} />
                    <div className={`h-full flex-1 transition-all ${strength >= 3 ? "bg-indigo-500" : "bg-transparent"}`} />
                    <div className={`h-full flex-1 transition-all ${strength >= 4 ? "bg-emerald-500" : "bg-transparent"}`} />
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    {strength <= 1 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Good" : "Strong"}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  type={showPassword ? "text" : "password"}
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
              Update Password & Sign In
            </Button>
          </form>
        )}
      </div>
    </GuestRoute>
  );
}
