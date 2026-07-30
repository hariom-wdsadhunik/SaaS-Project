import * as React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppointmentFilterState } from "@/domain/appointment/types";

interface AppointmentFiltersProps {
  filters: AppointmentFilterState;
  onFilterChange: (filters: Partial<AppointmentFilterState>) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export function AppointmentFilters({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
}: AppointmentFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search appointments by title, customer, or property..."
          className="pl-9 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CHECKED_IN">Checked In</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <select
          value={filters.appointmentType}
          onChange={(e) => onFilterChange({ appointmentType: e.target.value })}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="PROPERTY_VIEWING">Property Viewing</option>
          <option value="CLIENT_CONSULTATION">Client Consultation</option>
          <option value="LISTING_PRESENTATION">Listing Presentation</option>
          <option value="CONTRACT_SIGNING">Contract Signing</option>
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
