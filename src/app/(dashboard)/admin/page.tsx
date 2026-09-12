'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { StatsOverview } from '@/components/admin/StatsOverview';
import { ErrorAnalyticsChart } from '@/components/admin/ErrorAnalyticsChart';
import { RecentActivityFeed } from '@/components/admin/RecentActivityFeed';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  BookOpen, 
  Users, 
  ShieldAlert,
  Loader2,
  AlertCircle
} from 'lucide-react';
import type { CMSStats } from '@/types';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CMSStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Statistikani yuklashda xatolik');
        }
        setStats(json.data);
      } catch (err: unknown) {
        setError((err as Error).message || 'Server bilan bog‘lanishda xatolik');
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Admin panel ma’lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle className="w-5 h-5" />
          <span>Xatolik yuz berdi</span>
        </div>
        <p className="text-sm">{error || 'Ma’lumotlarni olib bo‘lmadi'}</p>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Qayta urinish
        </Button>
      </div>
    );
  }

  const isInstructor = user?.role === 'instructor';
  const isAdminOrSuper = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {isInstructor ? 'O‘qituvchi Boshqaruv Markazi' : 'CodeQuest Admin & CMS'}
            </h1>
            <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Faza 2.2
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {isInstructor 
              ? 'O‘zingiz yaratgan kurslar, darslar va talabalar faolligini nazorat qiling.' 
              : 'Butun platforma kurslari, darslar, mashqlar, foydalanuvchilar va audit nazorati.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Link href="/admin/courses">
            <Button variant="outline" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Kurslar Ro‘yxati</span>
            </Button>
          </Link>
          <Link href="/admin/courses?action=new">
            <Button variant="gradient" className="gap-2 shadow-sm">
              <PlusCircle className="w-4 h-4" />
              <span>Yangi Kurs Yaratish</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsOverview stats={stats} isInstructor={isInstructor} />

      {/* Analytics & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Analytics */}
        <ErrorAnalyticsChart errors={stats.frequentErrors} />

        {/* Recent Activity */}
        <RecentActivityFeed activities={stats.recentActivity} />
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/courses"
          className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm hover:border-primary/50 transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              Kurslar & Darslar CMS
            </span>
            <BookOpen className="w-5 h-5 text-primary opacity-80" />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Yangi darslar qo‘shish, amaliy mashqlar (single/multi-file), test keyslar va quizlarni kodsiz boshqaring.
          </p>
        </Link>

        {isAdminOrSuper && (
          <Link
            href="/admin/users"
            className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm hover:border-indigo-500/50 transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                Foydalanuvchilar & Rollar
              </span>
              <Users className="w-5 h-5 text-indigo-500 opacity-80" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Talabalar, o‘qituvchilar va adminlar ro‘yxati. Super Admin orqali rollarni boshqarish.
            </p>
          </Link>
        )}

        {isAdminOrSuper && (
          <Link
            href="/admin/audit"
            className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm hover:border-rose-500/50 transition-all group space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground group-hover:text-rose-500 transition-colors">
                Xavfsizlik & Audit Loglari
              </span>
              <ShieldAlert className="w-5 h-5 text-rose-500 opacity-80" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Kontent yaratilishi, o‘zgarishi, nashr qilinishi va rollback harakatlarining to‘liq logi.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
