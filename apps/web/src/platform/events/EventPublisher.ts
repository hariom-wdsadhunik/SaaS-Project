import { DomainEvent } from "./DomainEvent";

export class EventPublisher {
  public createEvent<T>(
    eventName: string,
    aggregateId: string,
    payload: T,
    metadata?: Record<string, unknown>
  ): DomainEvent<T> {
    return {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      eventName,
      aggregateId,
      timestamp: new Date().toISOString(),
      payload,
      metadata,
    };
  }
}

export const eventPublisher = new EventPublisher();
