-- =============================================================
-- 001_initial_schema.sql
-- Business Coach Lead Management System
-- Run this in your Supabase SQL editor or via migration tool
-- =============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================
-- PROFILES
-- One profile per authenticated coach (linked to auth.users)
-- =============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  email         TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  booking_url   TEXT DEFAULT 'https://cal.com/nipun-dilshan-p5amnb/business-growth-consultation',
  notification_email    BOOLEAN NOT NULL DEFAULT TRUE,
  notification_followup BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================
-- LEADS
-- =============================================================
CREATE TABLE IF NOT EXISTS leads (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name         TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT,
  business_type     TEXT,
  main_challenge    TEXT NOT NULL,
  business_age      TEXT,
  main_goal         TEXT NOT NULL,
  urgency           TEXT,
  status            TEXT NOT NULL DEFAULT 'NEW'
                    CHECK (status IN ('NEW', 'CONTACTED', 'BOOKED', 'NO_RESPONSE')),
  follow_up_stage   INTEGER NOT NULL DEFAULT 0
                    CHECK (follow_up_stage BETWEEN 0 AND 3),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for search and filtering
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================
-- LEAD FOLLOWUPS
-- =============================================================
CREATE TABLE IF NOT EXISTS lead_followups (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id       UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  stage         INTEGER NOT NULL CHECK (stage BETWEEN 0 AND 3),
  status        TEXT NOT NULL DEFAULT 'PENDING'
                CHECK (status IN ('PENDING', 'SCHEDULED', 'SENT', 'SKIPPED')),
  scheduled_at  TIMESTAMPTZ,
  sent_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_followups_lead_id_idx ON lead_followups(lead_id);

-- =============================================================
-- EMAIL EVENTS
-- =============================================================
CREATE TABLE IF NOT EXISTS email_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  type        TEXT NOT NULL
              CHECK (type IN ('WELCOME', 'FOLLOW_UP_1', 'FOLLOW_UP_2', 'FINAL_FOLLOW_UP')),
  subject     TEXT,
  status      TEXT NOT NULL DEFAULT 'PENDING'
              CHECK (status IN ('PENDING', 'SENT', 'FAILED')),
  sent_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS email_events_lead_id_idx ON email_events(lead_id);

-- =============================================================
-- CONSULTATIONS
-- Populated by Cal.com → n8n → Supabase webhook
-- =============================================================
CREATE TABLE IF NOT EXISTS consultations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID REFERENCES leads(id) ON DELETE SET NULL,
  event_id    TEXT,                -- Cal.com event/booking ID
  start_time  TIMESTAMPTZ NOT NULL,
  end_time    TIMESTAMPTZ,
  meeting_url TEXT,
  status      TEXT NOT NULL DEFAULT 'CONFIRMED'
              CHECK (status IN ('CONFIRMED', 'CANCELLED', 'COMPLETED')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS consultations_start_time_idx ON consultations(start_time);
CREATE INDEX IF NOT EXISTS consultations_lead_id_idx ON consultations(lead_id);

CREATE TRIGGER consultations_updated_at
  BEFORE UPDATE ON consultations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
