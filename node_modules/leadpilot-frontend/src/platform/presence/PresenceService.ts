import { PresenceChannel } from "./PresenceChannel";
import { OnlineStatus, UserPresenceState } from "./UserPresence";

export class PresenceService {
  private channels: Map<string, PresenceChannel> = new Map();

  public getChannel(channelName = "global-presence"): PresenceChannel {
    if (!this.channels.has(channelName)) {
      this.channels.set(channelName, new PresenceChannel(channelName));
    }
    return this.channels.get(channelName)!;
  }

  public setUserPresence(
    userId: string,
    userName: string,
    status: OnlineStatus,
    channelName = "global-presence"
  ): UserPresenceState {
    const channel = this.getChannel(channelName);
    const presence: UserPresenceState = {
      userId,
      userName,
      status,
      lastSeen: new Date().toISOString(),
    };
    channel.trackUser(presence);
    return presence;
  }

  public setTyping(userId: string, isTyping: boolean, channelName = "global-presence"): void {
    const channel = this.getChannel(channelName);
    const presences = channel.getPresences();
    const existing = presences.find((p) => p.userId === userId);
    if (existing) {
      existing.isTyping = isTyping;
      channel.trackUser(existing);
    }
  }

  public disconnectUser(userId: string, channelName = "global-presence"): void {
    const channel = this.getChannel(channelName);
    channel.untrackUser(userId);
  }
}

export const presenceService = new PresenceService();
