# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.6.5] - 2026-07-26

### Added
* **Supabase Realtime Infrastructure (`src/platform/realtime/`)**: Built `RealtimeService`, `RealtimeChannelManager`, `RealtimeSubscription`, and `RealtimeEventMapper` powering live streaming for `leads`, `deals`, `contacts`, `tasks`, `appointments`, and `dashboard`.
* **Domain Event Bus (`src/platform/events/`)**: Implemented strongly typed event bus (`DomainEvent`, `EventBus`, `EventPublisher`, `EventSubscriber`, `EventRegistry`, `EventDispatcher`).
* **Notification Engine (`src/platform/notifications/`)**: Built multi-channel notification engine (`NotificationService`, `NotificationCenter`, `NotificationRepository`, `NotificationPreferences`, `NotificationFormatter`) supporting In-App, Email, SMS, WhatsApp, and Push abstractions.
* **Background Jobs Queue & Scheduler (`src/platform/jobs/`)**: Created `JobScheduler`, `JobRunner`, `JobQueue`, `RetryPolicy`, and `ScheduledJob` supporting reminder delivery, workflows, AI tasks, and recurring appointments with exponential backoff retries.
* **User Presence Engine (`src/platform/presence/`)**: Added `PresenceService`, `UserPresence`, and `PresenceChannel` tracking Online, Offline, Away, Last Seen, and typing states.
* **Centralized Audit Stream (`src/platform/audit/`)**: Built `AuditStream`, `AuditEvent`, and `AuditPublisher` capturing domain audit logs.
* **AI Copilot Event Integration**: Wired `AIOrchestrator` to subscribe to `TaskCompleted`, `DealWon`, and `AppointmentScheduled` events for automated AI recommendations.
* **Platform Unit Test Suites**: Created unit tests `realtime.test.ts`, `event-bus.test.ts`, `notification.test.ts`, `jobs.test.ts`, and `presence.test.ts`.

---

## [0.6.0] - 2026-07-26

### Added
* **Calendar & Appointment Management Domain**: Built production-grade `public.appointments`, `public.appointment_attendees`, `public.appointment_reminders`, and `public.appointment_activity` tables backed by live Supabase repository `SupabaseAppointmentRepository`.
