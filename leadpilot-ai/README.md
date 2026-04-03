# LeadPilot AI

AI-powered Real Estate CRM with lead management, automation, and analytics.

## Features

- **Lead Management**: Capture, track, and nurture leads
- **WhatsApp Integration**: Receive leads via WhatsApp Business API
- **Email & SMS**: Send bulk emails and SMS to leads
- **Task Management**: Kanban-style task board with drag-and-drop
- **Calendar**: Schedule appointments with month/week/day views
- **Deal Pipeline**: Track deals from initial to closed won/lost
- **Team Collaboration**: Multi-tenant system for team management
- **Email Templates**: Create and manage email templates with variables
- **Automation Sequences**: Set up lead nurturing sequences
- **Analytics Dashboard**: Track performance and AI insights
- **CSV Import/Export**: Bulk import/export leads
- **PDF Reports**: Generate performance reports

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Auth**: JWT with multi-tenant support
- **Frontend**: HTML5, Tailwind CSS, Chart.js
- **Integrations**: WhatsApp Business API, Twilio SMS, SendGrid Email
- **Deployment**: Vercel (serverless)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account
- WhatsApp Business API access (optional)
- Twilio account (optional)
- SendGrid account (optional)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd leadpilot-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
```

### Environment Variables

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# JWT
JWT_SECRET=your_jwt_secret

# WhatsApp (optional)
WHATSAPP_TOKEN=your_whatsapp_token
WHATSAPP_VERIFY_TOKEN=your_verify_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Email (SendGrid - optional)
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourdomain.com

# SMS (Twilio - optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# Server
PORT=80
NODE_ENV=development
```

### Run Development Server

```bash
npm run dev
# or
node server.js
```

Server runs on http://localhost:80

## API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": { "id": "...", "email": "...", "name": "..." }
}
```

#### Get Profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Leads

#### Get All Leads
```http
GET /api/leads?status=new&limit=50&offset=0
Authorization: Bearer <token>
```

#### Create Lead
```http
POST /api/leads
Authorization: Bearer <token>
Content-Type: application/json

{
  "phone": "+919876543210",
  "name": "John Doe",
  "email": "john@example.com",
  "location": "Mumbai",
  "budget": "50-70 Lacs",
  "message": "Looking for 2BHK in Andheri"
}
```

#### Update Lead
```http
PATCH /api/leads/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "contacted",
  "score": 85
}
```

#### Delete Lead
```http
DELETE /api/leads/:id
Authorization: Bearer <token>
```

### Tasks

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Follow up with lead",
  "description": "Call John about the property",
  "task_type": "Call",
  "priority": "High",
  "due_date": "2026-04-05T10:00:00Z",
  "lead_id": "lead-uuid"
}
```

#### Update Task Status
```http
PATCH /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Completed"
}
```

### Appointments

#### Get All Appointments
```http
GET /api/appointments
Authorization: Bearer <token>
```

#### Create Appointment
```http
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Site Visit",
  "appointment_type": "Site Visit",
  "scheduled_at": "2026-04-05T10:00:00Z",
  "duration_minutes": 60,
  "location": "Property Address",
  "notes": "Bring documents",
  "lead_id": "lead-uuid"
}
```

### Deals

#### Get All Deals
```http
GET /api/deals
Authorization: Bearer <token>
```

#### Create Deal
```http
POST /api/deals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "2BHK in Andheri",
  "deal_value": 6500000,
  "commission_percentage": 2,
  "deal_stage": "Initial",
  "lead_id": "lead-uuid",
  "expected_close_date": "2026-05-01"
}
```

### Email

#### Send Email
```http
POST /api/email/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "to": "lead@example.com",
  "subject": "Property Inquiry",
  "html": "<h1>Hello!</h1><p>We have properties for you...</p>"
}
```

#### Send to Lead
```http
POST /api/email/lead/:leadId
Authorization: Bearer <token>
Content-Type: application/json

{
  "template_id": "template-uuid"
}
```

#### Bulk Send
```http
POST /api/email/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "template_id": "template-uuid",
  "lead_ids": ["uuid1", "uuid2", "uuid3"]
}
```

### Email Templates

#### Get Templates
```http
GET /api/email/templates
Authorization: Bearer <token>
```

#### Create Template
```http
POST /api/email/templates
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Welcome Email",
  "subject": "Welcome to {{company_name}}!",
  "body": "<h1>Hi {{name}}!</h1><p>Thank you for reaching out...</p>",
  "type": "email"
}
```

### SMS

#### Send SMS
```http
POST /api/sms/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "to": "+919876543210",
  "message": "We have found properties matching your requirements!"
}
```

### Sequences

#### Get Sequences
```http
GET /api/sequences
Authorization: Bearer <token>
```

#### Create Sequence
```http
POST /api/sequences
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Lead Nurture",
  "description": "Follow up with new leads over 7 days",
  "steps": [
    { "day": 1, "action": "email", "template_id": "welcome" },
    { "day": 3, "action": "sms", "message": "Hi! Any questions?" },
    { "day": 7, "action": "email", "template_id": "followup" }
  ]
}
```

### Reports

#### Generate Report
```http
GET /api/reports/pdf?type=leads&start_date=2026-01-01&end_date=2026-04-01
Authorization: Bearer <token>
```

### Import/Export

#### Import Leads (CSV)
```http
POST /api/import/leads
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <csv_file>
```

#### Export Leads (CSV)
```http
GET /api/import/export?format=csv
Authorization: Bearer <token>
```

### Settings

#### Get Settings
```http
GET /api/settings
Authorization: Bearer <token>
```

#### Update Settings
```http
POST /api/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "settings": {
    "newLeadAlert": true,
    "dailySummary": false
  }
}
```

### Team

#### Get Team
```http
GET /api/team
Authorization: Bearer <token>
```

#### Invite Member
```http
POST /api/team/invite
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "member@example.com",
  "role": "member"
}
```

### Webhook (WhatsApp)

```http
GET /webhook?hub.mode=subscribe&hub.verify_token=<token>&hub.challenge=<challenge>
```

```http
POST /webhook
Content-Type: application/json

{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "919876543210",
          "text": { "body": "I'm interested in 2BHK in Mumbai" }
        }]
      }
    }]
  }]
}
```

## Frontend Pages

- `/dashboard` - Main CRM dashboard with leads
- `/calendar` - Calendar with appointments
- `/tasks` - Kanban task board
- `/deals` - Deal pipeline
- `/analytics` - Analytics and insights
- `/settings` - User settings and integrations
- `/email-templates` - Email/SMS template management
- `/team` - Team management
- `/documents` - Document manager
- `/onboarding` - New user onboarding wizard
- `/login` - User login
- `/register` - User registration

## Deployment

### Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Database Setup

Run the migration SQL in your Supabase SQL Editor:

```bash
# Copy from database-migration.sql
# Run in Supabase SQL Editor
```

## License

MIT License
