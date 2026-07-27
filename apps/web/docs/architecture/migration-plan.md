# LeadPilot AI CRM — Monorepo Migration Plan (v3.0.0)

**Version:** v3.0.0  
**Status:** Approved  
**Author:** LeadPilot Architecture Team  

---

## 1. Current Repository Layout

```text
SaaS-Project/                             <-- Git Repository Root
├── .github/workflows/
│   ├── ci.yml
│   └── quality.yml
├── README.md
└── leadpilot-ai/                         <-- Backend Root
    ├── package.json
    ├── package-lock.json
    ├── server.js
    ├── controllers/
    ├── db/
    ├── middleware/
    ├── logger/
    ├── routes/
    ├── utils/
    ├── tests/
    └── leadpilot-frontend/               <-- Nested Frontend App
        ├── package.json
        ├── package-lock.json
        ├── src/
        └── docs/
```

---

## 2. Proposed Target Monorepo Architecture

```text
SaaS-Project/                             <-- Enterprise Monorepo Root
├── apps/
│   ├── api/                              <-- Express.js Backend Server
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── server.js
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── tests/
│   └── web/                              <-- Next.js 15 Frontend Application
│       ├── package.json
│       ├── package-lock.json
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── domain/
│       │   ├── platform/
│       │   └── infrastructure/
│       └── tsconfig.json
├── packages/
│   ├── shared/                           <-- Shared Domain Types & Utilities
│   │   └── package.json
│   └── config/                           <-- Shared Tooling Configurations
│       └── package.json
├── docs/                                 <-- Centralized System Documentation
│   ├── INDEX.md
│   ├── architecture/
│   ├── api/
│   ├── deployment/
│   ├── runbooks/
│   ├── releases/
│   ├── roadmap/
│   ├── development/
│   └── testing/
├── .github/workflows/
│   ├── ci.yml                            <-- Target Path Updated CI
│   └── quality.yml
├── README.md
├── CONTRIBUTING.md
├── CODE_STYLE.md
├── BRANCHING.md
├── PROJECT_STATUS.md
├── BACKLOG.md
├── TECHNICAL_DEBT.md
└── ARCHITECTURE_DECISIONS.md
```

---

## 3. Migration Stages

1. **Stage 1 (Folder Scaffold):** Create `apps/`, `packages/shared/`, `packages/config/`, and `docs/` directories.
2. **Stage 2 (Frontend Migration):** Move `leadpilot-ai/leadpilot-frontend` to `apps/web`. Update Next.js config, tsconfig aliases, and dependencies.
3. **Stage 3 (Backend Migration):** Move `leadpilot-ai` backend files (`server.js`, `controllers/`, `db/`, `middleware/`, `routes/`, `logger/`, `utils/`, `tests/`) to `apps/api`.
4. **Stage 4 (Shared Packages):** Extract shared constants/types into `packages/shared`.
5. **Stage 5 (Centralized Documentation):** Consolidate all documentation into `docs/` and create `docs/INDEX.md`.
6. **Stage 6 (Engineering Standards):** Create root governance docs (`CONTRIBUTING.md`, `CODE_STYLE.md`, `BRANCHING.md`, `PROJECT_STATUS.md`, `BACKLOG.md`, `TECHNICAL_DEBT.md`, `ARCHITECTURE_DECISIONS.md`).
7. **Stage 7 (CI Pipeline Hardening):** Update `.github/workflows/ci.yml` and `quality.yml` working directories to `apps/web` and `apps/api`.
8. **Stage 8 (Validation):** Run `npm ci`, `npm run lint`, `npm test`, and `npm run build` across all sub-apps.

---

## 4. Risks & Rollback Plan

- **Risk 1 (Path Alias Resolution):** Changing directory locations could break TypeScript `@/*` imports.
  - *Mitigation:* `tsconfig.json` path mappings in `apps/web/tsconfig.json` explicitly mapped to `./src/*`.
- **Risk 2 (CI Working Directory Mismatch):** GitHub Actions could fail if `working-directory` isn't updated.
  - *Mitigation:* Update `.github/workflows/ci.yml` to `apps/web` and `apps/api` simultaneously with folder migration.
- **Rollback Strategy:** Git branch isolation allows single-command reversion via `git reset --hard HEAD~1` if validation fails.
