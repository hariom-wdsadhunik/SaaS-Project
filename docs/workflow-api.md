# LeadPilot AI CRM — Workflow Automation API Specification

**Module:** Workflow API Contract  
**Version:** v3.4.0  

---

## Endpoints

### 1. `GET /api/v1/workflows`
Returns list of configured workflow rules for the active organization.

### 2. `POST /api/v1/workflows`
Creates a new workflow rule.

### 3. `PUT /api/v1/workflows/:id/toggle`
Enables or pauses a workflow rule.

### 4. `GET /api/v1/workflows/templates`
Retrieves pre-built automation templates gallery.

### 5. `GET /api/v1/workflows/history`
Fetches workflow execution audit logs and metrics.
