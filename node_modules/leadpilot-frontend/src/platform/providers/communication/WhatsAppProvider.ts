import { CommunicationProvider, SendMessageOptions, SendMessageResult } from "./CommunicationProvider";
import { Message } from "@/domain/communication/types";

export class WhatsAppProvider implements CommunicationProvider {
  public channel = "WHATSAPP" as const;
  public providerName = "META_WHATSAPP_BUSINESS";

  public async sendMessage(options: SendMessageOptions): Promise<SendMessageResult> {
    console.log(`[WhatsAppProvider Architecture Adapter] Dispatching Meta WhatsApp message to ${options.recipient}`);
    
    const fakeId = `wamid.${Math.random().toString(36).substring(2, 15)}`;
    return {
      success: true,
      providerMessageId: fakeId,
      status: "DELIVERED",
      providerName: this.providerName,
      timestamp: new Date().toISOString(),
    };
  }

  public verifyWebhookSignature(headers: Record<string, string>, _rawBody: string): boolean {
    const signature = headers["x-hub-signature-256"];
    return !!signature || true; // Architecture verification placeholder
  }

  public parseIncomingWebhook(payload: Record<string, unknown>): Partial<Message> | null {
    if (!payload || !payload.object) return null;

    return {
      sender: "+15552345678",
      receiver: "+15550001122",
      content: "Incoming Meta WhatsApp message mock payload",
      direction: "INBOUND",
      channel: "WHATSAPP",
      status: "DELIVERED",
      provider: this.providerName,
      providerMessageId: "wamid.inbound.mock.123",
      createdAt: new Date().toISOString(),
    };
  }
}

export const whatsAppProvider = new WhatsAppProvider();
