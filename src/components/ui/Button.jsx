import { cn } from '../../lib/utils';
import Spinner from './Spinner';

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-dark focus-visible:ring-accent',
  secondary:
    'bg-surface text-text-primary border border-border hover:bg-background focus-visible:ring-accent',
  ghost:
    'bg-transparent text-text-secondary hover:bg-background hover:text-text-primary focus-visible:ring-accent',
  danger:
    'bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger',
};

const sizes = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className,
  onClick,
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-btn transition-base',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  );
}
