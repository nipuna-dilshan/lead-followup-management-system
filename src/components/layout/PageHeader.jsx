import { cn } from '../../lib/utils';

export default function PageHeader({ title, description, actions, className }) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6', className)}>
      <div>
        {title && (
          <h1 className="text-2xl sm:text-[32px] font-[650] text-text-primary tracking-tight leading-tight">
            {title}
          </h1>
        )}
        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">{actions}</div>
      )}
    </div>
  );
}
