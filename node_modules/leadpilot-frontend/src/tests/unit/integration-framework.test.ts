import { ConnectorRegistry } from "@/domain/integration/ConnectorRegistry";

describe("Enterprise Integration Framework Unit Tests", () => {
  test("ConnectorRegistry returns active connector instances", async () => {
    const connectors = await ConnectorRegistry.getConnectors("org-1");
    expect(connectors.length).toBeGreaterThan(0);
    expect(connectors[0].provider).toBe("GOOGLE_WORKSPACE");
  });

  test("ConnectorRegistry triggers manual sync and updates timestamp", async () => {
    const syncTime = await ConnectorRegistry.triggerSync("conn-101");
    expect(syncTime).toBeDefined();
    expect(new Date(syncTime).getTime()).toBeGreaterThan(0);
  });

  test("ConnectorRegistry retrieves active webhook endpoints", async () => {
    const webhooks = await ConnectorRegistry.getWebhooks("org-1");
    expect(webhooks.length).toBeGreaterThan(0);
    expect(webhooks[0].direction).toBe("OUTGOING");
  });

  test("ConnectorRegistry creates and retrieves scoped API keys", async () => {
    const newKey = await ConnectorRegistry.createApiKey("Test Key", ["leads:read"]);
    expect(newKey.name).toBe("Test Key");
    expect(newKey.scopes).toContain("leads:read");

    const keys = await ConnectorRegistry.getApiKeys("org-1");
    expect(keys.length).toBeGreaterThan(0);
  });
});
