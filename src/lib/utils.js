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
