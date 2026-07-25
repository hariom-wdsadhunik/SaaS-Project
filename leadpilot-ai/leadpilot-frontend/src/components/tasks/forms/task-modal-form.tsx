"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, CheckSquare, Edit3, AlertCircle } from "lucide-react";

import { taskFormSchema, TaskFormInput } from "@/lib/validations/task-form";
import { taskMockService } from "@/services/task-mock-service";
import { TaskEntity } from "@/domain/task/types";
import { TaskFormSections } from "./task-form-sections";
import { UnsavedChangesDialog } from "@/components/leads/forms/unsaved-changes-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TaskModalFormProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialData?: TaskEntity | null;
  onClose: () => void;
  onSuccess: (task: TaskEntity) => void;
}

export function TaskModalForm({
  isOpen,
  mode,
  initialData,
  onClose,
  onSuccess,
}: TaskModalFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = React.useState(false);

  const defaultValues: TaskFormInput = React.useMemo(() => {
    if (mode === "edit" && initialData) {
      return {
        title: initialData.title,
        description: initialData.description || "",
        priority: initialData.priority,
        status: initialData.status,
        category: initialData.category,
        dueDate: initialData.dueDate ? initialData.dueDate.slice(0, 16) : "",
        assignedAgentName: initialData.assignedAgentName,
        relatedEntityType: initialData.relatedEntityType,
        relatedEntityName: initialData.relatedEntityName || "",
      };
    }
    return {
      title: "",
      description: "",
      priority: "HIGH",
      status: "TODO",
      category: "FOLLOW_UP",
      dueDate: new Date().toISOString().slice(0, 16),
      assignedAgentName: "Alex Morgan",
      relatedEntityType: undefined,
      relatedEntityName: "",
    };
  }, [mode, initialData]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<TaskFormInput>({
    resolver: zodResolver(taskFormSchema),
    values: defaultValues,
  });

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowUnsavedDialog(true);
    } else {
      setServerError(null);
      onClose();
    }
  };

  const onSubmit = async (data: TaskFormInput) => {
    setServerError(null);
    try {
      if (mode === "create") {
        const createdTask = await taskMockService.createTask(data);
        toast.success(`Task "${createdTask.title}" created successfully!`);
        onSuccess(createdTask);
      } else if (mode === "edit" && initialData) {
        const updatedTask = await taskMockService.updateTask(initialData.id, data);
        toast.success(`Task "${updatedTask.title}" updated successfully!`);
        onSuccess(updatedTask);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process task record.";
      setServerError(msg);
      toast.error(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none">
        {/* Modal Container */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={mode === "create" ? "Create New Task" : "Edit Task Parameters"}
          className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                {mode === "create" ? <CheckSquare className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {mode === "create" ? "Create New Action Item Task" : "Edit Task Parameters"}
                </h2>
                <p className="text-xs text-zinc-400">
                  {mode === "create"
                    ? "Schedule a new action item or follow-up reminder for a broker"
                    : `Modify task parameters for "${initialData?.title}"`}
                </p>
              </div>
            </div>

            <button
              onClick={handleCloseAttempt}
              aria-label="Close dialog"
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {serverError && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <TaskFormSections register={register} errors={errors} />

            {/* Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-950/95 py-2">
              <div className="text-[11px] text-zinc-500 font-mono">
                {isDirty ? "• Unsaved changes detected" : "• Form synchronized"}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCloseAttempt}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  isLoading={isSubmitting}
                  className="text-xs font-semibold shadow-sm"
                >
                  {mode === "create" ? "Save Task" : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onConfirmDiscard={() => {
          setShowUnsavedDialog(false);
          setServerError(null);
          onClose();
        }}
        onKeepEditing={() => setShowUnsavedDialog(false)}
      />
    </>
  );
}
