# LeadPilot AI CRM — Omnichannel Communication Platform

**Module:** Omnichannel Communication Platform  
**Version:** v0.7.0  

---

## 1. Architectural Vision

The LeadPilot AI CRM Communication Platform delivers unified inbox capabilities across Meta WhatsApp, SendGrid Email, and Twilio SMS. Every interaction is mapped to conversations, messages, and timeline events for full CRM context.

```
+-----------------------------------------------------------------------------------+
|                        Omnichannel Communication Platform                         |
+-------------------+-------------------+-------------------+-----------------------+
|  WhatsAppAdapter  |   EmailAdapter    |    SMSAdapter     |  InAppNotification    |
| (Meta Webhooks)   | (SendGrid Thread) |  (Twilio SMS)     |  (Realtime Badge)     |
+-------------------+-------------------+-------------------+-----------------------+
                    |                   |                   |
                    v                   v                   v
+-----------------------------------------------------------------------------------+
|                     SupabaseCommunicationRepository & RLS                        |
+-----------------------------------------------------------------------------------+
```

---

## 2. Supported Messaging Channels

1. **WhatsApp Business API (`WHATSAPP`)**: Meta WhatsApp Business integration adapter.
2. **Email (`EMAIL`)**: SendGrid transactional and marketing email adapter.
3. **SMS (`SMS`)**: Twilio SMS delivery and status callback adapter.
4. **In-App Messaging (`IN_APP`)**: Internal platform messaging.
