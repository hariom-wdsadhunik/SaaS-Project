# LeadPilot AI CRM — Version 1.1.0 Release Checklist

This document provides a mandatory pre-release and deployment checklist for releasing LeadPilot AI CRM Version 1.1.0 to staging and production environments.

---

## 1. Code Quality & Review Checklist

- [ ] **Code Freeze**: Features and refactoring frozen; only release-critical fixes permitted.
- [ ] **Version Bump**: `package.json` version updated to `1.1.0`.
- [ ] **Changelog**: `CHANGELOG.md` updated with all v1.1.0 additions and enhancements.
- [ ] **Dead Code Audit**: Verified no unused files, dead logic, or temporary scratch code in production paths.
- [ ] **Console Logs**: Verified production paths use structured `pino` logger rather than ad-hoc `console.log`.
- [ ] **EditorConfig**: Verified indentation, newline format, and trailing whitespace compliance.

---

## 2. Automated Testing & Verification

- [ ] **All Test Suites Passing**: Run `npm test` and verify **72 test suites** and **363 tests** pass with 100% success rate.
- [ ] **Line Coverage Thresholds**:
  - [ ] Repository Layer Line Coverage ≥ 90% (Current: 94.80%)
  - [ ] Middleware Layer Line Coverage ≥ 90% (Current: 92.85%)
  - [ ] Service Layer Line Coverage ≥ 90% (Current: 90.33%)
  - [ ] Overall Project Line Coverage ≥ 80% (Current: 80.06%)
- [ ] **Reliability & Stress Benchmarks**: Verified 100-request stress test succeeds with < 400ms average latency and zero memory leaks.

---

## 3. Environment & Secrets Checklist

- [ ] **Production Environment Variables**:
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET`: Minimum 64-character random string configured in secret store.
  - [ ] `CRON_SECRET`: Minimum 32-character random string configured in secret store.
  - [ ] `SUPABASE_URL` & `SUPABASE_SERVICE_KEY`: Production database keys set.
  - [ ] `CORS_ORIGIN`: Set to exact authorized origin domain(s); wildcard `*` disabled.
- [ ] **Startup Validation**: Verified application executes `validateConfig()` on boot and fails fast if required secrets are absent.

---

## 4. Observability & Health Check Verification

- [ ] **Health Endpoints**:
  - [ ] `GET /health`: Verified returning `200 OK` with version `1.1.0`, memory usage, database mode, and uptime.
  - [ ] `GET /ready`: Verified readiness probe responding to Kubernetes/Load Balancer.
  - [ ] `GET /live`: Verified process liveness probe.
- [ ] **Request Correlation**: Verified `X-Request-ID` attached to HTTP response headers and error payloads.
- [ ] **Graceful Shutdown**: Verified process catches `SIGINT` / `SIGTERM` signals and drains connections cleanly within 10s.

---

## 5. Deployment & Rollback Strategy

- [ ] **Staging Verification**: Deploy build to staging environment and verify `/health` and authentication flows.
- [ ] **Database Migration**: Verify any PostgreSQL schema changes applied prior to code deployment.
- [ ] **Blue-Green / Canary Deployment**: Deploy v1.1.0 instances alongside v1.0.0; route 10% traffic for smoke verification.
- [ ] **Rollback Plan**:
  - If error rate spikes > 1%, immediately revert load balancer target group to previous release tag `v1.0.0`.
  - Database schema is backward-compatible with v1.0.0.

---

## 6. GitHub Actions CI/CD Pipeline

- [ ] **Workflow Passing**: Verified `.github/workflows/ci.yml` passes cleanly on `main` and `develop` branches.
- [ ] **Artifact Retention**: Verified coverage artifacts uploaded and retained for 14 days.
