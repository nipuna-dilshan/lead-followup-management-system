export function validateLeadForm(values) {
  const errors = {};

  if (!values.fullName?.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!values.email?.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.businessType) {
    errors.businessType = 'Please select a business type.';
  }

  if (!values.mainChallenge?.trim()) {
    errors.mainChallenge = 'Main business challenge is required.';
  } else if (values.mainChallenge.trim().length < 10) {
    errors.mainChallenge = 'Please provide more detail about your challenge (at least 10 characters).';
  }

  if (!values.mainGoal?.trim()) {
    errors.mainGoal = 'Main goal is required.';
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

export function validatePublicLeadForm(values) {
  return validateLeadForm(values);
}
