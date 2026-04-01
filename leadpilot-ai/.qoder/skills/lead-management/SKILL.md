---
name: lead-management
description: Manage real estate leads in LeadPilot AI. Use when adding leads, updating lead status, searching leads, or working with the lead dashboard and WhatsApp webhook integration.
---

# Lead Management

## Overview
LeadPilot AI is a real estate lead management system that captures leads from WhatsApp, stores them in Supabase, and provides a web dashboard for management.

## API Endpoints

### Webhook (WhatsApp Integration)
- **POST** `/webhook` - Receive leads from WhatsApp
- Body format:
```json
{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "919999999999",
          "text": { "body": "2BHK in Mumbai under 80L" }
        }]
      }
    }]
  }]
}
```

### Leads API
- **GET** `/leads` - List all leads
- **GET** `/leads/:id` - Get specific lead
- **PATCH** `/leads/:id` - Update lead status

## Lead Status Values
- `new` - New lead, not yet contacted
- `contacted` - Initial contact made
- `follow-up` - Requires follow-up
- `closed` - Deal closed or rejected

## Message Parsing
The system automatically extracts:
- **Budget**: Patterns like "80L", "1.5Cr", "80 lakh"
- **Location**: Text after "in", "at", or "near"

## Common Tasks

### Add Test Lead via API
```bash
curl -X POST http://localhost:80/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "919999999999",
            "text": { "body": "2BHK in Mumbai under 80L" }
          }]
        }
      }]
    }]
  }'
```

### Update Lead Status
```bash
curl -X PATCH http://localhost:80/leads/LEAD_ID \
  -H "Content-Type: application/json" \
  -d '{"status": "contacted"}'
```

## Dashboard
Access at: `http://localhost:80/dashboard`
Features:
- Real-time lead display
- Status filtering
- Search functionality
- Dark mode toggle
- Add leads manually
