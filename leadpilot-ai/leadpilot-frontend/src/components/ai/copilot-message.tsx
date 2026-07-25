import * as React from "react";
import { Sparkles, User, Bot, Clock, Cpu } from "lucide-react";
import { formatDate } from "@/utils/formatters";

export interface CopilotMessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  provider?: string;
  model?: string;
  tokensUsed?: number;
  timestamp: string;
}

interface CopilotMessageProps {
  message: CopilotMessageItem;
}

export function CopilotMessage({ message }: CopilotMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} animate-in fade-in duration-200`}>
      {!isUser && (
        <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-1">
          <Bot className="h-4 w-4" />
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5`}>
        <div
          className={`p-4 rounded-2xl text-xs leading-relaxed ${
            isUser
              ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
              : "bg-zinc-900/90 border border-zinc-800 text-zinc-100 rounded-tl-none shadow-sm"
          }`}
        >
          {!isUser && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400 font-mono mb-2 border-b border-zinc-800 pb-1.5">
              <Sparkles className="h-3 w-3" />
              <span>LeadPilot AI Intelligence</span>
            </div>
          )}
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        <div className={`flex items-center gap-3 text-[10px] text-zinc-500 font-mono ${isUser ? "justify-end" : "justify-start"}`}>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-zinc-600" />
            <span>{formatDate(message.timestamp)}</span>
          </span>
          {!isUser && message.provider && (
            <span className="flex items-center gap-1 text-zinc-400">
              <Cpu className="h-3 w-3 text-indigo-400" />
              <span>{message.provider} ({message.tokensUsed} tokens)</span>
            </span>
          )}
        </div>
      </div>

      {isUser && (
        <div className="h-8 w-8 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center shrink-0 mt-1">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
