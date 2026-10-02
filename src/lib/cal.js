import { CAL_BOOKING_URL } from './constants';

/**
 * Builds a dynamic Cal.com booking URL with pre-filled lead information.
 * Binds attendee email, name, and lead identifier to ensure calendar bookings
 * seamlessly match incoming CRM inquiries.
 *
 * @param {string} [baseUrl] - Base Cal.com calendar URL
 * @param {Object} [lead] - Lead data object
 * @param {string} [lead.email] - Client email address
 * @param {string} [lead.fullName] - Client full name (camelCase)
 * @param {string} [lead.full_name] - Client full name (snake_case)
 * @param {string} [lead.name] - Client name fallback
 * @param {string} [lead.id] - Lead UUID in Supabase
 * @param {string} [lead.lead_id] - Lead UUID fallback
 * @returns {string} Fully qualified URL with query parameters
 */
export function buildCalBookingUrl(baseUrl = CAL_BOOKING_URL, lead = {}) {
  const targetUrl = baseUrl || CAL_BOOKING_URL;
  if (!targetUrl) return '';

  const email = lead?.email ? String(lead.email).trim() : '';
  const name = (lead?.fullName || lead?.full_name || lead?.name)
    ? String(lead.fullName || lead.full_name || lead.name).trim()
    : '';
  const leadId = lead?.id || lead?.lead_id ? String(lead.id || lead.lead_id).trim() : '';

  try {
    const parsedUrl = new URL(targetUrl);

    if (email) {
      parsedUrl.searchParams.set('email', email);
    }
    if (name) {
      parsedUrl.searchParams.set('name', name);
    }
    if (leadId) {
      parsedUrl.searchParams.set('metadata[lead_id]', leadId);
    }

    return parsedUrl.toString();
  } catch {
    // Graceful fallback for non-standard or relative URLs
    const params = new URLSearchParams();
    if (email) params.set('email', email);
    if (name) params.set('name', name);
    if (leadId) params.set('metadata[lead_id]', leadId);

    const queryString = params.toString();
    if (!queryString) return targetUrl;

    const separator = targetUrl.includes('?') ? '&' : '?';
    return `${targetUrl}${separator}${queryString}`;
  }
}
