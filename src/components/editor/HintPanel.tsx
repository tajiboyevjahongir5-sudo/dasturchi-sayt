'use client';

import React, { useState } from 'react';
import { Lightbulb, ChevronRight, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

interface HintPanelProps {
  hints: string[];
  hintsUsedCount: number;
  onRevealNextHint: () => void;
}

export function HintPanel({ hints, hintsUsedCount, onRevealNextHint }: HintPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (hints.length === 0) return null;

  const hintLabels = [
    '1-bosqich: Yo‘nalish va umumiy fikr',
    '2-bosqich: Aniq ko‘rsatma va sintaksis',
    '3-bosqich: Yechim siri',
  ];

  return (
    <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 space-y-3 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <h4 className="font-bold text-sm text-foreground">Maslahatlar tizimi (Hints)</h4>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs font-semibold text-primary hover:underline transition-colors"
        >
          {isOpen ? 'Yashirish' : 'Ko‘rsatish'}
        </button>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Maslahatlar darhol tayyor yechimni bermaydi. Ular sizni mustaqil o‘ylashga va xatoni o‘zingiz topishga undaydi.
      </p>

      {isOpen && (
        <div className="space-y-2.5 pt-1 animate-in fade-in-50 duration-200">
          {hints.map((hint, idx) => {
            const isUnlocked = idx < hintsUsedCount;
            const isNextToUnlock = idx === hintsUsedCount;

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-xs transition-all duration-200 ${
                  isUnlocked
                    ? 'bg-card border-amber-500/30 shadow-xs'
                    : isNextToUnlock
                    ? 'bg-amber-500/5 border-amber-500/30 border-dashed text-foreground'
                    : 'bg-muted/40 border-dashed border-border/80 text-muted-foreground opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[11px] text-foreground flex items-center gap-1.5">
                    {isUnlocked && <Sparkles className="w-3 h-3 text-amber-500" />}
                    {hintLabels[idx] || `${idx + 1}-bosqich`}
                  </span>
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-500 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Ochilgan
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-muted/60 border border-border/50">
                      <Lock className="w-3 h-3" />
                      Yopiq
                    </span>
                  )}
                </div>

                {isUnlocked ? (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{hint}</p>
                ) : isNextToUnlock ? (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-muted-foreground italic">Ushbu maslahatni ko‘rishni xohlaysizmi?</span>
                    <Button
                      onClick={onRevealNextHint}
                      size="sm"
                      variant="outline"
                      className="h-6 text-[11px] px-2.5 gap-1 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 active:scale-95"
                    >
                      <span>Ochish</span>
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <p className="text-[11px] italic opacity-60">Avvalgi maslahatni oching</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
