'use client';

import React, { useEffect, useState } from 'react';
import { Award, Lock, CheckCircle2, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Achievement } from '@/types';
import { SEED_ACHIEVEMENTS } from '@/db/seed-data';

interface UserAchievementData extends Achievement {
  unlockedAt?: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<UserAchievementData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAchievements() {
      try {
        const res = await fetch('/api/user/stats');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            const unlockedMap = new Map<string, string>();
            if (json.data.achievements) {
              json.data.achievements.forEach((a: { id: string; unlockedAt: string }) => {
                unlockedMap.set(a.id, a.unlockedAt);
              });
            }

            const merged = SEED_ACHIEVEMENTS.map((ach) => ({
              ...ach,
              unlockedAt: unlockedMap.get(ach.id),
            }));

            setAchievements(merged);
          }
        }
      } catch (err) {
        console.error('Achievements load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, []);

  const unlockedCount = achievements.filter((a) => Boolean(a.unlockedAt)).length;

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Gamification & Medallar</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">Mening Yutuqlarim</h1>
        <p className="text-sm text-muted-foreground">
          Darslarni yakunlang, testlardan o‘ting va maxsus dasturchilik unvonlarini qo‘lga kiriting.
        </p>
      </div>

      {/* Overview Stat Banner */}
      <div className="p-6 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-card flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-sm">
            <Trophy className="w-7 h-7 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Yutuqlar to‘plami</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Jami {achievements.length} ta yutuqdan {unlockedCount} tasi ochilgan
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-primary">
            {achievements.length > 0 ? Math.round((unlockedCount / achievements.length) * 100) : 0}%
          </span>
          <p className="text-xs text-muted-foreground">Kolleksiya yakunlangan</p>
        </div>
      </div>

      {/* Achievements Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const isUnlocked = Boolean(ach.unlockedAt);

            return (
              <Card
                key={ach.id}
                className={`p-5 space-y-3 transition-all duration-300 hover:-translate-y-1 ${
                  isUnlocked
                    ? 'border-amber-500/30 bg-amber-500/5 shadow-xs'
                    : 'border-border/60 bg-muted/20 opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="text-3xl p-2 rounded-xl bg-card border border-border/80 shadow-xs">
                    {ach.icon}
                  </div>
                  <Badge variant={isUnlocked ? 'success' : 'outline'} className="text-[10px]">
                    {isUnlocked ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Ochilgan
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        +{ach.xpReward} XP
                      </span>
                    )}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-foreground">{ach.name}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {ach.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
                  <span className="truncate">Shart: {ach.requirement}</span>
                  {ach.unlockedAt && (
                    <span className="text-emerald-500 font-semibold shrink-0 ml-2">
                      {new Date(ach.unlockedAt).toLocaleDateString('uz-UZ')}
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
