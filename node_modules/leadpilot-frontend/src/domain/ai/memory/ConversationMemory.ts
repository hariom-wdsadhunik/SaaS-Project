export interface ConversationMemoryItem {
  conversationId: string;
  summary: string;
  preferredChannel: string;
  lastInteractionAt: string;
}

export const ConversationMemory = {
  getMemory(conversationId: string): ConversationMemoryItem {
    return {
      conversationId,
      summary: "Customer inquiring about $5M penthouse listing. High intent, fast follow-up requested.",
      preferredChannel: "WHATSAPP",
      lastInteractionAt: new Date().toISOString(),
    };
  },
};
