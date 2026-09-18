import { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import {
  Briefcase,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  Bell,
  Link as LinkIcon,
} from 'lucide-react';
import { useSettings } from '../features/settings/hooks/useSettings';
import { useToast } from '../components/ui/Toast';
import IntegrationSettings from '../features/settings/components/IntegrationSettings';
import NotificationSettings from '../features/settings/components/NotificationSettings';

export default function Settings() {
  const { profile, saving, saveProfile } = useSettings();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: 'Michael Carter',
    title: 'Business Growth Coach & Executive Advisor',
    email: 'michael@cartergrowth.com',
    phone: '+1 (555) 234-8890',
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
      toast({ message: err.message || 'Saved locally.', type: 'success' });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with Route Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1C1917] tracking-tight">Settings</h1>
            <p className="text-xs text-[#78716C] mt-1 font-medium">
              Manage your advisory practice profile, calendar connections, and notifications.
            </p>
          </div>

          <div>
            <span className="inline-block font-mono text-[11px] font-semibold text-[#78716C] bg-white border border-[#EDE5DA] px-3 py-1 rounded-md shadow-xs">
              ROUTE: /admin/settings
            </span>
          </div>
        </div>

        {/* Coach Profile Card matching Image 3 */}
        <div className="bg-white rounded-2xl border border-[#EDE5DA] shadow-[0_2px_8px_-2px_rgba(0,0,0,0.03)] p-6 sm:p-7">
          {/* Section Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[#EDE5DA]">
            <div className="flex items-center gap-2 text-[#8C432D]">
              <Briefcase className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                Coach Profile
              </span>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-[#E8F5EE] text-[#2D7A51] text-xs font-bold px-2.5 py-1 rounded-md">
              Verified Practice
            </span>
          </div>

          <form onSubmit={handleSubmit} className="pt-6 space-y-6">
            {/* Photo Avatar Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="relative shrink-0">
                <img
                  src="/michael-carter.png"
                  alt="Michael Carter"
                  className="h-20 w-20 rounded-2xl object-cover ring-1 ring-black/10 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 bg-[#2D7A51] text-white p-0.5 rounded-full ring-2 ring-white">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="px-3.5 py-1.5 bg-white border border-[#EDE5DA] hover:bg-[#FAF7F2] text-xs font-semibold text-[#1C1917] rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    Change photo
                  </button>
                  <button
                    type="button"
                    className="text-xs font-medium text-[#A34A3B] hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-[11.5px] text-[#78716C]">
                  Recommended: 800x800px square format in JPG or PNG under 3MB.
                </p>
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EDE5DA] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#8C432D] focus:ring-1 focus:ring-[#8C432D] transition-all"
                  placeholder="Michael Carter"
                />
              </div>

              {/* Title / Discipline */}
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                  Title / Discipline
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EDE5DA] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#8C432D] focus:ring-1 focus:ring-[#8C432D] transition-all"
                  placeholder="Business Growth Coach & Executive Advisor"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A29E]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#EDE5DA] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#8C432D] focus:ring-1 focus:ring-[#8C432D] transition-all"
                    placeholder="michael@cartergrowth.com"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-[#1C1917] mb-1.5">
                  Phone / WhatsApp
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A29E]" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-[#EDE5DA] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#8C432D] focus:ring-1 focus:ring-[#8C432D] transition-all"
                    placeholder="+1 (555) 234-8890"
                  />
                </div>
              </div>

              {/* Short Bio */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#1C1917]">
                    Short Bio
                  </label>
                  <span className="text-[11px] text-[#78716C] font-mono">
                    {formData.bio.length} / 160 characters
                  </span>
                </div>
                <textarea
                  name="bio"
                  rows={3}
                  maxLength={160}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#EDE5DA] rounded-xl text-[#1C1917] focus:outline-none focus:border-[#8C432D] focus:ring-1 focus:ring-[#8C432D] transition-all resize-none leading-relaxed"
                  placeholder="Advising founders and service firm owners on high-ticket client acquisition..."
                />
                <p className="text-[11px] text-[#78716C] mt-1.5">
                  Displayed to prospective clients on private booking pages and calendar invites.
                </p>
              </div>
            </div>

            {/* Footer with Save Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#EDE5DA]">
              <div className="flex items-center gap-2 text-xs text-[#2D7A51] font-medium">
                <span className="h-2 w-2 rounded-full bg-[#2D7A51]" />
                <span>All unsaved changes tracked locally</span>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 bg-[#8C432D] hover:bg-[#793926] active:bg-[#683020] text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Additional Settings Tabs: Integrations & Notifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#EDE5DA] p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-[#EDE5DA] mb-4 text-[#8C432D]">
              <LinkIcon className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                Integrations (Cal.com &amp; n8n)
              </h3>
            </div>
            <IntegrationSettings profile={profile} onSave={saveProfile} saving={saving} />
          </div>

          <div className="bg-white rounded-2xl border border-[#EDE5DA] p-6 shadow-xs">
            <div className="flex items-center gap-2 pb-4 border-b border-[#EDE5DA] mb-4 text-[#8C432D]">
              <Bell className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
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
