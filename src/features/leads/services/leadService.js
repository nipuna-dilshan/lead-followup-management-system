import supabase from '../../../lib/supabase';
import { isSupabaseConfigured } from '../../../config/env';
import { DEFAULT_PAGE_SIZE } from '../../../lib/constants';

function requireSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }
}

export function calculateAutoStage(lead) {
  if (!lead) return 0;
  if (lead.status === 'BOOKED' || lead.status === 'NO_RESPONSE') {
    return lead.follow_up_stage || lead.followup_stage || 0;
  }

  const createdAt = lead.created_at ? new Date(lead.created_at).getTime() : Date.now();
  const now = Date.now();
  const daysElapsed = (now - createdAt) / (1000 * 60 * 60 * 24);

  let calculatedStage = lead.follow_up_stage ?? lead.followup_stage ?? 0;

  // Cadence:
  // - 2+ days elapsed -> Follow-up 1 has been dispatched (Stage 1)
  // - 4+ days elapsed -> Follow-up 2 has been dispatched (Stage 2)
  // - 7+ days elapsed -> Final Follow-up has been dispatched (Stage 3)
  if (daysElapsed >= 7) {
    calculatedStage = Math.max(calculatedStage, 3);
  } else if (daysElapsed >= 4) {
    calculatedStage = Math.max(calculatedStage, 2);
  } else if (daysElapsed >= 2) {
    calculatedStage = Math.max(calculatedStage, 1);
  }

  return calculatedStage;
}

function normalizeLead(lead) {
  if (!lead) return lead;
  const consultation =
    lead.consultations && lead.consultations.length > 0
      ? [...lead.consultations].sort((a, b) => new Date(b.created_at || b.start_time) - new Date(a.created_at || a.start_time))[0]
      : null;

  const autoStage = calculateAutoStage(lead);
  const effectiveFollowUpStage = Math.max(lead.follow_up_stage || 0, lead.followup_stage || 0, autoStage);

  // Sync to database if stage advanced automatically
  if (autoStage > (lead.follow_up_stage || 0) && supabase && lead.id) {
    supabase
      .from('leads')
      .update({
        follow_up_stage: effectiveFollowUpStage,
        followup_stage: effectiveFollowUpStage,
        status: lead.status === 'NEW' ? 'CONTACTED' : lead.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead.id)
      .then(() => {})
      .catch(() => {});
  }

  return {
    ...lead,
    full_name: lead.full_name || lead.name || 'Unnamed Client',
    name: lead.name || lead.full_name || 'Unnamed Client',
    main_challenge: lead.main_challenge || lead.challenge || '',
    challenge: lead.challenge || lead.main_challenge || '',
    main_goal: lead.main_goal || lead.goal || '',
    goal: lead.goal || lead.main_goal || '',
    follow_up_stage: effectiveFollowUpStage,
    followup_stage: effectiveFollowUpStage,
    consultation,
  };
}

/**
 * Fetch paginated, filtered leads.
 */
export async function fetchLeads({ page = 1, pageSize = DEFAULT_PAGE_SIZE, search = '', status = 'ALL', businessType = '' } = {}) {
  requireSupabase();

  let query = supabase
    .from('leads')
    .select(`
      *,
      consultations (
        id,
        start_time,
        end_time,
        meeting_url,
        status,
        created_at
      ),
      lead_followups (
        id,
        stage,
        status,
        scheduled_at,
        sent_at
      )
    `, { count: 'exact' })
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
    supabase.from('lead_followups').select('*').eq('lead_id', id).order('stage', { ascending: true }),
    supabase.from('email_events').select('*').eq('lead_id', id).order('created_at', { ascending: true }),
    supabase.from('consultations').select('*').eq('lead_id', id).order('created_at', { ascending: false }).limit(1),
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
 * Update lead follow-up stage and log timeline events.
 */
export async function updateLeadFollowUpStage(id, stage) {
  requireSupabase();

  const now = new Date().toISOString();

  // Update lead follow-up stage (both columns for compatibility)
  const { data, error } = await supabase
    .from('leads')
    .update({
      follow_up_stage: stage,
      followup_stage: stage,
      status: 'CONTACTED',
      last_contacted_at: now,
      updated_at: now,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  // Log to email_events and lead_followups so audit timeline and checkmarks update
  const stageNames = {
    1: { type: 'FOLLOW_UP_1', title: 'Follow-up #1: Diagnostic Framework' },
    2: { type: 'FOLLOW_UP_2', title: 'Follow-up #2: Client Case Study' },
    3: { type: 'FINAL_FOLLOW_UP', title: 'Final Follow-up: Availability Close' },
  };

  const currentInfo = stageNames[stage];
  if (currentInfo) {
    try {
      await Promise.allSettled([
        supabase.from('email_events').insert([{
          lead_id: id,
          type: currentInfo.type,
          subject: currentInfo.title,
          status: 'SENT',
          sent_at: now,
        }]),
        supabase.from('lead_followups').insert([{
          lead_id: id,
          stage: stage,
          status: 'SENT',
          sent_at: now,
        }]),
      ]);
    } catch (e) {
      console.warn('Logging follow-up event warning:', e);
    }
  }

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
    .select(`
      *,
      consultations (
        id,
        start_time,
        end_time,
        meeting_url,
        status,
        created_at
      )
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('fetchRecentLeads error:', error);
    throw error;
  }
  return (data || []).map(normalizeLead);
}
