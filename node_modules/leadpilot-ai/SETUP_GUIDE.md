# LeadPilot AI - Production Setup Guide

## 🚀 Professional Features Implemented

### 1. **Backend Architecture**
- ✅ Express.js with security middleware (Helmet, CORS, Rate Limiting)
- ✅ Proper error handling and logging
- ✅ RESTful API architecture
- ✅ JWT authentication system
- ✅ Supabase database integration
- ✅ WhatsApp Business API integration

### 2. **Security Features**
- ✅ Helmet.js for HTTP headers security
- ✅ CORS configuration for production
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Input validation and sanitization
- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication

### 3. **WhatsApp Integration**
- ✅ Official WhatsApp Business API (Meta)
- ✅ QR code connection flow
- ✅ Auto-reply settings
- ✅ Message templates support
- ✅ Real-time message handling via webhooks
- ✅ Lead creation from WhatsApp messages
- ✅ AI-powered lead scoring based on message content

### 4. **Database Schema**
All tables are ready in Supabase:
- `users` - User accounts
- `leads` - Lead management
- `properties` - Property listings
- `appointments` - Scheduled visits
- `tasks` - Task management
- `notes` - Lead notes
- `documents` - Document storage
- `deals` - Deal/commission tracking
- `activity_logs` - Audit trail
- `whatsapp_logs` - Message history
- `settings` - User preferences

---

## ⚙️ Configuration Required

### Step 1: Get Your Supabase Service Role Key

1. Go to your Supabase project: https://supabase.com/dashboard/project/xsfgtmypzxqfkmtzdvje
2. Navigate to **Settings** → **API**
3. Copy the **service_role** key (NOT the anon/public key)
4. Update `.env` file:
   ```
   SUPABASE_SERVICE_KEY=your_service_role_key_here
   ```

### Step 2: Generate JWT Secret

Generate a random secret key:
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((Get-Random -Count 32))
```

Update `.env` file:
```
JWT_SECRET=your_generated_secret_here
```

### Step 3: Configure WhatsApp Business API

#### Option A: Direct Meta Integration (Recommended for Production)

1. **Create a Meta Developer Account**
   - Go to https://developers.facebook.com/
   - Create a new app or use existing one

2. **Add WhatsApp Product**
   - In your app dashboard, add "WhatsApp" product
   - Complete business verification (required for production)

3. **Get Your Credentials**
   - Go to WhatsApp → API Setup
   - Copy these values to `.env`:
     ```
     WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
     WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
     WHATSAPP_ACCESS_TOKEN=your_access_token
     WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
     ```

4. **Set Up Webhook**
   - Webhook URL: `https://your-domain.com/webhook`
   - Subscribe to: messages, message_deliveries, message_reads
   - Verify token must match `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

#### Option B: Twilio WhatsApp Sandbox (For Testing)

1. Go to https://www.twilio.com/try-twilio
2. Create account and get free credits
3. Enable WhatsApp sandbox
4. Update credentials in `.env`

### Step 4: Email Service Configuration (Optional)

For password resets and notifications:

**SendGrid:**
1. Sign up at https://sendgrid.com/
2. Get API key
3. Update `.env`:
   ```
   EMAIL_API_KEY=your_sendgrid_api_key
   EMAIL_FROM=noreply@leadpilot.ai
   ```

**Resend:**
1. Sign up at https://resend.com/
2. Get API key
3. Update `.env`

### Step 5: Redis Configuration (Optional - for caching)

For better performance in production:

1. Install Redis locally or use cloud service (Redis Cloud, Upstash)
2. Update `.env`:
   ```
   REDIS_URL=redis://localhost:6379
   # or
   REDIS_URL=redis://user:password@host:port
   ```

---

## 📦 Database Setup

Run this SQL in your Supabase SQL Editor to create all necessary tables:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'agent',
  team_id UUID,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new',
  ai_score INTEGER DEFAULT 50,
  ai_priority TEXT DEFAULT 'cold',
  budget_min DECIMAL,
  budget_max DECIMAL,
  preferred_location TEXT,
  property_type TEXT,
  requirements TEXT,
  assigned_to UUID REFERENCES users(id),
  team_id UUID,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  location TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'India',
  property_type TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqft DECIMAL,
  amenities TEXT[],
  images TEXT[],
  status TEXT DEFAULT 'available',
  listed_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  property_id UUID REFERENCES properties(id),
  user_id UUID REFERENCES users(id),
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  user_id UUID REFERENCES users(id),
  note_type TEXT DEFAULT 'general',
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  property_id UUID REFERENCES properties(id),
  user_id UUID REFERENCES users(id),
  deal_value DECIMAL,
  commission_percentage DECIMAL DEFAULT 2,
  commission_amount DECIMAL,
  status TEXT DEFAULT 'negotiation',
  closed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  team_id UUID,
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  key TEXT NOT NULL,
  value JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, key)
);

-- WhatsApp Logs table
CREATE TABLE IF NOT EXISTS whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  content TEXT,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  status TEXT DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_ai_score ON leads(ai_score DESC);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_settings_user_key ON settings(user_id, key);
```

