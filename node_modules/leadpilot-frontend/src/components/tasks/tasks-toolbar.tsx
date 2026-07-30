import * as React from "react";
import { LayoutGrid, List, Kanban, Plus, Download, Upload, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TasksToolbarProps {
  viewMode: "grid" | "table" | "kanban";
  onViewModeChange: (mode: "grid" | "table" | "kanban") => void;
  onRefresh: () => void;
  onAddTask?: () => void;
  isRefreshing?: boolean;
}

export function TasksToolbar({
  viewMode,
  onViewModeChange,
  onRefresh,
  onAddTask,
  isRefreshing = false,
}: TasksToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* View Switcher */}
      <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-1">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            viewMode === "grid"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5 text-indigo-400" />
          <span>Grid</span>
        </button>
        <button
          onClick={() => onViewModeChange("table")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            viewMode === "table"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <List className="h-3.5 w-3.5 text-emerald-400" />
          <span>Table</span>
        </button>
        <button
          onClick={() => onViewModeChange("kanban")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            viewMode === "kanban"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Kanban className="h-3.5 w-3.5 text-amber-400" />
          <span>Kanban</span>
        </button>
      </div>

      {/* Right Actions */}
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
          onClick={() => toast.info("Import Tasks iCal / CSV Triggered (Placeholder)")}
          className="h-8 text-xs gap-1.5"
        >
          <Upload className="h-3.5 w-3.5 text-zinc-400" />
          <span>Import</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.info("Export Tasks CSV Triggered (Placeholder)")}
          className="h-8 text-xs gap-1.5"
        >
          <Download className="h-3.5 w-3.5 text-zinc-400" />
          <span>Export</span>
        </Button>

        <Button
          size="sm"
          variant="default"
          onClick={onAddTask}
          className="h-8 text-xs gap-1.5 shadow-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Create Task</span>
        </Button>
      </div>
    </div>
  );
}
