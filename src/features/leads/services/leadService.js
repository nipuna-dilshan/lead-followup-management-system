import supabase from '../../../lib/supabase';
import { isSupabaseConfigured } from '../../../config/env';
import { DEFAULT_PAGE_SIZE } from '../../../lib/constants';

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }
}

function normalizeLead(lead) {
  if (!lead) return lead;
  return {
    ...lead,
    full_name: lead.full_name || lead.name || 'Unnamed Client',
    name: lead.name || lead.full_name || 'Unnamed Client',
    main_challenge: lead.main_challenge || lead.challenge || '',
    challenge: lead.challenge || lead.main_challenge || '',
    main_goal: lead.main_goal || lead.goal || '',
    goal: lead.goal || lead.main_goal || '',
  };
}

/**
 * Fetch paginated, filtered leads.
 */
export async function fetchLeads({ page = 1, pageSize = DEFAULT_PAGE_SIZE, search = '', status = 'ALL', businessType = '' } = {}) {
  requireSupabase();

  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status && status !== 'ALL') {
    query = query.eq('status', status);
  }

  if (businessType && businessType !== 'ALL') {
    query = query.eq('business_type', businessType);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) {
    console.error('fetchLeads error:', error);
    throw error;
  }

  const normalized = (data || []).map(normalizeLead);

  if (search.trim()) {
    const s = search.toLowerCase();
    const filtered = normalized.filter(
      (l) =>
        l.full_name.toLowerCase().includes(s) ||
        (l.email && l.email.toLowerCase().includes(s)) ||
        l.main_challenge.toLowerCase().includes(s)
    );
    return { leads: filtered, total: filtered.length };
  }

  return { leads: normalized, total: count || 0 };
}

/**
 * Fetch a single lead by ID including related records.
 */
export async function fetchLeadById(id) {
  requireSupabase();

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();

  if (leadError) throw leadError;

  const [followupsResult, emailsResult, consultationsResult] = await Promise.all([
    supabase.from('lead_followups').select('*').eq('lead_id', id).order('stage', { ascending: true }).catch(() => ({ data: [] })),
    supabase.from('email_events').select('*').eq('lead_id', id).order('created_at', { ascending: true }).catch(() => ({ data: [] })),
    supabase.from('consultations').select('*').eq('lead_id', id).order('created_at', { ascending: false }).limit(1).catch(() => ({ data: [] })),
  ]);

  return {
    lead: normalizeLead(lead),
    followups: followupsResult.data || [],
    emailEvents: emailsResult.data || [],
    consultation: consultationsResult.data?.[0] || null,
  };
}

/**
 * Create a new lead (admin manual entry).
 */
export async function createLead(leadData) {
  requireSupabase();

  const { data, error } = await supabase
    .from('leads')
    .insert([{
      full_name: leadData.fullName,
      name: leadData.fullName,
      email: leadData.email,
      phone: leadData.phone || null,
      business_type: leadData.businessType || null,
      main_challenge: leadData.mainChallenge,
      challenge: leadData.mainChallenge,
      business_age: leadData.businessAge || null,
      main_goal: leadData.mainGoal,
      goal: leadData.mainGoal,
      status: 'NEW',
    }])
    .select()
    .single();

  if (error) throw error;
  return normalizeLead(data);
}

/**
 * Update lead status.
 */
export async function updateLeadStatus(id, status) {
  requireSupabase();

  const { data, error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return normalizeLead(data);
}

/**
 * Fetch dashboard metrics from Supabase.
 */
export async function fetchDashboardMetrics() {
  requireSupabase();

  const [totalResult, newResult, followupResult, bookedResult] = await Promise.all([
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }).in('status', ['NEW', 'NO_RESPONSE']),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'CONTACTED'),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'BOOKED'),
  ]);

  return {
    total: totalResult.count || 0,
    needsAttention: newResult.count || 0,
    activeFollowups: followupResult.count || 0,
    booked: bookedResult.count || 0,
  };
}

/**
 * Fetch recent leads for the dashboard.
 */
export async function fetchRecentLeads(limit = 5) {
  requireSupabase();

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('fetchRecentLeads error:', error);
    throw error;
  }
  return (data || []).map(normalizeLead);
}
