# LeadPilot AI CRM — Enterprise System Architecture

---

## 1. Enterprise System Architecture (v2.2.0 Billing & Subscription Platform)

```
+-----------------------------------------------------------------------------------+
|                                  Next.js 15 Client App                            |
|          (Billing Dashboard, Usage Metering, Checkout & Customer Portal)          |
+-------------------+-------------------+-------------------+-----------------------+
                    |                   |                   |
                    v                   v                   v
+-------------------+---+   +-----------+-------+   +-------+---------------+
|   BillingProvider |   | UsageLimitEngine  |   |   WebhookHandler      |
| (StripeBilling    |   | (Seat/Lead/Storage|   | (Idempotency & HMAC   |
| Provider Adapter) |   | Metering Engine)  |   | Signature Validator)  |
+-------------------+---+   +-----------+-------+   +-------+---------------+
                    |                   |                   |
                    +-------------------+-------------------+
                                        |
                                        v
                    +-------------------+-------------------+
                    |        Supabase PostgreSQL Backend    |
                    | (Subscriptions, Invoices, RLS)        |
                    +---------------------------------------+
```

---

## 2. Billing & Subscription Architecture

- **Abstraction Interface:** `BillingProvider.ts` decoupling business logic from payment vendors.
- **Provider Implementation:** `StripeBillingProvider.ts`.
- **Idempotency & Security:** `WebhookHandler.ts` signature validation and duplicate event rejection.
- **Usage Limits:** `UsageLimitEngine.ts` enforces seat quotas, lead capacities, AI queries, and document storage limits per plan tier.
