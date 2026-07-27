"use client";

import * as React from "react";
import {
  UserCheck,
  Tag,
  Download,
  Archive,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BulkActionBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAssign?: () => void;
  onBulkStatus?: () => void;
  onBulkExport?: () => void;
  onBulkArchive?: () => void;
  onBulkDelete?: () => void;
}

export function BulkActionBar({
  selectedCount,
  onClearSelection,
  onBulkAssign,
  onBulkStatus,
  onBulkExport,
  onBulkArchive,
  onBulkDelete,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/95 px-4 py-2.5 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom duration-200">
      {/* Selected Counter Badge */}
      <div className="flex items-center gap-2 border-r border-zinc-800 pr-3">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white font-mono">
          {selectedCount}
        </span>
        <span className="text-xs font-semibold text-white hidden sm:inline">
          {selectedCount === 1 ? "Lead Selected" : "Leads Selected"}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="ghost"
          onClick={onBulkAssign}
          className="h-8 text-xs text-zinc-300 hover:text-white gap-1.5 px-2.5"
        >
          <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
          <span>Assign</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onBulkStatus}
          className="h-8 text-xs text-zinc-300 hover:text-white gap-1.5 px-2.5"
        >
          <Tag className="h-3.5 w-3.5 text-emerald-400" />
          <span>Status</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onBulkExport}
          className="h-8 text-xs text-zinc-300 hover:text-white gap-1.5 px-2.5 hidden sm:flex"
        >
          <Download className="h-3.5 w-3.5 text-amber-400" />
          <span>Export</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onBulkArchive}
          className="h-8 text-xs text-zinc-300 hover:text-white gap-1.5 px-2.5"
        >
          <Archive className="h-3.5 w-3.5 text-zinc-400" />
          <span className="hidden md:inline">Archive</span>
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onBulkDelete}
          className="h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 gap-1.5 px-2.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Delete</span>
        </Button>
      </div>

      {/* Clear Selection X Button */}
      <button
        onClick={onClearSelection}
        className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-800 hover:text-white ml-1 border-l border-zinc-800 pl-2"
        title="Clear Selection (Esc)"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
