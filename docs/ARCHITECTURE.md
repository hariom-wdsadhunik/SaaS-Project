# LeadPilot AI CRM — Enterprise System Architecture

---

## 1. Enterprise System Architecture (v3.1.0 AI Sales Copilot)

```
+-----------------------------------------------------------------------------------+
|                           AI Command Center Dashboard                             |
|                    (apps/web/src/app/(dashboard)/copilot/page.tsx)                |
+-------------------+-----------------------------------+---------------------------+
                    |                                   |
                    v                                   v
+-------------------+-------------------+   +-----------+-----------------------+
|  AI Copilot Platform Engines          |   |  API v1 Copilot Endpoints             |
|  - LeadSummaryEngine                  |   |  - /api/v1/copilot/lead-summary       |
|  - EmailCopilotService                |   |  - /api/v1/copilot/email-assistant    |
|  - WhatsAppCopilotService             |   |  - /api/v1/copilot/whatsapp-assistant |
|  - MeetingPrepEngine                  |   |  - /api/v1/copilot/meeting-prep       |
|  - DailyBriefEngine                   |   |  - /api/v1/copilot/daily-brief        |
|  - DealHealthEngine                   |   |  - /api/v1/copilot/deal-health        |
+-------------------+-------------------+   +-----------+-----------------------+
                    |                                   |
                    +-----------------+-----------------+
                                      |
                                      v
+-------------------------------------+---------------------------------------------+
|                          Domain & Infrastructure Services                         |
|                    (Leads, Deals, Tasks, Communications, Supabase)                |
+-----------------------------------------------------------------------------------+
```

---

## 2. AI Sales Copilot Architecture

- **Proactive Intelligence Layer:** Daily Brief Engine aggregates priority leads, deal risks, and tasks automatically.
- **Multi-Channel Assistant:** Email and WhatsApp Copilot services handle message drafting, rewriting, and thread summarization.
- **Predictive Deal Analytics:** Deal Health Engine predicts 0-100 closing probability, health grade, and flags missing documentation.
