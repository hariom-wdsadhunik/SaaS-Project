"use client";

import * as React from "react";
import { UserCheck, Tag, Download, Archive, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  const handleBulkAction = (actionName: string) => {
    toast.info(`Bulk Action: ${actionName}`, {
      description: `Triggered for ${selectedCount} selected leads (UI Placeholder)`,
    });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-xl border border-zinc-700/80 bg-zinc-900/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center gap-2 pr-3 border-r border-zinc-800">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white font-mono">
          {selectedCount}
        </span>
        <span className="text-xs font-semibold text-white">Leads Selected</span>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="secondary"
          className="h-8 text-xs gap-1.5"
          onClick={() => handleBulkAction("Assign Agent")}
        >
          <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
          <span>Assign Agent</span>
        </Button>

        <Button
          size="sm"
          variant="secondary"
          className="h-8 text-xs gap-1.5"
          onClick={() => handleBulkAction("Change Status")}
        >
          <Tag className="h-3.5 w-3.5 text-violet-400" />
          <span>Change Status</span>
        </Button>

        <Button
          size="sm"
          variant="secondary"
          className="h-8 text-xs gap-1.5"
          onClick={() => handleBulkAction("Export Selected")}
        >
          <Download className="h-3.5 w-3.5 text-emerald-400" />
          <span>Export</span>
        </Button>

        <Button
          size="sm"
          variant="secondary"
          className="h-8 text-xs gap-1.5"
          onClick={() => handleBulkAction("Archive")}
        >
          <Archive className="h-3.5 w-3.5 text-amber-400" />
          <span>Archive</span>
        </Button>

        <Button
          size="sm"
          variant="danger"
          className="h-8 text-xs gap-1.5"
          onClick={() => handleBulkAction("Delete")}
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </Button>
      </div>

      <button
        onClick={onClearSelection}
        className="ml-2 rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        title="Clear Selection (Esc)"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
