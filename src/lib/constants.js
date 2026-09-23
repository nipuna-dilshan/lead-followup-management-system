// =============================================================
// App-wide constants
// =============================================================

export const COACH_NAME = 'Michael Carter';
export const COACH_TITLE = 'Business Growth Coach';
export const COACH_PRACTICE = 'Executive Practice';

export const CAL_BOOKING_URL =
  'https://cal.com/nipun-dilshan-p5amnb/business-growth-consultation';

// Lead statuses
export const LEAD_STATUS = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  BOOKED: 'BOOKED',
  NO_RESPONSE: 'NO_RESPONSE',
};

export const LEAD_STATUS_LABELS = {
  [LEAD_STATUS.NEW]: 'New',
  [LEAD_STATUS.CONTACTED]: 'Contacted',
  [LEAD_STATUS.BOOKED]: 'Booked',
  [LEAD_STATUS.NO_RESPONSE]: 'No Response',
};

export const ALL_STATUSES = Object.values(LEAD_STATUS);

// Follow-up statuses
export const FOLLOWUP_STATUS = {
  PENDING: 'PENDING',
  SCHEDULED: 'SCHEDULED',
  SENT: 'SENT',
  SKIPPED: 'SKIPPED',
};

// Email event types
export const EMAIL_TYPE = {
  WELCOME: 'WELCOME',
  FOLLOW_UP_1: 'FOLLOW_UP_1',
  FOLLOW_UP_2: 'FOLLOW_UP_2',
  FINAL_FOLLOW_UP: 'FINAL_FOLLOW_UP',
};

export const EMAIL_TYPE_LABELS = {
  [EMAIL_TYPE.WELCOME]: 'Welcome Email',
  [EMAIL_TYPE.FOLLOW_UP_1]: 'Follow-up #1',
  [EMAIL_TYPE.FOLLOW_UP_2]: 'Follow-up #2',
  [EMAIL_TYPE.FINAL_FOLLOW_UP]: 'Final Follow-up',
};

// Consultation statuses
export const CONSULTATION_STATUS = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Toast auto-dismiss duration (ms)
export const TOAST_DURATION = 4000;
