# LeadPilot AI CRM — Enterprise System Architecture

---

## 1. High-Level System Architecture

```
+-----------------------------------------------------------------------------------+
|                                  Next.js 15 Client App                            |
|             (React 19, Tailwind CSS v4, Zustand Store, Lucide Icons)              |
+-------------------+-------------------+-------------------+-----------------------+
                    |                   |                   |
                    v                   v                   v
+-------------------+---+   +-----------+-------+   +-------+---------------+
|   Supabase Realtime   |   |  Domain Event Bus |   |  Notification Engine  |
| (RealtimeService/     |   | (DomainEvents/    |   | (NotificationService/ |
| ChannelManager)       |   | EventDispatcher)  |   | Preferences/Center)   |
+-------------------+---+   +-----------+-------+   +-------+---------------+
                    |                   |                   |
                    +-------------------+-------------------+
                                        |
                                        v
                    +-------------------+-------------------+
                    |        Supabase PostgreSQL Backend    |
                    | (14 Tables, RLS Enabled, B-Tree Ind.)|
                    +---------------------------------------+
```

---

## 2. Infrastructure Platform Stack (Sprint v0.6.5)

- **Supabase Realtime Engine (`src/platform/realtime/`):** Real-time subscription manager, payload mapper, channel pooling, and connection resilience.
- **Domain Event Bus (`src/platform/events/`):** Asynchronous pub/sub event broker with isolated error dispatching.
- **Notification Engine (`src/platform/notifications/`):** Multi-channel notification delivery (In-App, Email, SMS, WhatsApp, Push).
- **Background Jobs Queue (`src/platform/jobs/`):** Job queue, scheduler, and retry policy handler with exponential backoff.
- **User Presence (`src/platform/presence/`):** Real-time online/offline and typing state tracking.
- **Audit Stream (`src/platform/audit/`):** Centralized audit logging stream.
