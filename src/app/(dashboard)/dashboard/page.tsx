'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  Zap, 
  BookOpen, 
  Play, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
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
    activeCourse?: {
      courseId: string;
      courseTitle: string;
      courseSlug: string;
      totalLessons: number;
      completedLessons: number;
      percentage: number;
      currentLessonSlug: string | null;
      currentLessonTitle: string | null;
    };
    coursesProgress: Array<{
      courseId: string;
      courseTitle: string;
      courseSlug: string;
      totalLessons: number;
      completedLessons: number;
      percentage: number;
      currentLessonSlug: string | null;
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
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/user/stats');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setData(json.data);
          }
        }
      } catch (err) {
        console.error('Stats load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-1/3 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  const { user, stats, achievements } = data;
  const activeCourse = stats.activeCourse;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
            <span>Salom, {user.name}!</span>
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Bugungi maqsadingiz: kamida 1 ta dars o‘rganish va kod yozish.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link href="/courses">
            <Button variant="gradient" size="sm" className="gap-1.5 font-bold shadow-xs">
              <BookOpen className="w-4 h-4" />
              <span>Barcha kurslar</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Streak */}
        <Card className="p-4 sm:p-5 flex items-center gap-3.5 border-amber-500/20 bg-amber-500/5 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium">Uzluksiz Streak</span>
            <p className="text-xl sm:text-2xl font-black text-amber-500">{user.streak} kun</p>
          </div>
        </Card>

        {/* XP */}
        <Card className="p-4 sm:p-5 flex items-center gap-3.5 border-blue-500/20 bg-blue-500/5 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500 shrink-0">
            <Zap className="w-6 h-6 fill-blue-500" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium">Umumiy Tajriba</span>
            <p className="text-xl sm:text-2xl font-black text-blue-500">{user.totalXP} XP</p>
          </div>
        </Card>

        {/* Level */}
        <Card className="p-4 sm:p-5 flex items-center gap-3.5 border-purple-500/20 bg-purple-500/5 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-500 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium">{user.levelTitle}</span>
            <p className="text-xl sm:text-2xl font-black text-purple-500">{user.level}-daraja</p>
          </div>
        </Card>

        {/* Completed Lessons */}
        <Card className="p-4 sm:p-5 flex items-center gap-3.5 border-emerald-500/20 bg-emerald-500/5 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-medium">Tugallangan</span>
            <p className="text-xl sm:text-2xl font-black text-emerald-500">{stats.completedLessons} dars</p>
          </div>
        </Card>
      </div>

      {/* 3. Continue Learning Featured Card */}
      {activeCourse && (
        <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>O‘qishni davom ettiring</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                {activeCourse.courseTitle}
              </h3>

              {activeCourse.currentLessonTitle && (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Keyingi dars: <strong className="text-foreground">{activeCourse.currentLessonTitle}</strong>
                </p>
              )}

              <div className="space-y-1.5 max-w-md pt-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Jami progress</span>
                  <span className="text-primary">{activeCourse.percentage}%</span>
                </div>
                <Progress value={activeCourse.percentage} className="h-2" />
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              {activeCourse.currentLessonSlug ? (
                <Link
                  href={`/courses/${activeCourse.courseSlug}/lessons/${activeCourse.currentLessonSlug}`}
                >
                  <Button variant="gradient" size="lg" className="font-bold gap-2 shadow-md">
                    <Play className="w-4 h-4 fill-white" />
                    <span>Darsni boshlash</span>
                  </Button>
                </Link>
              ) : (
                <Link href={`/courses/${activeCourse.courseSlug}`}>
                  <Button variant="gradient" size="lg" className="font-bold gap-2">
                    <span>Kursga o‘tish</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* 4. Two Columns: Weekly Chart & Daily Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Chart */}
        <div className="lg:col-span-7">
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Haftalik faollik statistikasi</h3>
                <p className="text-xs text-muted-foreground mt-0.5">So‘nggi 7 kunda to‘plangan tajriba ballari (XP)</p>
              </div>
              <div className="text-xs font-semibold text-primary flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Bu hafta</span>
              </div>
            </div>

            <div className="h-56 w-full pt-2">
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
                  <Bar dataKey="xp" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Daily Motivation & Topic Insights */}
        <div className="lg:col-span-5 space-y-4">
          {/* Motivation card */}
          <Card className="p-5 border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent space-y-3">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>Kunlik tavsiya</span>
            </div>
            <h4 className="font-bold text-base leading-tight">Bugun 15 daqiqa kod yozing!</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dasturlashda eng muhimi ko‘p vaqt emas, har kuni oz-ozdan bo‘lsa ham uzluksiz shug‘ullanishdir. Streakni yo‘qotmang!
            </p>
          </Card>

          {/* Strong / Weak topics */}
          <Card className="p-5 space-y-3">
            <h4 className="font-bold text-sm">Mavzular bo‘yicha tahlil</h4>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Kuchli mavzularingiz:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {stats.strongTopics.map((topic, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px]">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border/40">
                <span className="text-[11px] font-semibold text-amber-500 flex items-center gap-1 mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Qayta takrorlash tavsiya etiladi:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {stats.weakTopics.map((topic, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[11px]">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 5. Courses In Progress Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight">Mening kurslarim</h3>
          <Link href="/courses" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            <span>Barchasi</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.coursesProgress.map((c) => (
            <Card key={c.courseId} className="p-4 space-y-3 hover:border-primary/40 transition-all flex flex-col justify-between">
              <div className="space-y-1.5">
                <h4 className="font-bold text-sm line-clamp-1">{c.courseTitle}</h4>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{c.completedLessons} / {c.totalLessons} dars</span>
                  <span className="font-semibold text-primary">{c.percentage}%</span>
                </div>
                <Progress value={c.percentage} className="h-1.5" />
              </div>

              <Link href={`/courses/${c.courseSlug}`}>
                <Button variant="outline" size="sm" className="w-full text-xs h-7">
                  {c.percentage === 100 ? 'Ko‘rish' : 'Davom ettirish'}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* 6. Recent Achievements */}
      {achievements.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight">Ochilgan yutuqlar</h3>
            <Link href="/achievements" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              <span>Barcha yutuqlar</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {achievements.slice(0, 3).map((ach) => (
              <Card key={ach.id} className="p-3.5 flex items-center gap-3 border-border/80">
                <span className="text-2xl">{ach.icon}</span>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-xs">{ach.name}</h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{ach.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
