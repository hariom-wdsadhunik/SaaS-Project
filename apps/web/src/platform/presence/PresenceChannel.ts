import { UserPresenceState } from "./UserPresence";

export class PresenceChannel {
  private channelName: string;
  private presences: Map<string, UserPresenceState> = new Map();
  private listeners: Set<(presences: UserPresenceState[]) => void> = new Set();

  constructor(channelName: string) {
    this.channelName = channelName;
  }

  public trackUser(presence: UserPresenceState): void {
    this.presences.set(presence.userId, presence);
    this.notify();
  }

  public untrackUser(userId: string): void {
    const p = this.presences.get(userId);
    if (p) {
      p.status = "OFFLINE";
      p.lastSeen = new Date().toISOString();
      this.presences.set(userId, p);
      this.notify();
    }
  }

  public getPresences(): UserPresenceState[] {
    return Array.from(this.presences.values());
  }

  public subscribe(callback: (presences: UserPresenceState[]) => void): () => void {
    this.listeners.add(callback);
    callback(this.getPresences());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(): void {
    const current = this.getPresences();
    this.listeners.forEach((fn) => fn(current));
  }
}
