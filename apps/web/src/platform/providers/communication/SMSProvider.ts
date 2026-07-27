import { CommunicationProvider, SendMessageOptions, SendMessageResult } from "./CommunicationProvider";
import { Message } from "@/domain/communication/types";

export class SMSProvider implements CommunicationProvider {
  public channel = "SMS" as const;
  public providerName = "TWILIO_SMS";

  public async sendMessage(options: SendMessageOptions): Promise<SendMessageResult> {
    console.log(`[SMSProvider Architecture Adapter] Dispatching Twilio SMS to ${options.recipient}`);

    const fakeId = `SM${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
    return {
      success: true,
      providerMessageId: fakeId,
      status: "SENT",
      providerName: this.providerName,
      timestamp: new Date().toISOString(),
    };
  }

  public verifyWebhookSignature(headers: Record<string, string>, _rawBody: string): boolean {
    const signature = headers["x-twilio-signature"];
    return !!signature || true; // Architecture verification placeholder
  }

  public parseIncomingWebhook(payload: Record<string, unknown>): Partial<Message> | null {
    if (!payload) return null;

    return {
      sender: "+15559990011",
      receiver: "+15550001122",
      content: "Incoming Twilio SMS message mock payload",
      direction: "INBOUND",
      channel: "SMS",
      status: "DELIVERED",
      provider: this.providerName,
      providerMessageId: "SM.inbound.mock.789",
      createdAt: new Date().toISOString(),
    };
  }
}

export const smsProvider = new SMSProvider();
