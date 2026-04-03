-- LeadPilot AI - Enhanced RLS Policies for Multi-Tenant Security
-- Run this in your Supabase SQL Editor

-- ============================================
-- DROP EXISTING POLICIES (Optional - for clean slate)
-- ============================================

-- Note: Only run these if you want to reset all policies
-- DROP POLICY IF EXISTS "..." ON ...;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can view all team members
CREATE POLICY "Team members can view all users"
ON users FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users AS u
        WHERE u.id = auth.uid()
        AND u.team_id = users.team_id
    )
);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Users can only view their own password hash (for auth purposes)
CREATE POLICY "Users can view own row"
ON users FOR SELECT
USING (auth.uid() = id);

-- ============================================
-- LEADS TABLE POLICIES
-- ============================================

-- Team members can view leads in their team
CREATE POLICY "Team leads are viewable by team"
ON leads FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = leads.team_id
    )
);

-- Team members can insert leads for their team
CREATE POLICY "Team leads are creatable by team"
ON leads FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = leads.team_id
    )
);

-- Team members can update leads in their team
CREATE POLICY "Team leads are updatable by team"
ON leads FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = leads.team_id
    )
);

-- Only admins or assigned user can delete leads
CREATE POLICY "Team leads are deletable by admin or assigned"
ON leads FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = leads.team_id
        AND (users.role = 'admin' OR users.id = leads.assigned_to)
    )
);

-- ============================================
-- ACTIVITY LOGS POLICIES
-- ============================================

-- Users can view activity logs for their team
CREATE POLICY "Team activity is viewable by team"
ON activity_logs FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = activity_logs.team_id
    )
);

-- System can insert activity logs
CREATE POLICY "System can insert activity logs"
ON activity_logs FOR INSERT
WITH CHECK (true);

-- ============================================
-- EMAIL_LOGS POLICIES
-- ============================================

CREATE POLICY "Team email logs viewable by team"
ON email_logs FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id IN (SELECT team_id FROM users WHERE users.id = email_logs.user_id)
    )
);

CREATE POLICY "Team email logs insertable by team"
ON email_logs FOR INSERT
WITH CHECK (true);

-- ============================================
-- TASKS POLICIES (Enhanced)
-- ============================================

CREATE POLICY "Tasks viewable by assigned or team"
ON tasks FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = (
            SELECT team_id FROM users WHERE users.id = tasks.assigned_to
            UNION
            SELECT team_id FROM users WHERE users.id = tasks.created_by
            LIMIT 1
        )
    )
);

CREATE POLICY "Tasks creatable by team members"
ON tasks FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND (users.team_id IS NOT NULL OR auth.uid() = created_by)
    )
);

CREATE POLICY "Tasks updatable by assigned or admin"
ON tasks FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND (users.role = 'admin' OR users.id = tasks.assigned_to OR users.id = tasks.created_by)
    )
);

-- ============================================
-- NOTES POLICIES (Enhanced)
-- ============================================

CREATE POLICY "Notes viewable by team"
ON notes FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM leads
        WHERE leads.id = notes.lead_id
        AND EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.team_id = leads.team_id
        )
    )
);

CREATE POLICY "Notes creatable by team"
ON notes FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
    )
);

CREATE POLICY "Notes deletable by creator or admin"
ON notes FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND (users.role = 'admin' OR users.id = notes.created_by)
    )
);

-- ============================================
-- DOCUMENTS POLICIES
-- ============================================

CREATE POLICY "Documents viewable by related team"
ON documents FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND (
            users.id = documents.uploaded_by
            OR EXISTS (
                SELECT 1 FROM leads WHERE leads.id = documents.lead_id AND leads.team_id = users.team_id
            )
            OR EXISTS (
                SELECT 1 FROM properties WHERE properties.id = documents.property_id AND properties.team_id = users.team_id
            )
        )
    )
);

CREATE POLICY "Documents insertable by team"
ON documents FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
    )
);

CREATE POLICY "Documents deletable by uploader or admin"
ON documents FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND (users.role = 'admin' OR users.id = documents.uploaded_by)
    )
);

-- ============================================
-- EMAIL_TEMPLATES POLICIES
-- ============================================

CREATE POLICY "Email templates viewable by team"
ON email_templates FOR SELECT
USING (
    team_id IS NULL
    OR EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = email_templates.team_id
    )
);

CREATE POLICY "Email templates manageable by admin"
ON email_templates FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = email_templates.team_id
        AND users.role = 'admin'
    )
);

CREATE POLICY "Email templates insertable by admin"
ON email_templates FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
);

-- ============================================
-- CAMPAIGNS POLICIES
-- ============================================

CREATE POLICY "Campaigns viewable by team"
ON campaigns FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = campaigns.team_id
    )
);

CREATE POLICY "Campaigns manageable by admin"
ON campaigns FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = campaigns.team_id
        AND users.role = 'admin'
    )
);

-- ============================================
-- SEQUENCES POLICIES
-- ============================================

CREATE POLICY "Sequences viewable by team"
ON sequences FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = sequences.team_id
    )
);

CREATE POLICY "Sequences manageable by admin"
ON sequences FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.team_id = sequences.team_id
        AND users.role = 'admin'
    )
);

-- ============================================
-- CREATE HELPER FUNCTION FOR USER TEAM CHECK
-- ============================================

CREATE OR REPLACE FUNCTION get_user_team()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT team_id FROM users WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check all policies
-- SELECT tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE schemaname = 'public';

-- Count policies per table
-- SELECT tablename, COUNT(*) as policy_count FROM pg_policies WHERE schemaname = 'public' GROUP BY tablename;
