import { realtimeChannelManager } from "./RealtimeChannelManager";
import { RealtimeCallback, RealtimeEntity, RealtimeSubscriptionConfig } from "./RealtimeSubscription";

export class RealtimeService {
  public subscribeToEntity<T = Record<string, unknown>>(
    entity: RealtimeEntity,
    callback: RealtimeCallback<T>,
    customId?: string
  ): string {
    const id = customId || `sub-${entity}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const config: RealtimeSubscriptionConfig = {
      id,
      entity,
      callback: callback as RealtimeCallback,
    };

    realtimeChannelManager.subscribe(config);
    return id;
  }

  public unsubscribe(subscriptionId: string): boolean {
    return realtimeChannelManager.unsubscribe(subscriptionId);
  }

  public getChannelStatus(entity: RealtimeEntity): string {
    return realtimeChannelManager.getChannelStatus(entity);
  }

  public simulateServerEvent(
    table: string,
    eventType: "INSERT" | "UPDATE" | "DELETE",
    newRecord: Record<string, unknown> = {},
    oldRecord: Record<string, unknown> = {}
  ): void {
    realtimeChannelManager.dispatchEvent(table, eventType, newRecord, oldRecord);
  }

  public forceReconnect(): void {
    realtimeChannelManager.handleDisconnect();
  }
}

export const realtimeService = new RealtimeService();
