import * as React from "react";
import { Plus, Download, Upload, RefreshCw, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface DealsToolbarProps {
  onRefresh: () => void;
  onAddDeal?: () => void;
  isRefreshing?: boolean;
}

export function DealsToolbar({ onRefresh, onAddDeal, isRefreshing = false }: DealsToolbarProps) {
  const [viewMode, setViewMode] = React.useState<"kanban" | "table">("kanban");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      {/* View Mode Switcher */}
      <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-950 p-1">
        <button
          onClick={() => setViewMode("kanban")}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            viewMode === "kanban"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <LayoutGrid className="h-3.5 w-3.5 text-indigo-400" />
          <span>Kanban Pipeline</span>
        </button>
        <button
          onClick={() => {
            setViewMode("table");
            toast.info("Switched to List View (Placeholder)");
          }}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            viewMode === "table"
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <List className="h-3.5 w-3.5" />
          <span>List View</span>
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
          onClick={() => toast.info("Import Deals Wizard Triggered (Placeholder)")}
          className="h-8 text-xs gap-1.5"
        >
          <Upload className="h-3.5 w-3.5 text-zinc-400" />
          <span>Import</span>
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.info("Export Deals Report Triggered (Placeholder)")}
          className="h-8 text-xs gap-1.5"
        >
          <Download className="h-3.5 w-3.5 text-zinc-400" />
          <span>Export</span>
        </Button>

        <Button
          size="sm"
          variant="default"
          onClick={onAddDeal}
          className="h-8 text-xs gap-1.5 shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Deal</span>
        </Button>
      </div>
    </div>
  );
}
