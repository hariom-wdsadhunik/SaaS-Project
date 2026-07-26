"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MarketingNavbar() {
  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur sticky top-0 z-50 px-8 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white text-sm shadow-md">
            L
          </div>
          <span className="font-bold text-lg text-white tracking-tight">LeadPilot AI</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-zinc-400">
          <Link href="/features" className="hover:text-white transition">
            Features
          </Link>
          <Link href="/pricing" className="hover:text-white transition">
            Pricing
          </Link>
          <Link href="/copilot" className="hover:text-white transition">
            AI Copilot
          </Link>
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/register">
          <Button variant="primary" size="sm">
            Get Started Free →
          </Button>
        </Link>
      </div>
    </header>
  );
}
