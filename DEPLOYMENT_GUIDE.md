# LeadPilot AI CRM — Enterprise Deployment Guide (v4.0.0)

**Version:** v4.0.0  
**Target Environment:** Docker / Kubernetes / Vercel / Railway  

---

## 1. Environment Variable Configuration

### Backend (`apps/api/.env`)
```ini
PORT=5000
NODE_ENV=production
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
JWT_SECRET=your-production-jwt-secret
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
CRON_SECRET=your-production-cron-secret
```

### Frontend (`apps/web/.env.local`)
```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 2. Monorepo Build & Execution Commands

```bash
# 1. Install Workspace Dependencies
npm install

# 2. Build Frontend Next.js Web App
npm run build --workspace=leadpilot-frontend

# 3. Start Production API Server
npm run start --workspace=leadpilot-backend
```
