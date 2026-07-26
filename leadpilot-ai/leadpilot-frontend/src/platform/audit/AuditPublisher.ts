import { AuditActionType, AuditCategory, AuditRecord } from "./AuditEvent";

export class AuditPublisher {
  public createRecord(
    category: AuditCategory,
    action: AuditActionType,
    entityId: string,
    actorId: string,
    actorEmail?: string,
    changes?: Record<string, { old: unknown; new: unknown }>,
    metadata?: Record<string, unknown>
  ): AuditRecord {
    return {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      category,
      action,
      entityId,
      actorId,
      actorEmail,
      changes,
      metadata,
      timestamp: new Date().toISOString(),
    };
  }
}

export const auditPublisher = new AuditPublisher();
