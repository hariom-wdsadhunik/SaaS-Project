"use client";

import * as React from "react";
import { TasksSummary } from "@/components/tasks/tasks-summary";
import { TasksFilters } from "@/components/tasks/tasks-filters";
import { TasksToolbar } from "@/components/tasks/tasks-toolbar";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskTable } from "@/components/tasks/task-table";
import { TaskKanban } from "@/components/tasks/task-kanban";
import { EntityEmptyState, EntityErrorState } from "@/platform/ui/entity-feedback";
import { TaskDrawer } from "@/components/tasks/drawer/task-drawer";
import { TaskModalForm } from "@/components/tasks/forms/task-modal-form";
import { TaskConfirmationDialog } from "@/components/tasks/actions/task-action-dialogs";
import { TaskStatusAssignModal } from "@/components/tasks/actions/task-status-assign-modal";
import { supabaseTaskRepository } from "@/infrastructure/repositories/SupabaseTaskRepository";
import { TaskEntity, TaskFilterState, TaskStatus } from "@/domain/task/types";
import { toast } from "sonner";

const initialFilterState: TaskFilterState = {
  search: "",
  status: "",
  priority: "",
  assignedAgent: "",
};

export default function TasksPage() {
  const [tasksList, setTasksList] = React.useState<TaskEntity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [viewMode, setViewMode] = React.useState<"grid" | "table" | "kanban">("grid");
  const [filters, setFilters] = React.useState<TaskFilterState>(initialFilterState);

  // Drawer State
  const [selectedTask, setSelectedTask] = React.useState<TaskEntity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Modal Form State
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editingTask, setEditingTask] = React.useState<TaskEntity | null>(null);

  // Action Dialog States
  const [actionDialog, setActionDialog] = React.useState<{
    isOpen: boolean;
    type: "delete" | "archive";
    taskId?: string;
    taskTitle?: string;
  }>({ isOpen: false, type: "delete" });

  const [assignModal, setAssignModal] = React.useState<{
    isOpen: boolean;
    mode: "status" | "priority" | "agent";
    taskId?: string;
  }>({ isOpen: false, mode: "status" });

  const [isActionProcessing, setIsActionProcessing] = React.useState(false);

  // Fetch tasks from Supabase repository
  React.useEffect(() => {
    let isMounted = true;
    supabaseTaskRepository
      .getTasks(filters)
      .then((data) => {
        if (isMounted) {
          setTasksList(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setIsError(true);
          const msg = err instanceof Error ? err.message : "Failed to load tasks";
          toast.error(msg);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

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
      const freshData = await supabaseTaskRepository.getTasks(filters);
      setTasksList(freshData);
      toast.success("Tasks database updated");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to refresh tasks";
      toast.error(msg);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormMode("create");
    setEditingTask(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (task: TaskEntity) => {
    setFormMode("edit");
    setEditingTask(task);
    setIsFormModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!actionDialog.taskId) return;
    setIsActionProcessing(true);
    try {
      if (actionDialog.type === "delete") {
        await supabaseTaskRepository.deleteTask(actionDialog.taskId);
        setTasksList((prev) => prev.filter((t) => t.id !== actionDialog.taskId));
        toast.success(`Task deleted.`);
      } else {
        await supabaseTaskRepository.archiveTask(actionDialog.taskId);
        setTasksList((prev) =>
          prev.map((t) => (t.id === actionDialog.taskId ? { ...t, status: "ARCHIVED" } : t))
        );
        toast.success(`Task archived.`);
      }
      setActionDialog({ isOpen: false, type: "delete" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Action failed";
      toast.error(msg);
    } finally {
      setIsActionProcessing(false);
    }
  };

  const handleConfirmAssign = async (val: string) => {
    if (!assignModal.taskId) return;
    setIsActionProcessing(true);
    try {
      if (assignModal.mode === "status") {
        await supabaseTaskRepository.bulkUpdateStatus([assignModal.taskId], val as TaskStatus);
        setTasksList((prev) =>
          prev.map((t) => (t.id === assignModal.taskId ? { ...t, status: val as TaskStatus } : t))
        );
        toast.success(`Task status updated to ${val}.`);
      } else if (assignModal.mode === "agent") {
        const updated = await supabaseTaskRepository.assignTask(assignModal.taskId, val);
        setTasksList((prev) =>
          prev.map((t) => (t.id === assignModal.taskId ? updated : t))
        );
        toast.success(`Task assigned to ${val}.`);
      }
      setAssignModal({ isOpen: false, mode: "status" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Assignment failed";
      toast.error(msg);
    } finally {
      setIsActionProcessing(false);
    }
  };

  const activeFilterCount = Object.values(filters).filter((val) => val !== "" && val !== undefined).length;

  const filteredTasks = React.useMemo(() => {
    return tasksList.filter((tsk) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = tsk.title.toLowerCase().includes(query);
        const matchesDesc = (tsk.description || "").toLowerCase().includes(query);
        const matchesRelated = (tsk.relatedEntityName || "").toLowerCase().includes(query);
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
        onAddTask={handleOpenCreateModal}
        isRefreshing={isRefreshing}
      />

      {/* Primary Display View (Grid / Table / Kanban) */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl border border-zinc-800 bg-zinc-950/60" />
          ))}
        </div>
      ) : isError ? (
        <EntityErrorState title="Tasks Load Failure" onRetry={handleRefresh} />
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
              onSelectTask={(t) => {
                setSelectedTask(t);
                setIsDrawerOpen(true);
              }}
            />
          ))}
        </div>
      ) : viewMode === "table" ? (
        <TaskTable
          data={filteredTasks}
          onSelectTask={(t) => {
            setSelectedTask(t);
            setIsDrawerOpen(true);
          }}
        />
      ) : (
        <TaskKanban
          tasks={filteredTasks}
          onSelectTask={(t) => {
            setSelectedTask(t);
            setIsDrawerOpen(true);
          }}
        />
      )}

      {/* Task Drawer Workspace */}
      <TaskDrawer
        task={selectedTask}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTask(null);
        }}
        onEdit={() => {
          if (selectedTask) {
            handleOpenEditModal(selectedTask);
          }
        }}
      />

      {/* Create / Edit Task Modal Form */}
      <TaskModalForm
        isOpen={isFormModalOpen}
        mode={formMode}
        initialData={editingTask}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={(task) => {
          if (formMode === "create") {
            setTasksList((prev) => [task, ...prev]);
          } else {
            setTasksList((prev) => prev.map((t) => (t.id === task.id ? task : t)));
          }
        }}
      />

      {/* Action Dialogs */}
      <TaskConfirmationDialog
        isOpen={actionDialog.isOpen}
        actionType={actionDialog.type}
        taskCount={1}
        taskTitle={actionDialog.taskTitle}
        onConfirm={handleConfirmAction}
        onClose={() => setActionDialog({ isOpen: false, type: "delete" })}
        isProcessing={isActionProcessing}
      />

      <TaskStatusAssignModal
        isOpen={assignModal.isOpen}
        mode={assignModal.mode}
        taskCount={1}
        onConfirm={handleConfirmAssign}
        onClose={() => setAssignModal({ isOpen: false, mode: "status" })}
        isProcessing={isActionProcessing}
      />
    </div>
  );
}
