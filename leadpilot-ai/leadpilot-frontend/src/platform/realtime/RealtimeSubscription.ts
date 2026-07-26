export type RealtimeEntity =
  | "leads"
  | "deals"
  | "contacts"
  | "tasks"
  | "appointments"
  | "dashboard";

export type RealtimeEventType = "INSERT" | "UPDATE" | "DELETE" | "*";

export interface RealtimeSubscriptionPayload<T = Record<string, unknown>> {
  entity: RealtimeEntity;
  eventType: RealtimeEventType;
  newRecord: T | null;
  oldRecord: T | null;
  timestamp: string;
}

export type RealtimeCallback<T = Record<string, unknown>> = (
  payload: RealtimeSubscriptionPayload<T>
) => void;

export interface RealtimeSubscriptionConfig {
  id: string;
  entity: RealtimeEntity;
  table?: string;
  filter?: string;
  callback: RealtimeCallback;
}
