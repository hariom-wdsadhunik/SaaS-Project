"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { OfflineBanner } from "@/components/common/OfflineBanner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Leads", href: "/leads" },
    { label: "Deals", href: "/deals" },
    { label: "Contacts", href: "/contacts" },
    { label: "Appointments", href: "/appointments" },
    { label: "Tasks", href: "/tasks" },
    { label: "Communication", href: "/communication" },
    { label: "Documents", href: "/documents" },
    { label: "AI Copilot", href: "/copilot" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <OfflineBanner />
      <CommandPalette />

      {/* Top Bar */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-zinc-400 hover:text-white"
          >
            ☰
          </button>
          <Link href="/dashboard" className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-xs font-black">L</span>
            <span>LeadPilot AI</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-xs text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-full border border-zinc-700">
            Enterprise GA (v2.0.0)
          </span>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className={`w-64 border-r border-zinc-800 bg-zinc-900/30 p-4 space-y-1 md:block ${mobileMenuOpen ? "block" : "hidden"}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition"
            >
              {item.label}
            </Link>
          ))}
        </aside>

        {/* Main Content View Container */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
