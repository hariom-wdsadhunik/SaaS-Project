# LeadPilot AI CRM — Platform Architecture Specification

**Version:** 0.5.1  
**Architecture Style:** Domain-Driven Design (DDD) & Clean Layered Architecture  

---

## 1. High-Level Architectural Overview

LeadPilot AI CRM is built as a enterprise-ready real estate AI CRM. It uses a strict decoupled multi-layer architecture isolating domain business rules, application contracts, data persistence, and UI presentation components.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Presentation Layer (Next.js)                │
│       React 19 Server/Client Components, Tailwind, Lucide       │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                     Application / Facade Layer                  │
│             Services, Action Services, Middleware, Auth         │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                       Domain Layer (DDD)                        │
│          Entity Definitions, Workflow Rules, AI Tools           │
└────────────────────────────────┬────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────┐
│                 Infrastructure / Repository Layer               │
│          Supabase Client, Repositories, Audit Logging           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Principles

1. **Domain-Driven Design (DDD):** Domain entities (`LeadEntity`, `DealEntity`, `ContactEntity`, `TaskEntity`) live in pure TypeScript under `src/domain/` with zero external dependencies.
2. **Repository Pattern:** UI components and services interact exclusively with repository contracts defined in `src/contracts/`. Data persistence is implemented in `src/infrastructure/repositories/` backed by live Supabase PostgreSQL.
3. **AI Copilot Orchestration:** AI tool functions (`TaskTool`, `ContactTool`, `DealTool`, `LeadTool`) wrap domain logic and execute via `ToolRegistry` and `AIOrchestrator` with audit logging.
4. **Security & RBAC First:** Strict Row-Level Security (RLS) is enforced across all 10 PostgreSQL tables. Authentication is managed via Supabase Auth and cached in React Context.

---

## 3. Directory Layout

```
leadpilot-frontend/
├── src/
│   ├── app/                    # Next.js App Router (Dashboard, Auth, Modules)
│   ├── components/             # Presentational UI Components
│   ├── contracts/              # Abstract Repository & Service Interfaces
│   ├── domain/                 # DDD Entities, Enums, AI Tools & Workflows
│   ├── infrastructure/         # Supabase Client, Repositories, Telemetry
│   ├── lib/                    # Validation Schemas (Zod), Utilities
│   └── platform/               # Audit Logger, Feedback UI Components
docs/                           # Architecture Docs, ADRs, Release Checklists
supabase/                       # SQL Migrations & Master Bootstrap Script
```
