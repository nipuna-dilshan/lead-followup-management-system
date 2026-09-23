import supabase from '../../../lib/supabase';
import { isSupabaseConfigured } from '../../../config/env';
import { CONSULTATION_STATUS } from '../../../lib/constants';

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured.');
}

/**
 * Fetch all consultations with lead details.
 */
export async function fetchConsultations() {
  requireSupabase();

  const { data, error } = await supabase
    .from('consultations')
    .select(`
      *,
      leads (
        id,
        full_name,
        name,
        business_type,
        email,
        phone
      )
    `)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return (data || []).map((c) => ({
    ...c,
    leads: c.leads
      ? {
          ...c.leads,
          full_name: c.leads.full_name || c.leads.name || 'Client',
        }
      : null,
  }));
}

/**
 * Fetch upcoming confirmed consultations.
 */
export async function fetchUpcomingConsultations(limit = 5) {
  requireSupabase();

  const { data, error } = await supabase
    .from('consultations')
    .select(`
      *,
      leads (id, full_name, name, business_type, email)
    `)
    .eq('status', CONSULTATION_STATUS.CONFIRMED)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return (data || []).map((c) => ({
    ...c,
    leads: c.leads
      ? {
          ...c.leads,
          full_name: c.leads.full_name || c.leads.name || 'Client',
        }
      : null,
  }));
}

/**
 * Create a new scheduled consultation.
 */
export async function createConsultation({ lead_id, start_time, end_time, meeting_url }) {
  requireSupabase();

  const { data, error } = await supabase
    .from('consultations')
    .insert([
      {
        lead_id,
        start_time,
        end_time: end_time || new Date(new Date(start_time).getTime() + 45 * 60000).toISOString(),
        meeting_url: meeting_url || 'https://meet.google.com/coaching-session',
        status: 'CONFIRMED',
      },
    ])
    .select(`
      *,
      leads (
        id,
        full_name,
        name,
        business_type,
        email,
        phone
      )
    `)
    .single();

  if (error) throw error;

  // Also update lead status to BOOKED
  if (lead_id) {
    await supabase
      .from('leads')
      .update({ status: 'BOOKED', booked_at: new Date().toISOString() })
      .eq('id', lead_id);
  }

  return {
    ...data,
    leads: data.leads
      ? {
          ...data.leads,
          full_name: data.leads.full_name || data.leads.name || 'Client',
        }
      : null,
  };
}
