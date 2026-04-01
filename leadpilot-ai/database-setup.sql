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

-- ============================================
-- REAL ESTATE CRM EXTENSION TABLES
-- ============================================

-- Properties/Inventory table
CREATE TABLE IF NOT EXISTS properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) CHECK (property_type IN ('1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Plot', 'Commercial', 'Penthouse', 'Studio')),
    listing_type VARCHAR(20) CHECK (listing_type IN ('Sale', 'Rent', 'Lease')),
    price DECIMAL(15, 2),
    price_per_sqft DECIMAL(10, 2),
    area_sqft INTEGER,
    bedrooms INTEGER,
    bathrooms INTEGER,
    balconies INTEGER,
    furnishing VARCHAR(50) CHECK (furnishing IN ('Unfurnished', 'Semi-Furnished', 'Fully-Furnished')),
    parking INTEGER DEFAULT 0,
    floor_number INTEGER,
    total_floors INTEGER,
    age_of_property VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    landmarks TEXT,
    amenities JSONB DEFAULT '[]',
    photos JSONB DEFAULT '[]',
    video_url TEXT,
    virtual_tour_url TEXT,
    status VARCHAR(50) DEFAULT 'Available' CHECK (status IN ('Available', 'Sold', 'Reserved', 'Under Negotiation', 'Off Market')),
    owner_name VARCHAR(255),
    owner_phone VARCHAR(20),
    owner_email VARCHAR(255),
    commission_percentage DECIMAL(5, 2) DEFAULT 2.00,
    listed_by UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments/Site Visits table
CREATE TABLE IF NOT EXISTS appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    appointment_type VARCHAR(50) CHECK (appointment_type IN ('Site Visit', 'Meeting', 'Call', 'Video Call', 'Property Showing')),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    status VARCHAR(50) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'No Show', 'Rescheduled')),
    location TEXT,
    notes TEXT,
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    reminder_sent BOOLEAN DEFAULT false,
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type VARCHAR(50) CHECK (task_type IN ('Call', 'Email', 'Follow-up', 'Site Visit', 'Document', 'Meeting', 'Reminder', 'Other')),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled')),
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    reminder_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notes/Communication History table
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    note_type VARCHAR(50) CHECK (note_type IN ('General', 'Call', 'Email', 'Meeting', 'WhatsApp', 'SMS', 'Site Visit', 'System')),
    content TEXT NOT NULL,
    call_duration INTEGER,
    call_outcome VARCHAR(100),
    sentiment VARCHAR(20) CHECK (sentiment IN ('Positive', 'Neutral', 'Negative')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    deal_id UUID,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) CHECK (document_type IN ('ID Proof', 'Address Proof', 'Agreement', 'Contract', 'Payment Receipt', 'Property Document', 'Loan Document', 'Other')),
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deals/Commission Tracking table
CREATE TABLE IF NOT EXISTS deals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    deal_value DECIMAL(15, 2) NOT NULL,
    commission_percentage DECIMAL(5, 2) DEFAULT 2.00,
    commission_amount DECIMAL(15, 2),
    deal_stage VARCHAR(50) DEFAULT 'Initial' CHECK (deal_stage IN ('Initial', 'Negotiation', 'Agreement', 'Documentation', 'Payment', 'Closed Won', 'Closed Lost')),
    expected_close_date DATE,
    actual_close_date DATE,
    payment_status VARCHAR(50) DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Partial', 'Received', 'Disbursed')),
    amount_received DECIMAL(15, 2) DEFAULT 0,
    notes TEXT,
    closed_by UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Tags table
