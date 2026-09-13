'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Clock, 
  ArrowRight,
  LogIn
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface ProgressData {
  user: {
    name: string;
    level: number;
    levelTitle: string;
    currentXP: number;
    requiredXP: number;
    totalXP: number;
    streak: number;
  };
  stats: {
    completedLessons: number;
    totalAchievements: number;
    coursesProgress: Array<{
      courseId: string;
      courseTitle: string;
      courseSlug: string;
      totalLessons: number;
      completedLessons: number;
      percentage: number;
    }>;
    weeklyProgress: Array<{
      day: string;
      xp: number;
      lessons: number;
      minutes: number;
    }>;
    strongTopics: string[];
    weakTopics: string[];
  };
}

export default function ProgressPage() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/user/stats');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setData(json.data);
          }
        }
      } catch (err) {
        console.error('Progress page error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8 pb-16 max-w-xl mx-auto my-12">
        <Card className="p-8 text-center space-y-4 border-primary/20 bg-card/60">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
            <BarChart3 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold">O‘quv statistikasini ko‘rish</h2>
          <p className="text-sm text-muted-foreground">
            Shaxsiy o‘zlashtirish ko‘rsatkichlaringiz, sarflangan vaqt va darajalaringizni ko‘rish uchun profilingizga kiring.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/login?callbackUrl=/progress">
              <Button variant="gradient" className="font-bold gap-2">
                <LogIn className="w-4 h-4" />
                <span>Tizimga kirish</span>
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" className="font-semibold">
                <span>Kurslarni ko‘rish</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const { user, stats } = data;

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Ta’lim tahlili</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">O‘zlashtirish va Rivojlanish</h1>
        <p className="text-sm text-muted-foreground">
          O‘quv ko‘rsatkichlaringiz, sarflangan vaqt va kurslar bo‘yicha batafsil statistika.
        </p>
      </div>

      {/* Level and XP Banner */}
      <Card className="p-6 sm:p-8 border-primary/30 bg-gradient-to-r from-primary/10 via-card to-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Hozirgi maqom:</span>
            <h2 className="text-2xl font-black">{user.levelTitle} ({user.level}-daraja)</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-card border border-border text-center">
              <span className="text-[10px] text-muted-foreground block">Jami XP</span>
              <span className="text-base font-black text-blue-500">{user.totalXP}</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-card border border-border text-center">
              <span className="text-[10px] text-muted-foreground block">Streak</span>
              <span className="text-base font-black text-amber-500">{user.streak} kun</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Keyingi darajagacha</span>
            <span className="text-primary font-bold">
              {user.currentXP} / {user.requiredXP} XP
            </span>
          </div>
          <Progress
            value={user.requiredXP > 0 ? (user.currentXP / user.requiredXP) * 100 : 100}
            className="h-2.5"
          />
        </div>
      </Card>

      {/* Weekly Activity Chart */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base">Haftalik faollik grafigi</h3>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            So‘nggi 7 kun
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.weeklyProgress}>
              <XAxis dataKey="day" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#181825',
                  borderColor: '#3b82f6',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="xp" fill="#3b82f6" radius={[4, 4, 0, 0]} name="XP Ballari" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Courses Breakdown */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight">Kurslar bo‘yicha batafsil</h3>

        <div className="space-y-3">
          {stats.coursesProgress.map((c) => (
            <Card key={c.courseId} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1 max-w-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm">{c.courseTitle}</h4>
                  <span className="text-xs font-semibold text-primary">{c.percentage}%</span>
                </div>
                <Progress value={c.percentage} className="h-2" />
                <p className="text-[11px] text-muted-foreground">
                  {c.completedLessons} / {c.totalLessons} dars muvaffaqiyatli yakunlandi
                </p>
              </div>

              <Link href={`/courses/${c.courseSlug}`}>
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <span>Kursga o‘tish</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
