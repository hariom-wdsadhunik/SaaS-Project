import { DomainEvent, EventHandler } from "./DomainEvent";

export class EventDispatcher {
  public async dispatch<T>(handlers: EventHandler<T>[], event: DomainEvent<T>): Promise<void> {
    const promises = handlers.map(async (handler) => {
      try {
        await handler(event);
      } catch (error) {
        console.error(`[EventDispatcher] Handler error for event ${event.eventName}:`, error);
      }
    });

    await Promise.all(promises);
  }
}

export const eventDispatcher = new EventDispatcher();
