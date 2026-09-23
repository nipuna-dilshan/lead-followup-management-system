import { useState, useEffect, useRef } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Button from '../components/ui/Button';
import {
  Briefcase,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  Bell,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import { useSettings } from '../features/settings/hooks/useSettings';
import { useToast } from '../components/ui/Toast';
import IntegrationSettings from '../features/settings/components/IntegrationSettings';
import NotificationSettings from '../features/settings/components/NotificationSettings';
import { getInitials } from '../lib/utils';

export default function Settings() {
  const { profile, saving, uploading, saveProfile, uploadPhoto, removePhoto } = useSettings();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: 'Nipuna Dilshan',
    title: 'Business Growth Coach & Executive Advisor',
    email: 'nipund001@gmail.com',
    phone: '+94 77 123 4567',
    bio: 'Advising founders and service firm owners on high-ticket client acquisition and operational leverage.',
  });

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: profile.full_name || prev.fullName,
        phone: profile.phone || prev.phone,
        email: profile.email || prev.email,
        title: profile.title || prev.title,
        bio: profile.bio || prev.bio,
      }));
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ message: 'Image must be under 5MB.', type: 'error' });
      return;
    }
    try {
      await uploadPhoto(file);
      toast({ message: 'Profile photo uploaded successfully!', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Failed to upload photo. Check storage policies.', type: 'error' });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await removePhoto();
      toast({ message: 'Profile photo removed.', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Failed to remove photo.', type: 'error' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveProfile({
        full_name: formData.fullName,
        phone: formData.phone,
        title: formData.title,
        bio: formData.bio,
      });
      toast({ message: 'Practice profile updated successfully.', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Failed to save profile.', type: 'error' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-[32px] font-[650] text-text-primary tracking-tight leading-tight">
              Settings
            </h1>
            <p className="text-sm text-text-secondary mt-1 font-normal">
              Manage your advisory practice profile, calendar connections, and notifications.
            </p>
          </div>

          <div>
            <span className="inline-block font-mono text-xs font-semibold text-text-secondary bg-surface border border-border px-3 py-1.5 rounded-btn shadow-xs">
              ROUTE: /admin/settings
            </span>
          </div>
        </div>

        {/* Coach Profile Card */}
        <div className="bg-surface rounded-card border border-border shadow-card p-6 sm:p-7">
          {/* Section Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div className="flex items-center gap-2 text-accent">
              <Briefcase className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                Coach Profile
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-success-light text-success border border-success/20 text-xs font-semibold px-2.5 py-1 rounded-md">
              Verified Practice
            </span>
          </div>

          <form onSubmit={handleSubmit} className="pt-6 space-y-6">
            {/* Photo Avatar Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="relative shrink-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={formData.fullName}
                    className="h-20 w-20 rounded-2xl object-cover ring-1 ring-border shadow-xs"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-accent-light text-accent font-semibold text-xl flex items-center justify-center ring-1 ring-border shadow-xs">
                    {getInitials(formData.fullName || 'Nipuna Dilshan')}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 bg-success text-white p-0.5 rounded-full ring-2 ring-white">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface border border-border hover:bg-hover text-xs font-semibold text-text-primary rounded-btn transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {uploading && <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />}
                    <span>{uploading ? 'Uploading...' : 'Change photo'}</span>
                  </button>
                  {profile?.avatar_url && (
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={handleRemovePhoto}
                      className="text-xs font-semibold text-danger hover:underline cursor-pointer disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-text-secondary">
                  Recommended: 800x800px square format in JPG, PNG or WebP under 5MB.
                </p>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-surface border border-border rounded-btn text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="Michael Carter"
                />
              </div>

              {/* Title / Discipline */}
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Title / Discipline
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-surface border border-border rounded-btn text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  placeholder="Business Growth Coach & Executive Advisor"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-surface border border-border rounded-btn text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    placeholder="michael@cartergrowth.com"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-surface border border-border rounded-btn text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                    placeholder="+1 (555) 234-8890"
                  />
                </div>
              </div>

              {/* Short Bio */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-text-primary">
                    Short Bio
                  </label>
                  <span className="text-[11px] text-text-secondary font-mono">
                    {formData.bio.length} / 160 characters
                  </span>
                </div>
                <textarea
                  name="bio"
                  rows={3}
                  maxLength={160}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-surface border border-border rounded-btn text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none leading-relaxed"
                  placeholder="Advising founders and service firm owners on high-ticket client acquisition..."
                />
                <p className="text-xs text-text-secondary mt-1.5">
                  Displayed to prospective clients on private booking pages and calendar invites.
                </p>
              </div>
            </div>

            {/* Footer with Save Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-success font-medium">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span>All practice changes saved securely</span>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={saving}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Additional Settings Tabs: Integrations & Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface rounded-card border border-border p-6 shadow-card">
            <div className="flex items-center gap-2 pb-4 border-b border-border mb-4 text-accent">
              <LinkIcon className="h-4 w-4" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                Integrations (Cal.com &amp; n8n)
              </h3>
            </div>
            <IntegrationSettings profile={profile} onSave={saveProfile} saving={saving} />
          </div>

          <div className="bg-surface rounded-card border border-border p-6 shadow-card">
            <div className="flex items-center gap-2 pb-4 border-b border-border mb-4 text-accent">
              <Bell className="h-4 w-4" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-primary">
                Notification Preferences
              </h3>
            </div>
            <NotificationSettings profile={profile} onSave={saveProfile} saving={saving} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
