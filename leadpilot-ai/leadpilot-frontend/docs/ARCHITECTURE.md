# LeadPilot AI CRM — Enterprise System Architecture

---

## 1. Enterprise System Architecture (v2.4.0 CI/CD Infrastructure)

```
+-----------------------------------------------------------------------------------+
|                           GitHub Actions CI/CD Pipeline                           |
|                       (.github/workflows/ci.yml & quality.yml)                     |
+-------------------+-----------------------------------+---------------------------+
                    |                                   |
                    v                                   v
+-------------------+-------------------+   +-----------+-----------------------+
|  Frontend CI Verification Job         |   |  Backend CI Verification Job          |
|  (working-directory:                  |   |  (working-directory:                  |
|   leadpilot-ai/leadpilot-frontend)    |   |   leadpilot-ai)                       |
|  (cache-dependency-path:              |   |  (cache-dependency-path:              |
|   leadpilot-frontend/package-lock)    |   |   leadpilot-ai/package-lock)          |
+---------------------------------------+   +---------------------------------------+
```

---

## 2. CI/CD Infrastructure Architecture

- **Subfolder Lockfile Caching:** Resolved `setup-node` missing lockfile error by passing explicit `cache-dependency-path`.
- **Working Directory Isolation:** Configured `defaults.run.working-directory` for frontend and backend jobs.
- **Pipeline Controls:** Concurrency groups (`cancel-in-progress: true`), 15-minute timeouts, and Next.js build artifact uploads (`actions/upload-artifact@v4`).
