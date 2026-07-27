# LeadPilot AI CRM — Architecture Decision Records (ADR)

---

## ADR-001: Monorepo Apps + Packages Structure (v3.0.0)

- **Context:** The codebase previously contained a nested `leadpilot-ai/leadpilot-frontend` structure inside backend directory `leadpilot-ai/`.
- **Decision:** Restructure into a clean monorepo architecture: `apps/web` (Next.js frontend), `apps/api` (Express backend), `packages/shared`, `packages/config`, and centralized `docs/`.
- **Consequences:** Simplifies directory navigation, isolates CI build paths, and supports future workspace package sharing.
