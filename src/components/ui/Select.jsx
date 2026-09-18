import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Select = forwardRef(function Select(
  { label, error, hint, id, disabled = false, className, containerClassName, children, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'w-full h-10 pl-3 pr-9 text-sm rounded-input border bg-surface text-text-primary appearance-none',
            'transition-base focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-background',
            error ? 'border-danger focus:ring-danger' : 'border-border hover:border-text-secondary/40',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="h-4 w-4 text-text-secondary" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-text-secondary">{hint}</p>
      )}
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-danger">{error}</p>
      )}
    </div>
  );
});

export default Select;
