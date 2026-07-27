import * as React from "react";
import { X, UserCheck, CheckSquare, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskStatusAssignModalProps {
  isOpen: boolean;
  mode: "status" | "priority" | "agent";
  taskCount: number;
  onConfirm: (val: string) => void;
  onClose: () => void;
  isProcessing?: boolean;
}

export function TaskStatusAssignModal({
  isOpen,
  mode,
  taskCount,
  onConfirm,
  onClose,
  isProcessing = false,
}: TaskStatusAssignModalProps) {
  const [selectedValue, setSelectedValue] = React.useState("");

  if (!isOpen) return null;

  const title =
    mode === "status"
      ? "Update Task Status"
      : mode === "priority"
      ? "Change Task Priority"
      : "Assign Broker Agent";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedValue) return;
    onConfirm(selectedValue);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              {mode === "status" ? (
                <CheckSquare className="h-4 w-4" />
              ) : mode === "priority" ? (
                <Flame className="h-4 w-4 text-amber-400" />
              ) : (
                <UserCheck className="h-4 w-4" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-xs text-zinc-400">Applying changes for {taskCount} task(s)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "status" ? (
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Target Status</label>
              <select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select status...</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="WAITING">Waiting</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          ) : mode === "priority" ? (
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Target Priority</label>
              <select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select priority...</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Assigned Broker</label>
              <select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select broker agent...</option>
                <option value="Alex Morgan">Alex Morgan (Senior Broker)</option>
                <option value="Sarah Jenkins">Sarah Jenkins (Agent)</option>
                <option value="Michael Chen">Michael Chen (Agent)</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
            <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={!selectedValue}
              isLoading={isProcessing}
              className="text-xs font-semibold"
            >
              Apply Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
