import { authService } from "@/lib/auth/auth-service";
import { PolicyEngine } from "@/platform/auth/PolicyEngine";

describe("Supabase Authentication & RBAC Engine Unit Tests", () => {
  test("authService.loginWithEmail authenticates valid user", async () => {
    const res = await authService.loginWithEmail("alex@leadpilot.ai", "password123");
    expect(res.user.email).toBe("alex@leadpilot.ai");
    expect(res.user.role).toBe("ADMIN");
    expect(res.token).toBeDefined();
  });

  test("PolicyEngine enforces ADMIN role permissions", () => {
    const hasLeadRead = PolicyEngine.hasPermission("ADMIN", "leads:read");
    const hasLeadDelete = PolicyEngine.hasPermission("ADMIN", "leads:delete");
    expect(hasLeadRead).toBe(true);
    expect(hasLeadDelete).toBe(true);
  });

  test("PolicyEngine restricts VIEWER permissions", () => {
    const canRead = PolicyEngine.hasPermission("VIEWER", "leads:read");
    const canDelete = PolicyEngine.hasPermission("VIEWER", "leads:delete");
    expect(canRead).toBe(true);
    expect(canDelete).toBe(false);
  });
});
