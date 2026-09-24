import { format, formatDistanceToNow, isToday, isTomorrow, parseISO } from 'date-fns';

/**
 * Merges class names, filtering falsy values.
 * Lightweight alternative to clsx.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Formats a date string or Date object to a human-readable format.
 */
export function formatDate(date, pattern = 'MMM d, yyyy') {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern);
}

/**
 * Formats a date to a time string.
 */
export function formatTime(date, pattern = 'h:mm a') {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, pattern);
}

/**
 * Returns relative time string (e.g. "3 days ago").
 */
export function timeAgo(date) {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

/**
 * Returns a human label for dates relative to today.
 */
export function relativeDateLabel(date) {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isToday(d)) return `Today, ${format(d, 'h:mm a')}`;
  if (isTomorrow(d)) return `Tomorrow, ${format(d, 'h:mm a')}`;
  return formatDate(d, 'MMM d, h:mm a');
}

/**
 * Returns the greeting based on the current hour.
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Generates initials from a full name.
 */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

/**
 * Truncates a string to a max length.
 */
export function truncate(str, maxLength = 80) {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str;
}

/**
 * Capitalises the first letter of a string.
 */
export function capitalise(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Formats a follow-up stage as a readable label.
 */
export function formatFollowUpStage(stage) {
  if (stage === null || stage === undefined) return 'Not started';
  if (stage === 0) return 'Not started';
  return `Stage ${stage} / 3`;
}

/**
 * Calculates next follow-up date and details for a lead.
 * Cadence:
 * - Stage 0 -> Follow-up 1 (due in +2 days from created_at)
 * - Stage 1 -> Follow-up 2 (due in +4 days from created_at)
 * - Stage 2 -> Final Follow-up (due in +7 days from created_at)
 * - Stage 3+ -> Sequence completed (3 of 3 sent)
 */
export function getNextFollowUpInfo(lead) {
  if (!lead) return null;

  // 1. If lead is booked with a consultation session date/time
  if (lead.status === 'BOOKED' && lead.consultation?.start_time) {
    const sessionDate = new Date(lead.consultation.start_time);
    return {
      type: 'BOOKED_SESSION',
      date: sessionDate,
      formattedDate: formatDate(sessionDate, 'MMM d, yyyy'),
      time: formatTime(sessionDate, 'hh:mm a'),
      label: 'Session',
    };
  }

  // 2. If lead is marked BOOKED, but consultation call date is not yet synced/scheduled
  if (lead.status === 'BOOKED') {
    return {
      type: 'BOOKED_PENDING',
      label: 'Consultation Booked',
      sublabel: 'Awaiting Schedule',
    };
  }

  const stage = typeof lead.follow_up_stage === 'number' ? lead.follow_up_stage : 0;
  const createdAt = lead.created_at ? new Date(lead.created_at) : new Date();

  // 3. If all 3 stages completed or lead marked as NO_RESPONSE
  if (stage >= 3 || lead.status === 'NO_RESPONSE') {
    return {
      type: 'COMPLETED',
      label: 'Sequence Ended',
      sublabel: '3 of 3 emails sent',
    };
  }

  // 4. Check if lead has scheduled followups in lead_followups table
  if (lead.lead_followups && Array.isArray(lead.lead_followups)) {
    const scheduled = lead.lead_followups
      .filter((f) => (f.status === 'SCHEDULED' || f.status === 'PENDING') && f.scheduled_at)
      .sort((a, b) => new Date(a.scheduled_at) - new Date(b.scheduled_at))[0];

    if (scheduled) {
      const scheduledDate = new Date(scheduled.scheduled_at);
      const stageNum = scheduled.stage || (stage + 1);
      return {
        type: 'UPCOMING_FOLLOWUP',
        date: scheduledDate,
        formattedDate: formatDate(scheduledDate, 'MMM d, yyyy'),
        stage: stageNum,
        label: stageNum >= 3 ? 'Final Follow-up' : `Follow-up ${stageNum}`,
        sublabel: `Stage ${stageNum} of 3`,
      };
    }
  }

  // 5. Standard Cadence Calculation:
  // - Stage 0: Next is Follow-up 1 (+2 days from created_at)
  // - Stage 1: Next is Follow-up 2 (+4 days from created_at)
  // - Stage 2: Next is Final Follow-up (+7 days from created_at)
  let daysToAdd = 2;
  let nextStage = 1;
  let stageTitle = 'Follow-up 1';

  if (stage === 1) {
    daysToAdd = 4;
    nextStage = 2;
    stageTitle = 'Follow-up 2';
  } else if (stage === 2) {
    daysToAdd = 7;
    nextStage = 3;
    stageTitle = 'Final Follow-up';
  }

  const dueDate = new Date(createdAt.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

  return {
    type: 'UPCOMING_FOLLOWUP',
    date: dueDate,
    formattedDate: formatDate(dueDate, 'MMM d, yyyy'),
    stage: nextStage,
    label: stageTitle,
    sublabel: `Stage ${nextStage} of 3`,
  };
}
