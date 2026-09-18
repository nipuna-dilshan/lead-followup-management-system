import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TOAST_DURATION } from '../../lib/constants';

const ToastContext = createContext(null);

const icons = {
  success: <CheckCircle className="h-4 w-4 text-success shrink-0" />,
  error: <XCircle className="h-4 w-4 text-danger shrink-0" />,
  warning: <AlertCircle className="h-4 w-4 text-warning shrink-0" />,
};

const borderColors = {
  success: 'border-l-success',
  error: 'border-l-danger',
  warning: 'border-l-warning',
};

function ToastItem({ id, message, type = 'success', onDismiss }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 bg-surface border border-border border-l-4 rounded-card px-4 py-3',
        'shadow-card w-full max-w-sm animate-slide-in',
        borderColors[type]
      )}
    >
      {icons[type]}
      <p className="flex-1 text-sm text-text-primary leading-snug">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="shrink-0 text-text-secondary hover:text-text-primary transition-base ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ message, type = 'success', duration = TOAST_DURATION }) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="assertive"
        className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem {...t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}

export default ToastProvider;
