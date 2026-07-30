# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

---

## [3.2.0] - 2026-07-30

### Added
* **Formal QA Audit Report (`docs/qa-report.md`)**: Certified 100% test pass rate across 72 backend Jest suites and 6 Copilot engine unit tests.
* **UI Improvements Log (`docs/ui-improvements.md`)**: Documented standardized typography hierarchy, skeleton loading states, dark-mode card primitives, and Sonner toast notifications.
* **UX & Accessibility Review (`docs/ux-review.md`)**: Evaluated navigation flows, keyboard shortcuts (`⌘K` Command Palette, `⌘J` AI Assistant), and WCAG 2.2 AA accessibility standards.
