import * as React from "react";
import { X, UserCheck, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactStatusAssignModalProps {
  isOpen: boolean;
  mode: "status" | "agent";
  contactCount: number;
  onConfirm: (val: string) => void;
  onClose: () => void;
  isProcessing?: boolean;
}

export function ContactStatusAssignModal({
  isOpen,
  mode,
  contactCount,
  onConfirm,
  onClose,
  isProcessing = false,
}: ContactStatusAssignModalProps) {
  const [selectedValue, setSelectedValue] = React.useState("");

  if (!isOpen) return null;

  const isStatus = mode === "status";
  const title = isStatus ? "Update Relationship Status" : "Assign Broker Agent";

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
              {isStatus ? <Tag className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-xs text-zinc-400">Applying changes for {contactCount} record(s)</p>
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
          {isStatus ? (
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Target Status</label>
              <select
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
                className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
              >
                <option value="">Select status...</option>
                <option value="ACTIVE">Active</option>
                <option value="PROSPECT">Prospect</option>
                <option value="CLIENT">Client</option>
                <option value="VIP">VIP</option>
                <option value="INACTIVE">Inactive</option>
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
