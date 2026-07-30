export type IntegrationProvider =
  | "GOOGLE_WORKSPACE"
  | "MICROSOFT_365"
  | "TWILIO_SMS"
  | "WHATSAPP_BUSINESS"
  | "SENDGRID_EMAIL"
  | "NODEMAILER_SMTP"
  | "STRIPE_PAYMENTS"
  | "CUSTOM_WEBHOOK";

export type ConnectionStatus = "CONNECTED" | "DISCONNECTED" | "DEGRADED" | "SYNCING" | "ERROR";

export interface ConnectorInstance {
  id: string;
  provider: IntegrationProvider;
  name: string;
  status: ConnectionStatus;
  organizationId: string;
  credentials: Record<string, string | number | boolean>;
  configuration: Record<string, string | number | boolean>;
  healthScore: number; // 0 - 100
  lastSyncAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookEndpoint {
  id: string;
  organizationId: string;
  url: string;
  secret: string;
  direction: "INCOMING" | "OUTGOING";
  events: string[];
  status: "ACTIVE" | "INACTIVE" | "PAUSED";
  lastTriggeredAt: string;
  failureCount: number;
}

export interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  event: string;
  statusCode: number;
  durationMs: number;
  timestamp: string;
  payload: string;
  response: string;
}

export interface ApiKeyRecord {
  id: string;
  organizationId: string;
  name: string;
  prefix: string; // e.g. lp_live_xxx
  scopes: string[]; // e.g. ["leads:read", "leads:write", "webhooks:manage"]
  createdAt: string;
  expiresAt: string;
  lastUsedAt: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
}

export interface ImportJobRecord {
  id: string;
  organizationId: string;
  entityType: "LEADS" | "CONTACTS" | "DEALS" | "PROPERTIES";
  fileName: string;
  totalRecords: number;
  importedRecords: number;
  failedRecords: number;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
}
