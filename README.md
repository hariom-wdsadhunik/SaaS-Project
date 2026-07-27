# LeadPilot AI CRM — Enterprise SaaS Platform (v2.4.0)

LeadPilot AI CRM is a next-generation autonomous enterprise AI Customer Relationship Management (CRM) platform built for high-performance sales, real estate, and enterprise organizations.

---

## Production CI/CD Pipeline (v2.4.0)

1. **Subfolder Lockfile Caching:** Resolved `setup-node` missing lockfile error by passing explicit `cache-dependency-path` for nested frontend and backend projects.
2. **Working Directory Standardization:** `defaults.run.working-directory` isolates frontend (`leadpilot-ai/leadpilot-frontend`) and backend (`leadpilot-ai`) builds.
3. **Pipeline Control & Hardening:** Concurrency cancellation, 15-minute step timeouts, artifact uploads (`actions/upload-artifact@v4`), and weekly security audits.
