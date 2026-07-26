# Multi-Tenant SaaS Architecture

**Module:** Multi-Tenancy  
**Location:** `src/platform/tenant/`  

---

## 1. Tenant Boundaries

Enforces strict `organization_id` organizational isolation across database Row Level Security policies and HTTP middleware headers.
