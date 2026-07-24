import * as React from "react";
import { Search, Filter, RotateCcw, Building, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PropertyFilterState } from "@/domain/property/types";

interface PropertiesFiltersProps {
  filters: PropertyFilterState;
  onFilterChange: (filters: Partial<PropertyFilterState>) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export function PropertiesFilters({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
}: PropertiesFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-950 p-4 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search by property title, address, city, or MLS ID..."
          className="pl-9 text-xs"
        />
      </div>

      {/* Attribute Dropdown Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Property Type Filter */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300">
          <Building className="h-3.5 w-3.5 text-indigo-400" />
          <select
            value={filters.propertyType}
            onChange={(e) => onFilterChange({ propertyType: e.target.value })}
            className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="PENTHOUSE">Penthouse</option>
            <option value="VILLA">Villa</option>
            <option value="APARTMENT">Apartment</option>
            <option value="COMMERCIAL">Commercial</option>
            <option value="DUPLEX">Duplex</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300">
          <Filter className="h-3.5 w-3.5 text-indigo-400" />
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="SOLD">Sold</option>
            <option value="OFF_MARKET">Off Market</option>
          </select>
        </div>

        {/* Assigned Agent */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300">
          <User className="h-3.5 w-3.5 text-indigo-400" />
          <select
            value={filters.assignedAgent}
            onChange={(e) => onFilterChange({ assignedAgent: e.target.value })}
            className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
          >
            <option value="">All Brokers</option>
            <option value="Alex Morgan">Alex Morgan</option>
            <option value="Sarah Jenkins">Sarah Jenkins</option>
            <option value="Michael Chen">Michael Chen</option>
          </select>
        </div>

        {/* Reset Button */}
        {activeFilterCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onResetFilters}
            className="h-8 text-xs text-zinc-400 hover:text-white gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset ({activeFilterCount})</span>
          </Button>
        )}
      </div>
    </div>
  );
}
