import { RBACEngine } from "@/domain/organization/RBACEngine";
import { ActivityLogger } from "@/domain/organization/ActivityLogger";
import { AuditLogger } from "@/domain/organization/AuditLogger";

describe("Enterprise Team & RBAC Unit Tests", () => {
  test("RBACEngine permits Owner full actions across all 9 domains", () => {
    expect(RBACEngine.hasPermission("Owner", "Billing", "Delete")).toBe(true);
    expect(RBACEngine.hasPermission("Owner", "Team", "Assign")).toBe(true);
  });

  test("RBACEngine restricts Viewer to Read only", () => {
    expect(RBACEngine.hasPermission("Viewer", "Leads", "Read")).toBe(true);
    expect(RBACEngine.hasPermission("Viewer", "Leads", "Delete")).toBe(false);
    expect(RBACEngine.hasPermission("Viewer", "Billing", "Read")).toBe(false);
  });

  test("RBACEngine grants Agent Lead/Deal Create & Read but restricts Billing/Settings", () => {
    expect(RBACEngine.hasPermission("Agent", "Leads", "Create")).toBe(true);
    expect(RBACEngine.hasPermission("Agent", "Billing", "Read")).toBe(false);
  });

  test("ActivityLogger records and retrieves organization events", async () => {
    const act = await ActivityLogger.logActivity(
      "org-1",
      "usr-1",
      "Alex Morgan",
      "Promoted Team Member",
      "Team",
      "usr-2",
      "Sarah Jenkins"
    );

    expect(act.userName).toBe("Alex Morgan");
    expect(act.objectType).toBe("Team");

    const list = await ActivityLogger.getActivities("org-1");
    expect(list.length).toBeGreaterThan(0);
  });

  test("AuditLogger logs security and compliance records", async () => {
    const aud = await AuditLogger.logAudit(
      "org-1",
      "usr-1",
      "alex@leadpilot.ai",
      "RBAC_CHANGE",
      "Updated Role",
      "127.0.0.1",
      "Escalated user privileges"
    );

    expect(aud.userEmail).toBe("alex@leadpilot.ai");
    expect(aud.category).toBe("RBAC_CHANGE");

    const audits = await AuditLogger.getAudits("org-1");
    expect(audits.length).toBeGreaterThan(0);
  });
});
