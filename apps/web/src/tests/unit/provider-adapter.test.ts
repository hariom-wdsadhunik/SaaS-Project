import { ProviderFactory } from "@/platform/providers/communication/ProviderFactory";

describe("Communication Provider Adapter Unit Tests", () => {
  test("ProviderFactory returns Meta WhatsApp provider for WHATSAPP channel", () => {
    const provider = ProviderFactory.getProvider("WHATSAPP");
    expect(provider.providerName).toBe("META_WHATSAPP_BUSINESS");
    expect(provider.channel).toBe("WHATSAPP");
  });

  test("ProviderFactory returns SendGrid provider for EMAIL channel", () => {
    const provider = ProviderFactory.getProvider("EMAIL");
    expect(provider.providerName).toBe("SENDGRID_EMAIL");
    expect(provider.channel).toBe("EMAIL");
  });

  test("ProviderFactory returns Twilio provider for SMS channel", () => {
    const provider = ProviderFactory.getProvider("SMS");
    expect(provider.providerName).toBe("TWILIO_SMS");
    expect(provider.channel).toBe("SMS");
  });

  test("WhatsAppProvider validates webhook signatures and parses inbound payloads", () => {
    const provider = ProviderFactory.getProvider("WHATSAPP");
    const valid = provider.verifyWebhookSignature({ "x-hub-signature-256": "sha256=test" }, "{}");
    expect(valid).toBe(true);

    const parsed = provider.parseIncomingWebhook({ object: "whatsapp_business_account" });
    expect(parsed).not.toBeNull();
    expect(parsed?.channel).toBe("WHATSAPP");
  });
});
