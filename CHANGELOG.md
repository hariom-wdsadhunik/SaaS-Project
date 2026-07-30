# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [3.7.0] - 2026-07-30

### Added
* **Centralized AI Intelligence Engine (`AiIntelligenceEngine.ts`)**: Modular machine learning predictor providing Lead Scoring, Opportunity Win Probability, Churn Risk, Revenue Forecasting, and Next Best Actions.
* **Predictive Lead & Opportunity Scoring**: Propensity scores (0-100), grades (A-D), confidence levels, and feature importance weighting.
* **AI Revenue Forecasting**: Monthly, quarterly, and annual projections with Monte Carlo simulations, best/worst case scenarios, and 85-95% confidence intervals.
* **Next Best Action Engine**: Prescriptive sales guidance prioritizing critical follow-ups based on expected revenue impact and urgency.
* **Explainable AI (XAI)**: Transparent reasoning breakdowns showing positive and negative feature drivers.
* **AI Platform UI Sub-App (`/ai/*`)**: Created 5 AI intelligence pages (`/ai`, `/ai/insights`, `/ai/forecast`, `/ai/leads`, `/ai/recommendations`).
* **Unit Tests & Documentation**: Added `ai-intelligence-engine.test.ts` unit test suite and system documentation (`ai-engine.md`, `lead-scoring.md`, `forecasting.md`, `recommendation-engine.md`, `next-best-action.md`).

---

## [3.6.0] - 2026-07-30

### Added
* **Centralized Reporting Engine (`ReportingEngine.ts`)**: BI aggregation engine compiling metrics across all CRM data stores.
* **16-Metric Enterprise KPI Library**: Revenue, Pipeline Value, Deals Won/Lost, Lead Conversion, Sales Velocity, Task Completion, Appointment Success, Response Time, Workflow Success, MRR, ARR, Churn, and Net Retention.
* **5 Role-Tailored Executive Dashboards**: Executive Leadership, Sales Performance, Financial Intelligence, Operations, and Agent performance views.
* **Custom Dashboard Builder (`custom/page.tsx`)**: Drag-and-drop widget studio supporting 10 chart types and layout sharing.
* **Automated Report Scheduler (`scheduled/page.tsx`)**: Daily, weekly, monthly, and quarterly email delivery with PDF/CSV attachments.
* **Multi-Format Data Exporter**: Filtered CSV, Excel, PDF, and JSON data export compiler.
* **Reporting UI Sub-App (`/reports/*`)**: Created 6 reporting pages (`/reports`, `/reports/executive`, `/reports/sales`, `/reports/finance`, `/reports/custom`, `/reports/scheduled`).
* **Unit Tests & Documentation**: Added `reporting-engine.test.ts` unit test suite and system documentation (`reporting-engine.md`, `dashboard-builder.md`, `kpi-library.md`, `report-export.md`).
