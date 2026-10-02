/**
 * Demo Account Data Masking Service
 *
 * NOTE: Masking is disabled so that live records, test workflows,
 * and email binding operate normally with real lead data.
 */

export const DEMO_EMAILS = [
  'testuser@gmail.com',
];

/**
 * Checks if the given user or session is a demo evaluator user.
 * Enables the demo badge in the UI while keeping live data unmasked.
 * @param {object|null} user - The authenticated Supabase user object
 * @returns {boolean}
 */
export function isDemoUser(user) {
  if (!user || !user.email) return false;
  const normalized = user.email.trim().toLowerCase();
  return DEMO_EMAILS.includes(normalized);
}

export function getMaskedContact(lead) {
  if (!lead) {
    return { email: '', phone: null };
  }
  return {
    email: lead.email || '',
    phone: lead.phone || null,
  };
}

export function maskLeadName(name) {
  return name || '';
}

/**
 * Masks a single lead object. Returns original lead without modification.
 */
export function maskLead(lead) {
  return lead;
}

/**
 * Masks an array of leads. Returns original leads array without modification.
 */
export function maskLeadList(leads) {
  return leads || [];
}
