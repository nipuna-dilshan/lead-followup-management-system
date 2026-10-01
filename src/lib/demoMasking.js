/**
 * Demo Account Data Masking Service
 *
 * Automatically detects if the authenticated user is a demo/evaluator account
 * (e.g. 'testuser@gmail.com') and masks private lead contact information
 * (email, phone, etc.) with professional dummy data across all UI views.
 *
 * Actual database records, webhooks, n8n automations, and booking workflows
 * remain 100% untouched so the live system operates normally.
 */

export const DEMO_EMAILS = [
  'testuser@gmail.com',
];

/**
 * Checks if the given user or session is a demo user.
 * @param {object|null} user - The authenticated Supabase user object
 * @returns {boolean}
 */
export function isDemoUser(user) {
  if (!user || !user.email) return false;
  const normalized = user.email.trim().toLowerCase();
  return DEMO_EMAILS.includes(normalized);
}

/**
 * Deterministic integer hash from a string so that the same lead
 * always gets the exact same dummy contact info on all views/refreshes.
 */
function hashString(str) {
  if (!str) return 42;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

const DUMMY_DOMAINS = [
  'growthbrand.co',
  'apexadvisory.io',
  'vanguardbrands.com',
  'scalecraft.io',
  'luminahealth.co',
];

/**
 * Returns professional dummy contact details for a lead.
 * e.g., client1@growthbrand.co, +1 (555) 234-5678
 */
export function getMaskedContact(lead, index = 0) {
  if (!lead) {
    return { email: 'client@growthbrand.co', phone: '+1 (555) 234-5678' };
  }

  // Use lead.id or full_name for stable hashing; fallback to index
  const seed = hashString(lead.id || lead.full_name || String(index + 1));
  const clientNumber = (seed % 20) + 1; // 1 to 20
  const domain = DUMMY_DOMAINS[seed % DUMMY_DOMAINS.length];
  const dummyEmail = `client${clientNumber}@${domain}`;

  // Professional dummy phone format: +1 (555) 234-5678
  const areaOffset = (seed % 700) + 200; // 200 - 899
  const lineOffset = ((seed * 13) % 9000) + 1000; // 1000 - 9999
  const dummyPhone = `+1 (555) ${areaOffset}-${lineOffset}`;

  return {
    email: dummyEmail,
    phone: lead.phone ? dummyPhone : null,
  };
}

// Specific name overrides for sensitive client records during demo preview
const SENSITIVE_NAME_REPLACEMENTS = [
  { pattern: /sanuji|sasithma|saithma/i, replacement: 'Sarah Mitchell' },
];

export function maskLeadName(name) {
  if (!name) return name;
  for (const item of SENSITIVE_NAME_REPLACEMENTS) {
    if (item.pattern.test(name)) {
      return item.replacement;
    }
  }
  return name;
}

/**
 * Masks a single lead object if isDemo is true.
 */
export function maskLead(lead, isDemo = false, index = 0) {
  if (!lead || !isDemo) return lead;

  const masked = getMaskedContact(lead, index);
  const safeFullName = maskLeadName(lead.full_name);
  const safeName = maskLeadName(lead.name);

  return {
    ...lead,
    full_name: safeFullName,
    name: safeName,
    email: masked.email,
    phone: masked.phone,
    _isDemoMasked: true,
  };
}

/**
 * Masks an array of leads if isDemo is true.
 */
export function maskLeadList(leads, isDemo = false) {
  if (!Array.isArray(leads) || !isDemo) return leads || [];
  return leads.map((lead, idx) => maskLead(lead, true, idx));
}
