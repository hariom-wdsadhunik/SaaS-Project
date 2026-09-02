# LeadPilot AI CRM — Comprehensive Manual Test Checklist (v4.0.0)

**Version:** v4.0.0  
**Date:** July 30, 2026  

---

## Complete Tester Checklist

### 1. Authentication & Session
- [ ] Verify User Login with valid email and password.
- [ ] Verify User Registration with password strength meter validation.
- [ ] Verify Password Reset link generation and token verification.
- [ ] Verify JWT token expiration forces redirect to `/login`.
- [ ] Verify Logout clears session storage and cookies.

### 2. Dashboard & BI Analytics
- [ ] Verify Executive Dashboard loads all 9 metric widgets without layout shifts.
- [ ] Verify KPI metric card calculations match underlying dataset totals.
- [ ] Verify chart hover tooltips render accurate data points.
- [ ] Verify dark mode / light mode toggle persists user theme preference.

### 3. Organizations & Multi-Tenancy
- [ ] Verify Workspace Switcher dropdown lists user's accessible organizations.
- [ ] Verify switching organization instantly scopes Leads, Deals, and Tasks.
- [ ] Verify Organization Owner can invite new team members via email.

### 4. RBAC & Access Control
- [ ] Verify Agent role cannot access `/admin/*` platform routes (returns 403 / Redirect).
- [ ] Verify Viewer role cannot create, edit, or delete Leads.
- [ ] Verify Super Admin can modify global feature flag percentage rollouts.

### 5. Lead & Contact Pipeline
- [ ] Verify Creating Lead auto-calculates Lead Score (0-100) and Grade (A-D).
- [ ] Verify Searching leads by name or company filters table in real-time.
- [ ] Verify Exporting leads compiles base64 encoded CSV download.

### 6. Deal Kanban & Properties
- [ ] Verify Dragging deal card from "Qualification" to "Proposal Sent" updates stage.
- [ ] Verify Property matching algorithm displays compatible listings for selected lead.

### 7. AI Sales Copilot & Workflows
- [ ] Verify Morning Brief generator compiles daily prioritized action items.
- [ ] Verify Workflow Automation trigger fires action upon new lead creation.

### 8. Admin Operations & Telemetry
- [ ] Verify System Monitoring page displays cluster CPU, Memory, and DB Health.
- [ ] Verify Feature Flag toggle updates feature visibility instantaneously.
