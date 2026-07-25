import { ChannelAdapter, ChannelSendMessageInput } from "./ChannelAdapter";
import { CommunicationChannel, MessageEntity } from "../types";

export class InternalNoteAdapter implements ChannelAdapter {
  channel: CommunicationChannel = "INTERNAL_NOTE";

  async sendMessage(input: ChannelSendMessageInput): Promise<MessageEntity> {
    await new Promise((res) => setTimeout(res, 100));
    return {
      id: `note-${Date.now()}`,
      conversationId: input.conversationId,
      senderId: "agent-curr",
      senderName: "Alex Morgan",
      content: input.content,
      channel: "INTERNAL_NOTE",
      status: "SENT",
      sentAt: new Date().toISOString(),
    };
  }

  validateRecipient(): boolean {
    return true;
  }

  supportsAttachments(): boolean {
    return true;
  }

  supportsTemplates(): boolean {
    return false;
  }

  supportsScheduling(): boolean {
    return false;
  }
}
