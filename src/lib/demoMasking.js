/**
 * Demo Account Data Masking Service
 *
 * NOTE: Masking is disabled so that live records, test workflows,
 * and email binding operate normally with real lead data.
 */

export const DEMO_EMAILS = [];

/**
 * Checks if the given user or session is a demo user.
 * @returns {boolean} Always false to ensure real data is displayed and synced.
 */
export function isDemoUser() {
  return false;
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
