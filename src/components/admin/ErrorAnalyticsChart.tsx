'use client';

import React from 'react';
import { AlertTriangle, Bug } from 'lucide-react';

interface ErrorAnalyticsProps {
  errors: Array<{ concept: string; errorCount: number }>;
}

export function ErrorAnalyticsChart({ errors }: ErrorAnalyticsProps) {
  if (!errors || errors.length === 0) {
    return (
      <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Bug className="w-4 h-4 text-amber-500" />
          <span>Ko‘p uchrayotgan xatolar tahlili</span>
        </div>
        <p className="text-xs text-muted-foreground">Hozircha tizimda qayd etilgan xatolar yo‘q.</p>
      </div>
    );
  }

  const maxCount = Math.max(...errors.map(e => e.errorCount), 1);

  return (
    <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Bug className="w-4 h-4 text-amber-500" />
          <span>Talabalar eng ko‘p yo‘l qo‘yayotgan xatolar</span>
        </div>
        <span className="text-xs text-muted-foreground">Oxirgi topshiriqlar bo‘yicha</span>
      </div>

      <div className="space-y-3">
        {errors.map((item, idx) => {
          const percent = Math.round((item.errorCount / maxCount) * 100);
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="font-mono text-foreground font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  {item.concept}
                </span>
                <span className="text-muted-foreground">{item.errorCount} marta</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
