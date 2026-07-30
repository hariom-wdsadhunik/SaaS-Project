import * as React from "react";
import { UserCheck, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyStatusAssignModalProps {
  isOpen: boolean;
  mode: "ASSIGN" | "STATUS";
  itemCount: number;
  isProcessing?: boolean;
  onConfirm: (selectedValue: string) => void;
  onClose: () => void;
}

export function PropertyStatusAssignModal({
  isOpen,
  mode,
  itemCount,
  isProcessing = false,
  onConfirm,
  onClose,
}: PropertyStatusAssignModalProps) {
  const initialDefault = mode === "ASSIGN" ? "Alex Morgan" : "AVAILABLE";
  const [selectedValue, setSelectedValue] = React.useState<string>(initialDefault);

  const activeValue = selectedValue || initialDefault;

  if (!isOpen) return null;

  const isAssign = mode === "ASSIGN";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100 select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isAssign ? "Assign Broker Agent" : "Update Property Status"}
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
                  ? `Assign Broker (${itemCount} Properties)`
                  : `Change Status (${itemCount} Properties)`}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {isAssign
                  ? "Select broker agent to manage inventory listing"
                  : "Update inventory availability status across selected properties"}
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
            </select>
          ) : (
            <select
              value={activeValue}
              onChange={(e) => setSelectedValue(e.target.value)}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Sold</option>
              <option value="OFF_MARKET">Off Market</option>
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
