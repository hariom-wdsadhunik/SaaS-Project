-- LeadPilot AI - Missing Tables Migration
-- Run this in your Supabase SQL Editor to add missing tables

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, team_id, key)
);

-- RLS for settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their settings"
ON settings FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their settings"
ON settings FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their settings"
ON settings FOR INSERT
WITH CHECK (user_id = auth.uid());

-- ============================================
-- WHATSAPP_LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS whatsapp_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),
    phone VARCHAR(20) NOT NULL,
    message_id VARCHAR(255),
    message_type VARCHAR(50) DEFAULT 'text',
    content TEXT,
    direction VARCHAR(20) CHECK (direction IN ('inbound', 'outbound')),
    status VARCHAR(50) DEFAULT 'sent',
    lead_id UUID REFERENCES leads(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for whatsapp_logs
CREATE INDEX idx_whatsapp_logs_phone ON whatsapp_logs(phone);
CREATE INDEX idx_whatsapp_logs_direction ON whatsapp_logs(direction);
CREATE INDEX idx_whatsapp_logs_created_at ON whatsapp_logs(created_at);
CREATE INDEX idx_whatsapp_logs_lead_id ON whatsapp_logs(lead_id);

-- RLS for whatsapp_logs
ALTER TABLE whatsapp_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view whatsapp logs"
ON whatsapp_logs FOR SELECT
USING (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM users
        WHERE users.team_id = whatsapp_logs.team_id
        AND users.id = auth.uid()
    )
);

CREATE POLICY "Users can insert whatsapp logs"
ON whatsapp_logs FOR INSERT
WITH CHECK (
    user_id = auth.uid() OR
    user_id IS NULL
);

-- ============================================
-- EMAIL_TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('lead_notification', 'follow_up', 'daily_summary', 'high_priority', 'custom', 'welcome', 'invitation')),
    variables JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for email_templates
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view email templates"
ON email_templates FOR SELECT
USING (
    team_id IS NULL OR
    EXISTS (
        SELECT 1 FROM users
        WHERE users.team_id = email_templates.team_id
        AND users.id = auth.uid()
    )
);

CREATE POLICY "Team members can manage templates"
ON email_templates FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.team_id = email_templates.team_id
        AND users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- ============================================
-- CAMPAIGNS TABLE (for email/SMS sequences)
-- ============================================
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) CHECK (type IN ('email', 'sms', 'whatsapp')),
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    stats JSONB DEFAULT '{"sent": 0, "delivered": 0, "opened": 0, "clicked": 0, "replied": 0}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for campaigns
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view campaigns"
ON campaigns FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.team_id = campaigns.team_id
        AND users.id = auth.uid()
    )
);

CREATE POLICY "Admins can manage campaigns"
ON campaigns FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.team_id = campaigns.team_id
        AND users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- ============================================
-- SEQUENCES TABLE (automation workflows)
-- ============================================
CREATE TABLE IF NOT EXISTS sequences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(50) CHECK (trigger_type IN ('lead_created', 'status_change', 'tag_added', 'manual', 'schedule')),
    trigger_config JSONB,
    steps JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'paused')),
    stats JSONB DEFAULT '{"entered": 0, "completed": 0, "stopped": 0}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for sequences
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view sequences"
ON sequences FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.team_id = sequences.team_id
        AND users.id = auth.uid()
    )
);

CREATE POLICY "Admins can manage sequences"
ON sequences FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.team_id = sequences.team_id
        AND users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- ============================================
-- UPDATE DOCUMENTS TABLE - Add storage_path column
-- ============================================
ALTER TABLE documents ADD COLUMN IF NOT EXISTS storage_path TEXT;

