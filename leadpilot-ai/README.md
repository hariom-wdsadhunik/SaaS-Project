# LeadPilot AI CRM — Billing Platform & Enterprise SaaS (v2.2.0)

LeadPilot AI CRM is a next-generation autonomous enterprise AI Customer Relationship Management (CRM) platform built for high-performance sales, real estate, and enterprise organizations.

---

## Billing Platform & Subscriptions (v2.2.0)

1. **BillingProvider Abstraction (`src/platform/billing/`):** Clean interface isolating core business logic from Stripe or alternative payment providers.
2. **Idempotent Webhook Engine:** HMAC signature verification, replay protection, and duplicate event filtering (`WebhookHandler.ts`).
3. **Usage Metering Engine (`UsageLimitEngine.ts`):** Evaluates seat quotas, lead limits, AI query caps, and storage thresholds across Starter, Professional, and Enterprise plans.
4. **Billing Dashboard UI (`/billing`):** Plan tier management, seat utilization progress, metered consumption counters, and invoice history.
