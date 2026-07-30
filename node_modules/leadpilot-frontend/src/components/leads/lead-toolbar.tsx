"use client";

import * as React from "react";
import {
  Plus,
  Download,
  Upload,
  RefreshCw,
  Columns,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LeadToolbarProps {
  density: "compact" | "standard" | "spacious";
  onDensityChange: (d: "compact" | "standard" | "spacious") => void;
  onRefresh: () => void;
  onAddLead?: () => void;
  isRefreshing?: boolean;
}

export function LeadToolbar({
  density,
  onDensityChange,
  onRefresh,
  onAddLead,
  isRefreshing = false,
}: LeadToolbarProps) {
  const [isColumnMenuOpen, setIsColumnMenuOpen] = React.useState(false);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* Left: View & Density Toggles */}
      <div className="flex items-center gap-2">
        {/* Table Density Selector */}
        <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-1">
          <SlidersHorizontal className="h-3.5 w-3.5 text-zinc-500 ml-1.5 mr-1" />
          {(["compact", "standard", "spacious"] as const).map((d) => (
            <button
              key={d}
              onClick={() => onDensityChange(d)}
              className={`rounded-md px-2 py-0.5 text-[11px] font-medium capitalize transition-colors ${
                density === d
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Column Selector */}
        <div className="relative">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
            className="h-8 text-xs gap-1.5"
          >
            <Columns className="h-3.5 w-3.5 text-zinc-400" />
            <span>Columns</span>
          </Button>

          {isColumnMenuOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl z-30 animate-in fade-in duration-100">
              <p className="px-2 py-1 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                Toggle Columns
              </p>
              {["Phone/Email", "Status", "Source", "AI Score", "Budget", "Agent", "Created"].map(
                (col) => (
                  <label
                    key={col}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-950 text-indigo-600"
                    />
                    <span>{col}</span>
                  </label>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          isLoading={isRefreshing}
          className="h-8 text-xs gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.info("Import Leads Wizard Triggered (Placeholder)")}
          className="h-8 text-xs gap-1.5"
        >
          <Upload className="h-3.5 w-3.5 text-zinc-400" />
          <span>Import</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.info("Export CSV Report Triggered (Placeholder)")}
          className="h-8 text-xs gap-1.5"
        >
          <Download className="h-3.5 w-3.5 text-zinc-400" />
          <span>Export</span>
        </Button>

        <Button
          size="sm"
          variant="default"
          onClick={onAddLead}
          className="h-8 text-xs gap-1.5 shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Lead</span>
        </Button>
      </div>
    </div>
  );
}
