import { CommunicationChannel, Message, MessageStatus } from "@/domain/communication/types";

export interface SendMessageOptions {
  conversationId: string;
  recipient: string;
  sender: string;
  content: string;
  channel: CommunicationChannel;
  templateId?: string;
  templateVariables?: Record<string, string>;
  attachments?: { fileName: string; fileType: string; fileSizeBytes: number; fileUrl: string }[];
  metadata?: Record<string, unknown>;
}

export interface SendMessageResult {
  success: boolean;
  providerMessageId: string;
  status: MessageStatus;
  providerName: string;
  timestamp: string;
  error?: string;
}

export interface CommunicationProvider {
  channel: CommunicationChannel;
  providerName: string;

  sendMessage(options: SendMessageOptions): Promise<SendMessageResult>;
  verifyWebhookSignature(headers: Record<string, string>, rawBody: string): boolean;
  parseIncomingWebhook(payload: Record<string, unknown>): Partial<Message> | null;
}
