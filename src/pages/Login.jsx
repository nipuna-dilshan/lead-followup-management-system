import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import LoginForm from '../features/auth/components/LoginForm';
import { useAuth } from '../features/auth/hooks/useAuth';
import { isSupabaseConfigured } from '../config/env';

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
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 bg-accent-light border border-accent/20 rounded-card flex items-center justify-center">
            <Lock className="h-6 w-6 text-accent" />
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
        Authenticated Advisory Workspace · Ver. 1.0
      </p>
    </div>
  );
}
