import * as React from "react";
import { Trash2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PlatformConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PlatformConfirmationDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onCancel,
}: PlatformConfirmationDialogProps) {
  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-100 select-none">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`w-full max-w-md rounded-2xl border bg-zinc-950 p-6 shadow-2xl space-y-4 ${
          isDanger ? "border-red-500/30" : "border-amber-500/30"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full border shrink-0 ${
              isDanger
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-400"
            }`}
          >
            {isDanger ? <Trash2 className="h-5 w-5" /> : <Archive className="h-5 w-5" />}
          </div>

          <div>
            <h3 className="text-base font-bold text-white">{title}</h3>
            <p className="text-xs text-zinc-400 mt-1">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="text-xs"
          >
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            variant={isDanger ? "danger" : "secondary"}
            onClick={onConfirm}
            isLoading={isLoading}
            className="text-xs font-semibold"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
