import { AuditActionType, AuditCategory, AuditRecord } from "./AuditEvent";
import { auditPublisher } from "./AuditPublisher";
import { eventBus } from "../events/EventBus";

export class AuditStream {
  private auditLogs: AuditRecord[] = [];
  private listeners: Set<(record: AuditRecord) => void> = new Set();

  constructor() {
    this.registerEventBusHooks();
  }

  public record(
    category: AuditCategory,
    action: AuditActionType,
    entityId: string,
    actorId = "system-user",
    actorEmail?: string,
    changes?: Record<string, { old: unknown; new: unknown }>,
    metadata?: Record<string, unknown>
  ): AuditRecord {
    const record = auditPublisher.createRecord(
      category,
      action,
      entityId,
      actorId,
      actorEmail,
      changes,
      metadata
    );

    this.auditLogs.unshift(record);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }

    this.listeners.forEach((fn) => fn(record));
    return record;
  }

  public getRecentLogs(category?: AuditCategory, limit = 50): AuditRecord[] {
    if (!category) return this.auditLogs.slice(0, limit);
    return this.auditLogs.filter((l) => l.category === category).slice(0, limit);
  }

  public subscribe(callback: (record: AuditRecord) => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private registerEventBusHooks(): void {
    eventBus.subscribe("LeadCreated", (evt) => {
      this.record("LEAD", "CREATE", evt.aggregateId, "system", undefined, undefined, evt.payload as Record<string, unknown>);
    });
    eventBus.subscribe("TaskCompleted", (evt) => {
      this.record("TASK", "UPDATE", evt.aggregateId, "system", undefined, undefined, evt.payload as Record<string, unknown>);
    });
    eventBus.subscribe("AppointmentScheduled", (evt) => {
      this.record("APPOINTMENT", "CREATE", evt.aggregateId, "system", undefined, undefined, evt.payload as Record<string, unknown>);
    });
    eventBus.subscribe("DealWon", (evt) => {
      this.record("DEAL", "UPDATE", evt.aggregateId, "system", undefined, undefined, evt.payload as Record<string, unknown>);
    });
  }
}

export const auditStream = new AuditStream();
