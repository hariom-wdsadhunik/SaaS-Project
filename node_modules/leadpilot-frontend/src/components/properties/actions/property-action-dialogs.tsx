import * as React from "react";
import { Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyConfirmationDialogProps {
  isOpen: boolean;
  type: "DELETE" | "ARCHIVE";
  itemCount: number;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PropertyConfirmationDialog({
  isOpen,
  type,
  itemCount,
  isProcessing = false,
  onConfirm,
  onCancel,
}: PropertyConfirmationDialogProps) {
  if (!isOpen) return null;

  const isDelete = type === "DELETE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100 select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isDelete ? "Confirm Property Deletion" : "Confirm Property Archival"}
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
                  ? `Delete ${itemCount} Selected Properties?`
                  : "Delete Property Listing?"
                : itemCount > 1
                ? `Archive ${itemCount} Selected Properties?`
                : "Archive Property Listing?"}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              {isDelete
                ? "This action is permanent. Associated listing specs and gallery documents will be removed."
                : "Archived properties will be marked OFF_MARKET but preserved for historical reporting."}
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
