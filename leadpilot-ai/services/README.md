# Services

External API integrations for LeadPilot AI.

## Files

- **whatsappService.js** - WhatsApp Cloud API integration
  - `sendMessage()` - Send WhatsApp messages to leads
  - Uses Meta Graph API v18.0
  - Requires `WHATSAPP_TOKEN` and `PHONE_ID` in .env

## Environment Variables

```
WHATSAPP_TOKEN=your_meta_access_token
PHONE_ID=your_whatsapp_phone_number_id
```
