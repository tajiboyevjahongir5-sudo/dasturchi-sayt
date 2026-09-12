'use client';

import React from 'react';
import { History, PlusCircle, Edit3, Trash2, CheckCircle, Archive, RefreshCw, UserCheck } from 'lucide-react';

interface ActivityItem {
  id: string;
  action: string;
  targetType: string;
  userName: string;
  createdAt: string;
  details?: string;
}

interface RecentActivityFeedProps {
  activities: ActivityItem[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return { label: 'Yaratildi', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: PlusCircle };
      case 'update':
        return { label: 'Tahrirlandi', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: Edit3 };
      case 'delete':
        return { label: 'O‘chirildi', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', icon: Trash2 };
      case 'publish':
        return { label: 'Nashr qilindi', color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', icon: CheckCircle };
      case 'archive':
        return { label: 'Arxivlandi', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Archive };
      case 'rollback':
        return { label: 'Versiya tiklandi', color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20', icon: RefreshCw };
      case 'role_change':
        return { label: 'Rol o‘zgardi', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', icon: UserCheck };
      default:
        return { label: action, color: 'text-slate-500 bg-slate-500/10 border-slate-500/20', icon: History };
    }
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString('uz-UZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <History className="w-4 h-4 text-primary" />
          <span>So‘nggi harakatlar (Activity)</span>
        </div>
        <p className="text-xs text-muted-foreground">Hozircha harakatlar tarixi bo‘sh.</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <History className="w-4 h-4 text-primary" />
          <span>So‘nggi harakatlar (CMS Activity)</span>
        </div>
        <span className="text-xs text-muted-foreground">Avtomat audit</span>
      </div>

      <div className="divide-y divide-border/50">
        {activities.map((item) => {
          const badge = getActionBadge(item.action);
          const Icon = badge.icon;
          return (
            <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-1.5 rounded-lg border shrink-0 ${badge.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 truncate">
                  <div className="font-semibold text-foreground truncate flex items-center gap-1.5">
                    <span>{item.userName}</span>
                    <span className="text-muted-foreground font-normal">
                      {item.targetType === 'course' ? 'kursni' : item.targetType === 'lesson' ? 'darsni' : item.targetType === 'module' ? 'modulni' : item.targetType}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                {formatTime(item.createdAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
