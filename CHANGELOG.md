# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.6.0] - 2026-07-30

### Added
* **Centralized Reporting Engine (`ReportingEngine.ts`)**: BI aggregation engine compiling metrics across all CRM data stores.
* **16-Metric Enterprise KPI Library**: Revenue, Pipeline Value, Deals Won/Lost, Lead Conversion, Sales Velocity, Task Completion, Appointment Success, Response Time, Workflow Success, MRR, ARR, Churn, and Net Retention.
* **5 Role-Tailored Executive Dashboards**: Executive Leadership, Sales Performance, Financial Intelligence, Operations, and Agent performance views.
* **Custom Dashboard Builder (`custom/page.tsx`)**: Drag-and-drop widget studio supporting 10 chart types and layout sharing.
* **Automated Report Scheduler (`scheduled/page.tsx`)**: Daily, weekly, monthly, and quarterly email delivery with PDF/CSV attachments.
* **Multi-Format Data Exporter**: Filtered CSV, Excel, PDF, and JSON data export compiler.
* **Reporting UI Sub-App (`/reports/*`)**: Created 6 reporting pages (`/reports`, `/reports/executive`, `/reports/sales`, `/reports/finance`, `/reports/custom`, `/reports/scheduled`).
* **Unit Tests & Documentation**: Added `reporting-engine.test.ts` unit test suite and system documentation (`reporting-engine.md`, `dashboard-builder.md`, `kpi-library.md`, `report-export.md`).

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
