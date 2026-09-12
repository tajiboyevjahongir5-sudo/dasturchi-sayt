'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Search, 
  BookOpen, 
  ExternalLink, 
  Edit, 
  Trash2, 
  Clock, 
  AlertCircle,
  Loader2,
  X,
  Sparkles
} from 'lucide-react';
import type { Course, ContentStatus } from '@/types';

function AdminCoursesContent() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Create Modal state
  const [createModalOpen, setCreateModalOpen] = useState(() => searchParams.get('action') === 'new');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    category: 'frontend' as Course['category'],
    level: 'boshlangich' as Course['level'],
    thumbnail: '📘',
    estimatedHours: 10,
    technologies: 'HTML, CSS, JavaScript',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    const query = new URLSearchParams();
    if (statusFilter !== 'all') query.set('status', statusFilter);
    if (search) query.set('search', search);

    fetch(`/api/admin/courses?${query.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        if (!ignore && json.success) {
          setCourses(json.data);
        }
      })
      .catch((err) => {
        console.error('Error fetching courses:', err);
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [statusFilter, search, refreshKey]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug === '' || prev.slug === generatedSlug.slice(0, -1) ? generatedSlug : prev.slug,
    }));
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim() || formData.title.length < 3) {
      setFormError('Kurs nomi kamida 3 ta belgidan iborat bo‘lishi kerak');
      return;
    }
    if (!formData.shortDescription.trim() || formData.shortDescription.length < 5) {
      setFormError('Qisqa tavsif kamida 5 ta belgidan iborat bo‘lishi kerak');
      return;
    }
    if (!formData.description.trim() || formData.description.length < 10) {
      setFormError('To‘liq tavsif kamida 10 ta belgidan iborat bo‘lishi kerak');
      return;
    }

    try {
      setSubmitting(true);
      const techList = formData.technologies
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          ...formData,
          technologies: techList,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Kurs yaratishda xatolik yuz berdi');
      }

      setCreateModalOpen(false);
      setFormData({
        title: '',
        slug: '',
        shortDescription: '',
        description: '',
        category: 'frontend',
        level: 'boshlangich',
        thumbnail: '📘',
        estimatedHours: 10,
        technologies: 'HTML, CSS, JavaScript',
      });
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId: string, title: string) => {
    if (!confirm(`Haqiqatan ham "${title}" kursini arxivlamoqchimisiz? Kurs talabalardan yashiriladi, lekin avvalgi progress saqlanib qoladi.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      const json = await res.json();
      if (json.success) {
        setRefreshKey((k) => k + 1);
      } else {
        alert(json.error || 'O‘chirishda xatolik');
      }
    } catch {
      alert('Server bilan bog‘lanishda xatolik');
    }
  };

  const getStatusBadge = (status?: ContentStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Nashr qilingan</span>;
      case 'review':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">Ko‘rib chiqishda</span>;
      case 'archived':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-500/10 text-slate-600 border border-slate-500/20">Arxivlangan</span>;
      case 'draft':
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Qoralama (Draft)</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Kurslar Boshqaruvi</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Kurslarni yaratish, tahrirlash, modullar va darslarni boshqarish.
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)} variant="gradient" className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Yangi Kurs Yaratish</span>
        </Button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card/60 p-3 rounded-2xl border border-border/70 backdrop-blur-sm">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'published', label: 'Nashr qilingan' },
            { id: 'review', label: 'Review' },
            { id: 'draft', label: 'Qoralamalar' },
            { id: 'archived', label: 'Arxiv' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Kurs nomi yoki slug bo‘yicha..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-border/80 bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button type="submit" size="sm" variant="outline">
            Izlash
          </Button>
        </form>
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[30vh] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Kurslar yuklanmoqda...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border/80 bg-card/40 space-y-3">
          <BookOpen className="w-10 h-10 text-muted-foreground/60 mx-auto" />
          <h3 className="text-base font-semibold text-foreground">Kurslar topilmadi</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Ushbu filter bo‘yicha hech qanday kurs mavjud emas. Yangi kurs yaratish tugmasidan foydalanishingiz mumkin.
          </p>
          <Button onClick={() => setCreateModalOpen(true)} variant="outline" size="sm" className="gap-2 mt-2">
            <Plus className="w-4 h-4" />
            <span>Yangi kurs yaratish</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-3.5">
                {/* Header: Thumbnail + Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shrink-0">
                    {course.thumbnail || '📘'}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {getStatusBadge(course.status)}
                    <span className="text-[10px] font-mono text-muted-foreground">/{course.slug}</span>
                  </div>
                </div>

                {/* Course Title & Short Description */}
                <div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                    {course.shortDescription || course.description}
                  </p>
                </div>

                {/* Meta info: Hours & Technologies */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    {course.estimatedHours} soat
                  </span>
                  <span className="text-border">•</span>
                  <span className="capitalize">{course.level}</span>
                  <span className="text-border">•</span>
                  <span className="capitalize">{course.category}</span>
                </div>

                {/* Technology pills */}
                {course.technologies && course.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {course.technologies.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/60 text-muted-foreground border border-border/40"
                      >
                        {tech}
                      </span>
                    ))}
                    {course.technologies.length > 4 && (
                      <span className="text-[10px] text-muted-foreground">+{course.technologies.length - 4}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions Bar */}
              <div className="p-3 bg-muted/20 border-t border-border/60 flex items-center justify-between gap-2">
                <Link
                  href={`/courses/${course.slug}`}
                  target="_blank"
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  title="Talaba ko‘rinishida ochish"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id, course.title)}
                    className="text-destructive hover:bg-destructive/10 text-xs h-8 px-2.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>

                  <Link href={`/admin/courses/${course.id}`}>
                    <Button variant="default" size="sm" className="gap-1.5 text-xs h-8 px-3">
                      <Edit className="w-3.5 h-3.5" />
                      <span>Modullar & Darslar</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE COURSE MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Yangi Kurs Yaratish</h2>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Kurs Nomi *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Masalan: Python Dasturlash Asoslari"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Slug (URL) *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="python-asoslari"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-[11px] focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Emoji / Icon</label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="🐍"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-center text-base focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Qisqa Tavsif *</label>
                <input
                  type="text"
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Kurs kartasida ko‘rinadigan 1-2 jumlali xulosa"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">To‘liq Tavsif *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ushbu kurs kimlar uchun mo‘ljallangan va nimalar o‘rgatiladi..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Daraja</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as Course['level'] })}
                    className="w-full px-2.5 py-2 rounded-xl border border-border bg-background outline-none"
                  >
                    <option value="boshlangich">Boshlang‘ich</option>
                    <option value="orta">O‘rta</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Kategoriya</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Course['category'] })}
                    className="w-full px-2.5 py-2 rounded-xl border border-border bg-background outline-none"
                  >
                    <option value="kirish">Kirish</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="database">Database</option>
                    <option value="fullstack">Fullstack</option>
                    <option value="career">Karyera</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-foreground mb-1">Davomiylik</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) || 10 })}
                    className="w-full px-2.5 py-2 rounded-xl border border-border bg-background outline-none text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Texnologiyalar (vergul bilan)</label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="HTML, CSS, JavaScript, React"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" variant="gradient" size="sm" disabled={submitting}>
                  {submitting ? 'Yaratilmoqda...' : 'Kursni Yaratish'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCoursesPage() {
  return (
    <React.Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Kurslar yuklanmoqda...</p>
      </div>
    }>
      <AdminCoursesContent />
    </React.Suspense>
  );
}
