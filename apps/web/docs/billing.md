# LeadPilot AI CRM — Billing Architecture Specification

**Module:** Billing Platform  
**Version:** v2.2.0  

---

## 1. Provider Abstraction Architecture

LeadPilot uses the `BillingProvider` interface (`src/platform/billing/BillingProvider.ts`) to isolate business logic from underlying payment gateways.

- **Adapter:** `StripeBillingProvider.ts` implements checkout session generation, customer portal links, subscription retrieval, and invoice queries.
- **Idempotency:** `WebhookHandler.ts` validates HMAC signatures and tracks processed event IDs (`Set<string>`) to prevent duplicate execution.
