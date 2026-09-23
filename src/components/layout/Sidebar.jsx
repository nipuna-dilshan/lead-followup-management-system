import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Target,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { cn } from '../../lib/utils';
import { APP_VERSION } from '../../lib/constants';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Leads', icon: Users },
  { to: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Failed to sign out:', err);
    }
  };

  return (
    <nav className="flex flex-col h-full bg-[#111315] border-r border-[#1F2226] px-4 py-5 select-none w-full">
      {/* Navigation List */}
      <div className="space-y-1.5 pt-1">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-[#1C1715] border border-[#BD6B52] text-[#BD6B52] font-semibold'
                  : 'text-[#9A9791] hover:bg-[#181A1D] hover:text-white border border-transparent'
              )
            }
          >
            {({ isActive }) => {
              const Icon = item.icon;
              return (
                <>
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isActive ? 'text-[#BD6B52]' : 'text-[#9A9791] group-hover:text-white'
                    )}
                  />
                  <span>{item.label}</span>
                </>
              );
            }}
          </NavLink>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto pt-4 space-y-3">
        {/* Automation Card */}
        <div className="bg-[#181A1D] border border-[#2A2D30] rounded-card p-4">
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-[#BD6B52] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-white leading-snug">
                Automate. Follow up.<br />Grow.
              </p>
              <p className="text-[11px] text-[#9A9791] mt-1.5 leading-tight">
                More conversations.<br />More clients.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1F2226]" />

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          type="button"
          className="flex items-center gap-3.5 w-full px-3.5 py-2.5 text-sm font-medium text-[#9A9791] hover:text-white hover:bg-[#181A1D] rounded-xl transition-all cursor-pointer group"
        >
          <LogOut className="h-4 w-4 text-[#9A9791] group-hover:text-white transition-colors" />
          <span>Sign Out</span>
        </button>

        {/* Version text */}
        <div className="px-3 text-[11px] text-[#555C66]">
          <p>Business Coach CRM <span className="text-[10px] text-[#434851]">v{APP_VERSION}</span></p>
        </div>
      </div>
    </nav>
  );
}
