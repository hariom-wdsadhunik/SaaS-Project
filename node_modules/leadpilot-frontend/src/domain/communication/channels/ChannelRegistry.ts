import { CommunicationChannel } from "../types";
import { ChannelAdapter } from "./ChannelAdapter";
import { WhatsAppAdapter } from "./WhatsAppAdapter";
import { EmailAdapter } from "./EmailAdapter";
import { SMSAdapter } from "./SMSAdapter";
import { InternalNoteAdapter } from "./InternalNoteAdapter";

export class ChannelRegistry {
  private adapters: Map<CommunicationChannel, ChannelAdapter> = new Map();

  constructor() {
    this.register(new WhatsAppAdapter());
    this.register(new EmailAdapter());
    this.register(new SMSAdapter());
    this.register(new InternalNoteAdapter());
  }

  register(adapter: ChannelAdapter): void {
    this.adapters.set(adapter.channel, adapter);
  }

  getAdapter(channel: CommunicationChannel): ChannelAdapter {
    const adapter = this.adapters.get(channel);
    if (!adapter) throw new Error(`No registered adapter for channel: ${channel}`);
    return adapter;
  }
}

export const channelRegistry = new ChannelRegistry();
