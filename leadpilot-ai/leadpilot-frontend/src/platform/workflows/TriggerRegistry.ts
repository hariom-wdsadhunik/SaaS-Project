import { TriggerEvent } from "./WorkflowDefinition";

export class TriggerRegistry {
  private static registeredTriggers: Set<TriggerEvent> = new Set([
    "LeadCreated",
    "LeadUpdated",
    "DealWon",
    "DealLost",
    "AppointmentCompleted",
    "MessageReceived",
    "DocumentUploaded",
    "TaskCompleted",
  ]);

  public static isSupported(trigger: string): trigger is TriggerEvent {
    return this.registeredTriggers.has(trigger as TriggerEvent);
  }
}
