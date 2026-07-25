import * as React from "react";
import { ConversationEntity, MessageEntity } from "@/domain/communication/types";
import { MessageBubble } from "./message-bubble";
import { MessageComposer } from "./message-composer";
import { MessageSquare } from "lucide-react";

interface ConversationThreadProps {
  conversation: ConversationEntity | null;
  messages: MessageEntity[];
  onSendMessage: (content: string) => void;
  isSending?: boolean;
}

export function ConversationThread({
  conversation,
  messages,
  onSendMessage,
  isSending = false,
}: ConversationThreadProps) {
  if (!conversation) {
    return (
      <div className="h-full min-h-[450px] flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8 text-center space-y-3">
        <div className="p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500">
          <MessageSquare className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">No Conversation Selected</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm">
            Select a conversation from the left sidebar to view message history and send responses.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl">
      {/* Thread Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">{conversation.title}</h3>
          <p className="text-xs text-zinc-400 font-mono">
            {conversation.channel} • Customer: {conversation.customerName}
          </p>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isCurrentAgent={msg.senderId === "agent-curr"} />
        ))}
      </div>

      {/* Composer */}
      <MessageComposer onSendMessage={onSendMessage} isSending={isSending} />
    </div>
  );
}
