import { eventBus } from "@/platform/events/EventBus";
import { DOMAIN_EVENTS, TaskCompletedPayload } from "@/platform/events/EventRegistry";

describe("Domain EventBus Unit Tests", () => {
  beforeEach(() => {
    eventBus.clear();
  });

  test("publishes typed domain events to registered subscribers", async () => {
    let capturedEvent: unknown = null;

    eventBus.subscribe<TaskCompletedPayload>(DOMAIN_EVENTS.TASK_COMPLETED, (evt) => {
      capturedEvent = evt;
    });

    const event = await eventBus.publish<TaskCompletedPayload>(
      DOMAIN_EVENTS.TASK_COMPLETED,
      "task-88",
      {
        taskId: "task-88",
        title: "Draft VIP Purchase Agreement",
        completedBy: "Alex Morgan",
      }
    );

    expect(event.id).toBeDefined();
    expect(capturedEvent).not.toBeNull();
  });

  test("isolates subscriber execution errors without failing bus publish", async () => {
    let secondSubscriberFired = false;

    eventBus.subscribe(DOMAIN_EVENTS.LEAD_CREATED, () => {
      throw new Error("Broken subscriber simulation");
    });

    eventBus.subscribe(DOMAIN_EVENTS.LEAD_CREATED, () => {
      secondSubscriberFired = true;
    });

    await expect(
      eventBus.publish(DOMAIN_EVENTS.LEAD_CREATED, "lead-01", { leadId: "lead-01" })
    ).resolves.toBeDefined();

    expect(secondSubscriberFired).toBe(true);
  });

  test("unsubscribes handlers using returned token", async () => {
    let count = 0;
    const token = eventBus.subscribe(DOMAIN_EVENTS.DEAL_WON, () => {
      count++;
    });

    await eventBus.publish(DOMAIN_EVENTS.DEAL_WON, "deal-1", { value: 50000 });
    expect(count).toBe(1);

    token.unsubscribe();
    await eventBus.publish(DOMAIN_EVENTS.DEAL_WON, "deal-2", { value: 100000 });
    expect(count).toBe(1);
  });
});
