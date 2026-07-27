import { notificationService } from "@/platform/notifications/NotificationService";
import { notificationPreferencesManager } from "@/platform/notifications/NotificationPreferences";

describe("Notification Engine Unit Tests", () => {
  const userId = "test-user-1";

  test("sends in-app notifications and increments unread count", async () => {
    const notification = await notificationService.sendNotification({
      userId,
      title: "Contract Signed",
      message: "Penthouse agreement signed by buyer.",
      channel: "IN_APP",
      priority: "HIGH",
    });

    expect(notification).not.toBeNull();
    expect(notification?.userId).toBe(userId);
    expect(notification?.isRead).toBe(false);

    const unread = await notificationService.getUnreadCount(userId);
    expect(unread).toBeGreaterThan(0);
  });

  test("marks notification as read", async () => {
    const notif = await notificationService.sendNotification({
      userId,
      title: "New Lead Assigned",
      message: "Lead Marcus Vance assigned to you.",
    });

    expect(notif).not.toBeNull();
    const marked = await notificationService.markAsRead(notif!.id);
    expect(marked).toBe(true);

    const list = await notificationService.getUserNotifications(userId);
    const updated = list.find((n) => n.id === notif!.id);
    expect(updated?.isRead).toBe(true);
  });

  test("respects channel enablement in user notification preferences", async () => {
    notificationPreferencesManager.updatePreferences(userId, {
      enabledChannels: {
        IN_APP: true,
        EMAIL: false,
        SMS: false,
        WHATSAPP: true,
        PUSH: true,
      },
      muteAll: false,
    });

    const result = await notificationService.sendNotification({
      userId,
      title: "Email Notification Test",
      message: "Should be blocked by preference",
      channel: "EMAIL",
    });

    expect(result).toBeNull();
  });
});
