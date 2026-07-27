# Controllers

This folder contains request handlers for the LeadPilot AI API.

## Files

- **whatsappController.js** - Handles WhatsApp webhook verification and incoming messages
  - `verifyWebhook()` - Validates webhook token with Meta
  - `handleMessage()` - Processes incoming WhatsApp messages, parses leads, saves to database

- **leadsController.js** - Manages lead CRUD operations
  - `getLeads()` - Fetch all leads from Supabase
  - `getSingleLead()` - Fetch a specific lead by ID
  - `updateLeadStatus()` - Update lead status (new, contacted, follow-up, closed)

## Flow

1. WhatsApp message → `whatsappController.handleMessage()`
2. Parse message (budget, location) → Save to Supabase
3. Dashboard/API → `leadsController` for lead management
