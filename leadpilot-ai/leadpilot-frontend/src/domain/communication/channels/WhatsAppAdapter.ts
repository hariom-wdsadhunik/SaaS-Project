import { ChannelAdapter, ChannelSendMessageInput } from "./ChannelAdapter";
import { CommunicationChannel, MessageEntity } from "../types";

export class WhatsAppAdapter implements ChannelAdapter {
  channel: CommunicationChannel = "WHATSAPP";

  async sendMessage(input: ChannelSendMessageInput): Promise<MessageEntity> {
    await new Promise((res) => setTimeout(res, 150));
    return {
      id: `wa-${Date.now()}`,
      conversationId: input.conversationId,
      senderId: "agent-curr",
      senderName: "Alex Morgan",
      content: input.content,
      channel: "WHATSAPP",
      status: "SENT",
      sentAt: new Date().toISOString(),
    };
  }

  validateRecipient(recipient: string): boolean {
    return /^\+?[1-9]\d{1,14}$/.test(recipient.replace(/\s+/g, ""));
  }

  supportsAttachments(): boolean {
    return true;
  }

  supportsTemplates(): boolean {
    return true;
  }

  supportsScheduling(): boolean {
    return true;
  }
}
