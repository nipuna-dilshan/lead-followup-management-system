import { cn } from '../../lib/utils';
import Spinner from './Spinner';

const variants = {
  primary: 'bg-[#BD6B52] text-white hover:bg-[#A95C46] border-none font-semibold shadow-xs focus-visible:ring-[#BD6B52]',
  secondary:
    'bg-surface text-text-primary border border-border hover:bg-hover focus-visible:ring-[#BD6B52] font-medium',
  ghost:
    'bg-transparent text-text-secondary hover:bg-hover hover:text-text-primary focus-visible:ring-[#BD6B52]',
  danger:
    'bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger font-semibold',
};

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-[8px]',
  md: 'h-[42px] px-4 sm:px-[18px] text-sm gap-2 rounded-btn font-semibold',
  lg: 'h-[46px] px-5 sm:px-6 text-base gap-2 rounded-btn font-semibold',
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
        'inline-flex items-center justify-center transition-base cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
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
