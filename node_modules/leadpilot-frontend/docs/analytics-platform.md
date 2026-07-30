# LeadPilot AI CRM — Analytics & Business Intelligence Platform

**Module:** Analytics & Business Intelligence  
**Version:** v0.9.0  

---

## 1. Architectural Vision

The LeadPilot AI CRM Analytics & Business Intelligence Platform provides enterprise-grade metric calculation, predictive forecasting, custom report generation, and AI-driven insights. All aggregation logic is isolated from UI layers within dedicated platform services.

```
+-----------------------------------------------------------------------------------+
|               Analytics & Business Intelligence Platform Stack                     |
+-------------------+-------------------+-------------------+-----------------------+
|    KPIEngine      |   ReportEngine    |  ForecastEngine   |    InsightEngine      |
|  (MetricCache)    | (ReportExporter)  |  (ForecastModel)  |  (InsightRanking)     |
+-------------------+-------------------+-------------------+-----------------------+
                    |                   |                   |
                    v                   v                   v
+-----------------------------------------------------------------------------------+
|                        Supabase Data Warehouse Layer                              |
+-----------------------------------------------------------------------------------+
```

---

## 2. Core Subsystems

1. **KPI Engine (`src/platform/analytics/KPIEngine.ts`)**: Evaluates 11 core KPIs with TTL caching (`MetricCache.ts`).
2. **Report Engine (`src/platform/analytics/reports/`)**: Builds, exports (CSV, Excel, PDF), and schedules custom reports.
3. **Forecast Engine (`src/platform/analytics/forecast/`)**: Generates 30-day predictive projections for revenue, lead growth, and deal closures.
4. **AI Insight Engine (`src/platform/analytics/insights/`)**: Scans CRM data to detect high-priority leads, slow deals, inactive customers, and pipeline risks.
