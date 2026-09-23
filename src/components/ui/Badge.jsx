import { cn } from '../../lib/utils';

const variants = {
  // Primary Lead Statuses
  NEW: 'bg-warning-light text-warning border border-warning/20',
  CONTACTED: 'bg-[#F3E2DC] text-[#BD6B52] border border-[#BD6B52]/20 font-medium',
  BOOKED: 'bg-[#E4F2EB] text-[#3E8F68] border border-[#3E8F68]/20 font-medium',
  NO_RESPONSE: 'bg-hover text-text-secondary border border-border',

  // Semantic variants
  terracotta: 'bg-[#F3E2DC] text-[#BD6B52] border border-[#BD6B52]/20',
  success: 'bg-[#E4F2EB] text-[#3E8F68] border border-[#3E8F68]/20',
  warning: 'bg-warning-light text-warning border border-warning/20',
  danger: 'bg-danger-light text-danger border border-danger/20',
  neutral: 'bg-hover text-text-secondary border border-border',
  default: 'bg-hover text-text-secondary border border-border',
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
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-medium tracking-wide border',
        variants[resolvedVariant] || variants.default,
        className
      )}
    >
      {resolvedLabel}
    </span>
  );
}
