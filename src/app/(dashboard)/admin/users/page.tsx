'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  GraduationCap, 
  User as UserIcon,
  AlertCircle,
  Loader2
} from 'lucide-react';
import type { User, UserRole } from '@/types';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (roleFilter !== 'all') params.set('role', roleFilter);

    fetch(`/api/admin/users?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (!ignore && json.success) {
          setUsers(json.data.users);
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
  }, [search, roleFilter, refreshKey]);

  const handleRoleChange = async (targetUser: User, newRole: UserRole) => {
    if (currentUser?.role !== 'superadmin') {
      alert('Foydalanuvchilar rolini o‘zgartirish huquqi faqat Super Admin uchun ruxsat etilgan!');
      return;
    }

    if (!confirm(`"${targetUser.name}" (${targetUser.email}) foydalanuvchisining rolini "${newRole}" ga o‘zgartirmoqchimisiz?`)) {
      return;
    }

    try {
      setUpdatingId(targetUser.id);
      const res = await fetch(`/api/admin/users/${targetUser.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ role: newRole }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Rolni o‘zgartirishda xatolik yuz berdi');
      }

      alert(`Foydalanuvchi roli muvaffaqiyatli ${newRole} ga o‘zgartirildi!`);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert((err as Error).message || 'Xatolik');
    } finally {
      setUpdatingId(null);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-3 h-3" />
            Super Admin
          </span>
        );
      case 'admin':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <ShieldCheck className="w-3 h-3" />
            Admin
          </span>
        );
      case 'instructor':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <GraduationCap className="w-3 h-3" />
            O‘qituvchi
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-600 border border-slate-500/20">
            <UserIcon className="w-3 h-3" />
            Talaba
          </span>
        );
    }
  };

  const isSuperAdmin = currentUser?.role === 'superadmin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Foydalanuvchilar & Rollar</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Platformadagi barcha foydalanuvchilar, ularning rollari va statistikasini boshqaring.
        </p>
      </div>

      {/* Super Admin Notice */}
      {!isSuperAdmin && (
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            Diqqat: Siz Admin rolidasiz. Foydalanuvchilarning rollarini o‘zgartirish huquqi xavfsizlik nuqtai nazaridan faqat <strong>Super Admin</strong> ga berilgan.
          </span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card/60 p-3 rounded-2xl border border-border/70 backdrop-blur-sm">
        {/* Role Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: `Barchasi (${total})` },
            { id: 'user', label: 'Talabalar' },
            { id: 'instructor', label: 'O‘qituvchilar' },
            { id: 'admin', label: 'Adminlar' },
            { id: 'superadmin', label: 'Super Adminlar' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                roleFilter === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setRefreshKey((k) => k + 1);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ism yoki email bo‘yicha..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-border/80 bg-background outline-none"
            />
          </div>
          <Button type="submit" size="sm" variant="outline">
            Izlash
          </Button>
        </form>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Foydalanuvchilar yuklanmoqda...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-xs">
            Foydalanuvchilar topilmadi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-semibold">
                <tr>
                  <th className="p-3.5">Foydalanuvchi</th>
                  <th className="p-3.5">Rol</th>
                  <th className="p-3.5">Level & XP</th>
                  <th className="p-3.5">Streak</th>
                  <th className="p-3.5">Ro‘yxatdan o‘tgan</th>
                  <th className="p-3.5 text-right">Rolni Boshqarish</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 text-foreground">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-foreground">{u.name}</div>
                      <div className="text-[11px] text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="p-3.5">{getRoleBadge(u.role)}</td>
                    <td className="p-3.5">
                      <div className="font-semibold">{u.level}-daraja</div>
                      <div className="text-[11px] text-muted-foreground">{u.xp} XP</div>
                    </td>
                    <td className="p-3.5 font-semibold text-amber-500">
                      {u.streak} kun
                    </td>
                    <td className="p-3.5 text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString('uz-UZ')}
                    </td>
                    <td className="p-3.5 text-right">
                      {isSuperAdmin ? (
                        <select
                          value={u.role}
                          disabled={updatingId === u.id}
                          onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                          className="px-2.5 py-1 rounded-xl border border-border bg-background text-xs outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium"
                        >
                          <option value="user">Talaba (user)</option>
                          <option value="instructor">O‘qituvchi (instructor)</option>
                          <option value="admin">Admin (admin)</option>
                          <option value="superadmin">Super Admin (superadmin)</option>
                        </select>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          Faqat Super Admin
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
