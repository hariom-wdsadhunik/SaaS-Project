import { ChannelAdapter, ChannelSendMessageInput } from "./ChannelAdapter";
import { CommunicationChannel, MessageEntity } from "../types";

export class SMSAdapter implements ChannelAdapter {
  channel: CommunicationChannel = "SMS";

  async sendMessage(input: ChannelSendMessageInput): Promise<MessageEntity> {
    await new Promise((res) => setTimeout(res, 150));
    return {
      id: `sms-${Date.now()}`,
      conversationId: input.conversationId,
      senderId: "agent-curr",
      senderName: "Alex Morgan",
      content: input.content,
      channel: "SMS",
      status: "SENT",
      sentAt: new Date().toISOString(),
    };
  }

  validateRecipient(recipient: string): boolean {
    return recipient.length >= 7;
  }

  supportsAttachments(): boolean {
    return false;
  }

  supportsTemplates(): boolean {
    return true;
  }

  supportsScheduling(): boolean {
    return true;
  }
}
