"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { GuestRoute } from "@/components/auth/guest-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";
import { useAuthContext } from "@/lib/auth/auth-provider";

function RegisterForm() {
  const router = useRouter();
  const { signUp } = useAuthContext();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [registeredEmail, setRegisteredEmail] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password", "");

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-zinc-800" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 33, label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { score: 66, label: "Moderate", color: "bg-amber-500" };
    return { score: 100, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    try {
      const res = await signUp({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });

      if (res.needsVerification) {
        setRegisteredEmail(data.email);
        toast.success("Account Created!", {
          description: "Please check your inbox to verify your email address.",
        });
      } else {
        toast.success("Account Created!", {
          description: `Welcome to LeadPilot AI CRM, ${data.fullName}`,
        });
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Registration failed";
      toast.error("Registration Failed", {
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registeredEmail) {
    return (
      <div className="space-y-6 text-center animate-in fade-in duration-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <CheckCircle2 className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Check Your Email</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            We sent a verification link to <span className="font-semibold text-white">{registeredEmail}</span>.
            Please verify your email to access your workspace.
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-800/80 space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/login")}
          >
            Return to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">Create Account</h1>
        <p className="text-sm text-zinc-400">
          Join LeadPilot AI CRM as a Senior Sales Broker
        </p>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Alex Morgan"
              className="pl-9"
              {...register("fullName")}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-400">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Work Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type="email"
              placeholder="alex@agency.com"
              className="pl-9"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Password</label>
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
          {passwordValue && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                <span>Strength: <strong className="text-white">{strength.label}</strong></span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-9 pr-10"
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Role Notice */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-2.5 flex items-center gap-2 text-[11px] text-zinc-400">
          <ShieldCheck className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>New registrations default to <strong className="text-white font-mono">BROKER</strong> role.</span>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-10 mt-2"
          isLoading={isSubmitting}
        >
          <span>Register Account</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      {/* Footer Link to Login */}
      <div className="text-center text-xs text-zinc-400 pt-4 border-t border-zinc-800/80">
        <span>Already have an account? </span>
        <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <GuestRoute>
      <React.Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl" />}>
        <RegisterForm />
      </React.Suspense>
    </GuestRoute>
  );
}
