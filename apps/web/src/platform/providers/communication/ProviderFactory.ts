import { CommunicationChannel } from "@/domain/communication/types";
import { CommunicationProvider } from "./CommunicationProvider";
import { whatsAppProvider } from "./WhatsAppProvider";
import { emailProvider } from "./EmailProvider";
import { smsProvider } from "./SMSProvider";

export class ProviderFactory {
  private static providers: Map<CommunicationChannel, CommunicationProvider> = new Map<CommunicationChannel, CommunicationProvider>([
    ["WHATSAPP", whatsAppProvider],
    ["EMAIL", emailProvider],
    ["SMS", smsProvider],
    ["IN_APP", whatsAppProvider],
    ["INTERNAL_NOTE", whatsAppProvider],
  ]);

  public static getProvider(channel: CommunicationChannel): CommunicationProvider {
    const provider = this.providers.get(channel);
    if (!provider) {
      throw new Error(`[ProviderFactory] No communication provider registered for channel: ${channel}`);
    }
    return provider;
  }

  public static registerProvider(channel: CommunicationChannel, provider: CommunicationProvider): void {
    this.providers.set(channel, provider);
  }
}
