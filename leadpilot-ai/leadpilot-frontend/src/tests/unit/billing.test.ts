import { StripeBillingProvider } from "@/platform/billing/StripeBillingProvider";
import { WebhookHandler } from "@/platform/billing/WebhookHandler";
import { UsageLimitEngine } from "@/platform/billing/UsageLimitEngine";
import { STARTER_PLAN, PROFESSIONAL_PLAN, ENTERPRISE_PLAN } from "@/domain/billing/Plan";

describe("Billing Platform Unit Test Suite", () => {
  test("verifies plan tier limit constants", () => {
    expect(STARTER_PLAN.limits.maxUsers).toBe(5);
    expect(PROFESSIONAL_PLAN.limits.maxUsers).toBe(25);
    expect(ENTERPRISE_PLAN.limits.maxUsers).toBe(9999);
  });

  test("evaluates usage limit calculations correctly", () => {
    const engine = new UsageLimitEngine();
    const result = engine.checkLimit("professional", "leads", 5000);
    expect(result.allowed).toBe(true);
    expect(result.maxLimit).toBe(10000);
    expect(result.percentageUsed).toBe(50);
  });

  test("handles Stripe checkout session creation", async () => {
    const provider = new StripeBillingProvider();
    const session = await provider.createCheckoutSession({
      organizationId: "org_test",
      planId: "plan_professional",
      seats: 5,
      interval: "month",
      successUrl: "http://localhost:3000/billing",
      cancelUrl: "http://localhost:3000/billing",
    });
    expect(session.sessionId).toContain("cs_test_");
  });

  test("processes webhook events with idempotency protection", async () => {
    const handler = new WebhookHandler();
    const rawPayload = JSON.stringify({ id: "evt_1001", type: "invoice.paid", data: { object: {} } });
    const sig = "sig_valid_123";

    const res1 = await handler.processWebhookEvent(rawPayload, sig);
    expect(res1.eventType).toBe("invoice.paid");

    const res2 = await handler.processWebhookEvent(rawPayload, sig);
    expect(res2.eventType).toBe("invoice.paid (duplicate ignored)");
  });
});
