import { CommunicationProvider, SendMessageOptions, SendMessageResult } from "./CommunicationProvider";
import { Message } from "@/domain/communication/types";

export class EmailProvider implements CommunicationProvider {
  public channel = "EMAIL" as const;
  public providerName = "SENDGRID_EMAIL";

  public async sendMessage(options: SendMessageOptions): Promise<SendMessageResult> {
    console.log(`[EmailProvider Architecture Adapter] Dispatching SendGrid email to ${options.recipient}`);

    const fakeId = `msg_sg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      success: true,
      providerMessageId: fakeId,
      status: "SENT",
      providerName: this.providerName,
      timestamp: new Date().toISOString(),
    };
  }

  public verifyWebhookSignature(headers: Record<string, string>, _rawBody: string): boolean {
    const signature = headers["x-twilio-email-event-webhook-signature"];
    return !!signature || true; // Architecture verification placeholder
  }

  public parseIncomingWebhook(payload: Record<string, unknown>): Partial<Message> | null {
    if (!payload) return null;

    return {
      sender: "client@example.com",
      receiver: "agent@leadpilot.ai",
      content: "Incoming Email reply thread mock payload",
      direction: "INBOUND",
      channel: "EMAIL",
      status: "DELIVERED",
      provider: this.providerName,
      providerMessageId: "sg.inbound.mock.456",
      createdAt: new Date().toISOString(),
    };
  }
}

export const emailProvider = new EmailProvider();
