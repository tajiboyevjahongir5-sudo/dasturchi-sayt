import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Sidebar } from '@/components/common/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar on desktop */}
        <Sidebar className="hidden md:flex shrink-0" />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
