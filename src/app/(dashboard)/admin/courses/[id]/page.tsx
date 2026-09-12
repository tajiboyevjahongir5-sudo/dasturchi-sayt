'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  MoveUp, 
  MoveDown, 
  BookOpen, 
  FileText, 
  Layers, 
  AlertCircle, 
  Loader2, 
  ExternalLink, 
  X
} from 'lucide-react';
import type { Course, Module, Lesson, ContentStatus } from '@/types';

type CourseWithCurriculum = Course & {
  modules: (Module & { lessons: Lesson[] })[];
};

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  const { user } = useAuth();

  const [course, setCourse] = useState<CourseWithCurriculum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingCourse, setSavingCourse] = useState(false);

  // Course edit form state
  const [courseForm, setCourseForm] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    category: 'frontend' as Course['category'],
    level: 'boshlangich' as Course['level'],
    thumbnail: '📘',
    estimatedHours: 10,
    status: 'draft' as ContentStatus,
  });

  // Module Modal state
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');
  const [creatingModule, setCreatingModule] = useState(false);

  // Lesson Modal state
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonSlug, setLessonSlug] = useState('');
  const [lessonDesc, setLessonDesc] = useState('');
  const [creatingLesson, setCreatingLesson] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/admin/courses/${courseId}`)
      .then((res) => res.json())
      .then((json) => {
        if (!ignore) {
          if (!json.success) {
            setError(json.error || 'Kursni yuklashda xatolik');
          } else {
            setCourse(json.data);
            setCourseForm({
              title: json.data.title,
              slug: json.data.slug,
              shortDescription: json.data.shortDescription,
              description: json.data.description,
              category: json.data.category,
              level: json.data.level,
              thumbnail: json.data.thumbnail,
              estimatedHours: json.data.estimatedHours,
              status: json.data.status || 'draft',
            });
          }
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          setError((err as Error).message || 'Xatolik');
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [courseId, refreshKey]);

  const handleSaveCourseSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingCourse(true);
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(courseForm),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Saqlashda xatolik');
      }
      alert('Kurs ma’lumotlari muvaffaqiyatli yangilandi!');
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert((err as Error).message || 'Xatolik yuz berdi');
    } finally {
      setSavingCourse(false);
    }
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim()) return;

    try {
      setCreatingModule(true);
      const res = await fetch('/api/admin/modules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          courseId,
          title: moduleTitle,
          description: moduleDesc,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Modul yaratishda xatolik');
      }
      setModuleModalOpen(false);
      setModuleTitle('');
      setModuleDesc('');
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert((err as Error).message || 'Xatolik');
    } finally {
      setCreatingModule(false);
    }
  };

  const handleDeleteModule = async (moduleId: string, title: string) => {
    if (!confirm(`"${title}" modulini o‘chirishni tasdiqlaysizmi?`)) return;

    try {
      const res = await fetch(`/api/admin/modules/${moduleId}`, {
        method: 'DELETE',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });
      const json = await res.json();
      if (json.success) {
        setRefreshKey((k) => k + 1);
      } else {
        alert(json.error || 'O‘chirishda xatolik');
      }
    } catch {
      alert('Xatolik');
    }
  };

  const handleMoveModule = async (index: number, direction: 'up' | 'down') => {
    if (!course || !course.modules) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= course.modules.length) return;

    const reordered = [...course.modules];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    const orderedIds = reordered.map(m => m.id);

    try {
      const res = await fetch('/api/admin/modules', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          courseId,
          orderedIds,
        }),
      });
      if (res.ok) {
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMoveLesson = async (moduleId: string, lessonIndex: number, direction: 'up' | 'down') => {
    if (!course || !course.modules) return;
    const mod = course.modules.find(m => m.id === moduleId);
    if (!mod || !mod.lessons) return;

    const targetIdx = direction === 'up' ? lessonIndex - 1 : lessonIndex + 1;
    if (targetIdx < 0 || targetIdx >= mod.lessons.length) return;

    const reordered = [...mod.lessons];
    const temp = reordered[lessonIndex];
    reordered[lessonIndex] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    const orderedIds = reordered.map(l => l.id);

    try {
      const res = await fetch('/api/admin/lessons', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          moduleId,
          orderedIds,
        }),
      });
      if (res.ok) {
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openLessonModal = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setLessonTitle('');
    setLessonSlug('');
    setLessonDesc('');
    setLessonModalOpen(true);
  };

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModuleId || !lessonTitle.trim()) return;

    try {
      setCreatingLesson(true);
      const res = await fetch('/api/admin/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          courseId,
          moduleId: activeModuleId,
          title: lessonTitle,
          slug: lessonSlug || undefined,
          description: lessonDesc,
          status: 'draft',
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Dars yaratishda xatolik');
      }
      setLessonModalOpen(false);
      // Immediately navigate to lesson builder!
      router.push(`/admin/courses/${courseId}/lessons/${json.data.id}`);
    } catch (err: unknown) {
      alert((err as Error).message || 'Dars yaratishda xatolik');
      setCreatingLesson(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string, title: string) => {
    if (!confirm(`"${title}" darsini o‘chirishni tasdiqlaysizmi?`)) return;

    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });
      const json = await res.json();
      if (json.success) {
        setRefreshKey((k) => k + 1);
      } else {
        alert(json.error || 'O‘chirishda xatolik');
      }
    } catch {
      alert('Xatolik');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Kurs ma’lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-6 rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle className="w-5 h-5" />
          <span>Kurs yuklanmadi</span>
        </div>
        <p className="text-sm">{error || 'Kurs topilmadi'}</p>
        <Link href="/admin/courses">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Kurslar ro‘yxatiga qaytish</span>
          </Button>
        </Link>
      </div>
    );
  }

  const isAdminOrAbove = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="space-y-8">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/courses"
          className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-primary" />
          <span>Kurslar ro‘yxatiga qaytish</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/courses/${course.slug}`} target="_blank">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Saytda ko‘rish</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Grid: Course Settings (Left) & Modules/Lessons Tree (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Course Basic Settings Card */}
        <div className="lg:col-span-1 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <h2 className="font-bold text-sm text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Kurs Asosiy Sozlamalari</span>
            </h2>
            <span className="text-xl">{courseForm.thumbnail}</span>
          </div>

          <form onSubmit={handleSaveCourseSettings} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-foreground mb-1">Kurs Nomi</label>
              <input
                type="text"
                required
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Slug (URL)</label>
              <input
                type="text"
                required
                value={courseForm.slug}
                onChange={(e) => setCourseForm({ ...courseForm, slug: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-[11px] focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">Qisqa Tavsif</label>
              <input
                type="text"
                value={courseForm.shortDescription}
                onChange={(e) => setCourseForm({ ...courseForm, shortDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">To‘liq Tavsif</label>
              <textarea
                rows={3}
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-foreground mb-1">Daraja</label>
                <select
                  value={courseForm.level}
                  onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as Course['level'] })}
                  className="w-full px-2 py-1.5 rounded-xl border border-border bg-background outline-none text-xs"
                >
                  <option value="boshlangich">Boshlang‘ich</option>
                  <option value="orta">O‘rta</option>
                  <option value="professional">Professional</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Holati (Status)</label>
                <select
                  value={courseForm.status}
                  onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value as ContentStatus })}
                  disabled={!isAdminOrAbove && courseForm.status === 'published'}
                  className="w-full px-2 py-1.5 rounded-xl border border-border bg-background outline-none text-xs"
                >
                  <option value="draft">Qoralama (Draft)</option>
                  <option value="review">Ko‘rib chiqishda (Review)</option>
                  {isAdminOrAbove && <option value="published">Nashr qilingan (Published)</option>}
                  {isAdminOrAbove && <option value="archived">Arxivlangan (Archived)</option>}
                </select>
              </div>
            </div>

            <Button type="submit" variant="gradient" size="sm" className="w-full gap-2 mt-2" disabled={savingCourse}>
              <Save className="w-3.5 h-3.5" />
              <span>{savingCourse ? 'Saqlanmoqda...' : 'O‘zgarishlarni Saqlash'}</span>
            </Button>
          </form>
        </div>

        {/* Modules and Lessons Curriculum Tree (Right 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-card/60 p-4 rounded-2xl border border-border/70 backdrop-blur-sm">
            <div>
              <h2 className="font-bold text-base text-foreground flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <span>O‘quv Dasturi (Modullar & Darslar)</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Modullar qo‘shing, tartibini o‘zgartiring va darslarni yarating.
              </p>
            </div>

            <Button onClick={() => setModuleModalOpen(true)} variant="default" size="sm" className="gap-1.5 text-xs">
              <Plus className="w-4 h-4" />
              <span>Modul Qo‘shish</span>
            </Button>
          </div>

          {course.modules.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-border/80 bg-card/40 space-y-3">
              <Layers className="w-8 h-8 text-muted-foreground/50 mx-auto" />
              <h4 className="text-sm font-semibold text-foreground">Hozircha hech qanday modul mavjud emas</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Darslarni joylashdan oldin kamida bitta modul (masalan: 1-Modul: Kirish) yaratishingiz kerak.
              </p>
              <Button onClick={() => setModuleModalOpen(true)} variant="outline" size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Birinchi modulni qo‘shish</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {course.modules.map((mod, modIdx) => (
                <div
                  key={mod.id}
                  className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden"
                >
                  {/* Module Header */}
                  <div className="p-4 bg-muted/30 border-b border-border/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                        {modIdx + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-foreground truncate">{mod.title}</h3>
                        {mod.description && (
                          <p className="text-[11px] text-muted-foreground truncate">{mod.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Reorder Buttons */}
                      <button
                        onClick={() => handleMoveModule(modIdx, 'up')}
                        disabled={modIdx === 0}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-30"
                        title="Tepaga siljitish"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveModule(modIdx, 'down')}
                        disabled={modIdx === course.modules.length - 1}
                        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-30"
                        title="Pastga siljitish"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Add Lesson to this module */}
                      <Button
                        onClick={() => openLessonModal(mod.id)}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs gap-1 text-primary hover:bg-primary/10 font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Dars qo‘shish</span>
                      </Button>

                      {/* Delete Module */}
                      <button
                        onClick={() => handleDeleteModule(mod.id, mod.title)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive"
                        title="Modulni o‘chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Lessons List in Module */}
                  <div className="p-3 space-y-2">
                    {mod.lessons.length === 0 ? (
                      <div className="py-4 text-center text-xs text-muted-foreground">
                        Ushbu modulda darslar yo‘q.{' '}
                        <button
                          onClick={() => openLessonModal(mod.id)}
                          className="text-primary font-semibold hover:underline"
                        >
                          Dars qo‘shish
                        </button>
                      </div>
                    ) : (
                      mod.lessons.map((lesson, lesIdx) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/40 transition-colors gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-xs font-mono text-muted-foreground w-5 text-right">
                              {lesIdx + 1}.
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-foreground truncate">
                                  {lesson.title}
                                </span>
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                                  lesson.status === 'published'
                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                    : lesson.status === 'review'
                                    ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                    : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                }`}>
                                  {lesson.status === 'published' ? 'Published' : lesson.status === 'review' ? 'Review' : 'Draft'}
                                </span>
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border/40">
                                  v{lesson.version || 1}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground font-mono truncate">
                                /{lesson.slug} • {lesson.estimatedMinutes} daqiqa
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveLesson(mod.id, lesIdx, 'up')}
                              disabled={lesIdx === 0}
                              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-20 transition-colors"
                              title="Darsni yuqoriga surish"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveLesson(mod.id, lesIdx, 'down')}
                              disabled={lesIdx === mod.lessons.length - 1}
                              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 disabled:opacity-20 transition-colors"
                              title="Darsni pastga surish"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              title="Darsni o‘chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <Link href={`/admin/courses/${courseId}/lessons/${lesson.id}`}>
                              <Button variant="default" size="sm" className="h-7 text-xs gap-1">
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Tahrirlash</span>
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CREATE MODULE MODAL */}
      {moduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                <span>Yangi Modul Qo‘shish</span>
              </h3>
              <button onClick={() => setModuleModalOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateModule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Modul Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: 1-Modul: Dasturlashga Kirish"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Modul Tavsifi</label>
                <textarea
                  rows={2}
                  placeholder="Ushbu modulda nimalar o‘rganiladi..."
                  value={moduleDesc}
                  onChange={(e) => setModuleDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setModuleModalOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" variant="default" size="sm" disabled={creatingModule}>
                  {creatingModule ? 'Qo‘shilmoqda...' : 'Modulni Saqlash'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE LESSON MODAL */}
      {lessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span>Yangi Dars Yaratish</span>
              </h3>
              <button onClick={() => setLessonModalOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Dars Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: O‘zgaruvchilar va Ma’lumot Turlari"
                  value={lessonTitle}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                    setLessonTitle(title);
                    setLessonSlug(slug);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Slug (URL) *</label>
                <input
                  type="text"
                  required
                  placeholder="ozgaruvchilar-va-turlar"
                  value={lessonSlug}
                  onChange={(e) => setLessonSlug(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background font-mono text-[11px] focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Qisqa Tavsif</label>
                <textarea
                  rows={2}
                  placeholder="Dars mazmuni haqida qisqacha..."
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setLessonModalOpen(false)}>
                  Bekor qilish
                </Button>
                <Button type="submit" variant="gradient" size="sm" disabled={creatingLesson}>
                  {creatingLesson ? 'Yaratilmoqda...' : 'Darsni Yaratish & Builderga O‘tish'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
