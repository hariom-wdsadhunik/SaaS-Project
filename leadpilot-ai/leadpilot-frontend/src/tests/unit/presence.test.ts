import { presenceService } from "@/platform/presence/PresenceService";

describe("User Presence Unit Tests", () => {
  const channelName = "test-presence-room";

  test("tracks user online state and last seen timestamps", () => {
    const presence = presenceService.setUserPresence("usr-1", "Alex Morgan", "ONLINE", channelName);
    expect(presence.userId).toBe("usr-1");
    expect(presence.status).toBe("ONLINE");
    expect(presence.lastSeen).toBeDefined();

    const channel = presenceService.getChannel(channelName);
    expect(channel.getPresences().length).toBe(1);
  });

  test("updates user typing status in presence channel", () => {
    presenceService.setUserPresence("usr-1", "Alex Morgan", "ONLINE", channelName);
    presenceService.setTyping("usr-1", true, channelName);

    const channel = presenceService.getChannel(channelName);
    const user = channel.getPresences().find((p) => p.userId === "usr-1");
    expect(user?.isTyping).toBe(true);
  });

  test("untracks user presence on disconnect", () => {
    presenceService.setUserPresence("usr-2", "Sarah Jenkins", "ONLINE", channelName);
    presenceService.disconnectUser("usr-2", channelName);

    const channel = presenceService.getChannel(channelName);
    const user = channel.getPresences().find((p) => p.userId === "usr-2");
    expect(user?.status).toBe("OFFLINE");
  });
});