CREATE TABLE IF NOT EXISTS lead_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    tag_color VARCHAR(7) DEFAULT '#3b82f6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property-Lead Matches table
CREATE TABLE IF NOT EXISTS property_lead_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
    match_reasons JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'Suggested' CHECK (status IN ('Suggested', 'Viewed', 'Interested', 'Not Interested', 'Shortlisted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(lead_id, property_id)
);

-- Lead Requirements table (detailed preferences)
CREATE TABLE IF NOT EXISTS lead_requirements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    property_types JSONB DEFAULT '[]',
    locations JSONB DEFAULT '[]',
    min_budget DECIMAL(15, 2),
    max_budget DECIMAL(15, 2),
    min_area INTEGER,
    max_area INTEGER,
    bedrooms JSONB DEFAULT '[]',
    furnishing VARCHAR(50),
    purpose VARCHAR(50) CHECK (purpose IN ('Investment', 'End Use', 'Rental Income', 'Commercial')),
    timeline VARCHAR(50) CHECK (timeline IN ('Immediate', '1 Month', '3 Months', '6 Months', '1 Year')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_lead_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_requirements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
CREATE POLICY "Team members can view properties" 
ON properties FOR SELECT 
USING (
    team_id IS NULL OR
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.team_id = properties.team_id 
        AND users.id = auth.uid()
    )
);

CREATE POLICY "Team members can create properties" 
ON properties FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.team_id = properties.team_id 
        AND users.id = auth.uid()
    )
);

CREATE POLICY "Team members can update properties" 
ON properties FOR UPDATE 
USING (
    listed_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.team_id = properties.team_id 
        AND users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- RLS Policies for appointments
CREATE POLICY "Team members can view appointments" 
ON appointments FOR SELECT 
USING (
    assigned_to = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM leads 
        WHERE leads.id = appointments.lead_id
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.team_id = leads.team_id 
            AND users.id = auth.uid()
        )
    )
);

-- RLS Policies for tasks
CREATE POLICY "Users can view their tasks" 
ON tasks FOR SELECT 
USING (
    assigned_to = auth.uid() OR
    created_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- RLS Policies for notes
CREATE POLICY "Team members can view notes" 
ON notes FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM leads 
        WHERE leads.id = notes.lead_id
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.team_id = leads.team_id 
            AND users.id = auth.uid()
        )
    )
);

-- RLS Policies for deals
CREATE POLICY "Team members can view deals" 
ON deals FOR SELECT 
USING (
    closed_by = auth.uid() OR
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.team_id = deals.team_id 
        AND users.id = auth.uid()
    )
);

-- Create indexes for performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_listed_by ON properties(listed_by);
CREATE INDEX idx_appointments_lead_id ON appointments(lead_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_tasks_lead_id ON tasks(lead_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_notes_lead_id ON notes(lead_id);
CREATE INDEX idx_documents_lead_id ON documents(lead_id);
CREATE INDEX idx_deals_lead_id ON deals(lead_id);
CREATE INDEX idx_deals_status ON deals(deal_stage);
CREATE INDEX idx_lead_tags_lead_id ON lead_tags(lead_id);
CREATE INDEX idx_property_matches_lead_id ON property_lead_matches(lead_id);
CREATE INDEX idx_lead_requirements_lead_id ON lead_requirements(lead_id);

-- Insert default admin user (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO users (email, password, name, role)
VALUES ('admin@leadpilot.ai', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample properties
INSERT INTO properties (title, description, property_type, listing_type, price, area_sqft, bedrooms, bathrooms, city, address, amenities, status, commission_percentage)
VALUES 
('Luxury 3BHK in Whitefield', 'Spacious 3BHK apartment with modern amenities', '3BHK', 'Sale', 15000000, 1800, 3, 3, 'Bangalore', 'Whitefield Main Road', '["Swimming Pool", "Gym", "Club House", "24x7 Security"]', 'Available', 2.0),
('2BHK Apartment in Koramangala', 'Premium 2BHK near metro station', '2BHK', 'Sale', 8500000, 1200, 2, 2, 'Bangalore', 'Koramangala 5th Block', '["Lift", "Parking", "Power Backup"]', 'Available', 2.0),
('Villa in Sarjapur Road', 'Independent villa with private garden', 'Villa', 'Sale', 35000000, 3500, 4, 4, 'Bangalore', 'Sarjapur Road', '["Garden", "Private Pool", "Security"]', 'Available', 1.5)
ON CONFLICT DO NOTHING;
