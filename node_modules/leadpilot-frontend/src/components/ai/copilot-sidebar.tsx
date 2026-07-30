import * as React from "react";
import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopilotSidebarProps {
  conversations: { id: string; title: string; updatedAt: string }[];
  activeId: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export function CopilotSidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewConversation,
}: CopilotSidebarProps) {
  return (
    <div className="space-y-4 border-r border-zinc-800/80 bg-zinc-950 p-4 h-full flex flex-col">
      <Button onClick={onNewConversation} size="sm" className="w-full text-xs gap-1.5 shadow-sm">
        <Plus className="h-4 w-4" />
        <span>New AI Session</span>
      </Button>

      <div className="flex-1 overflow-y-auto space-y-1">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono px-2 py-1">
          Recent Copilot Sessions
        </p>

        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left text-xs transition-colors ${
              activeId === conv.id
                ? "bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 font-semibold"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
            <span className="truncate flex-1">{conv.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
