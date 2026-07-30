# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [4.0.0] - 2026-07-30

### Fixed
* **Workspace Turbopack Root Warning**: Configured `turbopack.root` in `apps/web/next.config.ts` to silence lockfile detection warnings in monorepo.
* **Domain Service Variable Hardening**: Resolved unused variable warnings across `DashboardService.ts` and UI pages.
* **Production Build Integrity**: Verified 64/64 routes compile cleanly in 17s with zero static page pre-rendering errors.
* **Documentation**: Published `docs/critical-fixes.md` detailing production hardening steps.

---

## [3.8.0] - 2026-07-30

### Added
* **Global Administration Console (`AdminService.ts`)**: Centralized multi-tenant organization provisioning, global user directory management, and license seat controls.
* **Centralized Feature Flags Studio (`/admin/feature-flags`)**: Environment-scoped feature toggles, percentage rollout sliders (0-100%), and organization-targeted overrides.
* **Infrastructure Telemetry Dashboard (`/admin/monitoring`)**: Live cluster health monitoring for CPU, memory, API latency, database connection pools, and AI inference engines.
* **Background Jobs & Retry Queue Manager (`/admin/jobs`)**: BullMQ worker monitoring, failed task retries, and job execution logs.
* **Security Operations Center (SOC) (`/admin/audit`)**: Real-time security incident alerts, failed login tracking, role elevation logs, and tamper-proof audit exports.
* **System Operations & Backup Recovery (`/admin/system`)**: Database snapshot history, retention policies, and SHA-256 integrity checksum verification.
* **Admin UI Sub-App (`/admin/*`)**: Created 8 admin operational pages (`/admin`, `/admin/system`, `/admin/organizations`, `/admin/users`, `/admin/jobs`, `/admin/monitoring`, `/admin/feature-flags`, `/admin/audit`).
* **Unit Tests & Documentation**: Added `admin-service.test.ts` unit test suite and system documentation (`admin-console.md`, `monitoring.md`, `feature-flags.md`, `operations.md`, `security-operations.md`).
