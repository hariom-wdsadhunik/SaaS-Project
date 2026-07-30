# LeadPilot AI CRM — Role-Based Access Control (RBAC) Specification

**Module:** Centralized Security & RBAC Policy  
**Version:** v3.3.0  

---

## 1. Role Definitions

- **Owner:** Full unrestricted control over organization, billing, team membership, workspace settings, and data exports.
- **Admin:** Full administrative capabilities over team, settings, and CRM data; view-only access to billing details.
- **Manager:** Lead, Deal, and Task assignment, team performance viewing, and data exports; no access to billing or security settings.
- **Agent:** Operational access to create, view, and update assigned Leads, Deals, Tasks, and Documents; read-only access to team and property catalogue.
- **Viewer:** Read-only access to Leads, Deals, Tasks, Properties, and Analytics.

---

## 2. Permissions Matrix

| Resource Domain | Owner | Admin | Manager | Agent | Viewer |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Leads** | CRUD+Export+Assign | CRUD+Export+Assign | CRU+Export+Assign | CRU | Read |
| **Deals** | CRUD+Export+Assign | CRUD+Export+Assign | CRU+Export+Assign | CRU | Read |
| **Tasks** | CRUD+Export+Assign | CRUD+Export+Assign | CRUD+Assign | CRUD | Read |
| **Properties** | CRUD+Export+Assign | CRUD+Export+Assign | CRU+Export | Read | Read |
| **Analytics** | CRUD+Export+Assign | CRUD+Export+Assign | Read+Export | Read | Read |
| **Billing** | CRUD+Export+Assign | Read+Export | None | None | None |
| **Settings** | CRUD+Export+Assign | CRUD+Export | Read | Read | None |
| **Team** | CRUD+Export+Assign | CRUD+Export+Assign | Read+Assign | Read | Read |
| **Documents** | CRUD+Export+Assign | CRUD+Export+Assign | CRU+Export | CR | Read |
