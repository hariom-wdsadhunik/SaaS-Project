# LeadPilot AI CRM — Enterprise System Architecture

---

## 1. Enterprise System Architecture (v1.0.0 GA)

```
+-----------------------------------------------------------------------------------+
|                                  Next.js 15 Client App                            |
|             (React 19, Tailwind CSS v4, Zustand Store, Lucide Icons)              |
+-------------------+-------------------+-------------------+-----------------------+
                    |                   |                   |
                    v                   v                   v
+-------------------+---+   +-----------+-------+   +-------+---------------+
|    AI Workspace   |   |  Workflow Engine  |   |   RAG Knowledge Base  |
| (AIContextBuilder/|   | (TriggerRegistry/ |   | (KnowledgeIndexer/    |
| AIResponseFormat) |   | ConditionEval)    |   | VectorStoreAdapter)   |
+-------------------+---+   +-----------+-------+   +-------+---------------+
                    |                   |                   |
                    +-------------------+-------------------+
                                        |
                                        v
                    +-------------------+-------------------+
                    |        Supabase PostgreSQL Backend    |
                    | (26 Tables, Strict Multi-Tenant RLS) |
                    +---------------------------------------+
```

---

## 2. Key Enterprise Subsystems

- **AI Workspace (`src/domain/ai/workspace/`):** Conversational copilot aggregating context across Leads, Contacts, Deals, Tasks, Appointments, Communications, Documents, and Analytics.
- **Workflow Automation Engine (`src/platform/workflows/`):** Event-driven trigger/condition/action runner listening to domain event bus.
- **RAG Knowledge Base (`src/domain/knowledge/`):** Decoupled chunking, embedding, and vector similarity search.
- **Multi-Tenant SaaS Foundation (`src/platform/tenant/`):** Organization tenancy isolation middleware (`organization_id`).
- **Observability Suite (`src/platform/observability/`):** Health check, latency metrics collector, system monitoring, and audit dashboard services.
