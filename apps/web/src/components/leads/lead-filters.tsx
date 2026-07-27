"use client";

import * as React from "react";
import { Filter, RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface LeadFilterState {
  search: string;
  status: string;
  source: string;
  agent: string;
  budgetMin: string;
}

interface LeadFiltersProps {
  filters: LeadFilterState;
  onFilterChange: (newFilters: Partial<LeadFilterState>) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export function LeadFilters({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
}: LeadFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/80 p-3 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search by lead name, email, phone, location..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="pl-9 h-9 text-xs"
        />
      </div>

      {/* Filter Options Group */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Dropdown */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="QUALIFIED">QUALIFIED</option>
          <option value="NURTURING">NURTURING</option>
          <option value="LOST">LOST</option>
        </select>

        {/* Source Dropdown */}
        <select
          value={filters.source}
          onChange={(e) => onFilterChange({ source: e.target.value })}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Sources</option>
          <option value="WhatsApp Business API">WhatsApp API</option>
          <option value="Meta / IG Lead Ads">Meta Ads</option>
          <option value="Website Webhook">Website Webhook</option>
          <option value="Client Referrals">Referrals</option>
        </select>

        {/* Agent Dropdown */}
        <select
          value={filters.agent}
          onChange={(e) => onFilterChange({ agent: e.target.value })}
          className="h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All Brokers</option>
          <option value="Alex Morgan">Alex Morgan</option>
          <option value="Sarah Jenkins">Sarah Jenkins</option>
          <option value="Michael Chen">Michael Chen</option>
          <option value="Unassigned">Unassigned</option>
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
          <span>Filters Active:</span>
          <span className="font-bold text-white font-mono">{activeFilterCount}</span>
        </div>
      </div>
    </div>
  );
}
