import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  IdCard,
  Calendar,
  Mail,
  Settings,
  CircleUser,
  LogOut,
  Plus,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../features/auth/hooks/useAuth';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/admin/leads', label: 'Leads', icon: IdCard },
  { to: '/admin/calendar', label: 'Calendar', icon: Calendar },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

function NavItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[14px] transition-colors group',
          isActive
            ? 'bg-[#EFE8E1] text-[#8C432D] font-semibold'
            : 'text-[#332E2A] hover:bg-[#F6F2EC] hover:text-[#1C1917] font-medium'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-[19px] w-[19px] shrink-0 transition-colors',
              isActive
                ? 'text-[#8C432D]'
                : 'text-[#4A4541] group-hover:text-[#1C1917]'
            )}
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <nav className="flex flex-col h-full bg-white border-r border-[#ECE6DE] px-4 py-5 select-none">
      {/* Top Workspace Identity */}
      <div className="flex items-center gap-3 px-1 mb-5">
        <div className="h-10 w-10 rounded-xl bg-[#FAF5F0] border border-[#EDE5DA] text-[#8C432D] font-bold text-xs flex items-center justify-center shrink-0 tracking-wider shadow-xs select-none">
          EA
        </div>
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold text-[#1C1917] tracking-tight leading-snug truncate">
            Executive Advisory
          </h2>
          <p className="text-[12.5px] font-normal text-[#78716C] leading-none truncate mt-0.5">
            Executive Practice
          </p>
        </div>
      </div>

      {/* Add Enquiry Action Button */}
      <button
        onClick={() => navigate('/admin/leads?add=true')}
        className="w-full flex items-center justify-center gap-2 bg-[#8C432D] hover:bg-[#793926] active:bg-[#683020] text-white font-medium text-[13.5px] h-10 rounded-xl transition-all shadow-sm mb-5 cursor-pointer"
      >
        <Plus className="h-4 w-4 stroke-[2.5]" />
        <span>Add Enquiry</span>
      </button>

      {/* Main Navigation */}
      <div className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>

      {/* Bottom Profile & Sign Out Card */}
      <div className="mt-auto pt-4">
        <div className="bg-[#FAF6F0] rounded-xl p-3 border border-[#ECE5DA]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <img
              src="/michael-carter.png"
              alt="Michael Carter"
              className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-black/5"
            />
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-[#1C1917] leading-tight truncate">Michael Carter</p>
              <p className="text-[11.5px] text-[#78716C] leading-none truncate mt-0.5">Growth Coach</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[#ECE5DA] pt-2 text-[12.5px] font-medium text-[#443E3A]">
            <NavLink
              to="/admin/settings"
              className="flex items-center gap-1.5 hover:text-[#1C1917] transition-colors"
            >
              <CircleUser className="h-4 w-4" />
              <span>Profile</span>
            </NavLink>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 hover:text-[#A34A3B] transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

