import * as React from "react";
import { AlertTriangle, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskConfirmationDialogProps {
  isOpen: boolean;
  actionType: "delete" | "archive";
  taskCount: number;
  taskTitle?: string;
  onConfirm: () => void;
  onClose: () => void;
  isProcessing?: boolean;
}

export function TaskConfirmationDialog({
  isOpen,
  actionType,
  taskCount,
  taskTitle,
  onConfirm,
  onClose,
  isProcessing = false,
}: TaskConfirmationDialogProps) {
  if (!isOpen) return null;

  const isDelete = actionType === "delete";
  const title = isDelete
    ? `Delete ${taskCount > 1 ? `${taskCount} Tasks` : `Task "${taskTitle}"`}?`
    : `Archive ${taskCount > 1 ? `${taskCount} Tasks` : `Task "${taskTitle}"`}?`;

  const description = isDelete
    ? "This action is permanent and will remove all task agenda items and execution logs."
    : "Archived tasks will be hidden from default views but remain preserved for auditing.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
              isDelete
                ? "border-red-500/20 bg-red-500/10 text-red-400"
                : "border-amber-500/20 bg-amber-500/10 text-amber-400"
            }`}
          >
            {isDelete ? <Trash2 className="h-5 w-5" /> : <Archive className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-300">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
          <span>Confirm action parameters before proceeding.</span>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            variant={isDelete ? "danger" : "default"}
            size="sm"
            onClick={onConfirm}
            isLoading={isProcessing}
            className="text-xs font-semibold"
          >
            {isDelete ? "Confirm Delete" : "Confirm Archive"}
          </Button>
        </div>
      </div>
    </div>
  );
}
