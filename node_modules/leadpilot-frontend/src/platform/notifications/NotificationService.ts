import { CreateNotificationInput, NotificationPayload } from "./NotificationTypes";
import { notificationRepository } from "./NotificationRepository";
import { notificationPreferencesManager } from "./NotificationPreferences";

export class NotificationService {
  public async sendNotification(input: CreateNotificationInput): Promise<NotificationPayload | null> {
    const channel = input.channel || "IN_APP";
    const priority = input.priority || "MEDIUM";

    const isEnabled = notificationPreferencesManager.isChannelEnabled(input.userId, channel);
    if (!isEnabled) {
      console.log(`[NotificationService] Channel ${channel} is disabled for user ${input.userId}`);
      return null;
    }

    const notification: NotificationPayload = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId: input.userId,
      title: input.title,
      message: input.message,
      channel,
      priority,
      isRead: false,
      actionUrl: input.actionUrl,
      metadata: input.metadata,
      createdAt: new Date().toISOString(),
    };

    await notificationRepository.save(notification);

    // Channel Abstractions (No provider drivers required yet)
    switch (channel) {
      case "EMAIL":
        console.log(`[NotificationService:EMAIL Architecture Driver] Email queued for user ${input.userId}`);
        break;
      case "SMS":
        console.log(`[NotificationService:SMS Architecture Driver] SMS queued for user ${input.userId}`);
        break;
      case "WHATSAPP":
        console.log(`[NotificationService:WHATSAPP Architecture Driver] WhatsApp queued for user ${input.userId}`);
        break;
      case "PUSH":
        console.log(`[NotificationService:PUSH Architecture Driver] Push notification dispatched for user ${input.userId}`);
        break;
      case "IN_APP":
      default:
        console.log(`[NotificationService:IN_APP] In-app notification delivered to user ${input.userId}`);
        break;
    }

    return notification;
  }

  public async getUserNotifications(userId: string): Promise<NotificationPayload[]> {
    return notificationRepository.getByUserId(userId);
  }

  public async markAsRead(id: string): Promise<boolean> {
    return notificationRepository.markAsRead(id);
  }

  public async getUnreadCount(userId: string): Promise<number> {
    return notificationRepository.getUnreadCount(userId);
  }
}

export const notificationService = new NotificationService();
