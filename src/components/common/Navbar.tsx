'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { useAuth } from '../providers/AuthProvider';
import { useTheme } from '../providers/ThemeProvider';
import { Button } from '../ui/button';
import { IconBadge } from '../ui/icon-badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard, 
  BookOpen, 
  Map, 
  Award, 
  User as UserIcon,
  ShieldAlert,
  Layers
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/courses', label: 'Kurslar', icon: BookOpen },
    { href: '/learning-path', label: 'O‘quv yo‘li', icon: Map },
    ...(user ? [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Logo showTagline={false} />

        {/* Center: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Rejimni o‘zgartirish"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-blue-500" />}
          </button>

          {/* User Profile or Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-3">
              {/* Streak Badge */}
              <IconBadge 
                variant="streak" 
                label={`${user.streak} kun`} 
                size="sm" 
                animated 
                className="hidden sm:inline-flex"
              />

              {/* XP Badge */}
              <IconBadge 
                variant="xp" 
                label={`${user.totalXP} XP`} 
                size="sm" 
                className="hidden sm:inline-flex"
              />

              {/* Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <Avatar className="w-9 h-9 border border-primary/30 cursor-pointer">
                    <AvatarImage src={user.avatarUrl || ''} />
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-xl z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-3 py-2 border-b border-border/50">
                      <p className="font-semibold text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-primary font-medium">
                        <span>{user.levelTitle}</span>
                        <span>{user.level}-daraja</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md hover:bg-muted transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-primary" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md hover:bg-muted transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-primary" />
                        Profil va Sozlamalar
                      </Link>
                      <Link
                        href="/achievements"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md hover:bg-muted transition-colors"
                      >
                        <Award className="w-4 h-4 text-primary" />
                        Yutuqlarim
                      </Link>
                      {['instructor', 'admin', 'superadmin'].includes(user.role) && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-purple-600 dark:text-purple-400 rounded-md hover:bg-purple-500/10 transition-colors"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          Admin & CMS Paneli
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-border/50">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-destructive rounded-md hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Chiqish
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Kirish
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="gradient" size="sm">
                  Ro‘yxatdan o‘tish
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50"
            aria-label="Menyu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-card/98 backdrop-blur-xl px-4 py-4 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto animate-in slide-in-from-top-3 duration-200">
          {user ? (
            <>
              {/* User mini profile card in mobile drawer */}
              <div className="p-3.5 rounded-2xl border border-border/80 bg-muted/30 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-11 h-11 border-2 border-primary/40">
                    <AvatarImage src={user.avatarUrl || ''} />
                    <AvatarFallback className="font-bold text-sm">{user.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-primary font-semibold">
                      <span>{user.levelTitle}</span>
                      <span>{user.level}-daraja</span>
                    </div>
                  </div>
                </div>

                {/* Gamification badges on mobile */}
                <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                  <IconBadge variant="streak" label={`${user.streak} kun`} size="sm" animated />
                  <IconBadge variant="xp" label={`${user.totalXP} XP`} size="sm" />
                </div>
              </div>

              {/* Mobile navigation links for logged-in user */}
              <nav className="flex flex-col space-y-1">
                {[
                  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { href: '/courses', label: 'Kurslar', icon: BookOpen },
                  { href: '/workspace', label: 'Workspace (Web muharrir)', icon: Layers },
                  { href: '/learning-path', label: 'O‘quv yo‘li', icon: Map },
                  { href: '/achievements', label: 'Yutuqlarim', icon: Award },
                  { href: '/profile', label: 'Profil va Sozlamalar', icon: UserIcon },
                ].map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/15 text-primary font-bold'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {['instructor', 'admin', 'superadmin'].includes(user.role) && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 text-purple-500" />
                    <span>Admin & CMS Paneli</span>
                  </Link>
                )}
              </nav>

              {/* Logout button */}
              <div className="pt-2 border-t border-border/50">
                <Button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  variant="destructive"
                  size="sm"
                  className="w-full gap-2 font-semibold justify-center"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Tizimdan chiqish</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <nav className="flex flex-col space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-border flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full font-semibold">
                    Kirish
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="gradient" className="w-full font-bold">
                    Bepul boshlash
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
