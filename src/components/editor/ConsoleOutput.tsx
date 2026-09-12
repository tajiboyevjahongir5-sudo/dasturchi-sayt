'use client';

import React from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import type { CodeError } from '@/types';

interface ConsoleOutputProps {
  output: string;
  errors?: CodeError[];
  onClear?: () => void;
}

export function ConsoleOutput({ output, errors = [], onClear }: ConsoleOutputProps) {
  const hasContent = Boolean(output || errors.length > 0);

  return (
    <div className="flex flex-col rounded-xl border border-border/80 bg-[#11111b] overflow-hidden shadow-md font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-white/5 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">
            Dastur Konsoli (Console)
          </span>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-[10px] hover:text-white transition-colors"
            title="Konsolni tozalash"
          >
            <Trash2 className="w-3 h-3" />
            Tozalash
          </button>
        )}
      </div>

      <div className="p-3.5 min-h-[100px] max-h-60 overflow-y-auto space-y-1.5 text-[#cdd6f4]">
        {!hasContent && (
          <div className="text-muted-foreground/60 italic py-4 text-center">
            Konsol bo‘sh. Kodni ishga tushirish uchun &quot;Ishga tushirish&quot; tugmasini bosing.
          </div>
        )}

        {output && (
          <div className="whitespace-pre-wrap leading-relaxed text-emerald-300">
            {output}
          </div>
        )}

        {errors.map((err, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 space-y-1"
          >
            <div className="flex items-center justify-between font-bold text-[11px]">
              <span className="uppercase tracking-wider">Xatolik: {err.type}</span>
              {err.line && <span className="text-red-400 font-semibold">{err.line}-qator</span>}
            </div>
            <p className="text-xs">{err.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
