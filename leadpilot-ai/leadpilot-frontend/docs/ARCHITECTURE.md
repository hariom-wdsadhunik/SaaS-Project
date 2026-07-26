# LeadPilot AI CRM — Enterprise System Architecture

---

## 1. Enterprise System Architecture (v2.0.0 Brand & Design System)

```
+-----------------------------------------------------------------------------------+
|                                  Next.js 15 Client App                            |
| (AppLayout, Button, Input, Card, Badge, Modal, CommandPalette, Design Tokens)     |
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

## 2. Design System Architecture

- **Design Tokens (`src/styles/tokens.css`):** Centralized CSS variables declaring color palettes, typography scales, border radii, elevation shadows, and dark/light themes.
- **Component Primitives (`src/components/ui/`):** Atomic UI primitives (`Button`, `Input`, `Card`, `Badge`, `Modal`, `CommandPalette`).
- **Layout Shell (`src/components/layout/AppLayout.tsx`):** Responsive sidebar, top bar navigation, and main content grid.
- **Design System Guide (`DESIGN.md`):** Complete design specification.
