# Changelog

All notable changes to the LeadPilot AI backend will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-07-23

### Added
* **Complete Automated Test Suite**: Built 72 test suites with 363 tests across Unit (`tests/unit/`), Contract (`tests/contracts/`), Integration (`tests/integration/`), and Reliability (`tests/reliability/`) tiers with 100% pass rate.
* **Production Observability & Diagnostics**: Added `logStartupDiagnostics()` in `server.js` and detailed health probe endpoints (`/health`, `/ready`, `/live`) returning system memory, Node version, environment, uptime, database mode, and startup timestamp.
* **Request Correlation Middleware**: Created `middleware/requestId.js` generating and tracking `X-Request-ID` headers across request lifecycles, structured logs, and error responses.
* **Graceful Process Shutdown**: Implemented `SIGINT` / `SIGTERM` signal handlers in `server.js` to cleanly close HTTP server listeners and active connections within a 10-second window.
* **GitHub Actions CI/CD Pipeline**: Created `.github/workflows/ci.yml` running Node 22 LTS automated linting, unit tests, contract tests, integration tests, stress benchmarks, and coverage artifact uploads on every push & pull request targeting `main` and `develop`.
* **Repository Hygiene & Templates**: Added `.editorconfig`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/bug_report.md`, and `feature_request.md`.

### Changed
* **Code Coverage Standards**: Raised Line Coverage to 94.80% in Repository layer, 92.85% in Middleware layer, and 90.33% in Service layer (80.06% overall project coverage).
* **Security Headers**: Hardened Helmet middleware with strict `X-Content-Type-Options`, `Referrer-Policy`, and production `HSTS` (`Strict-Transport-Security`).

---

## [1.0.0] - 2026-07-23

### Added
* **Repository Abstraction Layer (`db/index.js`)**: Created a unified Data Access Layer for all backend models (Users, Leads, Properties, Tasks, Appointments, Deals, Notes, Email Templates, Goals, Documents, Activity/SMS Logs, Settings).
* **Dual-Mode Data Access**: Full support for both Supabase (PostgreSQL) and zero-dependency in-memory Demo Store (`db/demoStore.js`).
* **Modular Express Routers**: Extracted monolithic API endpoints into 19 individual router files in `routes/`.
* **Atomic Lease Locking**: Added `acquireEnrollmentLock` and `releaseEnrollmentLock` to `db/index.js` and `db/demoStore.js` to prevent concurrent background worker executions.
* **Step-Level Idempotency Engine**: Added deterministic idempotency key generation (`seq_<seq_id>_lead_<lead_id>_step_<step_idx>`) and step tracking (`recordProcessedStep` / `isStepAlreadyProcessed`).
* **Secure External Cron Trigger**: Mounted `/api/sequences/process-jobs` endpoint guarded by `cronAuth` middleware using `crypto.timingSafeEqual` header validation.
* **Startup Configuration Validator**: Added `validateConfig()` in `config/index.js` to enforce fail-fast checks in production mode when `JWT_SECRET` or `CRON_SECRET` is missing.

### Changed
* **Refactored All 17 Controllers**: Completely eliminated direct `supabase.from(...)` database calls and Demo Mode branching (`if (isDemoMode)`) across all controllers.
* **Refactored Service Layer**: Updated `services/reportService.js`, `services/sequenceService.js`, and `services/whatsappBusinessService.js` to route all queries through `repository`.
* **Application Bootstrap Clean-Up**: Simplified `server.js` from 581 lines down to 108 lines. Added `module.exports = app` for serverless environments (Vercel) and testing.
* **Centralized JWT Resolution**: Standardized `middleware/auth.js` and `controllers/authController.js` to consume `config.jwt.secret` directly from `config/index.js`.

### Removed
* **Legacy In-Process Scheduler**: Removed `setInterval` `startProcessor` timer from `services/sequenceService.js` in favor of external HTTP cron triggers.
* **Legacy Inline Endpoints**: Purged 473 lines of duplicated inline route handlers from `server.js`.
