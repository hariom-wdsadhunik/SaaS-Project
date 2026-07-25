import { channelRegistry } from "@/domain/communication/channels/ChannelRegistry";
import { ChannelOrchestrator } from "@/domain/communication/channels/ChannelOrchestrator";

describe("Communication Channel Orchestration Unit Tests", () => {
  test("ChannelRegistry resolves WhatsApp adapter", () => {
    const adapter = channelRegistry.getAdapter("WHATSAPP");
    expect(adapter.channel).toBe("WHATSAPP");
    expect(adapter.supportsTemplates()).toBe(true);
  });

  test("ChannelRegistry resolves Email adapter", () => {
    const adapter = channelRegistry.getAdapter("EMAIL");
    expect(adapter.channel).toBe("EMAIL");
    expect(adapter.validateRecipient("test@example.com")).toBe(true);
    expect(adapter.validateRecipient("invalid-email")).toBe(false);
  });

  test("ChannelOrchestrator validates email recipient correctly", () => {
    expect(ChannelOrchestrator.validateRecipient("EMAIL", "client@domain.com")).toBe(true);
    expect(ChannelOrchestrator.validateRecipient("EMAIL", "bad-recipient")).toBe(false);
  });
});
