import { RealtimeEntity, RealtimeEventType, RealtimeSubscriptionPayload } from "./RealtimeSubscription";

export interface SupabaseRealtimePayload {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: Record<string, unknown>;
  old: Record<string, unknown>;
  table: string;
}

export const RealtimeEventMapper = {
  tableToEntity(table: string): RealtimeEntity {
    switch (table.toLowerCase()) {
      case "leads":
        return "leads";
      case "deals":
        return "deals";
      case "contacts":
        return "contacts";
      case "tasks":
        return "tasks";
      case "appointments":
        return "appointments";
      default:
        return "dashboard";
    }
  },

  mapPayload<T = Record<string, unknown>>(
    raw: SupabaseRealtimePayload
  ): RealtimeSubscriptionPayload<T> {
    return {
      entity: this.tableToEntity(raw.table),
      eventType: (raw.eventType as RealtimeEventType) || "*",
      newRecord: (raw.new as T) || null,
      oldRecord: (raw.old as T) || null,
      timestamp: new Date().toISOString(),
    };
  },
};
