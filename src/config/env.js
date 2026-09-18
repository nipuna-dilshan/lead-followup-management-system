/**
 * config/env.js
 * Centralised environment variable access.
 * All VITE_ variables are client-visible by design.
 */

export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  n8nLeadWebhookUrl: import.meta.env.VITE_N8N_LEAD_WEBHOOK_URL || '',
  calBookingUrl:
    import.meta.env.VITE_CAL_BOOKING_URL ||
    'https://cal.com/nipun-dilshan-p5amnb/business-growth-consultation',
  appName: import.meta.env.VITE_APP_NAME || 'Michael Carter — Business Growth Coach',
};

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const isN8nConfigured = Boolean(env.n8nLeadWebhookUrl);
