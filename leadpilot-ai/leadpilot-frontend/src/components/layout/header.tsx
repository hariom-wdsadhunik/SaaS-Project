"use client";

import * as React from "react";
import { Search, Bell, Sparkles, Sun, Moon, User, LogOut, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useUIStore } from "@/store/use-ui-store";
import { useAuthStore } from "@/store/use-auth-store";
import { Breadcrumb } from "./breadcrumb";
import { Avatar } from "@/components/ui/avatar";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { setCommandPaletteOpen, setAIDrawerOpen } = useUIStore();
  const { user, logout } = useAuthStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 backdrop-blur-md">
      {/* Left Area: Breadcrumbs */}
      <div className="flex items-center gap-4">
        <Breadcrumb />
      </div>

      {/* Right Area: Search, AI Button, Theme Switcher, Notifications, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Search Command Palette Trigger */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex h-8 w-48 sm:w-64 items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-zinc-500" />
            <span>Search or command...</span>
          </div>
          <kbd className="hidden sm:inline-block rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-700">
            ⌘K
          </kbd>
        </button>

        {/* AI Assistant Quick Toggle */}
        <button
          onClick={() => setAIDrawerOpen(true)}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 text-xs font-medium text-violet-300 hover:bg-violet-500/20 transition-colors shadow-sm shadow-violet-500/10"
        >
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          <span className="hidden md:inline">AI Assistant</span>
          <kbd className="hidden md:inline-block rounded bg-violet-950/60 px-1 py-0.5 text-[10px] font-mono text-violet-300 border border-violet-800">
            ⌘J
          </kbd>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notification Bell */}
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500" />
        </button>

        {/* User Menu Placeholder */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-zinc-900 transition-colors"
          >
            <Avatar src={user?.avatarUrl} fallback={user?.name?.[0] || "U"} size="sm" />
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-2xl z-50 animate-in fade-in duration-100">
              <div className="px-3 py-2 border-b border-zinc-800/80">
                <p className="text-xs font-semibold text-zinc-200">{user?.name}</p>
                <p className="text-[11px] text-zinc-500 truncate">{user?.email}</p>
                <span className="mt-1 inline-block rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
                  {user?.role}
                </span>
              </div>
              <div className="py-1">
                <button
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Profile Settings</span>
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
