import { useState } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { validateLoginForm } from '../validation/authSchema';

export default function LoginForm({ onSubmit, loading, serverError }) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { errors: validationErrors, isValid } = validateLoginForm(values);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <div role="alert" className="rounded-btn bg-danger-light border border-danger/20 px-4 py-3 text-sm text-danger">
          {serverError}
        </div>
      )}

      <Input
        label="Email Address"
        id="login-email"
        name="email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="michael@cartergrowth.com"
        rightElement={<Mail className="h-4 w-4 text-text-secondary" />}
        disabled={loading}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="text-sm font-medium text-text-primary">
            Password
          </label>
          <span className="text-xs text-accent cursor-not-allowed opacity-60" title="Password reset is handled through Supabase dashboard">
            Forgot password?
          </span>
        </div>
        <div className="relative">
          <input
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
            disabled={loading}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            className={`w-full h-10 px-3 pr-10 text-sm rounded-input border bg-surface text-text-primary
              placeholder:text-text-secondary/60 transition-base
              focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              ${errors.password ? 'border-danger' : 'border-border'}`}
            placeholder="••••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-text-primary"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" role="alert" className="text-xs text-danger">{errors.password}</p>
        )}
      </div>

      <Button type="submit" loading={loading} className="w-full" size="lg">
        Sign In →
      </Button>
    </form>
  );
}
