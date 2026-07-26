"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { GuestRoute } from "@/components/auth/guest-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { useAuthContext } from "@/lib/auth/auth-provider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthContext();

  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isExpired = searchParams.get("expired") === "true";

  React.useEffect(() => {
    if (isExpired) {
      toast.error("Your session has expired. Please log in again.");
    }
  }, [isExpired]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "alex@leadpilot.ai",
      password: "password123",
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsSubmitting(true);
    try {
      const response = await login(data.email, data.password);
      toast.success("Welcome back!", {
        description: `Logged in as ${response.user.fullName}`,
      });
      router.push("/dashboard");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Invalid email or password";
      toast.error("Authentication Failed", {
        description: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = () => {
    setValue("email", "alex@leadpilot.ai");
    setValue("password", "password123");
    toast.info("Demo credentials pre-filled");
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
        <p className="text-sm text-zinc-400">
          Sign in to access your LeadPilot AI CRM workspace
        </p>
      </div>

      {/* Demo Preset Bar */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3 flex items-center justify-between text-xs text-indigo-300">
        <span>Demo Account Loaded</span>
        <button
          type="button"
          onClick={fillDemoAccount}
          className="font-semibold underline hover:text-white transition-colors"
        >
          Reset Form
        </button>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
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

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-300">Password</label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
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
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center space-x-2 pt-1">
          <input
            type="checkbox"
            id="rememberMe"
            className="h-4 w-4 rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-950"
            {...register("rememberMe")}
          />
          <label htmlFor="rememberMe" className="text-xs text-zinc-400 cursor-pointer select-none">
            Keep me signed in for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-10 mt-2"
          isLoading={isSubmitting}
        >
          <span>Sign In to Dashboard</span>
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <GuestRoute>
      <React.Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl" />}>
        <LoginForm />
      </React.Suspense>
    </GuestRoute>
  );
}
