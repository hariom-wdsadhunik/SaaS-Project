import * as React from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarViewMode } from "@/domain/calendar/types";

interface CalendarToolbarProps {
  viewMode: CalendarViewMode;
  onViewModeChange: (mode: CalendarViewMode) => void;
  currentDateText: string;
  onPrevDate: () => void;
  onNextDate: () => void;
  onToday: () => void;
}

export function CalendarToolbar({
  viewMode,
  onViewModeChange,
  currentDateText,
  onPrevDate,
  onNextDate,
  onToday,
}: CalendarToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">
      {/* Date Navigation */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={onToday} className="h-8 text-xs">
          Today
        </Button>
        <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-0.5">
          <button
            onClick={onPrevDate}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
            title="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onNextDate}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
            title="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <span className="text-sm font-bold text-white px-2 font-mono">{currentDateText}</span>
      </div>

      {/* View Mode Switcher */}
      <div className="flex items-center rounded-lg border border-zinc-800 bg-zinc-900 p-1">
        <button
          onClick={() => onViewModeChange("month")}
          className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
            viewMode === "month" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
          }`}
        >
          <Grid className="h-3.5 w-3.5" />
          <span>Month</span>
        </button>
        <button
          onClick={() => onViewModeChange("week")}
          className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
            viewMode === "week" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
          }`}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>Week</span>
        </button>
        <button
          onClick={() => onViewModeChange("agenda")}
          className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
            viewMode === "agenda" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-400 hover:text-white"
          }`}
        >
          <List className="h-3.5 w-3.5" />
          <span>Agenda</span>
        </button>
      </div>
    </div>
  );
}
