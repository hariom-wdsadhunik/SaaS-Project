# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.3.0] - 2026-07-26

### Added
* **Support Domain (`src/domain/support/`)**: Created `Article.ts`, `Feedback.ts`, and `Ticket.ts`.
* **Customer Success Platform (`src/platform/support/`)**: Created `HelpCenterService.ts`, `TicketService.ts`, and `HealthScoreEngine.ts` (0-100 score calculator).
* **API v1 Endpoints**: Created `/api/v1/help-center`, `/api/v1/feedback`, `/api/v1/tickets`, and `/api/v1/customer-health`.
* **Dashboards**: Created Support & Help Center Dashboard (`/support`) and Customer Health Score Dashboard (`/health`).
* **Documentation**: Created `docs/customer-success.md`, `docs/help-center.md`, `docs/support.md`, and `docs/health-score.md`.
* **Unit Test Suite**: Created `customer-success.test.ts`.

---

## [2.2.0] - 2026-07-26

### Added
* **Subscription Domain (`src/domain/billing/`)**: Created `Subscription.ts`, `Plan.ts`, `Invoice.ts`, `Payment.ts`, and `UsageRecord.ts`.
