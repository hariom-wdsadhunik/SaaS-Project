export type NotificationChannel = "IN_APP" | "EMAIL" | "SMS" | "WHATSAPP" | "PUSH";

export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface NotificationPayload {
  id: string;
  userId: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  priority: NotificationPriority;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  channel?: NotificationChannel;
  priority?: NotificationPriority;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}
