import React from 'react';
import { AdminSidebar, AdminMobileNav } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row -m-4 sm:-m-6 lg:-m-8 min-h-[calc(100vh-4rem)]">
      {/* Mobile Top Navigation Bar */}
      <AdminMobileNav />

      {/* Admin Sidebar for Desktop */}
      <AdminSidebar className="hidden lg:flex shrink-0 min-h-full" />

      {/* Admin Content Area */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
