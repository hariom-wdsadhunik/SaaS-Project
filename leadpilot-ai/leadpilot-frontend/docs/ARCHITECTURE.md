# LeadPilot AI CRM — Enterprise System Architecture

---

## 1. High-Level System Architecture

```
+-----------------------------------------------------------------------------------+
|                                  Next.js 15 Client App                            |
|             (React 19, Tailwind CSS v4, Zustand Store, Lucide Icons)              |
+-------------------+-------------------+-------------------+-----------------------+
                    |                   |                   |
                    v                   v                   v
+-------------------+---+   +-----------+-------+   +-------+---------------+
| Analytics & BI Engine |   |  Domain Event Bus |   |  Notification Engine  |
| (KPIEngine/Reports/   |   | (DomainEvents/    |   | (NotificationService/ |
| Forecast/Insights)    |   | EventDispatcher)  |   | Preferences/Center)   |
+-------------------+---+   +-----------+-------+   +-------+---------------+
                    |                   |                   |
                    +-------------------+-------------------+
                                        |
                                        v
                    +-------------------+-------------------+
                    |        Supabase PostgreSQL Backend    |
                    | (26 Tables, RLS Enabled, B-Tree Ind.)|
                    +---------------------------------------+
```

---

## 2. Analytics & Business Intelligence Architecture (Sprint v0.9.0)

- **KPI Engine (`src/platform/analytics/`):** Evaluates 11 core KPIs with `MetricCache` TTL caching and incremental refresh.
- **Report Engine (`src/platform/analytics/reports/`):** Builds custom reports, exports (CSV, Excel, PDF), and handles cron scheduling.
- **Forecast Engine (`src/platform/analytics/forecast/`):** Generates 30-day predictive forecasts for revenue, lead growth, and deal closures.
- **AI Insight Engine (`src/platform/analytics/insights/`):** Scans CRM data to detect high-priority leads, slow deals, inactive customers, and pipeline risks.
- **API Versioning (`/api/v1/`):** Versioned API endpoints (`/api/v1/analytics`, `/api/v1/reports`, `/api/v1/dashboard`, `/api/v1/forecast`).
