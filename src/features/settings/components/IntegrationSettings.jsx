import { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { env, isN8nConfigured, isSupabaseConfigured } from '../../../config/env';
import { ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

function StatusIndicator({ configured, label }) {
  return (
    <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-btn ${
      configured ? 'bg-success-light text-success' : 'bg-warning-light text-warning'
    }`}>
      {configured
        ? <CheckCircle className="h-4 w-4" />
        : <AlertCircle className="h-4 w-4" />}
      {configured ? `${label} connected` : `${label} not configured`}
    </div>
  );
}

export default function IntegrationSettings({ profile, onSave, saving }) {
  const [bookingUrl, setBookingUrl] = useState(env.calBookingUrl);

  useEffect(() => {
    if (profile?.booking_url) setBookingUrl(profile.booking_url);
  }, [profile]);

  function handleSave(e) {
    e.preventDefault();
    onSave({ booking_url: bookingUrl });
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Status */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-text-primary">Integration Status</h4>
        <StatusIndicator configured={isSupabaseConfigured} label="Supabase database" />
        <StatusIndicator configured={isN8nConfigured} label="n8n automation webhook" />
      </div>

      {/* Booking URL */}
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <Input
            label="Booking Calendar URL"
            id="integration-booking-url"
            value={bookingUrl}
            onChange={(e) => setBookingUrl(e.target.value)}
            hint="Your Cal.com booking link, used in welcome emails."
            disabled={saving}
          />
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-xs text-accent hover:underline"
          >
            Open booking page <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="p-4 bg-background rounded-btn border border-border">
          <p className="text-xs font-medium text-text-secondary mb-1">n8n Webhook</p>
          <p className="text-xs text-text-secondary">
            {isN8nConfigured
              ? 'Configured via VITE_N8N_LEAD_WEBHOOK_URL environment variable.'
              : 'Not configured. Set VITE_N8N_LEAD_WEBHOOK_URL in your .env file.'}
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Webhook credentials are never exposed in this interface for security.
          </p>
        </div>

        <Button type="submit" loading={saving}>
          Save Integration Settings
        </Button>
      </form>
    </div>
  );
}
