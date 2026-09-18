# Business Growth Lead Management System

A production-quality lead management and follow-up system for an independent business coach. Built with React, Vite, Tailwind CSS, Supabase, and n8n automation.

---

## Features

- **Public lead capture form** — premium consultation enquiry page
- **Admin authentication** — Supabase Auth (email + password)
- **Protected admin routes** — unauthenticated users redirected to login
- **Dashboard** — live metrics, recent leads, upcoming consultations
- **Lead management** — search, filter, paginate, view details
- **Lead details** — full info, follow-up status, email history, consultation booking
- **Manual lead creation** — admin modal with full validation
- **Status management** — update lead status with Supabase persistence
- **Calendar** — monthly view with consultation events from Supabase
- **Settings** — profile, integration config, notification preferences
- **n8n integration** — webhook-based lead submission and automation
- **Cal.com integration** — booking URL linked throughout admin
- **Responsive design** — desktop sidebar, mobile drawer navigation
- **Toast notifications** — success/error feedback for all actions
- **Accessible UI** — semantic HTML, ARIA labels, keyboard navigation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8 |
| Language | JavaScript (ES modules) |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Automation | n8n (webhook) |
| Booking | Cal.com |
| Dates | date-fns |

---

## Project Architecture

```
src/
├── app/                    # App shell, routing, providers
│   ├── App.jsx             # Root component with router + providers
│   ├── routes.jsx          # ProtectedRoute / PublicOnlyRoute guards
│   └── providers/
│       └── AuthProvider.jsx
│
├── components/
│   ├── ui/                 # Reusable design system components
│   │   ├── Button.jsx      # Primary / Secondary / Ghost / Danger
│   │   ├── Input.jsx       # With label, error, hint, accessible
│   │   ├── Select.jsx
│   │   ├── Textarea.jsx
│   │   ├── Badge.jsx       # Status-coloured badges
│   │   ├── Modal.jsx       # Accessible overlay modal
│   │   ├── Toast.jsx       # Toast notification system
│   │   ├── Spinner.jsx
│   │   ├── EmptyState.jsx
│   │   └── ConfirmDialog.jsx
│   └── layout/             # Admin shell layout
│       ├── AdminLayout.jsx
│       ├── Sidebar.jsx
│       ├── Topbar.jsx
│       ├── PageHeader.jsx
│       └── MobileNavigation.jsx
│
├── features/               # Feature-scoped modules
│   ├── auth/               # Login, auth hooks, Supabase auth service
│   ├── leads/              # Lead CRUD, table, filters, status, details
│   ├── calendar/           # Consultation calendar view
│   └── settings/           # Profile, integrations, notifications
│
├── pages/                  # Route-level page components
├── lib/                    # supabase.js, n8n.js, utils.js, constants.js
├── config/                 # env.js (typed env variable access)
└── styles/                 # globals.css (Tailwind base + tokens)
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key (safe for browser) |
| `VITE_N8N_LEAD_WEBHOOK_URL` | n8n webhook URL for lead capture |
| `VITE_CAL_BOOKING_URL` | Cal.com booking page URL |

> **Important**: VITE_ variables are exposed to the browser. Never put your Supabase **service role key**, Gmail credentials, or private API keys in `.env`. Those belong server-side in n8n.

---

## Supabase Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run migrations

In your Supabase SQL editor, run in order:

```sql
-- 1. Create schema
-- Paste contents of: supabase/migrations/001_initial_schema.sql

-- 2. Enable RLS
-- Paste contents of: supabase/migrations/002_rls_policies.sql

-- 3. (Optional) Seed development data
-- Paste contents of: supabase/seed.sql
```

### 3. Create admin user

In Supabase Dashboard → Authentication → Users → Add User:
- Email: `michael@cartergrowth.com`
- Password: (set a strong password)

### 4. Copy credentials

From Supabase Dashboard → Settings → API:
- Copy **Project URL** → `VITE_SUPABASE_URL`
- Copy **anon/public key** → `VITE_SUPABASE_ANON_KEY`

---

## n8n Integration

The public lead capture form posts to an n8n webhook. n8n handles:
1. Storing the lead in Supabase (using service role key — server-side)
2. Sending the welcome email
3. Scheduling follow-up sequence
4. Processing Cal.com booking webhooks

### n8n Workflow Setup

1. Create a new n8n workflow
2. Add a **Webhook** trigger node
3. Set the webhook URL in `VITE_N8N_LEAD_WEBHOOK_URL`
4. Add a **Supabase** node to insert into the `leads` table using your **service role key**
5. Add email nodes (Gmail/Brevo/etc.) for the welcome email

### Payload received by n8n

```json
{
  "full_name": "Alex Morgan",
  "email": "alex@company.com",
  "phone": "+1 555 000 0000",
  "business_type": "Consulting",
  "main_challenge": "Inconsistent lead flow...",
  "business_age": "1–3 years",
  "main_goal": "Scale to $50k MRR",
  "urgency": "Within the next month",
  "source": "public_form",
  "submitted_at": "2026-09-18T22:00:00.000Z"
}
```

---

## Cal.com Integration

Booking URL: `https://cal.com/nipun-dilshan-p5amnb/business-growth-consultation`

The frontend uses this URL for:
- "Schedule Consultation" button on Lead Details
- Booking link in admin settings

### Booking → Supabase flow

Cal.com → n8n webhook → Insert into `consultations` table → Update lead `status` to `BOOKED`

The React frontend reads the resulting Supabase state — it does not duplicate automation logic.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Supabase + n8n values

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Build

```bash
npm run build
```

Output in `dist/`. Deploy to Vercel, Netlify, Cloudflare Pages, or any static host.

---

## Security Notes

- **RLS is enabled** on all database tables
- **Anon key** is safe for browser use — it only grants access per RLS policies
- **Service role key** must only be used server-side (n8n, Supabase Edge Functions)
- **`.env` is gitignored** — never commit real credentials
- Admin routes are protected by React Router guards + Supabase session validation
- Public visitors cannot read or write leads directly via the frontend

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | Coach profile (linked to auth.users) |
| `leads` | All business enquiries |
| `lead_followups` | Per-lead follow-up sequence stages |
| `email_events` | Record of emails sent per lead |
| `consultations` | Booked sessions (via Cal.com) |

---

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Lead capture enquiry form |
| `/login` | Public | Admin sign-in |
| `/admin` | Protected | Dashboard |
| `/admin/leads` | Protected | Leads list |
| `/admin/leads/:id` | Protected | Lead detail view |
| `/admin/calendar` | Protected | Consultation calendar |
| `/admin/settings` | Protected | Profile and settings |

---

## Design System

- **Font**: DM Sans (Google Fonts)
- **Background**: `#F8F5F1` (warm off-white)
- **Accent/Brand**: `#B86A53` (muted terracotta)
- **Text**: `#191918` / `#6D6A63`
- **Border**: `#DDDAD2`
- **Success**: `#47735C`
- **Warning**: `#A06A32`
- **Danger**: `#A34A3B`
