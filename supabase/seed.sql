-- =============================================================
-- seed.sql
-- Development seed data for testing
-- Run AFTER 001_initial_schema.sql and 002_rls_policies.sql
-- =============================================================

-- Make legacy columns nullable if they still have NOT NULL constraints
ALTER TABLE leads ALTER COLUMN name DROP NOT NULL;
ALTER TABLE leads ALTER COLUMN challenge DROP NOT NULL;
ALTER TABLE leads ALTER COLUMN goal DROP NOT NULL;

-- =============================================================
-- LEADS — Realistic fictional enquiries
-- =============================================================
INSERT INTO leads (
  id, name, full_name, email, phone, business_type, challenge, main_challenge, business_age, goal, main_goal, urgency, status, follow_up_stage, created_at
)
VALUES
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Nimal Perera',
    'Nimal Perera',
    'nimal@pereracoaching.example.com',
    '+1 (555) 382-9104',
    'Coaching',
    'Inconsistent client enquiries and reliance on unpredictable organic social posts. Need structured acquisition.',
    'Inconsistent client enquiries and reliance on unpredictable organic social posts. Need structured acquisition.',
    '1–3 years',
    'Build a predictable high-ticket client acquisition process targeting $35k MRR.',
    'Build a predictable high-ticket client acquisition process targeting $35k MRR.',
    'Within the next month',
    'CONTACTED',
    1,
    NOW() - INTERVAL '3 days'
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Sarah Jenkins',
    'Sarah Jenkins',
    'sarah@jenkinspartners.example.com',
    '+44 7700 900234',
    'Professional Services',
    'Need high-ticket corporate packaging and structured consulting delivery framework.',
    'Need high-ticket corporate packaging and structured consulting delivery framework.',
    '3–5 years',
    'Package and sell a premium retainer programme at £15k per quarter.',
    'Package and sell a premium retainer programme at £15k per quarter.',
    'As soon as possible',
    'BOOKED',
    3,
    NOW() - INTERVAL '7 days'
  ),
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'Marcus Thorne',
    'Marcus Thorne',
    'marcus@thorneadvisory.example.com',
    NULL,
    'Consulting',
    'Outbound pipeline growth is stagnant. Conversion from leads to paid engagements is below 15%.',
    'Outbound pipeline growth is stagnant. Conversion from leads to paid engagements is below 15%.',
    '5+ years',
    'Systematize outbound and improve close rate to 30%+ within 90 days.',
    'Systematize outbound and improve close rate to 30%+ within 90 days.',
    'Just exploring',
    'NEW',
    0,
    NOW() - INTERVAL '1 day'
  ),
  (
    'a1b2c3d4-0004-0004-0004-000000000004',
    'Elena Rostova',
    'Elena Rostova',
    'elena@vanguardcreative.example.com',
    '+1 (555) 201-7788',
    'Agency',
    'Scaling retainer contracts without diluting service quality or burning out the team.',
    'Scaling retainer contracts without diluting service quality or burning out the team.',
    '3–5 years',
    'Grow from 8 to 20 retainer clients while maintaining premium positioning.',
    'Grow from 8 to 20 retainer clients while maintaining premium positioning.',
    'Within the next month',
    'CONTACTED',
    2,
    NOW() - INTERVAL '5 days'
  ),
  (
    'a1b2c3d4-0005-0005-0005-000000000005',
    'David Chen',
    'David Chen',
    'david@chenventures.example.com',
    '+65 9123 4567',
    'E-commerce',
    'Scaling D2C brand from $500k to $2M revenue — struggling with attribution and retention.',
    'Scaling D2C brand from $500k to $2M revenue — struggling with attribution and retention.',
    '1–3 years',
    'Hit $2M ARR and establish a repeatable paid acquisition engine.',
    'Hit $2M ARR and establish a repeatable paid acquisition engine.',
    'As soon as possible',
    'NO_RESPONSE',
    2,
    NOW() - INTERVAL '14 days'
  ),
  (
    'a1b2c3d4-0006-0006-0006-000000000006',
    'Maya Patel',
    'Maya Patel',
    'maya@archstudio.example.com',
    '+44 7900 112233',
    'Agency',
    'Scaling without diluting boutique reputation. Current growth trajectory risks commoditising the brand.',
    'Scaling without diluting boutique reputation. Current growth trajectory risks commoditising the brand.',
    'Less than 1 year',
    'Grow revenue by 150% while maintaining ultra-premium positioning.',
    'Grow revenue by 150% while maintaining ultra-premium positioning.',
    'Just exploring',
    'NEW',
    0,
    NOW() - INTERVAL '2 hours'
  )
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- LEAD FOLLOWUPS
-- =============================================================
INSERT INTO lead_followups (lead_id, stage, status, scheduled_at, sent_at)
VALUES
  -- Nimal Perera — Stage 1 sent
  ('a1b2c3d4-0001-0001-0001-000000000001', 0, 'SENT', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 1, 'SENT', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 2, 'SCHEDULED', NOW() + INTERVAL '1 day', NULL),

  -- Sarah Jenkins — all sent (booked)
  ('a1b2c3d4-0002-0002-0002-000000000002', 0, 'SENT', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 1, 'SENT', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 2, 'SENT', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 3, 'SKIPPED', NULL, NULL),

  -- Elena — stage 2 sent
  ('a1b2c3d4-0004-0004-0004-000000000004', 0, 'SENT', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 1, 'SENT', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 2, 'SCHEDULED', NOW() + INTERVAL '2 days', NULL),

  -- David — 2 sent, no response
  ('a1b2c3d4-0005-0005-0005-000000000005', 0, 'SENT', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 1, 'SENT', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 2, 'SENT', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days');

-- =============================================================
-- EMAIL EVENTS
-- =============================================================
INSERT INTO email_events (lead_id, type, subject, status, sent_at)
VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'WELCOME', 'Welcome — Next steps for your enquiry', 'SENT', NOW() - INTERVAL '3 days'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 'FOLLOW_UP_1', 'Diagnostic Framework — How we can work together', 'SENT', NOW() - INTERVAL '2 days'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'WELCOME', 'Welcome — Your enquiry has been received', 'SENT', NOW() - INTERVAL '7 days'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'FOLLOW_UP_1', 'A case study relevant to your business', 'SENT', NOW() - INTERVAL '5 days'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'FOLLOW_UP_2', 'Quick note before I close your file', 'SENT', NOW() - INTERVAL '3 days'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'WELCOME', 'Welcome — Your enquiry has been received', 'SENT', NOW() - INTERVAL '5 days'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'FOLLOW_UP_1', 'How retainer-based agencies scale profitably', 'SENT', NOW() - INTERVAL '3 days'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'WELCOME', 'Welcome — Your enquiry has been received', 'SENT', NOW() - INTERVAL '14 days'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'FOLLOW_UP_1', 'Attribution and retention — a framework', 'SENT', NOW() - INTERVAL '9 days'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'FOLLOW_UP_2', 'Final note — is now a good time?', 'SENT', NOW() - INTERVAL '4 days');

-- =============================================================
-- CONSULTATIONS
-- =============================================================
INSERT INTO consultations (lead_id, event_id, start_time, end_time, meeting_url, status)
VALUES
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'cal_event_sarah_001',
    NOW() + INTERVAL '1 day' + INTERVAL '14 hours 30 minutes',
    NOW() + INTERVAL '1 day' + INTERVAL '15 hours 30 minutes',
    'https://meet.google.com/abc-defg-hij',
    'CONFIRMED'
  ),
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'cal_event_nimal_001',
    NOW() + INTERVAL '6 days' + INTERVAL '10 hours',
    NOW() + INTERVAL '6 days' + INTERVAL '10 hours 45 minutes',
    'https://meet.google.com/xyz-uvwx-yzz',
    'CONFIRMED'
  )
ON CONFLICT (id) DO NOTHING;