-- ============================================
-- INSERT DEFAULT EMAIL TEMPLATES
-- ============================================
INSERT INTO email_templates (name, subject, body, type, variables, is_active)
VALUES
(
    'New Lead Notification',
    'New Lead Captured - {{lead_score}} Score',
    '<h1>New Lead!</h1><p>You have a new lead with {{lead_score}}/100 score.</p><p>Phone: {{lead_phone}}</p><p>Budget: {{lead_budget}}</p>',
    'lead_notification',
    '["lead_score", "lead_phone", "lead_budget", "lead_location"]',
    true
),
(
    'Follow Up Reminder',
    'Follow-up Reminder for Lead',
    '<h1>Follow Up</h1><p>Remember to follow up with this lead.</p><p>Last contact: {{last_contact_date}}</p>',
    'follow_up',
    '["lead_name", "last_contact_date"]',
    true
),
(
    'High Priority Alert',
    'HOT LEAD ALERT - {{lead_score}}/100',
    '<h1 style="color:red">HOT LEAD!</h1><p>Score: {{lead_score}}/100 - Contact Immediately!</p><p>Phone: {{lead_phone}}</p>',
    'high_priority',
    '["lead_score", "lead_phone"]',
    true
)
ON CONFLICT DO NOTHING;

-- ============================================
-- Enable Realtime for key tables
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE whatsapp_logs;

-- ============================================
-- GOALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    metric VARCHAR(50) NOT NULL CHECK (metric IN ('leads', 'converted_leads', 'revenue', 'calls', 'meetings', 'deals_won')),
    target_value DECIMAL(15, 2) NOT NULL,
    current_value DECIMAL(15, 2) DEFAULT 0,
    period VARCHAR(20) NOT NULL CHECK (period IN ('monthly', 'quarterly', 'yearly')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team goals viewable by team"
ON goals FOR SELECT
USING (
    team_id IS NULL OR
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = goals.team_id
    )
);

CREATE POLICY "Admins can manage team goals"
ON goals FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = goals.team_id
        AND users.role = 'admin'
    )
);

-- ============================================
-- SMS_LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sms_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id),
    user_id UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),
    phone VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    direction VARCHAR(20) DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
    status VARCHAR(50) DEFAULT 'sent',
    twilio_sid VARCHAR(255),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team sms logs viewable by team"
ON sms_logs FOR SELECT
USING (
    user_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = sms_logs.team_id
    )
);

CREATE POLICY "Users can insert sms logs"
ON sms_logs FOR INSERT
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE INDEX idx_sms_logs_lead_id ON sms_logs(lead_id);
CREATE INDEX idx_sms_logs_created_at ON sms_logs(created_at);

-- ============================================
-- SEQUENCE_ENROLLMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sequence_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    sequence_id UUID REFERENCES sequences(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'stopped', 'failed')),
    current_step INTEGER DEFAULT 0,
    last_action_at TIMESTAMP WITH TIME ZONE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lead_id, sequence_id)
);

ALTER TABLE sequence_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their enrollments"
ON sequence_enrollments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM leads
        WHERE leads.id = sequence_enrollments.lead_id
        AND EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.team_id = leads.team_id
        )
    )
);

CREATE INDEX idx_sequence_enrollments_lead_id ON sequence_enrollments(lead_id);
CREATE INDEX idx_sequence_enrollments_sequence_id ON sequence_enrollments(sequence_id);

-- ============================================
-- SEQUENCE_STEPS TABLE (for better step management)
-- ============================================
CREATE TABLE IF NOT EXISTS sequence_steps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sequence_id UUID REFERENCES sequences(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('email', 'sms', 'note', 'update_status', 'assign', 'delay')),
    delay_days INTEGER DEFAULT 0,
    delay_hours INTEGER DEFAULT 0,
    subject VARCHAR(500),
    body TEXT,
    template_id UUID,
    note_content TEXT,
    status VARCHAR(50),
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE sequence_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team can view sequence steps"
ON sequence_steps FOR SELECT
USING (true);

CREATE INDEX idx_sequence_steps_sequence_id ON sequence_steps(sequence_id);
