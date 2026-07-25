import * as React from "react";
import { X, MessageSquare, Mail, Phone, FileText } from "lucide-react";
import { ConversationEntity } from "@/domain/communication/types";
import { EntityStatusBadge } from "@/platform/ui/entity-status-badge";
import { formatDate } from "@/utils/formatters";

interface ConversationDrawerHeaderProps {
  conversation: ConversationEntity;
  onClose: () => void;
}

export function ConversationDrawerHeader({
  conversation,
  onClose,
}: ConversationDrawerHeaderProps) {
  const channelIconMap = {
    WHATSAPP: <MessageSquare className="h-4 w-4 text-emerald-400" />,
    EMAIL: <Mail className="h-4 w-4 text-indigo-400" />,
    SMS: <Phone className="h-4 w-4 text-cyan-400" />,
    INTERNAL_NOTE: <FileText className="h-4 w-4 text-amber-400" />,
  };

  return (
    <div className="border-b border-zinc-800/80 bg-zinc-950 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {channelIconMap[conversation.channel]}
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md font-mono">
            {conversation.channel}
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-white">{conversation.customerName}</h2>
          <EntityStatusBadge status={conversation.status} />
        </div>
        <p className="text-xs text-zinc-400">{conversation.title}</p>
      </div>

      <div className="flex items-center gap-4 border-t border-zinc-800/80 pt-3 text-xs text-zinc-400 font-mono">
        <span>Assigned: {conversation.assignedAgentName}</span>
        <span>•</span>
        <span>Last Active: {formatDate(conversation.lastMessageAt)}</span>
      </div>
    </div>
  );
}
