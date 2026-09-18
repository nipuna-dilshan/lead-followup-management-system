/**
 * Auth validation schema
 * Manual validation without external library dependencies.
 */

export function validateLoginForm({ email, password }) {
  const errors = {};

  if (!email || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password || !password.trim()) {
    errors.password = 'Password is required.';
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}
