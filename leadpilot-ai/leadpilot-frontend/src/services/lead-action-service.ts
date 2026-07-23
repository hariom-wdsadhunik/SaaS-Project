// Decoupled Observability & Audit Logger Interface
export interface AuditLogEvent {
  action: "ASSIGN" | "CHANGE_STATUS" | "ARCHIVE" | "DELETE";
  leadIds: string[];
  payload?: Record<string, unknown>;
  timestamp: string;
}

export const auditLogger = {
  log: (event: AuditLogEvent) => {
    // Extension point for Datadog / PostHog / Segment analytics telemetry
    console.log("[LeadPilot Telemetry Audit]", event);
  },
};

export const leadActionService = {
  async assignAgent(leadIds: string[], brokerName: string): Promise<{ success: boolean; count: number }> {
    await new Promise((res) => setTimeout(res, 400));
    auditLogger.log({
      action: "ASSIGN",
      leadIds,
      payload: { brokerName },
      timestamp: new Date().toISOString(),
    });
    return { success: true, count: leadIds.length };
  },

  async changeStatus(leadIds: string[], newStatus: string): Promise<{ success: boolean; count: number }> {
    await new Promise((res) => setTimeout(res, 400));
    auditLogger.log({
      action: "CHANGE_STATUS",
      leadIds,
      payload: { newStatus },
      timestamp: new Date().toISOString(),
    });
    return { success: true, count: leadIds.length };
  },

  async archiveLeads(leadIds: string[]): Promise<{ success: boolean; count: number }> {
    await new Promise((res) => setTimeout(res, 400));
    auditLogger.log({
      action: "ARCHIVE",
      leadIds,
      timestamp: new Date().toISOString(),
    });
    return { success: true, count: leadIds.length };
  },

  async deleteLeads(leadIds: string[]): Promise<{ success: boolean; count: number }> {
    await new Promise((res) => setTimeout(res, 400));
    auditLogger.log({
      action: "DELETE",
      leadIds,
      timestamp: new Date().toISOString(),
    });
    return { success: true, count: leadIds.length };
  },
};
