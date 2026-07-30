import { platformAuditLogger } from "@/platform/audit";

export function createMockAuditLogger() {
  const events: Array<Record<string, unknown>> = [];
  const originalLog = platformAuditLogger.log;

  platformAuditLogger.log = (event: unknown) => {
    events.push(event as Record<string, unknown>);
    return originalLog.call(platformAuditLogger, event as Parameters<typeof originalLog>[0]);
  };

  return {
    events,
    restore() {
      platformAuditLogger.log = originalLog;
    },
  };
}
