'use client';

import React from 'react';
import { 
  Users, 
  BookOpen, 
  FileCode, 
  Code2, 
  Percent 
} from 'lucide-react';
import type { CMSStats } from '@/types';

interface StatsOverviewProps {
  stats: CMSStats;
  isInstructor?: boolean;
}

export function StatsOverview({ stats, isInstructor }: StatsOverviewProps) {
  const cards = [
    {
      title: isInstructor ? 'Sizning Talabalaringiz' : 'Jami Foydalanuvchilar',
      value: stats.totalUsers,
      sub: `${stats.activeUsers7d} ta 7 kunlik faol`,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: isInstructor ? 'Sizning Kurslaringiz' : 'Jami Kurslar',
      value: stats.totalCourses,
      sub: `${stats.totalLessons} ta dars mavjud`,
      icon: BookOpen,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Amaliy Mashqlar',
      value: stats.totalExercises,
      sub: 'Single & Multi-file',
      icon: FileCode,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Yechimlar (Submissions)',
      value: stats.totalSubmissions,
      sub: 'Avtomat tekshirilgan',
      icon: Code2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'O‘rtacha Test Natijasi',
      value: `${stats.avgQuizScore}%`,
      sub: 'Quiz ko‘rsatkichi',
      icon: Percent,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm space-y-3 transition-all hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{card.title}</span>
              <div className={`p-2 rounded-xl border ${card.bg}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground">{card.value}</div>
              <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
