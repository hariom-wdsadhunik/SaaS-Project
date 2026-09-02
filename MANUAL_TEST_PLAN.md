# LeadPilot AI CRM — Master Manual Test Plan (v4.0.0)

**Version:** v4.0.0  
**Date:** July 30, 2026  
**Roles:** Senior QA Engineer, Software Test Lead, Product Owner, Release Manager  

---

## 1. Test Strategy & Objectives

This document outlines the master manual testing strategy for LeadPilot AI CRM (v4.0.0). The primary objective is to validate that all 21 system modules perform to enterprise standards across functional, UI/UX, security, workflow, performance, and cross-browser parameters.

---

## 2. Testing Scope & Module Architecture

### Tested Modules (21 Functional Areas):
1. **Authentication** (`/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`)
2. **Dashboard** (`/dashboard`, Executive BI widgets, KPI metrics)
3. **Organizations** (Workspace Switcher, Organization settings)
4. **RBAC** (Super Admin, Org Owner, Sales Manager, Agent, Viewer permissions)
5. **Users & Team** (`/team`, `/team/members`, `/team/roles`, `/team/invitations`)
6. **Leads** (`/leads`, Lead tables, Lead details, Auto-Scoring)
7. **Deals** (`/deals`, Kanban board, Stage transitions)
8. **Properties** (`/properties`, Listing grid, Property matching)
9. **Tasks** (`/tasks`, Task filters, Overdue alerts, Completion hooks)
10. **Appointments** (`/appointments`, Calendar views, Meeting prep)
11. **Documents** (`/documents`, File uploads, Folder structures, OCR preview)
12. **Communication** (`/communication`, Email, SMS, WhatsApp unified inbox)
13. **AI Sales Copilot** (`/copilot`, Morning brief, Deal health, Email rewrite)
14. **Workflow Automation** (`/automation`, Trigger rules, Condition builder, Actions)
15. **Integrations** (`/integrations`, Google, Microsoft 365, Stripe, Webhooks, API Keys)
16. **Reporting & BI** (`/reports`, Executive, Sales, Finance dashboards, PDF export)
17. **AI Intelligence Engine** (`/ai`, Predictive scoring, Monte Carlo revenue forecast)
18. **Admin Console** (`/admin`, Cluster monitoring, Feature flags, Job queues, SOC)
19. **Billing** (`/billing`, Subscriptions, Plans, Invoices)
20. **Notifications** (System toasts, Bell dropdown alerts)
21. **Settings** (`/settings`, Profile, Security, Preference configs)

---

## 3. Test Environment Requirements

- **Supported Browsers:** Chrome 120+, Microsoft Edge 120+, Firefox 120+, Safari Mobile (iOS 17+), Mobile Chrome (Android 14+).
- **Base URL:** `http://localhost:3000` (Local) / `https://app.leadpilot.ai` (Staging).
