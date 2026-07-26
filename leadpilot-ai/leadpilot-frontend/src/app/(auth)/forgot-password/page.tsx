"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { GuestRoute } from "@/components/auth/guest-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema, ForgotPasswordInput } from "@/lib/validations/auth";
import { useAuthContext } from "@/lib/auth/auth-provider";

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [resendTimer, setResendTimer] = React.useState(60);
  const [submittedEmail, setSubmittedEmail] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSubmitted && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSubmitted, resendTimer]);

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsSubmitting(true);
    try {
      await forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      setResendTimer(60);
      toast.success("Password reset link dispatched", {
        description: `Check your inbox at ${data.email}`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to request password reset";
      toast.error("Reset Request Failed", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GuestRoute>
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          href="/login"
          className="inline-flex items-center text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          <span>Back to login</span>
        </Link>

        {/* Header Title */}
        <div className="space-y-1.5 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Reset Password</h1>
          <p className="text-sm text-zinc-400">
            Enter your work email address to receive recovery instructions
          </p>
        </div>

        {isSubmitted ? (
          /* Confirmation Success State */
          <div className="space-y-6 text-center animate-in fade-in duration-200">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">Reset Link Dispatched</h3>
              <p className="text-xs text-zinc-400">
                We have sent instructions to <span className="font-semibold text-zinc-200">{submittedEmail}</span>.
              </p>
            </div>

            <Button
              type="button"
              variant="secondary"
              className="w-full h-10"
              disabled={resendTimer > 0}
              onClick={() => onSubmit({ email: submittedEmail })}
            >
              {resendTimer > 0
                ? `Resend available in ${resendTimer}s`
                : "Resend Reset Link"}
            </Button>
          </div>
        ) : (
          /* Form Input State */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  type="email"
                  placeholder="name@agency.com"
                  className="pl-9"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 mt-2"
              isLoading={isSubmitting}
            >
              Send Reset Instructions
            </Button>
          </form>
        )}
      </div>
    </GuestRoute>
  );
}
