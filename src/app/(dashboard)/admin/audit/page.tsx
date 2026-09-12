'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  History, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Archive, 
  RefreshCw, 
  UserCheck, 
  Loader2,
  X
} from 'lucide-react';
import type { AuditLog } from '@/types';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('all');
  const [targetFilter, setTargetFilter] = useState('all');
  const [selectedDetails, setSelectedDetails] = useState<AuditLog | null>(null);

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();
    if (actionFilter !== 'all') params.set('action', actionFilter);
    if (targetFilter !== 'all') params.set('targetType', targetFilter);

    fetch(`/api/admin/audit-logs?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (!ignore && json.success) {
          setLogs(json.data.logs);
          setTotal(json.data.total);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [actionFilter, targetFilter]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Xavfsizlik & Audit Loglari</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Tizimdagi har bir muhim o‘zgarish, kurs yaratish, nashr qilish va rol o‘zgarishlari xronologiyasi.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card/60 p-3 rounded-2xl border border-border/70 backdrop-blur-sm text-xs">
        {/* Action filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Barcha amallar' },
            { id: 'create', label: 'Yaratish' },
            { id: 'update', label: 'Tahrirlash' },
            { id: 'publish', label: 'Nashr qilish' },
            { id: 'rollback', label: 'Rollback' },
            { id: 'role_change', label: 'Rol o‘zgarishi' },
            { id: 'delete', label: 'O‘chirish' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActionFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                actionFilter === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Target Type selector */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground font-medium">Obyekt:</span>
          <select
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-border bg-background outline-none font-medium"
          >
            <option value="all">Barchasi</option>
            <option value="course">Kurs (Course)</option>
            <option value="module">Modul (Module)</option>
            <option value="lesson">Dars (Lesson)</option>
            <option value="exercise">Mashq (Exercise)</option>
            <option value="user">Foydalanuvchi (User)</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Audit loglari yuklanmoqda...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-xs">
            Audit loglari mavjud emas.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5">Foydalanuvchi</th>
                  <th className="p-3.5">Amal (Action)</th>
                  <th className="p-3.5">Obyekt turi</th>
                  <th className="p-3.5">Sana & Vaqt</th>
                  <th className="p-3.5 text-right">Tafsilotlar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-foreground">
                {logs.map((log) => {
                  const badge = getActionBadge(log.action);
                  const Icon = badge.icon;
                  return (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold">{log.userName || 'Tizim'}</div>
                        <div className="text-[11px] text-muted-foreground">{log.userEmail || ''}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}>
                          <Icon className="w-3 h-3" />
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-3.5 capitalize font-mono text-[11px] text-muted-foreground">
                        {log.targetType}
                      </td>
                      <td className="p-3.5 text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString('uz-UZ')}
                      </td>
                      <td className="p-3.5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedDetails(log)}
                          className="h-7 text-[11px]"
                        >
                          Ko‘rish
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILS MODAL */}
      {selectedDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <h3 className="font-bold text-sm text-foreground">Audit Tafsiloti</h3>
              <button onClick={() => setSelectedDetails(null)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amal:</span>
                <span className="font-semibold capitalize">{selectedDetails.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Obyekt turi:</span>
                <span className="font-semibold capitalize">{selectedDetails.targetType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Obyekt ID:</span>
                <span className="font-mono text-[11px]">{selectedDetails.targetId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Muallif:</span>
                <span className="font-semibold">{selectedDetails.userName} ({selectedDetails.userEmail})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sana:</span>
                <span>{new Date(selectedDetails.createdAt).toLocaleString('uz-UZ')}</span>
              </div>

              <div className="pt-2">
                <span className="block font-semibold text-muted-foreground mb-1">Qo‘shimcha ma’lumot (JSON):</span>
                <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-48">
                  {JSON.stringify(JSON.parse(selectedDetails.details || '{}'), null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setSelectedDetails(null)}>
                Yopish
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
