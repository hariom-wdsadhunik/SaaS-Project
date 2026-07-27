import * as React from "react";
import { UserCheck, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadStatusAssignModalProps {
  isOpen: boolean;
  mode: "ASSIGN" | "STATUS";
  itemCount: number;
  isProcessing?: boolean;
  onConfirm: (selectedValue: string) => void;
  onClose: () => void;
}

export function LeadStatusAssignModal({
  isOpen,
  mode,
  itemCount,
  isProcessing = false,
  onConfirm,
  onClose,
}: LeadStatusAssignModalProps) {
  const [selectedValue, setSelectedValue] = React.useState<string>(
    mode === "ASSIGN" ? "Alex Morgan" : "QUALIFIED"
  );

  // Sync default selection based on mode when opened
  const initialDefault = mode === "ASSIGN" ? "Alex Morgan" : "QUALIFIED";
  const activeValue = selectedValue || initialDefault;

  if (!isOpen) return null;

  const isAssign = mode === "ASSIGN";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100 select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isAssign ? "Assign Broker" : "Update Status"}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              {isAssign ? <UserCheck className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isAssign
                  ? `Assign Broker (${itemCount} Leads)`
                  : `Change Status (${itemCount} Leads)`}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {isAssign
                  ? "Select broker agent to take ownership of inquiry"
                  : "Update lifecycle stage across selected records"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 py-2">
          <label className="text-xs font-medium text-zinc-300">
            {isAssign ? "Select Broker Agent" : "Select Target Status"}
          </label>
          {isAssign ? (
            <select
              value={activeValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Alex Morgan">Alex Morgan (Senior Broker)</option>
              <option value="Sarah Jenkins">Sarah Jenkins (Agent)</option>
              <option value="Michael Chen">Michael Chen (Agent)</option>
              <option value="Unassigned">Unassigned</option>
            </select>
          ) : (
            <select
              value={activeValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="QUALIFIED">QUALIFIED</option>
              <option value="NURTURING">NURTURING</option>
              <option value="LOST">LOST</option>
            </select>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
          <Button size="sm" variant="outline" onClick={onClose} disabled={isProcessing} className="text-xs">
            Cancel
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={() => onConfirm(activeValue)}
            isLoading={isProcessing}
            className="text-xs font-semibold"
          >
            Apply Action
          </Button>
        </div>
      </div>
    </div>
  );
}
