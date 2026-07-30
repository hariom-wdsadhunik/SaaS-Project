import { CommunicationChannel, MessageEntity } from "../types";

export interface ChannelSendMessageInput {
  conversationId: string;
  recipient: string;
  content: string;
  templateId?: string;
  attachmentUrls?: string[];
}

export interface ChannelAdapter {
  channel: CommunicationChannel;
  sendMessage(input: ChannelSendMessageInput): Promise<MessageEntity>;
  validateRecipient(recipient: string): boolean;
  supportsAttachments(): boolean;
  supportsTemplates(): boolean;
  supportsScheduling(): boolean;
}
