"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  Calendar,
  CheckSquare,
  MessageSquare,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/use-ui-store";

import { WorkspaceSwitcher } from "./workspace-switcher";

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Copilot", href: "/copilot", icon: Sparkles, badge: "AI" },
    { name: "Leads", href: "/leads", icon: Users },
    { name: "Deals", href: "/deals", icon: Briefcase },
    { name: "Properties", href: "/properties", icon: Building2 },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Omnichannel", href: "/communication", icon: MessageSquare },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Billing", href: "/billing", icon: FileText },
    { name: "Support", href: "/support", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-zinc-800 bg-zinc-950/95 transition-all duration-200 ease-in-out select-none z-30",
        isSidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-zinc-800/80">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-white leading-none">
                LeadPilot <span className="text-indigo-400 font-normal">AI</span>
              </span>
              <span className="text-[10px] text-zinc-500 font-mono mt-0.5">Real Estate CRM</span>
            </div>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="hidden md:flex h-6 w-6 items-center justify-center rounded-md border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Workspace Switcher */}
      {!isSidebarCollapsed && (
        <div className="p-2 border-b border-zinc-800/80">
          <WorkspaceSwitcher />
        </div>
      )}

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors group relative",
                isActive
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/30"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300")} />
              {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
              {!isSidebarCollapsed && item.badge && (
                <span className="ml-auto rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-violet-300 border border-violet-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile Status */}
      {!isSidebarCollapsed && (
        <div className="p-3 border-t border-zinc-800/80">
          <div className="flex items-center gap-2.5 rounded-lg bg-zinc-900/60 p-2 border border-zinc-800/60">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-300">WhatsApp API Active</span>
              <span className="text-[10px] text-zinc-500">v1.1.0 Backend Connected</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
