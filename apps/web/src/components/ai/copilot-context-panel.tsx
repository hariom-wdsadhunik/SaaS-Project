import * as React from "react";
import { Database, User, Building } from "lucide-react";

export function CopilotContextPanel() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 space-y-4">
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <Database className="h-4 w-4 text-indigo-400" />
        <h3 className="text-xs font-bold text-white font-mono">ACTIVE CRM CONTEXT</h3>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-400 font-bold font-mono">
            <User className="h-3.5 w-3.5" />
            <span>Marcus Vance</span>
          </div>
          <p className="text-[11px] text-zinc-400">Budget: $5,000,000 • Intent: High</p>
        </div>

        <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
            <Building className="h-3.5 w-3.5" />
            <span>Waterfront Penthouse</span>
          </div>
          <p className="text-[11px] text-zinc-400">Listing: $4,850,000 • Active Deal</p>
        </div>
      </div>
    </div>
  );
}
