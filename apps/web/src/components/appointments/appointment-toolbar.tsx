import * as React from "react";
import { LayoutGrid, List, Plus, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AppointmentToolbarProps {
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  onRefresh: () => void;
  onAddAppointment?: () => void;
  isRefreshing?: boolean;
}

export function AppointmentToolbar({
  viewMode,
  onViewModeChange,
  onRefresh,
  onAddAppointment,
  isRefreshing = false,
}: AppointmentToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* View Switcher */}
      <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-1">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            viewMode === "grid" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5 text-indigo-400" />
          <span>Grid View</span>
        </button>
        <button
          onClick={() => onViewModeChange("table")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            viewMode === "table" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <List className="h-3.5 w-3.5" />
          <span>Table View</span>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onRefresh} isLoading={isRefreshing} className="h-8 text-xs gap-1.5">
          <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast.info("Export Appointments Triggered")} className="h-8 text-xs gap-1.5">
          <Download className="h-3.5 w-3.5 text-zinc-400" />
          <span>Export</span>
        </Button>
        <Button size="sm" variant="default" onClick={onAddAppointment} className="h-8 text-xs gap-1.5 shadow-sm">
          <Plus className="h-3.5 w-3.5" />
          <span>Book Appointment</span>
        </Button>
      </div>
    </div>
  );
}
