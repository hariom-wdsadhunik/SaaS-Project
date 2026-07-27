"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, AlertCircle, ArrowRight } from "lucide-react";

import { GuestRoute } from "@/components/auth/guest-route";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  const isExpired = errorCode === "otp_expired" || error === "access_denied";
  const isSuccess = !error;

  return (
    <div className="space-y-6 text-center animate-in fade-in duration-200">
      {isSuccess ? (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Email Verified Successfully</h1>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Your email address has been verified. You can now access your LeadPilot AI CRM workspace.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800/80">
            <Link href="/login">
              <Button className="w-full h-10">
                <span>Sign In to Workspace</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </>
      ) : isExpired ? (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <AlertCircle className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Verification Link Expired</h1>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              This email verification link has expired. Please sign in or register to receive a fresh verification link.
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 space-y-3">
            <Link href="/register">
              <Button className="w-full h-10">
                <span>Resend Verification / Register</span>
              </Button>
            </Link>
            <Link href="/login" className="block text-xs text-zinc-400 hover:text-white">
              Back to Sign In
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <XCircle className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Verification Failed</h1>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {errorDescription || "Invalid email verification token or corrupted link."}
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800/80">
            <Link href="/login">
              <Button variant="outline" className="w-full h-10">
                <span>Return to Sign In</span>
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <GuestRoute>
      <React.Suspense fallback={<Skeleton className="h-64 w-full rounded-2xl" />}>
        <VerifyEmailContent />
      </React.Suspense>
    </GuestRoute>
  );
}
