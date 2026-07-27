# Routes

API route definitions for LeadPilot AI.

## Files

- **webhook.js** - WhatsApp Cloud API webhook endpoints
  - `GET /webhook` - Webhook verification (required by Meta)
  - `POST /webhook` - Receive incoming WhatsApp messages

- **leads.js** - Lead management endpoints
  - `GET /leads` - List all leads
  - `GET /leads/:id` - Get specific lead
  - `PATCH /leads/:id` - Update lead status

## Usage

Routes are mounted in `server.js`:
```javascript
app.use("/webhook", webhookRoutes);
app.use("/leads", leadsRoutes);
```
