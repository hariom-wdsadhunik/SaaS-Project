# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.4.0] - 2026-07-30

### Added
* **Workflow Automation Engine (`WorkflowEngine.ts`)**: Event-driven automation engine supporting 14 triggers, AND/OR condition tree evaluation, and 13 action handlers.
* **7 Pre-Built Automation Templates**: Out-of-the-box workflows for lead follow-up, assignment, deal won celebration, deal lost recovery, appointment reminders, payment reminders, and cold lead re-engagement.
* **Execution Audit Log (`history/page.tsx`)**: Real-time execution logger recording execution latency, retries, status, and error tracebacks.
* **Automation UI Sub-App (`/automation/*`)**: Created 4 automation pages (`/automation`, `/automation/workflows`, `/automation/templates`, `/automation/history`).
* **Unit Tests & Documentation**: Added `workflow-engine.test.ts` unit test suite and system documentation (`workflow-engine.md`, `automation-architecture.md`, `workflow-api.md`).

---

## [3.3.0] - 2026-07-30

### Added
* **Organization & Multi-Tenant Model (`OrganizationTypes.ts`)**: Implemented organization boundary isolation.
* **Centralized RBAC Engine (`RBACEngine.ts`)**: 5 roles (`Owner`, `Admin`, `Manager`, `Agent`, `Viewer`) evaluating 6 actions across 9 resource domains.
* **Workspace Switcher (`workspace-switcher.tsx`)**: Multi-org switcher component in sidebar.
* **Activity Logger (`ActivityLogger.ts`)**: Organization-wide real-time activity stream timeline.
* **Audit Logger (`AuditLogger.ts`)**: Immutable security audit ledger.
* **Team UI Sub-App (`/team/*`)**: Created 6 team pages (`/team`, `/team/members`, `/team/invitations`, `/team/activity`, `/team/roles`, `/team/audit`).
* **Unit Tests & Documentation**: Added `team-rbac.test.ts` test suite and architectural documentation.
