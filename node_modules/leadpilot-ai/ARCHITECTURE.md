# LeadPilot AI — System Architecture & Engineering Documentation

This document provides a detailed technical overview of the architecture, design patterns, security mechanisms, and data access layers implemented in LeadPilot AI Version 1.0.

---

## 1. System Architecture Overview

LeadPilot AI follows a strict **Layered Component Architecture** with a **Repository Pattern** data abstraction. High-level requests pass through security and routing layers before reaching business logic controllers and services.

```mermaid
flowchart TD
    subgraph Client Tier
        UI[LeadPilot Web UI / External Client]
    end

    subgraph Security & Routing Tier
        R[Modular Routers - 19 Files]
        MW[Auth & Cron Security Middleware]
    end

    subgraph Business Logic Tier
        C[HTTP Controllers - 17 Controllers]
        S[Business Services - Report & Sequence Services]
    end

    subgraph Data Abstraction Tier
        RP[Unified Repository Layer - db/index.js]
    end

    subgraph Storage Tier
        PG[(Supabase PostgreSQL Database)]
        DS[(In-Memory Demo Store)]
    end

    UI -->|HTTPS Request| MW
    MW -->|Validated Request| R
    R -->|Route Execution| C
    C -->|Orchestration| S
    C -->|CRUD Operations| RP
    S -->|Data Queries| RP
    RP -->|Production Environment| PG
    RP -->|Demo Environment| DS
```

---

## 2. Component Responsibilities

| Architectural Layer | Core Directory | Responsibilities |
| :--- | :--- | :--- |
| **Configuration** | `config/` | Centralizes environment variables, validates startup parameters, throws fail-fast errors in production. |
| **Routing** | `routes/` | Defines API endpoints, maps HTTP verbs, attaches authentication middleware to specific endpoint groups. |
| **Middleware** | `middleware/` | Enforces authentication (JWT), multi-tenant isolation, rate limiting, and CRON header verification. |
| **Controllers** | `controllers/` | Validates request payloads, calls repository methods, formats HTTP JSON responses. **Contains ZERO direct database calls.** |
| **Services** | `services/` | Encapsulates complex multi-entity business workflows (PDF reporting, sequence execution). |
| **Repository** | `db/` | Hides underlying storage implementation (`Supabase` vs `Demo Store`). Exposes uniform CRUD interfaces. |
| **Persistence** | Supabase / DemoStore | Physical database (PostgreSQL) or in-memory arrays for demo execution. |

---

## 3. Detailed Request Lifecycle Flow

```mermaid
sequenceDiagram
    autonumber
    participant Client as Web Client / API Client
    participant Express as Express Application
    participant Middleware as Auth Middleware (JWT)
    participant Router as Modular Router (routes/leads.js)
    participant Controller as Leads Controller (controllers/leadsController.js)
    participant Repo as Unified Repository (db/index.js)
    participant Store as Supabase / Demo Store

    Client->>Express: GET /api/leads (Header: Authorization Bearer <token>)
    Express->>Middleware: Intercept Request
    Middleware->>Middleware: Verify JWT Token (config.jwt.secret)
    alt Token Invalid / Expired
        Middleware-->>Client: HTTP 403 Forbidden
    else Token Valid
        Middleware->>Router: Forward Request (Attach req.user)
        Router->>Controller: Invoke getLeads(req, res)
        Controller->>Repo: getLeads({ team_id: req.user.team_id })
        Repo->>Store: Query Leads Table / Filter Array
        Store-->>Repo: Return Raw Records
        Repo-->>Controller: Return Leads Array
        Controller-->>Client: HTTP 200 OK { success: true, data: [...] }
    end
```

---

## 4. Background Job & Cron Architecture

To ensure 100% compatibility with serverless runtimes (Vercel, AWS Lambda) and containerized clusters (Render, Railway), in-process timers (`setInterval`) are completely replaced by an external HTTP Cron trigger architecture:

```mermaid
flowchart TD
    subgraph External Schedulers
        VC[Vercel Cron]
        GHA[GitHub Actions]
        RC[Render / Railway Cron]
    end

    subgraph Secured Trigger Endpoint
        EP["POST /api/sequences/process-jobs"]
        MW["cronAuth Middleware (timingSafeEqual)"]
    end

    subgraph Service Execution
        SS[sequenceService.processPendingJobs]
        LG[Lock & Idempotency Guard]
    end

    subgraph Storage
        RP[Repository Layer]
        DB[(Supabase / Demo Store)]
    end

    VC -->|HTTPS POST + Bearer CRON_SECRET| MW
    GHA -->|HTTPS POST + Bearer CRON_SECRET| MW
    RC -->|HTTPS POST + Bearer CRON_SECRET| MW

    MW -->|Authorized| EP
    EP --> SS
    SS --> LG
    LG -->|Acquire 2m Lease| RP
    RP --> DB
```

---

## 5. Concurrency Control, Locking & Idempotency

LeadPilot AI employs two complementary reliability mechanisms to guarantee zero duplicate communications (Email/SMS/WhatsApp) during worker retries or concurrent cron executions:

### A. Atomic Lease Locking (`acquireEnrollmentLock`)
Before processing a sequence enrollment, the worker attempts to acquire an atomic lock:
```sql
UPDATE sequence_enrollments
SET status = 'processing', locked_until = NOW() + INTERVAL '2 minutes'
WHERE id = $1 AND (locked_until IS NULL OR locked_until < NOW())
RETURNING *;
```
If another worker holds an active lease (`locked_until > NOW()`), the query returns `null` and the current worker skips the enrollment.

### B. Step-Level Idempotency (`recordProcessedStep`)
Immediately after a side-effect (e.g. sending an email via SendGrid) completes, the service records an idempotency log entry:
* **Deterministic Idempotency Key**: `seq_<sequence_id>_lead_<lead_id>_step_<step_index>`
* **Duplicate Detection**: Prior to executing a step, `repository.isStepAlreadyProcessed(enrollment_id, step_index)` is checked. If `true`, the step is skipped and the enrollment safely advances.

```mermaid
flowchart TD
    A[Start Enrollment Processing] --> B{Acquire Lock?}
    B -- No (Already Locked) --> C[Skip Enrollment]
    B -- Yes (Lock Acquired) --> D{isStepAlreadyProcessed?}
    D -- Yes (Worker Retry / Crash Recovery) --> E[Advance Enrollment & Release Lock]
    D -- No (New Execution) --> F[Generate Idempotency Key]
    F --> G[Dispatch Outbound Action - Email/SMS]
    G --> H[Record Processed Step Log]
    H --> I[Advance Enrollment Step]
    I --> J[Release Lock]
```

---

## 6. Execution Modes & Configuration Hardening

### Configuration Matrix

| Feature | Demo Mode | Development Mode | Production Mode |
| :--- | :--- | :--- | :--- |
| **Trigger Criteria** | `SUPABASE_SERVICE_KEY == 'demo_mode'` | `NODE_ENV == 'development'` | `NODE_ENV == 'production'` |
| **Storage Backend** | In-Memory `demoStore.js` | Supabase PostgreSQL | Supabase PostgreSQL |
| **JWT Secret** | `leadpilot_demo_secret_2024` | `leadpilot_dev_secret_key` | `process.env.JWT_SECRET` |
| **Cron Secret** | `leadpilot_demo_cron_secret_2024` | `leadpilot_demo_cron_secret_2024` | `process.env.CRON_SECRET` |
| **Startup Behavior** | Pre-seeds demo data | Validates config with dev warnings | **Fails fast & halts if secrets missing** |
