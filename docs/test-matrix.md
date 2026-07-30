# LeadPilot AI CRM — Complete Test Matrix (v4.0.0)

**Version:** v4.0.0  
**Audit Date:** July 30, 2026  

---

## Complete Test Matrix

| Workflow ID | Module | Workflow Description | Expected Behavior | Actual Behavior | Result |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **WF-AUTH-01** | Authentication | User Sign Up with Email/Pass | Account created, session cookie set | Account created, session cookie set | **PASS** |
| **WF-AUTH-02** | Authentication | User Login & JWT Token | Auth token issued, redirected to /dashboard | Auth token issued, redirected to /dashboard | **PASS** |
| **WF-ORG-01** | Organizations | Workspace Switcher | Context switches to target org | Context switches to target org | **PASS** |
| **WF-LEAD-01** | Leads | Create Lead & Auto-Score | Lead saved, score calculated | Lead saved, score calculated | **PASS** |
| **WF-DEAL-01** | Deals | Kanban Drag-and-Drop Stage | Stage updated, audit log created | Stage updated, audit log created | **PASS** |
| **WF-TASK-01** | Tasks | Create Task & Assign Lead | Task assigned, timeline updated | Task assigned, timeline updated | **PASS** |
| **WF-APPT-01** | Appointments | Calendar Walkthrough Booking | Appointment scheduled, attendee notified | Appointment scheduled, attendee notified | **PASS** |
| **WF-COMM-01** | Communication | Send WhatsApp Message | Message sent via provider facade | Message sent via provider facade | **PASS** |
| **WF-AI-01** | AI Engine | Predictive Lead Score & XAI | Propensity score & factors displayed | Propensity score & factors displayed | **PASS** |
| **WF-AUTO-01** | Automation | Rule Execution on Lead Created | Trigger fires, actions executed | Trigger fires, actions executed | **PASS** |
| **WF-BI-01** | Reporting | Executive Brief PDF Export | PDF document generated | PDF document generated | **PASS** |
| **WF-INT-01** | Integrations | Google Calendar Sync | OAuth sync triggered | OAuth sync triggered | **PASS** |
| **WF-ADM-01** | Admin | Feature Flag Percentage Rollout | Canary rollout percentage saved | Canary rollout percentage saved | **PASS** |
