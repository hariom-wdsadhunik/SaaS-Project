import { TenantMiddleware } from "@/platform/tenant/TenantMiddleware";

describe("Security & Tenant Isolation Unit Tests", () => {
  test("blocks cross-tenant header tampering", () => {
    const mockRequest = new Request("https://leadpilot.ai/api/v1/deals", {
      headers: { "x-organization-id": "org-malicious-999" },
    });

    const res = TenantMiddleware.validateTenantAccess(mockRequest);
    expect(res).not.toBeNull();
    expect(res?.status).toBe(403);
  });
});
