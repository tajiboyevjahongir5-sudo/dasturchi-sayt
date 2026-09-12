import Link from 'next/link';
import { Terminal, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, showTagline = false }: { className?: string; showTagline?: boolean }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2.5 group select-none transition-all duration-200 active:scale-[0.98]', className)}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
        <Terminal className="w-5 h-5 text-white" />
        <Sparkles className="w-3 h-3 text-cyan-300 absolute -top-1 -right-1 animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-400 bg-clip-text text-transparent group-hover:brightness-110 transition-all">
          CodeQuest
        </span>
        {showTagline && (
          <span className="text-[10px] font-medium text-muted-foreground -mt-1 tracking-wider uppercase">
            Kodni o‘rgan. G‘oyangni yarat.
          </span>
        )}
      </div>
    </Link>
  );
}
