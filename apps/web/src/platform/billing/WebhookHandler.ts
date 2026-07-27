export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
}

export class WebhookHandler {
  private processedEventIds: Set<string> = new Set();

  async processWebhookEvent(rawBody: string, signature: string): Promise<{ success: boolean; eventType: string }> {
    if (!signature || signature.length === 0) {
      throw new Error("Missing or invalid Stripe webhook signature");
    }

    try {
      const event: StripeWebhookEvent = JSON.parse(rawBody);

      // Idempotency Check
      if (this.processedEventIds.has(event.id)) {
        return { success: true, eventType: `${event.type} (duplicate ignored)` };
      }

      this.processedEventIds.add(event.id);

      switch (event.type) {
        case "checkout.session.completed":
        case "invoice.paid":
        case "invoice.payment_failed":
        case "customer.subscription.updated":
        case "customer.subscription.deleted":
        case "payment_intent.succeeded":
        case "payment_intent.payment_failed":
          return { success: true, eventType: event.type };

        default:
          return { success: true, eventType: `unhandled_${event.type}` };
      }
    } catch {
      throw new Error("Invalid Stripe webhook payload format");
    }
  }
}
