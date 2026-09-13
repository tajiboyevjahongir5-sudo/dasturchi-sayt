'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { 
  Mail, 
  Award, 
  Flame, 
  Zap, 
  LogOut, 
  Sun, 
  Moon,
  LogIn,
  UserPlus,
  User as UserIcon
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-8 pb-16 max-w-xl mx-auto my-12">
        <Card className="p-8 text-center space-y-4 border-primary/20 bg-card/60">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold">Profilingizga kiring</h2>
          <p className="text-sm text-muted-foreground">
            Shaxsiy ma’lumotlaringiz, yutuqlaringiz va sozlamalarni ko‘rish uchun tizimga kiring yoki ro‘yxatdan o‘ting.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/login?callbackUrl=/profile">
              <Button variant="gradient" className="font-bold gap-2">
                <LogIn className="w-4 h-4" />
                <span>Tizimga kirish</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="font-semibold gap-2">
                <UserPlus className="w-4 h-4" />
                <span>Ro‘yxatdan o‘tish</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Mening Profilim</h1>
        <p className="text-sm text-muted-foreground">
          Shaxsiy ma’lumotlar, ta’lim statistikasi va tizim sozlamalari
        </p>
      </div>

      {/* Main Profile Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <Avatar className="w-20 h-20 border-2 border-primary/40 shadow-lg">
            <AvatarImage src={user.avatarUrl || ''} />
            <AvatarFallback className="text-xl font-bold">{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary self-center sm:self-auto">
                {user.levelTitle} ({user.level}-daraja)
              </span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border/60">
          <div className="p-3.5 rounded-xl bg-muted/40 text-center space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Streak</span>
            <p className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-amber-500" />
              {user.streak} kun
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 text-center space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Jami XP</span>
            <p className="text-xl font-black text-blue-500 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 fill-blue-500" />
              {user.totalXP}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 text-center space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Tugallangan</span>
            <p className="text-xl font-black text-emerald-500">
              {user.completedLessonsCount} dars
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 text-center space-y-1">
            <span className="text-xs text-muted-foreground font-medium">Yutuqlar</span>
            <p className="text-xl font-black text-purple-500 flex items-center justify-center gap-1">
              <Award className="w-4 h-4" />
              {user.achievementsCount} ta
            </p>
          </div>
        </div>
      </Card>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-base">Tizim ko‘rinishi (Mavzu)</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            O‘zingizga qulay rejimni tanlang: tungi qorong‘u (dark) yoki yorug‘ (light) rejim.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{theme === 'dark' ? 'Qorong‘u rejim (Dark)' : 'Yorug‘ rejim (Light)'}</span>
            </div>

            <Button onClick={toggleTheme} variant="outline" size="sm">
              Almashtirish
            </Button>
          </div>
        </Card>

        {/* Account Safety */}
        <Card className="p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-bold text-base">Xavfsizlik va Seans</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sizning sessiyangiz xavfsiz shifrlangan cookie bilan himoyalangan.
            </p>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => logout()}
              variant="destructive"
              size="sm"
              className="w-full gap-2 font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>Tizimdan chiqish</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
