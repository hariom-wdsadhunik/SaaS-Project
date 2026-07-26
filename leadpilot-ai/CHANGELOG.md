# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.5.0] - 2026-07-26

### Added
* **Task & Activity Management Module**: Built production-grade `public.tasks`, `public.task_comments`, and `public.task_activity` tables backed by live Supabase repository [`SupabaseTaskRepository`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/src/infrastructure/repositories/SupabaseTaskRepository.ts).
* **Multi-Entity Relationships**: Supported linking tasks to `Lead`, `Contact`, and `Deal` entities without data duplication.
* **Task Commenting & Activity Streams**: Enabled creating, editing, and deleting task comments with author metadata and automated activity stream recording (`Task Created`, `Task Assigned`, `Task Updated`, `Task Completed`, `Task Archived`, `Comment Added`).
* **Cross-Module Timeline Integration**: Connected task completion and creation events to automatically append to the `contact_timeline` when tasks are linked to contacts.
* **Kanban, Table, and Grid UI Views**: Built interactive task workspace supporting Kanban board columns (`TODO`, `IN_PROGRESS`, `WAITING`, `COMPLETED`), tabular list views, grid views, priority badges, and status assignment modals.
* **Executive Dashboard Task Widgets**: Integrated `Today's Tasks`, `Overdue Tasks`, `Upcoming Tasks`, and `Completion Rate` widgets into the main Executive Control Panel dashboard.
* **AI Task Intelligence Tool**: Created `task_intelligence_tool` (`src/domain/ai/tools/TaskTool.ts`) enabling AI copilot analysis of overdue tasks, priority levels, and linked entities.
* **Unit Test Suite**: Created `src/tests/unit/task-repository.test.ts`, `src/tests/unit/task-comments.test.ts`, and `src/tests/unit/task-timeline.test.ts`.

### Changed
* **Database Master Bootstrap**: Updated `supabase/bootstrap.sql` to include Section 2.8 (`public.tasks`), 2.9 (`public.task_comments`), 2.10 (`public.task_activity`), strict RLS policies, and seed data.
* **Audit Telemetry Expansion**: Added `TASK` to `AuditEvent` `entityType` union.

### Fixed
* **TypeScript & Lint Type Compliance**: Standardized task status types across Zod schemas, repository mappers, and UI components.

### Known Issues
* Real-time WebSocket push notifications for task assignment rely on polling fallback when Supabase Realtime channel is disabled.

---

## [0.4.0] - 2026-07-26

### Added
* **Customer Management Module**: Built `public.contacts` and `public.contact_timeline` tables backed by `SupabaseContactRepository`.
* **Lead Conversion Engine**: Implemented Lead $\rightarrow$ Contact conversion preserving lead history with `QUALIFIED` status update.
* **AI Contact Tool**: Added `contact_intelligence_tool` for deep client profile analysis.

---

## [1.1.0] - 2026-07-23

### Added
* **Complete Automated Test Suite**: Built 72 test suites with 363 tests across Unit, Contract, Integration, and Reliability tiers.
* **Production Observability & Diagnostics**: Added `/health`, `/ready`, `/live` probes and structured logging.
