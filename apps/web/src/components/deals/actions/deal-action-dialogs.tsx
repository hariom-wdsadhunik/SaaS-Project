import * as React from "react";
import { Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DealConfirmationDialogProps {
  isOpen: boolean;
  type: "DELETE" | "ARCHIVE";
  itemCount: number;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DealConfirmationDialog({
  isOpen,
  type,
  itemCount,
  isProcessing = false,
  onConfirm,
  onCancel,
}: DealConfirmationDialogProps) {
  if (!isOpen) return null;

  const isDelete = type === "DELETE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100 select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isDelete ? "Confirm Deal Deletion" : "Confirm Deal Archival"}
        className={`w-full max-w-md rounded-2xl border bg-zinc-950 p-6 shadow-2xl space-y-4 ${
          isDelete ? "border-red-500/30" : "border-amber-500/30"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full border shrink-0 ${
              isDelete
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}
          >
            {isDelete ? <Trash2 className="h-5 w-5" /> : <Archive className="h-5 w-5" />}
          </div>

          <div>
            <h3 className="text-base font-bold text-white">
              {isDelete
                ? itemCount > 1
                  ? `Delete ${itemCount} Selected Deals?`
                  : "Delete Deal Opportunity?"
                : itemCount > 1
                ? `Archive ${itemCount} Selected Deals?`
                : "Archive Deal Record?"}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {isDelete
                ? "This action is permanent. Associated revenue history and timeline notes will be removed."
                : "Archived deals will be hidden from active pipeline views but preserved for historical reporting."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            disabled={isProcessing}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant={isDelete ? "danger" : "secondary"}
            onClick={onConfirm}
            isLoading={isProcessing}
            className="text-xs font-semibold"
          >
            {isDelete ? `Confirm Delete (${itemCount})` : `Confirm Archive (${itemCount})`}
          </Button>
        </div>
      </div>
    </div>
  );
}
