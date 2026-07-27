import * as React from "react";
import { Sparkles, Bot, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopilotHeaderProps {
  provider: string;
  model: string;
  onClear: () => void;
}

export function CopilotHeader({ provider, model, onClear }: CopilotHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950 p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">LeadPilot AI Copilot</h2>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">
              ONLINE
            </span>
          </div>
          <p className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono mt-0.5">
            <Bot className="h-3.5 w-3.5 text-indigo-400" />
            <span>Routed Model: {provider} • {model}</span>
          </p>
        </div>
      </div>

      <Button size="sm" variant="ghost" onClick={onClear} className="h-8 text-xs text-zinc-400 hover:text-rose-400 gap-1.5">
        <Trash2 className="h-3.5 w-3.5" />
        <span>Clear Chat</span>
      </Button>
    </div>
  );
}
