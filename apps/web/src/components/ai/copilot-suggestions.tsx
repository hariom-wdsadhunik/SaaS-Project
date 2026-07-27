import * as React from "react";
import { Sparkles, TrendingUp, Mail, Calendar, Target } from "lucide-react";

interface CopilotSuggestionsProps {
  onSelectSuggestion: (prompt: string) => void;
}

export function CopilotSuggestions({ onSelectSuggestion }: CopilotSuggestionsProps) {
  const suggestions = [
    {
      icon: <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />,
      category: "Lead Analysis",
      prompt: "Qualify lead Marcus Vance based on $5M budget and luxury penthouse criteria.",
    },
    {
      icon: <Mail className="h-3.5 w-3.5 text-emerald-400" />,
      category: "Write WhatsApp",
      prompt: "Draft a friendly VIP WhatsApp follow-up for Marcus Vance regarding penthouse walkthrough.",
    },
    {
      icon: <Calendar className="h-3.5 w-3.5 text-cyan-400" />,
      category: "Appointment Prep",
      prompt: "Prepare executive talking points for upcoming penthouse showing with Eleanor Sterling.",
    },
    {
      icon: <Target className="h-3.5 w-3.5 text-amber-400" />,
      category: "Deal Strategy",
      prompt: "Suggest closing strategies for $3.2M Waterfront Mansion deal in negotiation stage.",
    },
  ];

  return (
    <div className="p-4 bg-zinc-950/60 border-b border-zinc-800/80 space-y-3">
      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 font-mono">
        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
        <span>SUGGESTED COPILOT ACTIONS</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((item, i) => (
          <button
            key={i}
            onClick={() => onSelectSuggestion(item.prompt)}
            className="flex items-start gap-2.5 p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-800/60 text-left transition-colors group"
          >
            <div className="mt-0.5 p-1.5 rounded-lg bg-zinc-800 group-hover:bg-zinc-700 transition-colors">
              {item.icon}
            </div>
            <div>
              <p className="text-[11px] font-bold text-indigo-400 font-mono">{item.category}</p>
              <p className="text-xs text-zinc-300 line-clamp-2 mt-0.5">{item.prompt}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
