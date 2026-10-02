import { env, isN8nConfigured } from '../config/env';
import { buildCalBookingUrl } from './cal';

/**
 * Sends lead data to the n8n webhook.
 * n8n is responsible for storing in Supabase and triggering emails.
 */
export async function sendLeadToN8n(leadData) {
  if (!isN8nConfigured) {
    throw new Error('n8n webhook is not configured. Please set VITE_N8N_LEAD_WEBHOOK_URL.');
  }

  const calBookingUrl = buildCalBookingUrl(env.calBookingUrl, {
    email: leadData.email,
    fullName: leadData.fullName,
  });

  const response = await fetch(env.n8nLeadWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Standard snake_case
      full_name: leadData.fullName,
      name: leadData.fullName,
      email: leadData.email,
      phone: leadData.phone || null,
      business_type: leadData.businessType,
      main_challenge: leadData.mainChallenge,
      challenge: leadData.mainChallenge,
      business_age: leadData.businessAge || null,
      main_goal: leadData.mainGoal,
      goal: leadData.mainGoal,
      urgency: leadData.urgency || null,
      source: 'public_form',
      submitted_at: new Date().toISOString(),

      // Pre-bound Cal.com booking link (with email and name pre-filled)
      booking_url: calBookingUrl,
      cal_booking_url: calBookingUrl,

      // CamelCase aliases
      fullName: leadData.fullName,
      businessType: leadData.businessType,
      mainChallenge: leadData.mainChallenge,
      businessAge: leadData.businessAge || null,
      mainGoal: leadData.mainGoal,
      calBookingUrl,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Webhook request failed: ${response.status} — ${text}`);
  }

  return response;
}
