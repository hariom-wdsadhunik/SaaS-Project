import { TenantContext } from "@/platform/tenant/TenantContext";

describe("Multi-Tenant Context Unit Tests", () => {
  test("retrieves organization details and subscription limits", () => {
    const org = TenantContext.getOrganization();
    expect(org.id).toBe("org-001");
    expect(org.subscriptionTier).toBe("ENTERPRISE");
    expect(org.maxUsers).toBe(500);
  });
});
