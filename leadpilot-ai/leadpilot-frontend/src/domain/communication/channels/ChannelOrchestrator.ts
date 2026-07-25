import { CommunicationChannel, MessageEntity } from "../types";
import { channelRegistry } from "./ChannelRegistry";
import { ChannelSendMessageInput } from "./ChannelAdapter";
import { platformAuditLogger } from "@/platform/audit";

export const ChannelOrchestrator = {
  async send(channel: CommunicationChannel, input: ChannelSendMessageInput): Promise<MessageEntity> {
    const adapter = channelRegistry.getAdapter(channel);
    const isValid = adapter.validateRecipient(input.recipient);

    if (!isValid) {
      throw new Error(`Invalid recipient format for ${channel} channel.`);
    }

    const message = await adapter.sendMessage(input);

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "SYSTEM",
      entityIds: [message.id],
      payload: { channel, conversationId: input.conversationId },
      timestamp: new Date().toISOString(),
    });

    return message;
  },

  validateRecipient(channel: CommunicationChannel, recipient: string): boolean {
    const adapter = channelRegistry.getAdapter(channel);
    return adapter.validateRecipient(recipient);
  },
};
