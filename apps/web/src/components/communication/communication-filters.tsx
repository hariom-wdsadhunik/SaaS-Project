import * as React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommunicationFilterState } from "@/domain/communication/types";

interface CommunicationFiltersProps {
  filters: CommunicationFilterState;
  onFilterChange: (filters: Partial<CommunicationFilterState>) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export function CommunicationFilters({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
}: CommunicationFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search conversations by title or customer name..."
          className="pl-9 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.channel}
          onChange={(e) => onFilterChange({ channel: e.target.value })}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Channels</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="EMAIL">Email</option>
          <option value="SMS">SMS</option>
          <option value="INTERNAL_NOTE">Internal Note</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="RESOLVED">Resolved</option>
          <option value="ARCHIVED">Archived</option>
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
