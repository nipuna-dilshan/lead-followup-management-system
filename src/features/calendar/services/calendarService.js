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
        business_type,
        email,
        phone
      )
    `)
    .order('start_time', { ascending: true });

  if (error) throw error;
  return data || [];
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
      leads (id, full_name, business_type, email)
    `)
    .eq('status', CONSULTATION_STATUS.CONFIRMED)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}
