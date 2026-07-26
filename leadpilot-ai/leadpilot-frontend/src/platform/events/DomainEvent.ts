export interface DomainEvent<TPayload = unknown> {
  id: string;
  eventName: string;
  aggregateId: string;
  timestamp: string;
  payload: TPayload;
  metadata?: Record<string, unknown>;
}

export type EventHandler<T = unknown> = (event: DomainEvent<T>) => void | Promise<void>;
