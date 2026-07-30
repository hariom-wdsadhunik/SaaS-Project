import * as React from "react";
import { Filter, RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface DealFilterState {
  search: string;
  stage: string;
  agent: string;
  priority: string;
}

interface DealsFiltersProps {
  filters: DealFilterState;
  onFilterChange: (newFilters: Partial<DealFilterState>) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export function DealsFilters({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
}: DealsFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-3 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search deals by title, company, or lead name..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="pl-9 h-9 text-xs"
        />
      </div>

      {/* Filter Options Group */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Stage Dropdown */}
        <select
          aria-label="Filter by Stage"
          value={filters.stage}
          onChange={(e) => onFilterChange({ stage: e.target.value })}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Stages</option>
          <option value="NEW">New Inquiry</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="PROPOSAL_SENT">Proposal Sent</option>
          <option value="NEGOTIATION">Negotiation</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
        </select>

        {/* Agent Dropdown */}
        <select
          aria-label="Filter by Broker Agent"
          value={filters.agent}
          onChange={(e) => onFilterChange({ agent: e.target.value })}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Brokers</option>
          <option value="Alex Morgan">Alex Morgan</option>
          <option value="Sarah Jenkins">Sarah Jenkins</option>
          <option value="Michael Chen">Michael Chen</option>
        </select>

        {/* Priority Dropdown */}
        <select
          aria-label="Filter by Priority"
          value={filters.priority}
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Priorities</option>
          <option value="URGENT">Urgent</option>
          <option value="HIGH">High</option>
          <option value="NORMAL">Normal</option>
          <option value="LOW">Low</option>
        </select>

        {/* Reset Button */}
        {activeFilterCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onResetFilters}
            className="h-9 text-xs text-zinc-400 hover:text-white gap-1 px-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset ({activeFilterCount})</span>
          </Button>
        )}

        {/* Active Filters Counter Badge */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-400">
          <Filter className="h-3.5 w-3.5 text-indigo-400" />
          <span>Active:</span>
          <span className="font-bold text-white font-mono">{activeFilterCount}</span>
        </div>
      </div>
    </div>
  );
}
