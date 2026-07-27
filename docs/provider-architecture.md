# Messaging Provider Architecture & Adapter Pattern

**Module:** Provider Architecture  
**Location:** `src/platform/providers/communication/`  

---

## 1. Provider Isolation Principle

Business logic within CRM repositories or UI components never interacts with vendor SDKs directly. All messaging calls pass through the `CommunicationProvider` interface:

```typescript
export interface CommunicationProvider {
  channel: CommunicationChannel;
  providerName: string;
  sendMessage(options: SendMessageOptions): Promise<SendMessageResult>;
  verifyWebhookSignature(headers: Record<string, string>, rawBody: string): boolean;
  parseIncomingWebhook(payload: Record<string, unknown>): Partial<Message> | null;
}
```

## 2. Factory Pattern Dispatch

`ProviderFactory.getProvider(channel)` dynamically resolves the correct adapter (`WhatsAppProvider`, `EmailProvider`, or `SMSProvider`) based on the target channel.
