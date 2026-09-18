-- =============================================================
-- 002_rls_policies.sql
-- Row Level Security Policies
-- Business Coach Lead Management System
-- =============================================================
-- SECURITY MODEL:
-- - Only authenticated users (the coach) can access admin data
-- - The public lead capture form does NOT insert directly to DB
-- - n8n (server-side with service role key) inserts leads
-- - Public users have zero read access to leads
-- =============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- PROFILES
-- Users can only read and update their own profile
-- =============================================================
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================================
-- LEADS
-- Only authenticated users can read/write leads
-- =============================================================
CREATE POLICY "leads_select_authenticated"
  ON leads FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "leads_insert_authenticated"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

CREATE POLICY "leads_update_authenticated"
  ON leads FOR UPDATE
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Note: DELETE is intentionally not granted in V1
-- Leads should be archived via status change, not deleted

-- =============================================================
-- LEAD FOLLOWUPS
-- =============================================================
CREATE POLICY "followups_all_authenticated"
  ON lead_followups FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- =============================================================
-- EMAIL EVENTS
-- =============================================================
CREATE POLICY "email_events_all_authenticated"
  ON email_events FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- =============================================================
-- CONSULTATIONS
-- =============================================================
CREATE POLICY "consultations_all_authenticated"
  ON consultations FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- =============================================================
-- IMPORTANT: n8n uses the Supabase service role key (server-side)
-- which bypasses RLS. NEVER expose the service role key in the
-- frontend or .env files committed to version control.
-- =============================================================
