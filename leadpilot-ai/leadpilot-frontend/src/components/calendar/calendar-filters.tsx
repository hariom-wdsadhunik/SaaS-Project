import * as React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarFilterState } from "@/domain/calendar/types";

interface CalendarFiltersProps {
  filters: CalendarFilterState;
  onFilterChange: (filters: Partial<CalendarFilterState>) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export function CalendarFilters({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
}: CalendarFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search calendar events by title, lead, property or contact..."
          className="pl-9 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.eventType}
          onChange={(e) => onFilterChange({ eventType: e.target.value })}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Event Types</option>
          <option value="PROPERTY_VISIT">Property Visit</option>
          <option value="MEETING">Meeting</option>
          <option value="FOLLOW_UP">Follow Up</option>
          <option value="TASK">Task</option>
          <option value="APPOINTMENT">Appointment</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Priorities</option>
          <option value="URGENT">Urgent</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        {activeFilterCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={onResetFilters}
            className="h-9 text-xs gap-1.5 text-zinc-400 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset ({activeFilterCount})</span>
          </Button>
        )}
      </div>
    </div>
  );
}
