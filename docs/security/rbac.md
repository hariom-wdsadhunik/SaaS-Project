# LeadPilot AI CRM — Role-Based Access Control (RBAC) Architecture

This document describes the data-driven permission engine and authorization architecture for LeadPilot AI CRM.

## System Roles

1. **SUPER_ADMIN**: Unrestricted system administration & tenant configuration.
2. **ADMIN**: Tenant user management, settings configuration, audit access.
3. **MANAGER**: Team oversight, analytics access, task/deal approval permissions.
4. **SALES_AGENT**: Standard record management (Leads, Deals, Properties, Tasks).
5. **SUPPORT_AGENT**: Support read/update permissions for Contacts & Tasks.
6. **VIEWER**: Read-only CRM browsing access.

## UI Permission Protection

```tsx
<PermissionGate permission="DELETE" fallback={<p>Unauthorized action</p>}>
  <Button variant="danger">Delete Record</Button>
</PermissionGate>
```