---

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 80 (or the PORT specified in .env).

---

## 🔐 First-Time Setup

After configuring everything:

1. **Register your first user**
   - Go to http://localhost/register.html
   - Fill in your details
   - User will be created in the database

2. **Login**
   - Go to http://localhost/login.html
   - Use your registered credentials

3. **Connect WhatsApp**
   - Click on the WhatsApp status in the header
   - Follow the connection steps
   - Scan QR code with your WhatsApp Business account

---

## 📊 API Endpoints

All endpoints require JWT authentication (except `/auth/register` and `/auth/login`)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Leads
- `GET /api/leads` - Get all leads (with pagination & filters)
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads` - Create new lead
- `PATCH /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### WhatsApp
- `GET /api/whatsapp/status` - Get connection status
- `POST /api/whatsapp/connect` - Initiate connection
- `POST /api/whatsapp/disconnect` - Disconnect
- `GET /api/whatsapp/settings` - Get settings
- `PATCH /api/whatsapp/settings` - Update settings
- `POST /api/whatsapp/send` - Send message
- `GET /api/whatsapp/history` - Get message history

### Other Resources
- `/api/properties` - Property management
- `/api/appointments` - Appointment scheduling
- `/api/tasks` - Task management
- `/api/notes` - Lead notes
- `/api/documents` - Document storage
- `/api/deals` - Deal tracking
- `/api/team` - Team management
- `/api/analytics` - Analytics dashboard

---

## 🎯 Next Steps

1. ✅ Update `.env` with your credentials
2. ✅ Run database setup SQL in Supabase
3. ✅ Configure WhatsApp Business API
4. ✅ Test registration and login
5. ✅ Connect WhatsApp from dashboard
6. ✅ Start adding leads and properties!

---

## 📝 Environment Variables Template

Copy this to your `.env` file and fill in the values:

```env
PORT=80
NODE_ENV=production

# JWT Secret - GENERATE YOUR OWN!
JWT_SECRET=your_jwt_secret_key_here_change_this_in_production

# WhatsApp Cloud API (Meta)
WHATSAPP_API_VERSION=v18.0
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# Supabase
SUPABASE_URL=https://xsfgtmypzxqfkmtzdvje.supabase.co
SUPABASE_ANON_KEY=sb_publishable_vqp4VjEsiBfBXT1AxwOcyQ_3lh3ZNhP
SUPABASE_SERVICE_KEY=your_service_role_key_here

# Email (Optional)
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_email_api_key
EMAIL_FROM=noreply@leadpilot.ai

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Storage
STORAGE_BUCKET=leadpilot-files
```

---

## 🆘 Troubleshooting

### "Missing configuration" warnings
- Make sure all required environment variables are set in `.env`
- Don't use placeholder values like `your_...` or `fallback_...`

### Database errors
- Verify your Supabase credentials
- Run the SQL setup script in Supabase SQL Editor
- Check that all tables exist

### WhatsApp not connecting
- Ensure you have a WhatsApp Business account
- Verify your Meta Business Manager is set up
- Check that your phone number is registered with WhatsApp Business

### Server won't start
- Check if port 80 is already in use
- Try changing PORT in .env to another value (e.g., 3000)
- Run `npm install` to ensure all dependencies are installed

---

## 📞 Support

For issues or questions:
- Check the code comments
- Review the Supabase documentation: https://supabase.com/docs
- WhatsApp Business API docs: https://developers.facebook.com/docs/whatsapp
