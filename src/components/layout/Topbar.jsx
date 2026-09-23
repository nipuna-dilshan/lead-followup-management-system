import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { useSettings } from '../../features/settings/hooks/useSettings';

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');

  const coachName = profile?.full_name || (user?.email?.includes('nipun') ? 'Nipuna Dilshan' : 'Nipuna Dilshan');
  const coachRole = 'Admin';
  const initials = 'ND';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/leads?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-[#111315] border-b border-[#1F2226] px-4 sm:px-6 flex items-center justify-between shrink-0 select-none z-20">
      {/* Left: Brand Identity with Terracotta accent */}
      <div className="flex items-center gap-3 sm:w-64 shrink-0">
        <button
          onClick={onMenuClick}
          className="p-1.5 -ml-1 text-[#9A9791] hover:text-white lg:hidden transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          {/* Terracotta Bar Chart Logo */}
          <div className="h-8 w-8 rounded-lg bg-[#BD6B52]/15 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-[#BD6B52]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="4" y="8" width="4" height="12" rx="1.5" />
              <rect x="11" y="4" width="4" height="16" rx="1.5" />
              <rect x="18" y="11" width="4" height="9" rx="1.5" />
            </svg>
          </div>

          <div className="min-w-0">
            <h1 className="text-[14px] font-bold text-white tracking-tight leading-tight">
              Business Coach
            </h1>
            <p className="text-[11px] text-[#9A9791] leading-tight truncate">
              Lead Automation &amp; Admin
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Search bar with ⌘ K shortcut */}
      <div className="flex-1 max-w-lg mx-4 hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#74716C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads, clients, or notes..."
            className="w-full pl-9 pr-14 py-2 text-xs bg-[#181A1D] border border-[#2A2D30] rounded-xl text-white placeholder:text-[#74716C] focus:outline-none focus:border-[#BD6B52] focus:bg-[#1C1F23] transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
            <kbd className="text-[10px] font-mono bg-[#22262B] text-[#9A9791] px-1.5 py-0.5 rounded border border-[#2E333A]">
              ⌘ K
            </kbd>
          </div>
        </form>
      </div>

      {/* Right: Notifications & Profile Area */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Notification Bell */}
        <button
          className="relative p-2 text-[#9A9791] hover:text-white transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#BD6B52] rounded-full ring-2 ring-[#111315]" />
        </button>

        {/* Profile Pill */}
        <div
          onClick={() => navigate('/admin/settings')}
          className="flex items-center gap-2.5 pl-2 cursor-pointer group"
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={coachName}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-white/20 shrink-0"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-white text-[#111315] font-bold text-xs flex items-center justify-center shrink-0">
              {initials}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white group-hover:text-[#BD6B52] transition-colors leading-tight">
              {coachName}
            </p>
            <p className="text-[11px] text-[#9A9791] leading-none mt-0.5">
              {coachRole}
            </p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-[#9A9791] hidden sm:block group-hover:text-white transition-colors" />
        </div>
      </div>
    </header>
  );
}
