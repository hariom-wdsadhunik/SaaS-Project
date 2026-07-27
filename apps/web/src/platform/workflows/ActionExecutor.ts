import { WorkflowAction } from "./WorkflowDefinition";
import { notificationService } from "@/platform/notifications/NotificationService";
import { CommunicationFacade } from "@/domain/communication/CommunicationFacade";

export class ActionExecutor {
  public static async executeAction(action: WorkflowAction, _payload: Record<string, unknown>): Promise<boolean> {
    console.log(`[ActionExecutor] Executing action ${action.type} with params:`, action.params);

    switch (action.type) {
      case "AssignUser":
        console.log(`[AssignUser] Reassigning record to user ${action.params.userId}`);
        break;

      case "CreateTask":
        console.log(`[CreateTask] Creating follow-up task: ${action.params.title}`);
        break;

      case "SendNotification":
        await notificationService.sendNotification({
          userId: String(action.params.userId || "agent-001"),
          title: String(action.params.title || "Workflow Alert"),
          message: String(action.params.message || "Automated workflow triggered"),
          channel: "IN_APP",
          priority: "MEDIUM",
        });
        break;

      case "SendEmail":
        await CommunicationFacade.sendMessage({
          conversationId: `conv-wf-${Date.now()}`,
          channel: "EMAIL",
          recipient: String(action.params.recipientEmail || "client@leadpilot.ai"),
          content: String(action.params.body || "Automated Workflow Email Notification"),
        });
        break;

      case "SendWhatsApp":
        await CommunicationFacade.sendMessage({
          conversationId: `conv-wf-${Date.now()}`,
          channel: "WHATSAPP",
          recipient: String(action.params.phone || "+971500000000"),
          content: String(action.params.message || "Automated WhatsApp Notification"),
        });
        break;

      case "UpdateRecord":
        console.log(`[UpdateRecord] Updating entity ${action.params.entityId} fields`, action.params.fields);
        break;

      case "CreateAppointment":
        console.log(`[CreateAppointment] Creating appointment: ${action.params.title}`);
        break;

      default:
        console.warn(`[ActionExecutor] Unknown action type: ${action.type}`);
    }

    return true;
  }
}
