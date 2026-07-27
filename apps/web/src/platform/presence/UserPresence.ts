export type OnlineStatus = "ONLINE" | "OFFLINE" | "AWAY" | "BUSY";

export interface UserPresenceState {
  userId: string;
  userName: string;
  status: OnlineStatus;
  lastSeen: string;
  isTyping?: boolean;
  activeChannel?: string;
  metadata?: Record<string, unknown>;
}
