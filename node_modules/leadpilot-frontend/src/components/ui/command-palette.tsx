"use client";

import * as React from "react";
import { Search, Sparkles, Building, Users, Calendar, Briefcase, Settings } from "lucide-react";
import { useUIStore } from "@/store/use-ui-store";

export function CommandPalette() {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const quickActions = [
    { icon: Sparkles, title: "Ask AI Assistant", shortcut: "⌘J", category: "AI Workflows" },
    { icon: Users, title: "Create New Lead", shortcut: "C", category: "Actions" },
    { icon: Briefcase, title: "Create New Deal", shortcut: "D", category: "Actions" },
    { icon: Building, title: "Search Property Catalogue", shortcut: "", category: "Navigation" },
    { icon: Calendar, title: "Schedule Viewing Appointment", shortcut: "", category: "Actions" },
    { icon: Settings, title: "Organization Settings", shortcut: "", category: "Navigation" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center border-b border-zinc-800 px-4 py-3">
          <Search className="mr-3 h-5 w-5 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search leads, deals, properties... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-700">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          <div className="px-2 py-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Quick Actions & Commands
          </div>
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => setCommandPaletteOpen(false)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800/80 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-indigo-400" />
                  <span>{action.title}</span>
                </div>
                {action.shortcut && (
                  <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs font-mono text-zinc-400 border border-zinc-700/60">
                    {action.shortcut}
                  </kbd>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
