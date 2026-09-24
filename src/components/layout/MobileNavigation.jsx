import { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../features/auth/hooks/useAuth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Leads', icon: Users },
  { to: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function MobileNavigation({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const panelRef = useRef(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape' && isOpen) onClose?.();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
    onClose?.();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#111315]/60" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <nav
        ref={panelRef}
        className="absolute inset-y-0 left-0 w-72 bg-[#111315] border-r border-[#1F2226] flex flex-col p-4 z-50 shadow-modal"
        aria-label="Mobile navigation"
      >
        {/* Header with brand & close */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#1F2226]">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#BD6B52]/15 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-[#BD6B52]" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="8" width="4" height="12" rx="1.5" />
                <rect x="11" y="4" width="4" height="16" rx="1.5" />
                <rect x="18" y="11" width="4" height="9" rx="1.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight leading-tight">Business Coach</p>
              <p className="text-[11px] text-[#9A9791] leading-tight">Lead Automation &amp; Admin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9A9791] hover:text-white transition-colors rounded-lg"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav items */}
        <div className="flex-1 space-y-1.5">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors group',
                  isActive
                    ? 'bg-[#1C1715] border border-[#BD6B52] text-[#BD6B52] font-semibold'
                    : 'text-[#9A9791] hover:bg-[#181A1D] hover:text-white border border-transparent'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-[#BD6B52]' : 'text-[#9A9791] group-hover:text-white'
                    )}
                  />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-4 space-y-3">
          <div className="bg-[#181A1D] border border-[#2A2D30] rounded-card p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#BD6B52] fill-[#BD6B52] shrink-0" />
                <span className="text-xs font-semibold text-white tracking-tight">
                  Automation Active
                </span>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#3E8F68] shadow-[0_0_6px_rgba(62,143,104,0.6)] shrink-0" />
            </div>

            <div className="mt-2 pl-6 text-[11px] text-[#9A9791] leading-relaxed">
              <p>Form → Supabase → n8n →</p>
              <p>Gmail + Cal.com</p>
            </div>
          </div>

          <div className="border-t border-[#1F2226]" />

          <button
            onClick={handleSignOut}
            type="button"
            className="flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-medium text-[#9A9791] hover:text-white hover:bg-[#181A1D] rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-[#9A9791]" />
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
