'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LearningPathPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const roadmapSteps = [
    {
      id: 'step-1',
      number: '01',
      title: 'Dasturlashga Kirish',
      slug: 'dasturlashga-kirish',
      description: 'Algoritmlar, kompyuter fikrlash tarzi va ilk kod sintaksisi.',
      level: 'Boshlang‘ich',
      status: 'available',
      topics: ['Algoritm nima?', '0 va 1 lar', 'console.log', 'Xatolar bilan ishlash'],
    },
    {
      id: 'step-2',
      number: '02',
      title: 'HTML Asoslari',
      slug: 'html-asoslari',
      description: 'Veb sahifalarning suyak tuzilishi, semantik teglar va formalar.',
      level: 'Boshlang‘ich',
      status: 'available',
      topics: ['HTML skeleti', 'Sarlavhalar va matn', 'Rasmlar va havolalar', 'Formalar'],
    },
    {
      id: 'step-3',
      number: '03',
      title: 'CSS Asoslari',
      slug: 'css-asoslari',
      description: 'Zamonaviy dizayn: Box model, Flexbox, Grid va responsive moslashuvchanlik.',
      level: 'Boshlang‘ich',
      status: 'available',
      topics: ['Selektorlar va ranglar', 'Box Model', 'Flexbox', 'CSS Grid', 'Media Queries'],
    },
    {
      id: 'step-4',
      number: '04',
      title: 'JavaScript Asoslari',
      slug: 'javascript-asoslari',
      description: 'Interaktiv veb: o‘zgaruvchilar, shartlar, sikllar, funksiyalar va DOM hodisalari.',
      level: 'Boshlang‘ich - O‘rta',
      status: 'available',
      topics: ['let va const', 'if/else shartlari', 'for sikli', 'Funksiyalar', 'DOM & Events'],
    },
    {
      id: 'step-5',
      number: '05',
      title: 'Git va GitHub',
      slug: '#',
      description: 'Versiyalarni boshqarish, jamoa bilan ishlash va portfolioni joylash.',
      level: 'O‘rta',
      status: 'locked',
      topics: ['Git buyruqlari', 'Commit va Branch', 'Pull Request', 'GitHub hosting'],
      lockReason: 'JavaScript kursi yakunlangach ochiladi',
    },
    {
      id: 'step-6',
      number: '06',
      title: 'React va Zamonaviy Frontend',
      slug: '#',
      description: 'Komponentlar, hooklar va professional veb ilovalar arxitekturasi.',
      level: 'Professional',
      status: 'locked',
      topics: ['Komponentlar', 'useState & useEffect', 'SPA ilovalar', 'API integratsiya'],
      lockReason: 'Oldingi barcha bosqichlar talab qilinadi',
    },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interaktiv Yo‘l Xaritasi</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">Dasturchilik O‘quv Xaritasi</h1>
        <p className="text-sm text-muted-foreground">
          Ketma-ketlikka rioya qilib, bosqichma-bosqich 0 dan professional darajaga yeting.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-4 relative">
          {/* Vertical Connecting line on desktop */}
          <div className="hidden sm:block absolute left-8 top-10 bottom-10 w-0.5 bg-border/60 z-0" />

          {roadmapSteps.map((step) => {
            const isLocked = step.status === 'locked';

            return (
              <Card
                key={step.id}
                className={`relative z-10 p-6 sm:p-7 rounded-2xl border transition-all ${
                  isLocked
                    ? 'border-border/60 bg-muted/20 opacity-70'
                    : 'border-border bg-card hover:border-primary/40 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Step Icon Badge */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                        isLocked
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      {isLocked ? <Lock className="w-5 h-5" /> : step.number}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-foreground">{step.title}</h3>
                        <Badge variant={isLocked ? 'outline' : 'success'} className="text-[10px]">
                          {step.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                        {step.description}
                      </p>

                      {/* Topic chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {step.topics.map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {isLocked && step.lockReason && (
                        <p className="text-[11px] text-amber-500 font-semibold flex items-center gap-1 pt-1">
                          <Lock className="w-3 h-3" />
                          {step.lockReason}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full sm:w-auto self-stretch sm:self-center shrink-0 mt-2 sm:mt-0">
                    {!isLocked ? (
                      <Link href={`/courses/${step.slug}`} className="w-full sm:w-auto block">
                        <Button variant="gradient" size="sm" className="w-full sm:w-auto gap-1.5 font-bold">
                          <span>Kursga o‘tish</span>
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled variant="outline" size="sm" className="w-full sm:w-auto gap-1 text-xs">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Qulflangan</span>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
