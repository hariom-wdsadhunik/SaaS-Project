# LeadPilot AI CRM — Enterprise System Architecture

---

## 1. Enterprise System Architecture (v1.0.1 Launch Readiness)

```
+-----------------------------------------------------------------------------------+
|                                  Next.js 15 Client App                            |
| (OnboardingWizard, ProductTourOverlay, OfflineBanner, Custom Error Boundaries)    |
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

## 2. Key Product Readiness Modules

- **First Run Experience (`src/components/onboarding/OnboardingWizard.tsx`):** Welcome wizard, organization setup, team invitation, and sample data loader.
- **Guided Product Tours (`src/platform/tour/ProductTourService.ts`):** Module-specific step tours.
- **Demo Mode (`src/platform/demo/DemoModeService.ts`):** Interactive demo workspace toggle.
- **Error Boundaries (`src/app/not-found.tsx`, `src/app/error.tsx`):** Custom 404, 500, and offline network state alerts.
