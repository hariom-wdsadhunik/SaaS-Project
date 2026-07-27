# LeadPilot AI CRM — Enterprise System Architecture

---

## 1. Enterprise System Architecture (v2.3.0 Customer Success Platform)

```
+-----------------------------------------------------------------------------------+
|                                  Next.js 15 Client App                            |
|          (Help Center, Ticket Management, Customer Health Telemetry UI)           |
+-------------------+-------------------+-------------------+-----------------------+
                    |                   |                   |
                    v                   v                   v
+-------------------+---+   +-----------+-------+   +-------+---------------+
| HelpCenterService |   |   TicketService       |   | HealthScoreEngine     |
| (Search Index &   |   | (Ticket Lifecycle |   | (0-100 Composite      |
| Article Viewer)   |   | & Escalations)    |   | Health Index)         |
+-------------------+---+   +-----------+-------+   +-------+---------------+
                    |                   |                   |
                    +-------------------+-------------------+
                                        |
                                        v
                    +-------------------+-------------------+
                    |        Supabase PostgreSQL Backend    |
                    | (Articles, Tickets, Health Telemetry) |
                    +---------------------------------------+
```

---

## 2. Customer Success Architecture

- **Help Center Engine:** `HelpCenterService.ts` for searching and indexing knowledge base articles.
- **Support Ticket Engine:** `TicketService.ts` managing ticket states (`open`, `pending`, `resolved`, `closed`) and priority escalation.
- **Customer Health Engine:** `HealthScoreEngine.ts` calculating 0-100 composite health index from login cadence, feature adoption, AI queries, and support ticket history.
