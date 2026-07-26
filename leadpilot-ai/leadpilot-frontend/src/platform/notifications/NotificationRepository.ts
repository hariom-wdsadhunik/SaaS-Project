import { NotificationPayload } from "./NotificationTypes";

export class NotificationRepository {
  private notifications: Map<string, NotificationPayload> = new Map();

  public async save(notification: NotificationPayload): Promise<NotificationPayload> {
    this.notifications.set(notification.id, notification);
    return notification;
  }

  public async getByUserId(userId: string): Promise<NotificationPayload[]> {
    return Array.from(this.notifications.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async markAsRead(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }

  public async getUnreadCount(userId: string): Promise<number> {
    const list = await this.getByUserId(userId);
    return list.filter((n) => !n.isRead).length;
  }

  public async clearAll(userId: string): Promise<void> {
    const list = await this.getByUserId(userId);
    list.forEach((n) => this.notifications.delete(n.id));
  }
}

export const notificationRepository = new NotificationRepository();
