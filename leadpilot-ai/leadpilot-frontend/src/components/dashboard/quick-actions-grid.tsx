"use client";

import * as React from "react";
import { UserPlus, Briefcase, Calendar, FileUp, MessageSquare, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export function QuickActionsGrid() {
  const quickActions = [
    {
      title: "Add New Lead",
      description: "Capture buyer/seller contact",
      icon: UserPlus,
      shortcut: "C",
      color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
      action: () => toast.info("Quick Lead Creator Drawer Triggered (C)"),
    },
    {
      title: "Create Deal",
      description: "Start pipeline transaction",
      icon: Briefcase,
      shortcut: "D",
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
      action: () => toast.info("New Deal Form Modal Triggered (D)"),
    },
    {
      title: "Schedule Viewing",
      description: "Set property site visit",
      icon: Calendar,
      shortcut: "A",
      color: "text-amber-400 border-amber-500/20 bg-amber-500/10",
      action: () => toast.info("Calendar Schedule Triggered (A)"),
    },
    {
      title: "Upload Contract",
      description: "Attach PDF or e-signature",
      icon: FileUp,
      shortcut: "U",
      color: "text-violet-400 border-violet-500/20 bg-violet-500/10",
      action: () => toast.info("File Uploader Modal Triggered (U)"),
    },
    {
      title: "Open WhatsApp",
      description: "Launch unified inbox",
      icon: MessageSquare,
      shortcut: "W",
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
      action: () => toast.info("WhatsApp Split View Triggered (W)"),
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
        <span className="text-xs text-zinc-500">Keyboard Short-cuts Enabled</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {quickActions.map((qa) => {
          const Icon = qa.icon;
          return (
            <Card
              key={qa.title}
              onClick={qa.action}
              className="group flex flex-col justify-between border-zinc-800/80 bg-zinc-900/80 p-4 hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${qa.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <kbd className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 border border-zinc-700">
                  {qa.shortcut}
                </kbd>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                    {qa.title}
                  </h4>
                  <Plus className="h-3.5 w-3.5 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">{qa.description}</p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
