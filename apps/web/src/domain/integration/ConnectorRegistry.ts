import {
  ConnectorInstance,
  WebhookEndpoint,
  ApiKeyRecord,
} from "./IntegrationTypes";

export class ConnectorRegistry {
  private static connectors: ConnectorInstance[] = [
    {
      id: "conn-101",
      provider: "GOOGLE_WORKSPACE",
      name: "Google Workspace (Calendar, Gmail & Contacts)",
      status: "CONNECTED",
      organizationId: "org-1",
      credentials: { clientId: "g_client_9942", scope: "calendar,gmail,contacts" },
      configuration: { autoSync: true, syncIntervalMinutes: 15 },
      healthScore: 98,
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      createdAt: "2025-02-10T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "conn-102",
      provider: "MICROSOFT_365",
      name: "Microsoft 365 (Outlook & Contacts)",
      status: "CONNECTED",
      organizationId: "org-1",
      credentials: { tenantId: "ms_tenant_881", scope: "User.Read,Calendars.ReadWrite" },
      configuration: { autoSync: true, syncIntervalMinutes: 30 },
      healthScore: 95,
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      createdAt: "2025-03-01T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "conn-103",
      provider: "WHATSAPP_BUSINESS",
      name: "Meta WhatsApp Business Cloud API",
      status: "CONNECTED",
      organizationId: "org-1",
      credentials: { phoneAccountId: "wa_acc_9921" },
      configuration: { webhookUrl: "https://leadpilot.ai/api/v1/webhooks/whatsapp" },
      healthScore: 100,
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      createdAt: "2025-01-20T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    },
    {
      id: "conn-104",
      provider: "STRIPE_PAYMENTS",
      name: "Stripe Billing & Subscriptions Provider",
      status: "CONNECTED",
      organizationId: "org-1",
      credentials: { publishableKey: "pk_live_51...982" },
      configuration: { webhookEndpoint: "https://leadpilot.ai/api/v1/webhooks/stripe" },
      healthScore: 99,
      lastSyncAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      createdAt: "2025-01-15T00:00:00.000Z",
      updatedAt: new Date().toISOString(),
    },
  ];

  private static webhooks: WebhookEndpoint[] = [
    {
      id: "wh-101",
      organizationId: "org-1",
      url: "https://hooks.zapier.com/hooks/catch/99214/leadpilot",
      secret: "whsec_9918273645",
      direction: "OUTGOING",
      events: ["lead.created", "deal.won", "task.completed"],
      status: "ACTIVE",
      lastTriggeredAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      failureCount: 0,
    },
  ];

  private static apiKeys: ApiKeyRecord[] = [
    {
      id: "key-101",
      organizationId: "org-1",
      name: "Zapier Integration Key",
      prefix: "lp_live_99a82...",
      scopes: ["leads:read", "leads:write", "deals:read"],
      createdAt: "2025-04-10T00:00:00.000Z",
      expiresAt: "2027-04-10T00:00:00.000Z",
      lastUsedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      status: "ACTIVE",
    },
  ];

  public static async getConnectors(orgId: string = "org-1"): Promise<ConnectorInstance[]> {
    return this.connectors.filter((c) => c.organizationId === orgId);
  }

  public static async triggerSync(connectorId: string): Promise<string> {
    const conn = this.connectors.find((c) => c.id === connectorId);
    if (!conn) throw new Error("Connector not found");
    conn.status = "SYNCING";
    conn.lastSyncAt = new Date().toISOString();
    conn.status = "CONNECTED";
    return conn.lastSyncAt;
  }

  public static async getWebhooks(orgId: string = "org-1"): Promise<WebhookEndpoint[]> {
    return this.webhooks.filter((w) => w.organizationId === orgId);
  }

  public static async getApiKeys(orgId: string = "org-1"): Promise<ApiKeyRecord[]> {
    return this.apiKeys.filter((k) => k.organizationId === orgId);
  }

  public static async createApiKey(name: string, scopes: string[]): Promise<ApiKeyRecord> {
    const key: ApiKeyRecord = {
      id: `key-${Date.now()}`,
      organizationId: "org-1",
      name,
      prefix: `lp_live_${Math.random().toString(36).substr(2, 8)}...`,
      scopes,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString(),
      lastUsedAt: "Never",
      status: "ACTIVE",
    };
    this.apiKeys.unshift(key);
    return key;
  }
}
