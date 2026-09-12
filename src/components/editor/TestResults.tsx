'use client';

import React from 'react';
import { CheckCircle2, XCircle, Award } from 'lucide-react';
import type { TestResult } from '@/types';
import { IconBadge } from '../ui/icon-badge';

interface TestResultsProps {
  results: TestResult[];
  passed: boolean;
  score?: number;
}

export function TestResults({ results, passed, score }: TestResultsProps) {
  if (results.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          <h4 className="font-bold text-sm">Tekshiruv natijalari (Test Cases)</h4>
        </div>
        <div className="flex items-center gap-2">
          {score !== undefined && (
            <span className="text-xs font-semibold text-muted-foreground">
              Ball: <strong className="text-foreground">{score}%</strong>
            </span>
          )}
          <IconBadge
            variant={passed ? 'success' : 'danger'}
            label={passed ? 'Barcha testlar o‘tdi' : 'Xatolar mavjud'}
            size="sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        {results.map((r, i) => (
          <div
            key={i}
            className={`p-2.5 rounded-lg border text-xs flex flex-col gap-1 transition-all ${
              r.passed
                ? 'bg-emerald-500/5 border-emerald-500/25 text-foreground'
                : 'bg-rose-500/5 border-rose-500/25 text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              {r.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 animate-in zoom-in-50 duration-200" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 animate-in zoom-in-50 duration-200" />
              )}
              <span className="font-semibold">{r.description}</span>
            </div>

            {!r.passed && (
              <div className="pl-6 pt-1 text-[11px] text-muted-foreground space-y-1">
                <div>
                  Kutilgan: <code className="bg-muted/80 border border-border/50 px-1.5 py-0.5 rounded font-mono text-emerald-400 text-[11px]">{r.expected}</code>
                </div>
                <div>
                  Haqiqiy: <code className="bg-muted/80 border border-border/50 px-1.5 py-0.5 rounded font-mono text-rose-400 text-[11px]">{r.actual}</code>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
