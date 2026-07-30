import * as React from "react";
import { ConversationEntity } from "@/domain/communication/types";
import { ConversationItem } from "./conversation-item";

interface ConversationListProps {
  conversations: ConversationEntity[];
  selectedConversationId?: string;
  onSelectConversation: (conv: ConversationEntity) => void;
}

export function ConversationList({
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <div className="space-y-3">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          isSelected={conv.id === selectedConversationId}
          onSelect={onSelectConversation}
        />
      ))}
    </div>
  );
}
