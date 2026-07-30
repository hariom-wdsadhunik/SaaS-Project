# LeadPilot AI CRM — Security & Compliance Audit Log Design

**Module:** Immutable Compliance Ledger  
**Version:** v3.3.0  

---

## 1. Compliance Categories

- **AUTHENTICATION:** Login success/failure, MFA verification, logout, session expiration.
- **RBAC_CHANGE:** Role escalation/demotion, permission updates, member deactivation.
- **BILLING:** Subscription upgrades/downgrades, invoice payments, payment method changes.
- **ADMIN_ACTION:** Organization settings updates, workspace creation, member invitations.
- **WORKSPACE_CHANGE:** Active workspace switching, multi-org navigation.
- **DATA_EXPORT:** CSV/Excel/PDF export events of leads, deals, contacts, or analytics.

---

## 2. Audit Record Data Model

```typescript
export interface AuditRecord {
  id: string;             // Audit Event ID (aud_xxx)
  organizationId: string; // Tenant Isolation Key
  userId: string;         // Actor User ID
  userEmail: string;      // Actor Email
  category: "AUTHENTICATION" | "RBAC_CHANGE" | "BILLING" | "ADMIN_ACTION" | "WORKSPACE_CHANGE" | "DATA_EXPORT";
  action: string;         // Event Action Title
  ipAddress: string;      // Client IP Address
  details: string;        // SHA-256 Validated Event Payload Summary
  timestamp: string;      // ISO 8601 Immutable Timestamp
}
```
