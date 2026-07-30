# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.5.0] - 2026-07-30

### Added
* **Modular Integration Framework (`ConnectorRegistry.ts`)**: Centralized connector manager supporting health checks, sync schedules, and provider credentials.
* **Google Workspace & Microsoft 365 Connectors**: OAuth 2.0 sync for Google Calendar, Gmail, Google Contacts, Outlook Calendar, Outlook Mail, and Microsoft Contacts.
* **Unified Messaging Abstraction**: Support for WhatsApp Business Cloud API, Twilio SMS, SendGrid Email, and Nodemailer SMTP.
* **Stripe Payments Extension**: Real-time webhook verification, subscription status, and payment logs.
* **Webhooks Engine (`webhooks/page.tsx`)**: Incoming and outgoing HTTP webhooks with HMAC SHA-256 signatures, retry queue, and ping testing.
* **Scoped API Keys (`api-keys/page.tsx`)**: Scoped token generation, key rotation, and audit logs.
* **Integrations UI Sub-App (`/integrations/*`)**: Created 7 integration pages (`/integrations`, `/integrations/google`, `/integrations/microsoft`, `/integrations/communication`, `/integrations/payments`, `/integrations/webhooks`, `/integrations/api-keys`).
* **Unit Tests & Documentation**: Added `integration-framework.test.ts` unit test suite and system documentation (`integration-architecture.md`, `connector-framework.md`, `oauth-design.md`, `webhook-design.md`, `api-key-management.md`).

---

## [3.4.0] - 2026-07-30

### Added
* **Workflow Automation Engine (`WorkflowEngine.ts`)**: Event-driven automation engine supporting 14 triggers, AND/OR condition tree evaluation, and 13 action handlers.
* **7 Pre-Built Automation Templates**: Out-of-the-box workflows for lead follow-up, assignment, deal won celebration, deal lost recovery, appointment reminders, payment reminders, and cold lead re-engagement.
* **Execution Audit Log (`history/page.tsx`)**: Real-time execution logger recording execution latency, retries, status, and error tracebacks.
* **Automation UI Sub-App (`/automation/*`)**: Created 4 automation pages (`/automation`, `/automation/workflows`, `/automation/templates`, `/automation/history`).
* **Unit Tests & Documentation**: Added `workflow-engine.test.ts` unit test suite and system documentation (`workflow-engine.md`, `automation-architecture.md`, `workflow-api.md`).
