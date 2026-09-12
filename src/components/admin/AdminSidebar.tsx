'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ShieldAlert, 
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role || 'user';
  const isSuperAdmin = role === 'superadmin';
  const isAdminOrAbove = role === 'admin' || isSuperAdmin;

  const navItems = [
    { href: '/admin', label: 'Boshqaruv Paneli', icon: LayoutDashboard, exact: true },
    { href: '/admin/courses', label: 'Kurslar & Darslar', icon: BookOpen },
    ...(isAdminOrAbove ? [
      { href: '/admin/users', label: 'Foydalanuvchilar', icon: Users },
      { href: '/admin/audit', label: 'Audit Loglari', icon: ShieldAlert },
    ] : []),
  ];

  const getRoleBadge = () => {
    switch (role) {
      case 'superadmin':
        return {
          label: 'Super Admin',
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
          icon: ShieldAlert,
        };
      case 'admin':
        return {
          label: 'Administrator',
          bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
          icon: ShieldCheck,
        };
      case 'instructor':
        return {
          label: 'O‘qituvchi',
          bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          icon: GraduationCap,
        };
      default:
        return {
          label: 'Foydalanuvchi',
          bg: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
          icon: Award,
        };
    }
  };

  const badge = getRoleBadge();
  const BadgeIcon = badge.icon;

  return (
    <aside className={cn('w-64 border-r border-border/60 bg-card/70 backdrop-blur-md flex flex-col justify-between p-4', className)}>
      <div className="space-y-6">
        {/* User Role Card */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Sizning rolingiz:</span>
            <span className={cn('flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border', badge.bg)}>
              <BadgeIcon className="w-3 h-3" />
              {badge.label}
            </span>
          </div>
          <p className="text-xs font-semibold truncate text-foreground">{user.name}</p>
          <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
        </div>

        {/* CMS Navigation */}
        <nav className="space-y-1.5">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
            CMS Boshqaruvi
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact 
              ? pathname === item.href 
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 font-semibold'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-primary')} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to student dashboard button */}
      <div className="pt-4 border-t border-border/60">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          <span>Talaba Dashboardiga qaytish</span>
        </Link>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role || 'user';
  const isSuperAdmin = role === 'superadmin';
  const isAdminOrAbove = role === 'admin' || isSuperAdmin;

  const navItems = [
    { href: '/admin', label: 'Boshqaruv', icon: LayoutDashboard, exact: true },
    { href: '/admin/courses', label: 'Kurslar & Darslar', icon: BookOpen },
    ...(isAdminOrAbove ? [
      { href: '/admin/users', label: 'Foydalanuvchilar', icon: Users },
      { href: '/admin/audit', label: 'Audit', icon: ShieldAlert },
    ] : []),
  ];

  return (
    <div className="lg:hidden w-full border-b border-border/60 bg-card/80 backdrop-blur-md px-3 sm:px-4 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact 
          ? pathname === item.href 
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0',
              isActive
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
