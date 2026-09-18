import { env, isN8nConfigured } from '../config/env';

/**
 * Sends lead data to the n8n webhook.
 * n8n is responsible for storing in Supabase and triggering emails.
 */
export async function sendLeadToN8n(leadData) {
  if (!isN8nConfigured) {
    throw new Error('n8n webhook is not configured. Please set VITE_N8N_LEAD_WEBHOOK_URL.');
  }

  const response = await fetch(env.n8nLeadWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      full_name: leadData.fullName,
      email: leadData.email,
      phone: leadData.phone || null,
      business_type: leadData.businessType,
      main_challenge: leadData.mainChallenge,
      business_age: leadData.businessAge || null,
      main_goal: leadData.mainGoal,
      urgency: leadData.urgency || null,
      source: 'public_form',
      submitted_at: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Webhook request failed: ${response.status} — ${text}`);
  }

  return response;
}
