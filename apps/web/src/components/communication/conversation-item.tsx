import * as React from "react";
import { ConversationEntity, CommunicationChannel } from "@/domain/communication/types";
import { MessageSquare, Mail, Phone, FileText, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";

interface ConversationItemProps {
  conversation: ConversationEntity;
  isSelected: boolean;
  onSelect: (conv: ConversationEntity) => void;
}

export function ConversationItem({ conversation, isSelected, onSelect }: ConversationItemProps) {
  const channelIconMap: Record<CommunicationChannel, React.ReactNode> = {
    WHATSAPP: <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />,
    EMAIL: <Mail className="h-3.5 w-3.5 text-indigo-400" />,
    SMS: <Phone className="h-3.5 w-3.5 text-cyan-400" />,
    IN_APP: <MessageSquare className="h-3.5 w-3.5 text-purple-400" />,
    INTERNAL_NOTE: <FileText className="h-3.5 w-3.5 text-amber-400" />,
  };

  return (
    <div
      onClick={() => onSelect(conversation)}
      className={`group relative rounded-xl border p-4 transition-all duration-150 cursor-pointer space-y-2 select-none ${
        isSelected
          ? "border-indigo-500/50 bg-indigo-500/10 shadow-lg"
          : "border-zinc-800 bg-zinc-950 hover:border-zinc-700 hover:bg-zinc-900/60"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {channelIconMap[conversation.channel] || <MessageSquare className="h-3.5 w-3.5 text-zinc-400" />}
          <span className="text-xs font-bold text-white truncate max-w-[160px]">
            {conversation.customerName || conversation.subject}
          </span>
          {conversation.isPinned && <Pin className="h-3 w-3 text-amber-400 fill-amber-400" />}
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">{formatDate(conversation.lastMessageAt)}</span>
      </div>

      <p className="text-xs text-zinc-400 line-clamp-1">{conversation.lastMessage || "No messages yet."}</p>

      <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2 text-[11px]">
        <span className="text-zinc-500 font-mono">{conversation.assignedAgentId}</span>
        {conversation.unreadCount > 0 && (
          <Badge variant="danger" className="text-[10px] px-1.5 py-0">
            {conversation.unreadCount} unread
          </Badge>
        )}
      </div>
    </div>
  );
}
