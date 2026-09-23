import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../features/auth/components/LoginForm';
import { useAuth } from '../features/auth/hooks/useAuth';
import { isSupabaseConfigured } from '../config/env';
import { APP_VERSION } from '../lib/constants';

export default function Login() {
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Already logged in → go to admin
  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  async function handleSubmit(values) {
    setLoading(true);
    setServerError('');
    try {
      await signIn(values);
      navigate('/admin', { replace: true });
    } catch (err) {
      setServerError(
        err.message === 'Invalid login credentials'
          ? 'Incorrect email or password. Please try again.'
          : err.message || 'Sign in failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="bg-surface rounded-card border border-border shadow-card w-full max-w-md p-8 sm:p-10">
        {/* Brand Logo */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-white border border-border shadow-sm flex items-center justify-center">
            <svg
              className="w-7 h-7 text-[#BD6B52]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="4" y="8" width="4" height="12" rx="1.5" />
              <rect x="11" y="4" width="4" height="16" rx="1.5" />
              <rect x="18" y="11" width="4" height="9" rx="1.5" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-2">
            Business Growth Coach
          </p>
          <h1 className="text-3xl font-semibold text-text-primary">Welcome back</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Sign in to manage your enquiries and consultations.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-6 rounded-btn bg-warning-light border border-warning/20 px-4 py-3 text-sm text-warning">
            Supabase is not configured. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env to enable login.
          </div>
        )}

        <LoginForm
          onSubmit={handleSubmit}
          loading={loading}
          serverError={serverError}
        />
      </div>

      <p className="mt-8 text-xs text-text-secondary tracking-widest uppercase">
        Authenticated Advisory Workspace · Ver. {APP_VERSION}
      </p>
    </div>
  );
}
