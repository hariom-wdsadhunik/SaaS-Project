import { DomainEvent, EventHandler } from "./DomainEvent";
import { EventSubscriber, SubscriptionToken } from "./EventSubscriber";
import { EventDispatcher } from "./EventDispatcher";
import { EventPublisher } from "./EventPublisher";

export class EventBus {
  private subscriber = new EventSubscriber();
  private dispatcher = new EventDispatcher();
  private publisher = new EventPublisher();

  public subscribe<T>(eventName: string, handler: EventHandler<T>): SubscriptionToken {
    return this.subscriber.subscribe<T>(eventName, handler);
  }

  public async publish<T>(
    eventName: string,
    aggregateId: string,
    payload: T,
    metadata?: Record<string, unknown>
  ): Promise<DomainEvent<T>> {
    const event = this.publisher.createEvent(eventName, aggregateId, payload, metadata);
    const handlers = this.subscriber.getHandlers<T>(eventName);
    await this.dispatcher.dispatch(handlers, event);
    return event;
  }

  public async publishEvent<T>(event: DomainEvent<T>): Promise<void> {
    const handlers = this.subscriber.getHandlers<T>(event.eventName);
    await this.dispatcher.dispatch(handlers, event);
  }

  public clear(): void {
    this.subscriber.clearAll();
  }
}

export const eventBus = new EventBus();
