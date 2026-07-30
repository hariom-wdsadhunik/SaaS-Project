import { AuditRecord } from "./OrganizationTypes";

export class AuditLogger {
  private static mockAudits: AuditRecord[] = [
    {
      id: "aud-101",
      organizationId: "org-1",
      userId: "usr-1",
      userEmail: "alex@leadpilot.ai",
      category: "AUTHENTICATION",
      action: "User Login Success (MFA Verified)",
      ipAddress: "192.168.1.42",
      details: "Session token granted for 7 days",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "aud-102",
      organizationId: "org-1",
      userId: "usr-1",
      userEmail: "alex@leadpilot.ai",
      category: "RBAC_CHANGE",
      action: "Updated Sarah Jenkins role to Manager",
      ipAddress: "192.168.1.42",
      details: "Role escalated from Agent to Manager",
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
      id: "aud-103",
      organizationId: "org-1",
      userId: "usr-2",
      userEmail: "sarah@leadpilot.ai",
      category: "DATA_EXPORT",
      action: "Exported 150 Leads to CSV",
      ipAddress: "10.0.0.88",
      details: "Lead export file SHA-256 validated",
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    },
  ];

  public static async getAudits(orgId: string = "org-1"): Promise<AuditRecord[]> {
    return this.mockAudits.filter((a) => a.organizationId === orgId);
  }

  public static async logAudit(
    orgId: string,
    userId: string,
    userEmail: string,
    category: AuditRecord["category"],
    action: string,
    ipAddress: string,
    details: string
  ): Promise<AuditRecord> {
    const record: AuditRecord = {
      id: `aud-${Date.now()}`,
      organizationId: orgId,
      userId,
      userEmail,
      category,
      action,
      ipAddress,
      details,
      timestamp: new Date().toISOString(),
    };
    this.mockAudits.unshift(record);
    return record;
  }
}
