-- LeadPilot AI Database Schema
-- Run this in your Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'agent' CHECK (role IN ('admin', 'agent')),
    team_id UUID,
    email_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for team_id in users
ALTER TABLE users 
ADD CONSTRAINT fk_user_team 
FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL;

-- Leads table (updated with new fields)
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    message TEXT,
    budget VARCHAR(50),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'follow-up', 'closed')),
    source VARCHAR(50) DEFAULT 'whatsapp',
    ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100),
    ai_priority VARCHAR(20) CHECK (ai_priority IN ('hot', 'warm', 'cold', 'nurture')),
    ai_insights JSONB,
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    team_id UUID REFERENCES teams(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),
    action VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email notifications log
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    lead_id UUID REFERENCES leads(id),
    email_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" 
ON users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- RLS Policies for teams
CREATE POLICY "Team members can view team" 
ON teams FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.team_id = teams.id 
        AND users.id = auth.uid()
    )
);

-- RLS Policies for leads
CREATE POLICY "Users can view team leads" 
ON leads FOR SELECT 
USING (
    team_id IS NULL OR
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.team_id = leads.team_id 
        AND users.id = auth.uid()
    )
);

CREATE POLICY "Users can update assigned leads" 
ON leads FOR UPDATE 
USING (
    assigned_to = auth.uid() OR
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.team_id = leads.team_id 
        AND users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- Create indexes for better performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_team_id ON leads(team_id);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_ai_score ON leads(ai_score);
CREATE INDEX idx_users_team_id ON users(team_id);
CREATE INDEX idx_activity_logs_team_id ON activity_logs(team_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Insert default admin user (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO users (email, password, name, role)
VALUES ('admin@leadpilot.ai', '$2a$10$YourHashedPasswordHere', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;
