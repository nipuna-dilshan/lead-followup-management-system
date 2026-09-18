import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell, Search, BookOpen } from 'lucide-react';

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const isCalendar = location.pathname.includes('/calendar');
  const isSettings = location.pathname.includes('/settings');
  const isLeads = location.pathname.includes('/leads');

  const getSubTitle = () => {
    if (isCalendar) return 'Consultation Administration';
    if (isSettings) return 'Practice Admin';
    if (isLeads) return 'Pipeline Management';
    return 'Executive Advisory';
  };

  const getSearchPlaceholder = () => {
    if (isCalendar) return 'Search consultations...';
    return 'Search leads, notes...';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/leads?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 bg-white/80 backdrop-blur border-b border-[#ECE6DE] shrink-0">
      {/* Mobile Left: Menu Toggle */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-[#78716C] hover:text-[#1C1917] transition-colors rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-[#1C1917]">Executive Advisory</span>
      </div>

      {/* Desktop Left: Executive Advisory Brand Pill */}
      <div className="hidden lg:flex items-center gap-2.5">
        <div className="flex items-center gap-2 text-[#8C432D] font-bold text-sm tracking-tight">
          <BookOpen className="h-4 w-4" />
          <span>Executive Advisory</span>
        </div>
        <span className="text-[#D1C9BE] font-light">/</span>
        <span className="text-xs text-[#78716C] font-medium">{getSubTitle()}</span>
      </div>

      {/* Right Controls: Search & Notification */}
      <div className="flex items-center gap-3">
        <form onSubmit={handleSearch} className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A8A29E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={getSearchPlaceholder()}
            className="w-56 md:w-64 pl-8 pr-3.5 py-1.5 text-xs bg-[#FAF7F2] border border-[#E6E0D6] rounded-lg text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#8C432D] focus:bg-white transition-all"
          />
        </form>

        <button
          className="relative p-2 text-[#78716C] hover:text-[#1C1917] bg-white border border-[#E6E0D6] rounded-lg transition-colors cursor-pointer"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8C432D] rounded-full ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}

