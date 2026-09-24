import { useState, forwardRef } from 'react';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';
import { BUSINESS_TYPES, BUSINESS_AGES, URGENCY_OPTIONS } from '../constants/leadOptions';
import { validateLeadForm } from '../validation/leadSchema';

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  businessType: '',
  mainChallenge: '',
  businessAge: '',
  mainGoal: '',
  urgency: 'Just exploring',
};

const LeadForm = forwardRef(function LeadForm({ onSubmit, loading, serverError }, ref) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { errors: validationErrors, isValid } = validateLeadForm(values);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(values);
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <div role="alert" className="rounded-btn bg-danger-light border border-danger/20 px-4 py-3 text-sm text-danger">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          id="lead-fullName"
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder="e.g. Alistair Sterling"
          disabled={loading}
        />
        <Input
          label="Email Address *"
          id="lead-email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="name@company.com"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone / WhatsApp"
          id="lead-phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          placeholder="+44 7911 123456"
          disabled={loading}
        />
        <Select
          label="Business Type *"
          id="lead-businessType"
          name="businessType"
          value={values.businessType}
          onChange={handleChange}
          error={errors.businessType}
          disabled={loading}
        >
          {BUSINESS_TYPES.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <Textarea
        label="Main Challenge *"
        id="lead-mainChallenge"
        name="mainChallenge"
        value={values.mainChallenge}
        onChange={handleChange}
        error={errors.mainChallenge}
        placeholder="Describe current operational bottlenecks, scale plateaus, or leadership frictions..."
        rows={3}
        disabled={loading}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Business Age"
          id="lead-businessAge"
          name="businessAge"
          value={values.businessAge}
          onChange={handleChange}
          disabled={loading}
        >
          {BUSINESS_AGES.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
              {opt.label}
            </option>
          ))}
        </Select>
        <Input
          label="Main Goal *"
          id="lead-mainGoal"
          name="mainGoal"
          value={values.mainGoal}
          onChange={handleChange}
          error={errors.mainGoal}
          placeholder="e.g. Scale to $50k MRR"
          disabled={loading}
        />
      </div>

      {/* Urgency */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary">How Soon Would You Like to Get Started?</label>
        <div className="flex flex-wrap gap-2">
          {URGENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValues((prev) => ({ ...prev, urgency: opt.value }))}
              disabled={loading}
              className={`px-4 py-2 rounded-btn text-sm font-medium border transition-base
                ${values.urgency === opt.value
                  ? 'bg-accent-light border-accent text-accent'
                  : 'bg-surface border-border text-text-secondary hover:border-accent/50 hover:text-text-primary'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
});

export default LeadForm;
