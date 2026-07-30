import { ConversationEntity } from "../types";

export const ConversationService = {
  markAsRead(conversation: ConversationEntity): ConversationEntity {
    return {
      ...conversation,
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    };
  },
};
