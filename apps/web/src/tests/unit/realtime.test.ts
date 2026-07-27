import { realtimeService } from "@/platform/realtime/RealtimeService";
import { realtimeChannelManager } from "@/platform/realtime/RealtimeChannelManager";
import { RealtimeSubscriptionPayload } from "@/platform/realtime/RealtimeSubscription";

describe("Realtime Infrastructure Unit Tests", () => {
  beforeEach(() => {
    realtimeChannelManager.clearAll();
  });

  test("subscribes to entity channels cleanly", () => {
    const subId = realtimeService.subscribeToEntity("leads", () => {});
    expect(subId).toBeDefined();
    expect(realtimeChannelManager.getActiveSubscriptionCount()).toBe(1);
    expect(realtimeService.getChannelStatus("leads")).toBe("CONNECTED");
  });

  test("prevents duplicate subscription registration", () => {
    const success1 = realtimeChannelManager.subscribe({
      id: "dup-1",
      entity: "deals",
      callback: () => {},
    });
    const success2 = realtimeChannelManager.subscribe({
      id: "dup-1",
      entity: "deals",
      callback: () => {},
    });

    expect(success1).toBe(true);
    expect(success2).toBe(false);
    expect(realtimeChannelManager.getActiveSubscriptionCount()).toBe(1);
  });

  test("unsubscribes and cleans up channel state", () => {
    const subId = realtimeService.subscribeToEntity("tasks", () => {}, "test-task-sub");
    expect(realtimeChannelManager.getActiveSubscriptionCount()).toBe(1);

    const unsubscribed = realtimeService.unsubscribe(subId);
    expect(unsubscribed).toBe(true);
    expect(realtimeChannelManager.getActiveSubscriptionCount()).toBe(0);
    expect(realtimeService.getChannelStatus("tasks")).toBe("DISCONNECTED");
  });

  test("dispatches live payload to subscribers", () => {
    let receivedPayload: RealtimeSubscriptionPayload | null = null;
    realtimeService.subscribeToEntity("leads", (payload) => {
      receivedPayload = payload;
    });

    realtimeService.simulateServerEvent("leads", "INSERT", { id: "lead-99", name: "Sarah Connor" });

    expect(receivedPayload).not.toBeNull();
    expect(receivedPayload?.entity).toBe("leads");
    expect(receivedPayload?.eventType).toBe("INSERT");
  });

  test("handles automatic reconnection workflow", () => {
    realtimeService.subscribeToEntity("appointments", () => {});
    expect(realtimeService.getChannelStatus("appointments")).toBe("CONNECTED");

    realtimeService.forceReconnect();
    expect(realtimeService.getChannelStatus("appointments")).toBe("CONNECTING");
  });
});
