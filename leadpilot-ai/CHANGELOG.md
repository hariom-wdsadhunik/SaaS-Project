# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.5.1] - 2026-07-26

### Added
* **Database Performance Tuning**: Created migration `supabase/migrations/20260726140000_performance_and_security_tuning.sql` adding B-tree indexes for foreign keys (`lead_id`, `contact_id`, `deal_id`, `task_id`), statuses, priorities, assigned brokers, due dates, and timestamp ordering across all 10 core tables.
* **RLS Hardening Audit**: Audited Row Level Security policies across `profiles`, `user_roles`, `leads`, `deals`, `contacts`, `contact_timeline`, `tasks`, `task_comments`, and `task_activity` ensuring **0 `USING (true)` policies**.
* **System Architectural Documentation**: Published comprehensive system documentation:
  - [`docs/ARCHITECTURE.md`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/docs/ARCHITECTURE.md)
  - [`docs/ROADMAP.md`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/docs/ROADMAP.md)
  - [`docs/RELEASE_PROCESS.md`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/docs/RELEASE_PROCESS.md)
  - [`docs/SECURITY.md`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/docs/SECURITY.md)
  - [`docs/CONTRIBUTING.md`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/docs/CONTRIBUTING.md)
  - [`docs/engineering-audit-v0.5.1.md`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/docs/engineering-audit-v0.5.1.md)
* **Architectural Decision Records (ADRs)**: Created 7 ADRs under `docs/adr/`:
  - `0001-ddd.md` (Domain-Driven Design)
  - `0002-repository-pattern.md` (Repository Abstraction Layer)
  - `0003-ai-platform.md` (AI Copilot & Tool Registry)
  - `0004-supabase.md` (Supabase PostgreSQL & RLS)
  - `0005-rbac.md` (Role-Based Access Control)
  - `0006-contact-domain.md` (Customer Management & Timeline)
  - `0007-task-domain.md` (Task & Activity Management)

### Changed
* **Master Database Bootstrap**: Updated `supabase/bootstrap.sql` to incorporate Section 5 performance indexes and strict RLS policy definitions.

### Fixed
* **Repository & Workflow Typing**: Synchronized `TaskStatus` transitions and workflow rules across domain boundaries.

---

## [0.5.0] - 2026-07-26

### Added
* **Task & Activity Management Module**: Built `public.tasks`, `public.task_comments`, and `public.task_activity` tables backed by live Supabase repository `SupabaseTaskRepository`.
* **Kanban, Table, and Grid UI Views**: Built interactive task workspace supporting Kanban board columns, tabular list views, grid views, priority badges, and status assignment modals.
* **Executive Dashboard Task Widgets**: Integrated `Today's Tasks`, `Overdue Tasks`, `Upcoming Tasks`, and `Completion Rate` widgets into Executive Dashboard.
