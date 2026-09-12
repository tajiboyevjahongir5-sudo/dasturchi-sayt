'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../providers/AuthProvider';
import { 
  LayoutDashboard, 
  BookOpen, 
  Map, 
  Award, 
  User, 
  Layers, 
  ChevronRight,
  Flame,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '../ui/progress';

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/courses', label: 'Kurslar', icon: BookOpen },
    { href: '/workspace', label: 'Workspace', icon: Layers },
    { href: '/learning-path', label: 'O‘quv yo‘li', icon: Map },
    { href: '/achievements', label: 'Yutuqlar', icon: Award },
    { href: '/profile', label: 'Profil', icon: User },
  ];

  return (
    <aside className={cn('w-64 border-r border-border/60 bg-card/60 backdrop-blur-md flex flex-col justify-between p-4', className)}>
      <div className="space-y-6">
        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
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
                {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
              </Link>
            );
          })}

          {user && ['instructor', 'admin', 'superadmin'].includes(user.role) && (
            <Link
              href="/admin"
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20',
                pathname.startsWith('/admin') && 'bg-purple-600 text-white font-semibold shadow-md shadow-purple-500/25'
              )}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4" />
                <span>Admin & CMS</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </Link>
          )}
        </nav>
      </div>

      {/* User Progress Mini Card */}
      {user && (
        <div className="p-3.5 rounded-xl border border-border/60 bg-muted/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{user.streak} kun streak</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500">
              <Zap className="w-4 h-4 fill-blue-500" />
              <span>{user.totalXP} XP</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
              <span>{user.levelTitle}</span>
              <span className="text-foreground font-semibold">{user.level}-daraja</span>
            </div>
            <Progress
              value={user.requiredXP > 0 ? (user.currentXP / user.requiredXP) * 100 : 100}
              className="h-1.5"
            />
          </div>
        </div>
      )}
    </aside>
  );
}
