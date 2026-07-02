import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DesktopSidebar, MobileSidebar } from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout({ title }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-bg min-h-screen">
      <DesktopSidebar />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setMobileOpen(true)} title={title} />
        <main className="px-4 py-5 sm:px-6 sm:py-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
