import * as React from "react";
import { MessageEntity } from "@/domain/communication/types";
import { CheckCheck } from "lucide-react";
import { formatDate } from "@/utils/formatters";

interface MessageBubbleProps {
  message: MessageEntity;
  isCurrentAgent: boolean;
}

export function MessageBubble({ message, isCurrentAgent }: MessageBubbleProps) {
  return (
    <div className={`flex flex-col ${isCurrentAgent ? "items-end" : "items-start"} space-y-1`}>
      <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
        <span>{message.senderName || message.sender || "Broker"}</span>
        <span>•</span>
        <span>{formatDate(message.sentAt || message.createdAt || new Date().toISOString())}</span>
      </div>

      <div
        className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
          isCurrentAgent
            ? "bg-indigo-600 text-white rounded-br-none shadow-md"
            : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
          <CheckCheck className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
}
