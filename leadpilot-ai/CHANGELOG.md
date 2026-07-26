# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.6.0] - 2026-07-26

### Added
* **Calendar & Appointment Management Domain**: Built production-grade `public.appointments`, `public.appointment_attendees`, `public.appointment_reminders`, and `public.appointment_activity` tables backed by live Supabase repository [`SupabaseAppointmentRepository`](file:///c:/Users/Hari%20Om%20Kumar/Desktop/GitHub%20Projects/SaaS%20Project/leadpilot-ai/leadpilot-frontend/src/infrastructure/repositories/SupabaseAppointmentRepository.ts).
* **Multi-Entity Relationships**: Supported linking appointments to `Lead`, `Contact`, `Deal`, and `Task` entities without data duplication.
* **Meeting Statuses & Types**: Supported meeting statuses (`SCHEDULED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`) and meeting types (`CALL`, `VIDEO`, `IN_PERSON`, `SITE_VISIT`, `DEMO`, `FOLLOW_UP`).
* **Cross-Module Timeline Integration**: Connected appointment creation, confirmation, completion, and cancellation events to automatically append to the `contact_timeline` when linked to contacts.
* **Calendar Workspaces & Views**: Integrated Month, Week, Day, and Agenda views on `/calendar` and `/appointments` with appointment drawers, modal forms, date navigation, and color-coded status badges.
* **Reminder Architecture Foundation**: Built underlying schema and repository structures for Email, SMS, WhatsApp, and Push notification reminders.
* **Executive Dashboard Appointment Widgets**: Integrated `Today's Meetings`, `Upcoming Meetings`, `This Week`, `No Shows`, and `Completed Meetings` widgets into the Executive Control Panel.
* **AI Appointment Intelligence Tool**: Created `appointment_intelligence_tool` (`src/domain/ai/tools/AppointmentTool.ts`) enabling AI copilot analysis of upcoming schedules, today's meetings, and meeting histories.
* **Unit Test Suite**: Created `appointment-repository.test.ts`, `appointment-reminder.test.ts`, `appointment-timeline.test.ts`, and `calendar-view.test.ts`.

### Changed
* **Database Master Bootstrap**: Updated `supabase/bootstrap.sql` to include Section 2.11 - 2.14 (`appointments`, `appointment_attendees`, `appointment_reminders`, `appointment_activity`), strict RLS policies, performance B-tree indexes, and seed data.

---

## [0.5.1] - 2026-07-26

### Added
* **Database Performance Tuning**: Created migration `20260726140000_performance_and_security_tuning.sql` adding B-tree indexes for foreign keys and timestamp ordering across all 10 core tables.
* **System Architectural Documentation**: Published `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `docs/RELEASE_PROCESS.md`, `docs/SECURITY.md`, `docs/CONTRIBUTING.md`, `docs/engineering-audit-v0.5.1.md`, and 7 ADRs under `docs/adr/`.
