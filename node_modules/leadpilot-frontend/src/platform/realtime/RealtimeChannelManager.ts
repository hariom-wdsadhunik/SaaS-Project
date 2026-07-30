import { RealtimeSubscriptionConfig, RealtimeSubscriptionPayload } from "./RealtimeSubscription";
import { RealtimeEventMapper } from "./RealtimeEventMapper";

export class RealtimeChannelManager {
  private subscriptions: Map<string, RealtimeSubscriptionConfig> = new Map();
  private channelState: Map<string, "CONNECTED" | "DISCONNECTED" | "CONNECTING"> = new Map();
  private isReconnecting = false;

  public subscribe(config: RealtimeSubscriptionConfig): boolean {
    if (this.subscriptions.has(config.id)) {
      console.warn(`[RealtimeChannelManager] Prevented duplicate subscription for ID: ${config.id}`);
      return false; // Prevent duplicate
    }
    this.subscriptions.set(config.id, config);
    this.channelState.set(config.entity, "CONNECTED");
    return true;
  }

  public unsubscribe(subscriptionId: string): boolean {
    if (!this.subscriptions.has(subscriptionId)) {
      return false;
    }
    const config = this.subscriptions.get(subscriptionId);
    this.subscriptions.delete(subscriptionId);

    if (config) {
      const entityRemaining = Array.from(this.subscriptions.values()).some(
        (sub) => sub.entity === config.entity
      );
      if (!entityRemaining) {
        this.channelState.delete(config.entity);
      }
    }
    return true;
  }

  public dispatchEvent(table: string, eventType: "INSERT" | "UPDATE" | "DELETE", newRecord: Record<string, unknown>, oldRecord: Record<string, unknown>): void {
    const payload = RealtimeEventMapper.mapPayload({ table, eventType, new: newRecord, old: oldRecord });
    
    this.subscriptions.forEach((config) => {
      if (config.entity === payload.entity || config.entity === "dashboard") {
        try {
          config.callback(payload as RealtimeSubscriptionPayload);
        } catch (err) {
          console.error(`[RealtimeChannelManager] Error in subscription callback ${config.id}:`, err);
        }
      }
    });
  }

  public getActiveSubscriptionCount(): number {
    return this.subscriptions.size;
  }

  public getChannelStatus(entity: string): "CONNECTED" | "DISCONNECTED" | "CONNECTING" {
    return this.channelState.get(entity) || "DISCONNECTED";
  }

  public handleDisconnect(): void {
    if (this.isReconnecting) return;
    this.isReconnecting = true;
    this.channelState.forEach((_, key) => this.channelState.set(key, "CONNECTING"));

    setTimeout(() => {
      this.channelState.forEach((_, key) => this.channelState.set(key, "CONNECTED"));
      this.isReconnecting = false;
    }, 100);
  }

  public clearAll(): void {
    this.subscriptions.clear();
    this.channelState.clear();
  }
}

export const realtimeChannelManager = new RealtimeChannelManager();
