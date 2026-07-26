import { NotificationChannel } from "./NotificationTypes";

export interface UserNotificationPreferences {
  userId: string;
  enabledChannels: Record<NotificationChannel, boolean>;
  muteAll: boolean;
}

export class NotificationPreferencesManager {
  private preferencesMap: Map<string, UserNotificationPreferences> = new Map();

  public getPreferences(userId: string): UserNotificationPreferences {
    if (!this.preferencesMap.has(userId)) {
      this.preferencesMap.set(userId, {
        userId,
        enabledChannels: {
          IN_APP: true,
          EMAIL: true,
          SMS: false,
          WHATSAPP: true,
          PUSH: true,
        },
        muteAll: false,
      });
    }
    return this.preferencesMap.get(userId)!;
  }

  public updatePreferences(
    userId: string,
    updates: Partial<UserNotificationPreferences>
  ): UserNotificationPreferences {
    const current = this.getPreferences(userId);
    const updated = { ...current, ...updates };
    this.preferencesMap.set(userId, updated);
    return updated;
  }

  public isChannelEnabled(userId: string, channel: NotificationChannel): boolean {
    const prefs = this.getPreferences(userId);
    if (prefs.muteAll) return false;
    return prefs.enabledChannels[channel] ?? true;
  }
}

export const notificationPreferencesManager = new NotificationPreferencesManager();
