import { ConversationEntity, MessageEntity, CommunicationFilterState, CommunicationChannel } from "./types";
import { supabaseCommunicationRepository } from "@/infrastructure/repositories/SupabaseCommunicationRepository";

export const CommunicationFacade = {
  async getConversations(_filters?: Partial<CommunicationFilterState>): Promise<ConversationEntity[]> {
    const defaultConv = await supabaseCommunicationRepository.getConversation("a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d");
    return defaultConv ? [{ ...defaultConv, customerName: "Marcus Vance", lastMessage: "Confirming walkthrough tomorrow." }] : [];
  },

  async sendMessage(input: { conversationId: string; recipient: string; content: string; channel?: CommunicationChannel }): Promise<MessageEntity> {
    return supabaseCommunicationRepository.sendMessage({
      conversationId: input.conversationId,
      sender: "Alex Morgan",
      receiver: input.recipient,
      direction: "OUTBOUND",
      channel: input.channel || "WHATSAPP",
      content: input.content,
    });
  },

  validateRecipient(_channel: string, recipient: string): boolean {
    return recipient.length > 3;
  },
};
