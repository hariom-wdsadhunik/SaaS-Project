import { ChannelAdapter, ChannelSendMessageInput } from "./ChannelAdapter";
import { CommunicationChannel, MessageEntity } from "../types";

export class EmailAdapter implements ChannelAdapter {
  channel: CommunicationChannel = "EMAIL";

  async sendMessage(input: ChannelSendMessageInput): Promise<MessageEntity> {
    await new Promise((res) => setTimeout(res, 150));
    return {
      id: `eml-${Date.now()}`,
      conversationId: input.conversationId,
      senderId: "agent-curr",
      senderName: "Alex Morgan",
      content: input.content,
      channel: "EMAIL",
      status: "SENT",
      sentAt: new Date().toISOString(),
    };
  }

  validateRecipient(recipient: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient);
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
