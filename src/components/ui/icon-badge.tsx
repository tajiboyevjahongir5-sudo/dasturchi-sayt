'use client';

import React from 'react';
import { 
  Flame, 
  Zap, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  BookOpen, 
  Award,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type IconBadgeVariant = 
  | 'streak' 
  | 'xp' 
  | 'trophy' 
  | 'gem' 
  | 'success' 
  | 'danger' 
  | 'warning' 
  | 'info' 
  | 'purple'
  | 'default';

interface IconBadgeProps {
  variant?: IconBadgeVariant;
  icon?: LucideIcon;
  label?: string | number;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const variantStyles: Record<IconBadgeVariant, {
  container: string;
  iconColor: string;
  defaultIcon: LucideIcon;
  fillIcon?: boolean;
}> = {
  streak: {
    container: 'bg-amber-500/10 border-amber-500/25 text-amber-500 dark:text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
    iconColor: 'text-amber-500 fill-amber-500',
    defaultIcon: Flame,
    fillIcon: true,
  },
  xp: {
    container: 'bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]',
    iconColor: 'text-blue-500 fill-blue-500',
    defaultIcon: Zap,
    fillIcon: true,
  },
  trophy: {
    container: 'bg-yellow-500/10 border-yellow-500/25 text-yellow-600 dark:text-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.15)]',
    iconColor: 'text-yellow-500 fill-yellow-500',
    defaultIcon: Trophy,
    fillIcon: true,
  },
  gem: {
    container: 'bg-purple-500/10 border-purple-500/25 text-purple-600 dark:text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)]',
    iconColor: 'text-purple-500 fill-purple-500',
    defaultIcon: Sparkles,
    fillIcon: true,
  },
  success: {
    container: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    iconColor: 'text-emerald-500',
    defaultIcon: CheckCircle2,
  },
  danger: {
    container: 'bg-rose-500/10 border-rose-500/25 text-rose-600 dark:text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    iconColor: 'text-rose-500',
    defaultIcon: AlertTriangle,
  },
  warning: {
    container: 'bg-orange-500/10 border-orange-500/25 text-orange-600 dark:text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]',
    iconColor: 'text-orange-500',
    defaultIcon: AlertTriangle,
  },
  info: {
    container: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-600 dark:text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]',
    iconColor: 'text-cyan-500',
    defaultIcon: ShieldCheck,
  },
  purple: {
    container: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-600 dark:text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.15)]',
    iconColor: 'text-indigo-500',
    defaultIcon: Award,
  },
  default: {
    container: 'bg-muted/80 border-border text-muted-foreground',
    iconColor: 'text-muted-foreground',
    defaultIcon: BookOpen,
  },
};

const sizeStyles = {
  sm: {
    pill: 'px-2 py-0.5 text-xs gap-1.5',
    icon: 'w-3 h-3',
  },
  md: {
    pill: 'px-2.5 py-1 text-xs gap-1.5 font-semibold',
    icon: 'w-3.5 h-3.5',
  },
  lg: {
    pill: 'px-3.5 py-1.5 text-sm gap-2 font-bold',
    icon: 'w-4 h-4',
  },
};

export function IconBadge({
  variant = 'default',
  icon,
  label,
  sublabel,
  size = 'md',
  animated = false,
  className,
  children,
}: IconBadgeProps) {
  const conf = variantStyles[variant] || variantStyles.default;
  const sizeConf = sizeStyles[size] || sizeStyles.md;
  const IconComponent = icon || conf.defaultIcon;

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border backdrop-blur-md transition-all duration-200 select-none',
        conf.container,
        sizeConf.pill,
        animated && 'hover:scale-105 active:scale-95 cursor-default',
        className
      )}
    >
      <IconComponent 
        className={cn(
          sizeConf.icon,
          conf.iconColor,
          animated && variant === 'streak' && 'animate-pulse'
        )} 
      />
      {label !== undefined && <span>{label}</span>}
      {sublabel && <span className="opacity-70 text-[10px] font-normal">{sublabel}</span>}
      {children}
    </div>
  );
}
