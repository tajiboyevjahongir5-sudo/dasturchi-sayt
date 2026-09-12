'use client';

import React from 'react';
import { Lightbulb, HelpCircle, RefreshCw } from 'lucide-react';
import type { ErrorExplanation } from '@/types';
import { Button } from '../ui/button';
import { IconBadge } from '../ui/icon-badge';

interface ErrorExplanationPanelProps {
  explanation: ErrorExplanation;
  onRetry?: () => void;
}

export function ErrorExplanationPanel({ explanation, onRetry }: ErrorExplanationPanelProps) {
  return (
    <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-4 space-y-3.5 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rose-500/20 pb-2.5">
        <IconBadge 
          variant="danger" 
          label={explanation.errorType} 
          size="sm"
        />
        {explanation.line && (
          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
            {explanation.line}-qator
          </span>
        )}
      </div>

      {/* Main explanation */}
      <div className="space-y-2.5 text-xs">
        <div>
          <span className="font-semibold text-foreground">Nima uchun bu xato yuz berdi?</span>
          <p className="text-muted-foreground mt-0.5 leading-relaxed">{explanation.explanation}</p>
        </div>

        <div>
          <span className="font-semibold text-foreground">Nimani o‘zgartirish kerak?</span>
          <p className="text-muted-foreground mt-0.5 leading-relaxed">{explanation.whatToChange}</p>
        </div>

        {/* Clue/Hint */}
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-start gap-2">
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Yo‘nalish: </span>
            <span>{explanation.hint}</span>
          </div>
        </div>

        {/* Similar example */}
        {explanation.similarExample && (
          <div>
            <span className="font-semibold text-foreground">O‘xshash to‘g‘ri namuna:</span>
            <pre className="mt-1.5 p-3 rounded-lg bg-[#181825] text-emerald-300 font-mono text-[11px] overflow-x-auto border border-white/10 leading-relaxed">
              {explanation.similarExample}
            </pre>
          </div>
        )}

        {/* Reflection question */}
        {explanation.reflectionQuestion && (
          <div className="flex items-start gap-2 text-[11px] text-muted-foreground italic pt-1">
            <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" />
            <span>O‘ylab ko‘ring: {explanation.reflectionQuestion}</span>
          </div>
        )}
      </div>

      {onRetry && (
        <div className="pt-1">
          <Button onClick={onRetry} size="sm" variant="outline" className="w-full text-xs gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            Qayta tekshirib ko‘rish
          </Button>
        </div>
      )}
    </div>
  );
}
