import { useState } from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { BUSINESS_TYPES, BUSINESS_AGES, URGENCY_OPTIONS } from '../features/leads/constants/leadOptions';
import { validatePublicLeadForm } from '../features/leads/validation/leadSchema';
import { sendLeadToN8n } from '../lib/n8n';
import { createLead } from '../features/leads/services/leadService';
import { isN8nConfigured, isSupabaseConfigured } from '../config/env';

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  businessType: '',
  mainChallenge: '',
  businessAge: '1–3 years',
  mainGoal: '',
  urgency: 'Within the next month',
};

export default function LeadCapture() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function setUrgency(v) {
    setValues((prev) => ({ ...prev, urgency: v }));
  }

  function setBusinessAge(v) {
    setValues((prev) => ({ ...prev, businessAge: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { errors: validationErrors, isValid } = validatePublicLeadForm(values);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    if (!isN8nConfigured && !isSupabaseConfigured) {
      setStatus('error');
      setErrorMessage('The enquiry service is not currently configured. Please contact us directly.');
      return;
    }

    if (status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      // 1. If n8n is configured, let n8n handle lead storage and email automation
      if (isN8nConfigured) {
        await sendLeadToN8n(values);
      } else if (isSupabaseConfigured) {
        // Fallback: If n8n is not configured, save directly to Supabase
        await createLead(values);
      }

      setStatus('success');
    } catch (err) {
      console.warn('Primary submission failed, attempting direct Supabase fallback:', err);
      
      // Safety Fallback: If n8n failed or was unreachable, save directly to Supabase so the lead is never lost
      if (isSupabaseConfigured) {
        try {
          await createLead(values);
          setStatus('success');
          return;
        } catch (dbErr) {
          console.error('Direct Supabase save also failed:', dbErr);
        }
      }

      console.error('Lead submission failed:', err);
      setStatus('error');
      setErrorMessage(
        'Unable to connect to the enquiry service. Please check your connection or contact us directly.'
      );
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="bg-surface rounded-card border border-border shadow-card w-full max-w-md p-10 text-center">
          <div className="flex justify-center mb-5">
            <div className="h-16 w-16 bg-success-light rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2">Request received</h1>
          <p className="text-text-secondary mb-1">Thanks, your enquiry has been received.</p>
          <p className="text-text-secondary">Check your inbox for the next steps.</p>
        </div>
        <p className="mt-8 text-xs text-text-secondary">
          © {new Date().getFullYear()} Michael Carter Executive Advisory. All rights reserved.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="bg-surface rounded-card border border-border shadow-card w-full max-w-2xl p-8 sm:p-10">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-border">
            <h1 className="text-3xl font-semibold text-text-primary mb-2">
              Tell Me About Your Business
            </h1>
            <p className="text-text-secondary text-base leading-relaxed">
              Share a few details about your business and the challenge you're currently facing.
              I'll review your enquiry and get back to you with the next steps.
            </p>
          </div>

          {/* Error banner */}
          {status === 'error' && (
            <div role="alert" className="mb-6 rounded-btn bg-danger-light border border-danger/20 px-4 py-3 text-sm text-danger">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Name + Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                id="public-fullName"
                name="fullName"
                value={values.fullName}
                onChange={handleChange}
                error={errors.fullName}
                placeholder="e.g. Alex Morgan"
                disabled={status === 'submitting'}
              />
              <Input
                label="Email Address *"
                id="public-email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="alex@company.com"
                disabled={status === 'submitting'}
              />
            </div>

            {/* Phone + Business Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label={<span>Phone / WhatsApp <span className="text-text-secondary font-normal">(Optional)</span></span>}
                  id="public-phone"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  hint="For urgent calendar coordination"
                  disabled={status === 'submitting'}
                />
              </div>
              <Select
                label="Business Type *"
                id="public-businessType"
                name="businessType"
                value={values.businessType}
                onChange={handleChange}
                error={errors.businessType}
                disabled={status === 'submitting'}
              >
                {BUSINESS_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Challenge */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="public-mainChallenge" className="text-sm font-medium text-text-primary">
                  Main Business Challenge *
                </label>
                <span className="text-xs text-text-secondary">Be specific</span>
              </div>
              <textarea
                id="public-mainChallenge"
                name="mainChallenge"
                value={values.mainChallenge}
                onChange={handleChange}
                rows={4}
                placeholder="What is the primary operational or revenue obstacle right now?"
                disabled={status === 'submitting'}
                aria-invalid={!!errors.mainChallenge}
                aria-describedby={errors.mainChallenge ? 'challenge-error' : undefined}
                className={`w-full px-3 py-2.5 text-sm rounded-input border bg-surface text-text-primary
                  placeholder:text-text-secondary/60 transition-base resize-y
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${errors.mainChallenge ? 'border-danger' : 'border-border'}`}
              />
              {errors.mainChallenge && (
                <p id="challenge-error" role="alert" className="mt-1 text-xs text-danger">{errors.mainChallenge}</p>
              )}
            </div>

            {/* Business Age */}
            <div>
              <label className="text-sm font-medium text-text-primary block mb-2">Business Age</label>
              <div className="flex flex-wrap gap-2">
                {BUSINESS_AGES.filter(b => b.value).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setBusinessAge(opt.value)}
                    disabled={status === 'submitting'}
                    className={`px-4 py-2 rounded-btn text-sm font-medium border transition-base
                      ${values.businessAge === opt.value
                        ? 'bg-accent-light border-accent text-accent'
                        : 'bg-surface border-border text-text-secondary hover:border-accent/40'
                      } disabled:opacity-50`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Goal */}
            <Input
              label="Main Goal *"
              id="public-mainGoal"
              name="mainGoal"
              value={values.mainGoal}
              onChange={handleChange}
              error={errors.mainGoal}
              placeholder="e.g. Scale to $50k MRR, systematize client acquisition, high-ticket packaging"
              disabled={status === 'submitting'}
            />

            {/* Urgency */}
            <div>
              <label className="text-sm font-medium text-text-primary block mb-2">
                How Soon Would You Like to Get Started?
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                {URGENCY_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-btn border cursor-pointer transition-base
                      ${values.urgency === opt.value
                        ? 'border-accent bg-accent-light'
                        : 'border-border bg-surface hover:border-accent/40'
                      }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={opt.value}
                      checked={values.urgency === opt.value}
                      onChange={() => setUrgency(opt.value)}
                      className="h-4 w-4 accent-accent"
                      disabled={status === 'submitting'}
                    />
                    <span className={`text-sm ${values.urgency === opt.value ? 'text-accent font-medium' : 'text-text-secondary'}`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                loading={status === 'submitting'}
                disabled={status === 'submitting'}
              >
                Request My Free Consultation →
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Shield className="h-3.5 w-3.5 text-text-secondary" />
                <p className="text-xs text-text-secondary">
                  Your information is kept private and only used to respond to your enquiry.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <footer className="py-6 text-center">
        <p className="text-xs text-text-secondary">
          © {new Date().getFullYear()} Michael Carter Executive Advisory. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
