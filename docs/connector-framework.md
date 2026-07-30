# LeadPilot AI CRM — Extensible Connector Framework

**Module:** Connector Registry & Data Protocol  
**Version:** v3.5.0  

---

## 1. Schema Specification

```typescript
export interface ConnectorInstance {
  id: string;
  provider: IntegrationProvider;
  name: string;
  status: "CONNECTED" | "DISCONNECTED" | "DEGRADED" | "SYNCING" | "ERROR";
  organizationId: string;
  credentials: Record<string, string | number | boolean>;
  configuration: Record<string, string | number | boolean>;
  healthScore: number; // 0 - 100
  lastSyncAt: string;
  createdAt: string;
  updatedAt: string;
}
```
