"use client";

import * as React from "react";
import { TasksSummary } from "@/components/tasks/tasks-summary";
import { TasksFilters } from "@/components/tasks/tasks-filters";
import { TasksToolbar } from "@/components/tasks/tasks-toolbar";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskTable } from "@/components/tasks/task-table";
import { EntityEmptyState, EntityErrorState } from "@/platform/ui/entity-feedback";
import { TaskDrawer } from "@/components/tasks/drawer/task-drawer";
import { TaskModalForm } from "@/components/tasks/forms/task-modal-form";
import { TaskConfirmationDialog } from "@/components/tasks/actions/task-action-dialogs";
import { TaskStatusAssignModal } from "@/components/tasks/actions/task-status-assign-modal";
import { initialTasksDataset, taskMockService } from "@/services/task-mock-service";
import { taskActionService } from "@/services/task-action-service";
import { TaskEntity, TaskFilterState, TaskStatus, TaskPriority } from "@/domain/task/types";
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

  const handleFormSuccess = (task: TaskEntity) => {
    if (formMode === "create") {
      setTasksList((prev) => [task, ...prev]);
    } else {
      setTasksList((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    }
  };

  const handleConfirmAction = async () => {
    if (!actionDialog.taskId) return;
    setIsActionProcessing(true);
    try {
      if (actionDialog.type === "delete") {
        await taskActionService.deleteTasks([actionDialog.taskId]);
        setTasksList((prev) => prev.filter((t) => t.id !== actionDialog.taskId));
        toast.success(`Task deleted.`);
      } else {
        await taskActionService.archiveTasks([actionDialog.taskId]);
        setTasksList((prev) => prev.filter((t) => t.id !== actionDialog.taskId));
        toast.success(`Task archived.`);
      }
      setActionDialog({ isOpen: false, type: "delete" });
    } catch {
      toast.error(`Action failed.`);
    } finally {
      setIsActionProcessing(false);
    }
  };

  const handleConfirmAssign = async (val: string) => {
    if (!assignModal.taskId) return;
    setIsActionProcessing(true);
    try {
      if (assignModal.mode === "status") {
        await taskActionService.updateStatus([assignModal.taskId], val as TaskStatus);
        setTasksList((prev) =>
          prev.map((t) => (t.id === assignModal.taskId ? { ...t, status: val as TaskStatus } : t))
        );
        toast.success(`Task status updated to ${val}.`);
      } else if (assignModal.mode === "priority") {
        await taskActionService.updatePriority([assignModal.taskId], val as TaskPriority);
        setTasksList((prev) =>
          prev.map((t) => (t.id === assignModal.taskId ? { ...t, priority: val as TaskPriority } : t))
        );
        toast.success(`Task priority updated to ${val}.`);
      } else {
        await taskActionService.assignAgent([assignModal.taskId], val);
        setTasksList((prev) =>
          prev.map((t) => (t.id === assignModal.taskId ? { ...t, assignedAgentName: val } : t))
        );
        toast.success(`Task assigned to ${val}.`);
      }
      setAssignModal({ isOpen: false, mode: "status" });
    } catch {
      toast.error(`Assignment failed.`);
    } finally {
      setIsActionProcessing(false);
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
        onAddTask={handleOpenCreateModal}
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
              onSelectTask={(t) => {
                setSelectedTask(t);
                setIsDrawerOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <TaskTable
          data={filteredTasks}
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
        onSuccess={handleFormSuccess}
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
