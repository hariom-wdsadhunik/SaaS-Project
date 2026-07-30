# LeadPilot AI CRM — Complete System Architecture Overview

**Version:** v4.0.0 GA  
**Architecture Pattern:** Monorepo Domain-Driven SaaS Architecture  

---

## Architecture Topology Diagram

```mermaid
graph TD
    Client[Next.js 16 Web App - apps/web] -->|REST / JSON| ExpressAPI[Express REST API - apps/api]
    Client -->|Realtime / Auth| Supabase[Supabase Cloud Postgres & RLS]
    ExpressAPI -->|SQL Queries| Supabase
    ExpressAPI -->|Background Workers| BullMQ[BullMQ Job Queue]
    ExpressAPI -->|OAuth 2.0 / Sync| GoogleMS[Google & Microsoft 365 API]
    ExpressAPI -->|Omnichannel| TwilioWA[Twilio & Meta WhatsApp API]
    ExpressAPI -->|Subscriptions| Stripe[Stripe Billing API & Webhooks]
```

---

## Module Directory Structure

- `apps/web/src/app/(dashboard)/`: 64 Next.js dashboard pages (`/leads`, `/deals`, `/properties`, `/tasks`, `/appointments`, `/communication`, `/automation`, `/integrations`, `/reports`, `/ai`, `/admin`).
- `apps/web/src/domain/`: Enterprise domain models & business engines (`AiIntelligenceEngine`, `ReportingEngine`, `ConnectorRegistry`, `AdminService`).
- `apps/api/controllers/`: 18 Express API controllers with Zod input validation.
- `apps/api/tests/`: 72 Jest contract test suites (363 tests).
