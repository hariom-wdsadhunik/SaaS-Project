# LeadPilot AI CRM — Automation Bus & Execution Architecture

**Module:** Event Bus & Rule Execution Pipeline  
**Version:** v3.4.0  

---

## 1. Execution Flow Diagram

```mermaid
graph TD
  A[CRM Event: Lead / Deal / Task / Appt] -->|Emit Event| B[Workflow Event Bus]
  B -->|Evaluate Rules| C{Active Workflow Engine}
  C -->|Check Conditions| D[Condition Evaluation Tree: AND / OR]
  D -->|Pass| E[Execute Configured Actions]
  E --> F[Send Email / WhatsApp / SMS]
  E --> G[Move Deal Stage / Create Task]
  E --> H[Invoke AI Sales Copilot]
  E --> I[Dispatch Webhook]
  D -->|Fail| J[Log Skipped Event]
  E --> K[Log Execution Result & Latency]
```

---

## 2. Condition Evaluation Engine

Supports recursive AND / OR trees evaluating:
- **Field Comparisons:** `EQUALS`, `NOT_EQUALS`, `CONTAINS`
- **Numeric Thresholds:** `GREATER_THAN`, `LESS_THAN`
- **Set Membership:** `IN`, `NOT_IN`
