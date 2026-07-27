import { WorkflowTriggerType } from "./WorkflowRule";

export type EventCallback = (payload: Record<string, unknown>) => void;

export class AutomationEventBus {
  private subscribers: Map<WorkflowTriggerType, EventCallback[]> = new Map();

  subscribe(trigger: WorkflowTriggerType, callback: EventCallback): void {
    if (!this.subscribers.has(trigger)) {
      this.subscribers.set(trigger, []);
    }
    this.subscribers.get(trigger)!.push(callback);
  }

  publish(trigger: WorkflowTriggerType, payload: Record<string, unknown>): void {
    const callbacks = this.subscribers.get(trigger) || [];
    callbacks.forEach((cb) => cb(payload));
  }
}

export const automationEventBus = new AutomationEventBus();
