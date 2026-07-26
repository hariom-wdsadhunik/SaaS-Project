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
| Omnichannel Platform  |   |  Domain Event Bus |   |  Notification Engine  |
| (WhatsApp / Email /   |   | (DomainEvents/    |   | (NotificationService/ |
| SMS ProviderAdapters) |   | EventDispatcher)  |   | Preferences/Center)   |
+-------------------+---+   +-----------+-------+   +-------+---------------+
                    |                   |                   |
                    +-------------------+-------------------+
                                        |
                                        v
                    +-------------------+-------------------+
                    |        Supabase PostgreSQL Backend    |
                    | (20 Tables, RLS Enabled, B-Tree Ind.)|
                    +---------------------------------------+
```

---

## 2. Communication & Provider Architecture Stack (Sprint v0.7.0)

- **Provider Abstractions (`src/platform/providers/communication/`):** Decoupled `CommunicationProvider` interface implemented by `WhatsAppProvider` (Meta WhatsApp), `EmailProvider` (SendGrid), and `SMSProvider` (Twilio). Dynamic factory resolution via `ProviderFactory`.
- **Communication Repository (`SupabaseCommunicationRepository`):** Executes live messaging queries against Supabase PostgreSQL and automatically appends events to `contact_timeline`.
- **AI Copilot Tool (`CommunicationTool`):** Registered `communication_intelligence_tool` providing sentiment analysis and suggested auto-replies.
- **API Versioning (`/api/v1/`):** Public and internal API endpoints (`/api/v1/communications`, `/api/v1/messages`, `/api/v1/templates`, `/api/v1/notifications`).
