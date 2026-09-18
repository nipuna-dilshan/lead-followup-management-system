import { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';

function Toggle({ label, description, checked, onChange }) {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <label htmlFor={id} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0 cursor-pointer group">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
      </div>
      <div className="relative shrink-0 mt-0.5">
        <input
          id={id}
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`w-10 h-5 rounded-full transition-base peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-1
          ${checked ? 'bg-accent' : 'bg-border'}`}
        />
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform
          ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </div>
    </label>
  );
}

export default function NotificationSettings({ profile, onSave, saving }) {
  const [prefs, setPrefs] = useState({
    notification_email: true,
    notification_followup: true,
    ...profile,
  });

  useEffect(() => {
    if (profile) setPrefs((prev) => ({ ...prev, ...profile }));
  }, [profile]);

  function handleSave(e) {
    e.preventDefault();
    onSave({
      notification_email: prefs.notification_email,
      notification_followup: prefs.notification_followup,
    });
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-4">
      <div className="bg-surface rounded-btn border border-border px-4 py-1">
        <Toggle
          label="Email notifications"
          description="Receive an email when a new enquiry is submitted."
          checked={!!prefs.notification_email}
          onChange={(v) => setPrefs((p) => ({ ...p, notification_email: v }))}
        />
        <Toggle
          label="Follow-up reminders"
          description="Receive reminders about pending follow-up actions."
          checked={!!prefs.notification_followup}
          onChange={(v) => setPrefs((p) => ({ ...p, notification_followup: v }))}
        />
      </div>
      <Button type="submit" loading={saving}>
        Save Preferences
      </Button>
    </form>
  );
}
