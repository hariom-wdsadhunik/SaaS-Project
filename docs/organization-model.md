# LeadPilot AI CRM — Organization Domain Model

**Module:** Multi-Tenant Organization Data Architecture  
**Version:** v3.3.0  

---

## 1. Schema Specification

```typescript
export interface Organization {
  id: string;                // Primary Key (UUID / org_xxx)
  name: string;              // Organization Display Name (e.g. LeadPilot Advisory Group)
  slug: string;              // URL-friendly unique slug (e.g. leadpilot-advisory)
  logoUrl?: string;          // Organization Brand Logo CDN URL
  timezone: string;          // Default Organization Timezone (e.g. America/New_York)
  subscriptionPlan: string;  // Active Plan (e.g. Enterprise Pro, Growth)
  ownerId: string;           // Owner User ID Reference
  createdAt: string;         // ISO 8601 Timestamp
  updatedAt: string;         // ISO 8601 Timestamp
}
```

---

## 2. Multi-Tenant Foreign Key Attachments

All primary CRM entities attach to `organization_id`:
- `leads.organization_id`
- `deals.organization_id`
- `tasks.organization_id`
- `properties.organization_id`
- `appointments.organization_id`
- `documents.organization_id`
- `communications.organization_id`
