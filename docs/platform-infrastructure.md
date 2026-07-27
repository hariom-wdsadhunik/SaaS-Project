# LeadPilot AI CRM — Platform Infrastructure Documentation

**Module:** Core Platform Infrastructure  
**Version:** v0.6.5  

---

## 1. Overview & Architectural Vision

LeadPilot AI CRM relies on a modular, decoupled platform infrastructure layer designed for real-time responsiveness, event-driven reactive programming, background processing, and enterprise auditability.

```
+-----------------------------------------------------------------------+
|                      LeadPilot AI CRM Platform                        |
+-------------------+-------------------+-------------------+-----------+
| Supabase Realtime | Domain Event Bus  | Notification Engine| Audit Stream|
| Presence Service  | Background Jobs   | AI Event Listener | Live Boards|
+-------------------+-------------------+-------------------+-----------+
```

---

## 2. Core Infrastructure Pillars

1. **Supabase Realtime Channel Engine (`src/platform/realtime/`)**
   - Live entity synchronization (`leads`, `deals`, `contacts`, `tasks`, `appointments`, `dashboard`).
   - Prevents duplicate channel subscriptions and manages automatic WebSocket reconnection.

2. **Domain Event Bus (`src/platform/events/`)**
   - Strongly-typed domain events (`LeadCreated`, `LeadUpdated`, `TaskCompleted`, `AppointmentScheduled`, `DealWon`).
   - Async non-blocking dispatcher isolating handler errors.

3. **Multi-Channel Notification Engine (`src/platform/notifications/`)**
   - In-App notification manager with unread counts and UI notification center dropdown.
   - Provider drivers abstraction for Email, SMS, WhatsApp, and Push.

4. **Background Job Queue & Scheduler (`src/platform/jobs/`)**
   - Scheduled timers for reminders, workflows, AI tasks, and recurring appointments.
   - Exponential backoff retry policies.

5. **User Presence Engine (`src/platform/presence/`)**
   - Realtime presence channels tracking Online, Offline, Away, Last Seen, and typing states.

6. **Centralized Audit Log Stream (`src/platform/audit/`)**
   - Aggregates system activities across core CRM entities into a high-throughput audit buffer.
