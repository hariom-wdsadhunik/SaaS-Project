---
name: project-setup
description: Set up and configure LeadPilot AI project. Use when initializing the project, configuring environment variables, setting up Supabase, or troubleshooting server issues.
---

# LeadPilot AI Project Setup

## Project Structure
```
leadpilot-ai/
├── .env                    # Environment variables (not in git)
├── .gitignore             # Git ignore rules
├── server.js              # Express server
├── package.json           # Dependencies
├── routes/
│   ├── webhook.js         # WhatsApp webhook
│   └── leads.js           # Leads API
├── controllers/
│   ├── whatsappController.js
│   └── leadsController.js
├── services/
│   └── whatsappService.js
├── db/
│   └── supabase.js        # Database config
├── utils/
│   └── parser.js          # Message parser
└── leadpilot-ui/
    └── dashboard.html     # Frontend
```

## Environment Variables (.env)
```
PORT=80
WHATSAPP_TOKEN=your_meta_token
PHONE_ID=your_whatsapp_phone_id
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key
```

## Startup Commands

### Start Server
```bash
cd leadpilot-ai
node server.js
```

### Start with ngrok (for WhatsApp webhook)
```bash
ngrok http 80
```

## Supabase Setup

### Required Table: `leads`
```sql
create table leads (
  id uuid default gen_random_uuid() primary key,
  phone text not null,
  message text,
  budget text,
  location text,
  status text default 'new',
  created_at timestamp default now()
);
```

### RLS Policies
Enable these policies:
- INSERT: Allow anon
- SELECT: Allow anon
- UPDATE: Allow anon

## Troubleshooting

### Port 80 in use
Change PORT in .env to 3000 and update ngrok

### CORS errors
CORS is enabled in server.js for all origins

### Database connection failed
Check SUPABASE_URL and SUPABASE_KEY in .env

### WhatsApp webhook not working
1. Verify ngrok is running
2. Check webhook URL in Meta Developer Console
3. Verify VERIFY_TOKEN matches
