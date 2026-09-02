# LeadPilot AI CRM — Master Test Cases Repository (v4.0.0)

**Version:** v4.0.0  
**Date:** July 30, 2026  

---

## Detailed Test Cases Catalog

| Feature Name | Test ID | Description | Preconditions | Steps to Execute | Expected Result | Actual Result | Status | Priority | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :---: | :---: |
| **Authentication** | TC-AUTH-001 | User Login Success | Valid user account exists | 1. Navigate to `/login`<br>2. Enter credentials<br>3. Click "Sign In" | User redirected to `/dashboard` with session active | | | High | Critical |
| **Authentication** | TC-AUTH-002 | User Registration | Email not registered | 1. Navigate to `/register`<br>2. Complete form<br>3. Submit | Account created & verification email sent | | | High | High |
| **Organizations** | TC-ORG-001 | Workspace Switcher | User belongs to >1 org | 1. Open Org Switcher<br>2. Select Target Org | Dashboard data updates to selected org context | | | High | High |
| **Leads** | TC-LEAD-001 | Lead Auto-Scoring | User logged in | 1. Navigate to `/leads`<br>2. Click "Add Lead"<br>3. Save details | Lead created with auto-calculated score (0-100) | | | High | High |
| **Deals** | TC-DEAL-001 | Kanban Stage Drag | Deal exists in Stage 1 | 1. Open `/deals`<br>2. Drag deal card to Stage 2 | Deal stage updated in DB & audit log generated | | | High | High |
| **Tasks** | TC-TASK-001 | Overdue Task Alert | Task due date < today | 1. Open `/tasks`<br>2. View Overdue tab | Task highlighted red with overdue warning badge | | | Medium | Medium |
| **AI Copilot** | TC-AI-001 | Email Assistant Rewrite | Draft email open | 1. Open AI Assistant<br>2. Select "Professional Tone"<br>3. Click Rewrite | Draft rewritten in professional tone with XAI rationale | | | High | Medium |
| **Workflows** | TC-AUTO-001 | Lead Created Trigger | Workflow rule enabled | 1. Create new lead<br>2. Inspect workflow log | Workflow triggered and task auto-assigned | | | High | High |
| **BI Reports** | TC-BI-001 | Executive Report Export | BI reports available | 1. Navigate to `/reports/executive`<br>2. Click "Export PDF" | PDF document downloads with chart graphics | | | Medium | Medium |
| **Admin Console**| TC-ADM-001 | Feature Flag Rollout | Super Admin login | 1. Open `/admin/feature-flags`<br>2. Set canary slider to 50% | Flag state updated for target percentage rollout | | | High | High |
