# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.9.0] - 2026-07-26

### Added
* **Analytics Domain Model (`src/domain/analytics/types.ts`)**: Defined `AnalyticsMetric`, `Dashboard`, `DashboardWidget`, `Report`, `ReportFilter`, `KPI`, `Forecast`, and `Insight` entities.
* **KPI Engine & Metric Subsystem (`src/platform/analytics/`)**: Implemented `MetricRegistry` (11 core KPIs), `MetricCalculator`, `MetricCache` (in-memory TTL caching), and `KPIEngine`.
* **Report Engine (`src/platform/analytics/reports/`)**: Built `ReportBuilder`, `ReportExporter` (CSV, Excel TSV/CSV, PDF mock), `ReportScheduler`, and `ReportEngine`.
* **Predictive Forecast Engine (`src/platform/analytics/forecast/`)**: Built `TrendAnalyzer`, `ForecastModel`, and `ForecastEngine` generating 30-day predictive projections for revenue, lead growth, and deal closures.
* **AI Insight Engine (`src/platform/analytics/insights/`)**: Built `InsightGenerator`, `InsightRanking`, and `InsightEngine` scanning CRM data for high-priority leads, slow deals, inactive customers, and pipeline risks.
* **Executive Dashboard Service (`DashboardService.ts`)**: Configured 9 executive widgets with realtime refresh capabilities.
* **Versioned API v1 Endpoints (`src/app/api/v1/`)**: Introduced `/api/v1/analytics`, `/api/v1/reports`, `/api/v1/dashboard`, and `/api/v1/forecast`.
* **Unit Test Suite**: Created `analytics.test.ts`, `kpi-engine.test.ts`, `forecast.test.ts`, `dashboard.test.ts`, `report.test.ts`, and `insight.test.ts`.

---

## [0.8.0] - 2026-07-26

### Added
* **Document Database Migration (`supabase/migrations/20260726170000_create_document_tables.sql`)**: Created `folders`, `documents`, `document_versions`, `document_tags`, `document_permissions`, and `document_previews` tables with strict Row-Level Security (RLS) policies and B-tree indexes.
