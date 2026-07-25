import { ConversationEntity, MessageEntity, CommunicationFilterState } from "./types";
import { communicationService } from "./services/CommunicationService";
import { ChannelOrchestrator } from "./channels/ChannelOrchestrator";
import { ChannelSendMessageInput } from "./channels/ChannelAdapter";

export const CommunicationFacade = {
  async getConversations(filters?: Partial<CommunicationFilterState>): Promise<ConversationEntity[]> {
    return communicationService.getConversations(filters);
  },

  async sendMessage(input: ChannelSendMessageInput): Promise<MessageEntity> {
    return ChannelOrchestrator.send("WHATSAPP", input);
  },

  validateRecipient(channel: "WHATSAPP" | "EMAIL" | "SMS" | "INTERNAL_NOTE", recipient: string): boolean {
    return ChannelOrchestrator.validateRecipient(channel, recipient);
  },
};
