"use client";

import * as React from "react";
import { TasksSummary } from "@/components/tasks/tasks-summary";
import { TasksFilters } from "@/components/tasks/tasks-filters";
import { TasksToolbar } from "@/components/tasks/tasks-toolbar";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskTable } from "@/components/tasks/task-table";
import { EntityEmptyState, EntityErrorState } from "@/platform/ui/entity-feedback";
import { initialTasksDataset, taskMockService } from "@/services/task-mock-service";
import { TaskEntity, TaskFilterState } from "@/domain/task/types";
import { toast } from "sonner";

const initialFilterState: TaskFilterState = {
  search: "",
  status: "",
  priority: "",
  assignedAgent: "",
};

export default function TasksPage() {
  const [tasksList, setTasksList] = React.useState<TaskEntity[]>(initialTasksDataset);
  const [isLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [filters, setFilters] = React.useState<TaskFilterState>(initialFilterState);

  const handleFilterChange = (newFilters: Partial<TaskFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    toast.info("All task filters reset");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Refreshing tasks agenda...");
    try {
      const freshData = await taskMockService.getTasks(filters);
      setTasksList(freshData);
      toast.success("Tasks database updated");
    } catch {
      toast.error("Failed to refresh tasks.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const activeFilterCount = Object.values(filters).filter((val) => val !== "").length;

  const filteredTasks = React.useMemo(() => {
    return tasksList.filter((tsk) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = tsk.title.toLowerCase().includes(query);
        const matchesDesc = tsk.description?.toLowerCase().includes(query);
        const matchesRelated = tsk.relatedEntityName?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesRelated) return false;
      }
      if (filters.status && tsk.status !== filters.status) return false;
      if (filters.priority && tsk.priority !== filters.priority) return false;
      if (filters.assignedAgent && tsk.assignedAgentName !== filters.assignedAgent) return false;
      return true;
    });
  }, [tasksList, filters]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Tasks &amp; Action Items Workspace</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Centralized task execution, follow-up reminders &amp; agent action items
          </p>
        </div>
      </div>

      {/* Top Tasks Summary KPI */}
      <TasksSummary tasks={filteredTasks} />

      {/* Filter Bar */}
      <TasksFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Toolbar */}
      <TasksToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Primary Display View (Grid / Table) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl border border-zinc-800 bg-zinc-950/60" />
          ))}
        </div>
      ) : isError ? (
        <EntityErrorState title="Tasks Load Failure" onRetry={() => setIsError(false)} />
      ) : filteredTasks.length === 0 ? (
        <EntityEmptyState
          title="No Tasks Found"
          description="No task action items match your active query filters."
          onResetFilters={handleResetFilters}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onSelectTask={(t) => toast.info(`Viewing task: "${t.title}"`)}
            />
          ))}
        </div>
      ) : (
        <TaskTable
          data={filteredTasks}
          onSelectTask={(t) => toast.info(`Viewing task: "${t.title}"`)}
        />
      )}
    </div>
  );
}
