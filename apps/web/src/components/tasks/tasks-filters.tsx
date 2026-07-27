import * as React from "react";
import { Search, Filter, RotateCcw, User, Flame } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TaskFilterState } from "@/domain/task/types";

interface TasksFiltersProps {
  filters: TaskFilterState;
  onFilterChange: (filters: Partial<TaskFilterState>) => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export function TasksFilters({
  filters,
  onFilterChange,
  onResetFilters,
  activeFilterCount,
}: TasksFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-950 p-4 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search tasks by title, description, or linked entity..."
          className="pl-9 text-xs"
        />
      </div>

      {/* Attribute Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300">
          <Filter className="h-3.5 w-3.5 text-indigo-400" />
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING">Waiting</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-300">
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            className="bg-transparent text-xs text-zinc-200 focus:outline-none cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Assigned Broker Agent */}
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
