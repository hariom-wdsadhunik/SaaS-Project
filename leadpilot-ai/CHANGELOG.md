# Changelog

All notable changes to LeadPilot AI CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-26

### Added
* **AI Workspace (`src/domain/ai/workspace/`)**: Introduced `AIConversation`, `AIContextBuilder` (aggregating multi-entity context), `AIResponseFormatter`, `ConversationMemory`, and `AIWorkspace` facade.
* **Workflow Automation Engine (`src/platform/workflows/`)**: Introduced `WorkflowDefinition`, `TriggerRegistry`, `ConditionEvaluator`, `ActionExecutor`, `WorkflowValidator`, `WorkflowRunner`, `WorkflowRepository`, and `WorkflowEngine`.
* **RAG Knowledge Base (`src/domain/knowledge/`)**: Introduced `KnowledgeDocument`, `EmbeddingProvider` interface, `VectorStoreAdapter` interface, `KnowledgeIndexer`, `KnowledgeSearch`, and `KnowledgeRepository`.
* **Multi-Tenant SaaS Foundation (`src/platform/tenant/`)**: Enforced organizational tenant boundary isolation (`organization_id`, `TenantContext`, `TenantMiddleware`).
* **Observability Suite (`src/platform/observability/`)**: Introduced `MonitoringService`, `HealthCheckService`, `MetricsCollector`, and `AuditDashboard`.
* **Security & Production Hardening**: Created `SECURITY_AUDIT.md`, `DeploymentChecklist.md`, `ProductionChecklist.md`, `Runbook.md`, `DisasterRecovery.md`, `BackupStrategy.md`, `ScalingGuide.md`.
* **Unit & System Integration Test Suite**: Created `workflow.test.ts`, `knowledge.test.ts`, `tenant.test.ts`, `ai-workspace.test.ts`, `security.test.ts`, `performance.test.ts`, `integration.test.ts`.

---

## [0.9.0] - 2026-07-26

### Added
* **Analytics Domain Model (`src/domain/analytics/types.ts`)**: Defined `AnalyticsMetric`, `Dashboard`, `DashboardWidget`, `Report`, `ReportFilter`, `KPI`, `Forecast`, and `Insight` entities.
