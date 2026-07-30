import * as React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-screen flex-col items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12 text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* Ambient Gradient Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-transparent blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="z-10 mb-8 flex flex-col items-center text-center">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xl font-bold tracking-tight text-white leading-none">
              LeadPilot <span className="text-indigo-400 font-normal">AI</span>
            </span>
            <span className="text-xs text-zinc-400 mt-0.5">Real Estate CRM OS</span>
          </div>
        </Link>
      </div>

      {/* Auth Card Container */}
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-xl transition-all duration-200">
        {children}
      </div>

      {/* Security Footer Note */}
      <div className="z-10 mt-8 flex items-center gap-2 text-xs text-zinc-500">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <span>Enterprise 256-bit SSL Encrypted • v1.1.0 Ready</span>
      </div>
    </div>
  );
}
