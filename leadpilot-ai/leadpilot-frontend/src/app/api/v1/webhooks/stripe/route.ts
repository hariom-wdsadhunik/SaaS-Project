import { NextResponse } from "next/server";
import { WebhookHandler } from "@/platform/billing/WebhookHandler";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature") || "mock_sig_123";

  try {
    const handler = new WebhookHandler();
    const result = await handler.processWebhookEvent(rawBody, signature);
    return NextResponse.json({ received: true, eventType: result.eventType });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
