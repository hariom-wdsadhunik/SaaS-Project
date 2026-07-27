# Database

Database configuration and connection for LeadPilot AI.

## Files

- **supabase.js** - Supabase client initialization
  - Exports configured Supabase client
  - Uses environment variables for credentials

## Environment Variables

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_key
```

## Required Table

**leads** table structure:
- `id` (uuid, primary key)
- `phone` (text)
- `message` (text)
- `budget` (text, nullable)
- `location` (text, nullable)
- `status` (text, default: 'new')
- `created_at` (timestamp)

## RLS Policies

Enable these policies in Supabase:
- INSERT: Allow anon/authenticated
- SELECT: Allow anon/authenticated
- UPDATE: Allow anon/authenticated
