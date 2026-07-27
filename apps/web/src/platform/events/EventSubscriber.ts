import { EventHandler } from "./DomainEvent";

export interface SubscriptionToken {
  eventName: string;
  id: string;
  unsubscribe: () => void;
}

export class EventSubscriber {
  private handlers: Map<string, Map<string, EventHandler<unknown>>> = new Map();

  public subscribe<T>(eventName: string, handler: EventHandler<T>): SubscriptionToken {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, new Map());
    }

    const subId = `sub-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    this.handlers.get(eventName)!.set(subId, handler as EventHandler<unknown>);

    return {
      eventName,
      id: subId,
      unsubscribe: () => this.unsubscribe(eventName, subId),
    };
  }

  public unsubscribe(eventName: string, subId: string): boolean {
    const eventHandlers = this.handlers.get(eventName);
    if (!eventHandlers) return false;
    return eventHandlers.delete(subId);
  }

  public getHandlers<T>(eventName: string): EventHandler<T>[] {
    const eventHandlers = this.handlers.get(eventName);
    if (!eventHandlers) return [];
    return Array.from(eventHandlers.values()) as EventHandler<T>[];
  }

  public clearAll(): void {
    this.handlers.clear();
  }
}
