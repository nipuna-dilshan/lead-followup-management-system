-- ============================================================
-- Fix: Enable Read Access & Sync Columns for Leads in Supabase
-- Copy and paste this into Supabase Dashboard -> SQL Editor -> Run
-- ============================================================

-- 1. Disable Row Level Security (RLS) on leads so your dashboard can read data:
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- 2. Ensure both 'name' and 'full_name' exist and stay synced:
DO $$
BEGIN
  -- If full_name column does not exist, add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='full_name') THEN
    ALTER TABLE leads ADD COLUMN full_name TEXT;
    UPDATE leads SET full_name = name WHERE full_name IS NULL;
  END IF;

  -- If main_challenge column does not exist, add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='main_challenge') THEN
    ALTER TABLE leads ADD COLUMN main_challenge TEXT;
    UPDATE leads SET main_challenge = challenge WHERE main_challenge IS NULL;
  END IF;

  -- If main_goal column does not exist, add it
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='leads' AND column_name='main_goal') THEN
    ALTER TABLE leads ADD COLUMN main_goal TEXT;
    UPDATE leads SET main_goal = goal WHERE main_goal IS NULL;
  END IF;

  -- If status column does not exist or has nulls, default to 'NEW'
  UPDATE leads SET status = 'NEW' WHERE status IS NULL;
END $$;

-- 3. Optional: Allow read access for public/anon key explicitly if RLS is kept enabled:
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "allow_anon_read_leads" ON leads;
DROP POLICY IF EXISTS "allow_anon_all_leads" ON leads;
CREATE POLICY "allow_anon_all_leads" ON leads FOR ALL USING (true) WITH CHECK (true);


meka run kara editor eke *****
