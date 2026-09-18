import { cn } from '../../lib/utils';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background border border-border">
          <Icon className="h-6 w-6 text-text-secondary" />
        </div>
      )}
      {title && (
        <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-text-secondary max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
