import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onConfirmDiscard: () => void;
  onKeepEditing: () => void;
}

export function UnsavedChangesDialog({
  isOpen,
  onConfirmDiscard,
  onKeepEditing,
}: UnsavedChangesDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100">
      <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-zinc-950 p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Discard Unsaved Changes?</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              You have uncommitted edits in this lead form. Discarding will permanently lose your changes.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
          <Button size="sm" variant="ghost" onClick={onKeepEditing} className="text-xs">
            Keep Editing
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={onConfirmDiscard}
            className="text-xs font-semibold"
          >
            Discard Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
