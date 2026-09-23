import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNavigation from './MobileNavigation';

export default function AdminLayout({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden antialiased font-sans text-text-primary">
      {/* Top Header spans across full width */}
      <Topbar onMenuClick={() => setMobileNavOpen(true)} />

      {/* Main body: Sidebar on left + Content on right */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop Sidebar (280px) */}
        <aside className="hidden lg:flex lg:flex-col lg:w-[280px] shrink-0">
          <Sidebar />
        </aside>

        {/* Mobile overlay navigation */}
        <MobileNavigation
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
