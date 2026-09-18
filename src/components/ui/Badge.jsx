import { cn } from '../../lib/utils';

const variants = {
  NEW: 'bg-warning-light text-warning border border-warning/20',
  CONTACTED: 'bg-accent-light text-accent border border-accent/20',
  BOOKED: 'bg-success-light text-success border border-success/20',
  NO_RESPONSE: 'bg-background text-text-secondary border border-border',
  // Generic
  success: 'bg-success-light text-success border border-success/20',
  warning: 'bg-warning-light text-warning border border-warning/20',
  danger: 'bg-danger-light text-danger border border-danger/20',
  default: 'bg-background text-text-secondary border border-border',
};

const labels = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  BOOKED: 'Booked',
  NO_RESPONSE: 'No Response',
};

export default function Badge({ status, variant, label, className }) {
  const resolvedVariant = variant || status || 'default';
  const resolvedLabel = label || labels[status] || status;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium tracking-wide',
        variants[resolvedVariant] || variants.default,
        className
      )}
    >
      {resolvedLabel}
    </span>
  );
}
