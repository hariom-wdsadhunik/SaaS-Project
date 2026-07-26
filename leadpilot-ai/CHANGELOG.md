# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.2.0] - 2026-07-26

### Added
* **Subscription Domain (`src/domain/billing/`)**: Created `Subscription.ts`, `Plan.ts`, `Invoice.ts`, `Payment.ts`, and `UsageRecord.ts`.
* **Stripe Provider Abstraction (`src/platform/billing/`)**: Created `BillingProvider.ts` interface, `StripeBillingProvider.ts` adapter, `WebhookHandler.ts` (HMAC verification & idempotency), and `UsageLimitEngine.ts`.
* **Database Migrations (`docs/migrations/005_billing_and_subscriptions.sql`)**: PostgreSQL schema for subscriptions, plans, invoices, payments, and usage records with strict RLS policies.
* **API v1 Endpoints**: Created `/api/v1/billing`, `/api/v1/subscriptions`, `/api/v1/webhooks/stripe`.
* **Billing Dashboard UI (`src/app/(dashboard)/billing/page.tsx`)**: Created `/billing` dashboard showing plan tier, seat utilization progress, metered resource breakdown, upgrade options, and invoice history.
* **Documentation**: Created `docs/billing.md`, `docs/pricing.md`, `docs/stripe.md`, and `docs/subscription-lifecycle.md`.
* **Unit Test Suite**: Created `billing.test.ts`.

---

## [2.1.0] - 2026-07-26

### Added
* **Marketing Home Page (`src/app/page.tsx`)**: High-converting landing page with Hero, Social Proof, Interactive Feature Cards, Key Benefits, and CTA.
