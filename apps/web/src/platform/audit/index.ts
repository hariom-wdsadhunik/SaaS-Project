import { AuditEvent } from "../types";

export const platformAuditLogger = {
  log: (event: AuditEvent) => {
    if (typeof window !== "undefined") {
      console.log("[Platform Telemetry Audit]", event);
    }
  },
};
