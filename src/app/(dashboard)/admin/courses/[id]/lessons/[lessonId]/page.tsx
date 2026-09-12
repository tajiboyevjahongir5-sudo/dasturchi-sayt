'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  CheckCircle, 
  Eye, 
  History, 
  FileText, 
  Code2, 
  HelpCircle, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Loader2,
  RotateCcw,
  BookOpen,
  MoveUp,
  MoveDown,
  X
} from 'lucide-react';
import type { 
  Lesson, 
  Exercise, 
  ContentVersion, 
  ContentBlock, 
  QuizQuestion, 
  CommonMistake,
  TestCase,
  ProjectFiles
} from '@/types';

export default function LessonBuilderPage() {
  const params = useParams();
  const courseId = params.id as string;
  const lessonId = params.lessonId as string;
  const { user } = useAuth();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'theory' | 'exercise' | 'quiz' | 'history'>('theory');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [changeSummary, setChangeSummary] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(20);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState('');
  const [realLifeAnalogy, setRealLifeAnalogy] = useState('');
  const [summary, setSummary] = useState('');
  const [theoryBlocks, setTheoryBlocks] = useState<ContentBlock[]>([]);
  const [commonMistakes, setCommonMistakes] = useState<CommonMistake[]>([]);

  // Exercise Form State
  const [hasExercise, setHasExercise] = useState(true);
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [exerciseDesc, setExerciseDesc] = useState('');
  const [isMultiFile, setIsMultiFile] = useState(false);
  const [language, setLanguage] = useState<Exercise['language']>('javascript');
  const [difficulty, setDifficulty] = useState<Exercise['difficulty']>('easy');
  const [passingScore, setPassingScore] = useState(80);
  const [xpReward, setXpReward] = useState(50);
  const [starterCode, setStarterCode] = useState('');
  const [starterFiles, setStarterFiles] = useState<ProjectFiles>({
    'index.html': '<h1>Salom!</h1>',
    'style.css': 'h1 { color: blue; }',
    'script.js': 'console.log("Salom!");',
  });
  const [activeFileTab, setActiveFileTab] = useState<'index.html' | 'style.css' | 'script.js'>('index.html');
  const [instructions, setInstructions] = useState<string[]>([]);
  const [newInstruction, setNewInstruction] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [hints, setHints] = useState<string[]>(['', '', '']);
  const [solutionExplanation, setSolutionExplanation] = useState('');

  // Quiz Form State
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/admin/lessons/${lessonId}`)
      .then((res) => res.json())
      .then((json) => {
        if (!ignore) {
          if (!json.success) {
            alert(json.error || 'Darsni yuklab bo‘lmadi');
            return;
          }

          const l: Lesson = json.data;
          setLesson(l);
          setTitle(l.title);
          setSlug(l.slug);
          setDescription(l.description || '');
          setEstimatedMinutes(l.estimatedMinutes || 20);
          setObjectives(l.objectives || []);
          setTheoryBlocks(l.content?.theory || []);
          setRealLifeAnalogy(l.content?.realLifeAnalogy || '');
          setSummary(l.content?.summary || '');
          setCommonMistakes(l.content?.commonMistakes || []);
          setQuizQuestions(l.content?.quiz || []);

          if (json.data.exercise) {
            const ex: Exercise = json.data.exercise;
            setHasExercise(true);
            setExerciseTitle(ex.title);
            setExerciseDesc(ex.description);
            setIsMultiFile(Boolean(ex.isMultiFile || ex.starterFiles));
            setLanguage(ex.language);
            setDifficulty(ex.difficulty);
            setPassingScore(ex.passingScore);
            setXpReward(ex.xpReward || 50);
            setStarterCode(ex.starterCode || '');
            if (ex.starterFiles) {
              setStarterFiles(ex.starterFiles);
            }
            setInstructions(ex.instructions || []);
            setTestCases(ex.testCases || []);
            setHints(ex.hints && ex.hints.length >= 3 ? ex.hints : [ex.hints?.[0] || '', ex.hints?.[1] || '', ex.hints?.[2] || '']);
            setSolutionExplanation(ex.solutionExplanation || '');
          } else {
            setHasExercise(false);
          }

          setVersions(json.data.versions || []);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          alert((err as Error).message || 'Xatolik');
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
  }, [lessonId, refreshKey]);

  // Objective handlers
  const addObjective = () => {
    if (!newObjective.trim()) return;
    setObjectives([...objectives, newObjective.trim()]);
    setNewObjective('');
  };

  const removeObjective = (idx: number) => {
    setObjectives(objectives.filter((_, i) => i !== idx));
  };

  // Instruction handlers
  const addInstruction = () => {
    if (!newInstruction.trim()) return;
    setInstructions([...instructions, newInstruction.trim()]);
    setNewInstruction('');
  };

  const removeInstruction = (idx: number) => {
    setInstructions(instructions.filter((_, i) => i !== idx));
  };

  // Theory Block handlers
  const addTheoryBlock = (type: ContentBlock['type']) => {
    setTheoryBlocks([
      ...theoryBlocks,
      {
        type,
        content: type === 'code' ? '// Kod namunasi\n' : 'Yangi matn bloki...',
        language: type === 'code' ? 'javascript' : undefined,
      },
    ]);
  };

  const updateTheoryBlock = (idx: number, updates: Partial<ContentBlock>) => {
    const updated = [...theoryBlocks];
    updated[idx] = { ...updated[idx], ...updates };
    setTheoryBlocks(updated);
  };

  const removeTheoryBlock = (idx: number) => {
    setTheoryBlocks(theoryBlocks.filter((_, i) => i !== idx));
  };

  const moveTheoryBlock = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= theoryBlocks.length) return;
    const updated = [...theoryBlocks];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setTheoryBlocks(updated);
  };

  // Test Case handlers
  const addTestCase = () => {
    const newTc: TestCase = {
      id: crypto.randomUUID(),
      description: 'Natija to‘g‘riligini tekshirish',
      expectedOutput: 'Salom Dunyo',
      type: isMultiFile ? 'html-check' : 'output',
      targetFile: isMultiFile ? 'index.html' : undefined,
    };
    setTestCases([...testCases, newTc]);
  };

  const updateTestCase = (idx: number, updates: Partial<TestCase>) => {
    const updated = [...testCases];
    updated[idx] = { ...updated[idx], ...updates };
    setTestCases(updated);
  };

  const removeTestCase = (idx: number) => {
    setTestCases(testCases.filter((_, i) => i !== idx));
  };

  // Quiz handlers
  const addQuizQuestion = () => {
    const newQ: QuizQuestion = {
      id: crypto.randomUUID(),
      question: 'Yangi savol matni...',
      type: 'multiple-choice',
      options: ['1-variant', '2-variant', '3-variant', '4-variant'],
      correctAnswer: 0,
      explanation: 'To‘g‘ri javob tushuntirishi...',
    };
    setQuizQuestions([...quizQuestions, newQ]);
  };

  const updateQuizQuestion = (idx: number, updates: Partial<QuizQuestion>) => {
    const updated = [...quizQuestions];
    updated[idx] = { ...updated[idx], ...updates };
    setQuizQuestions(updated);
  };

  const removeQuizQuestion = (idx: number) => {
    setQuizQuestions(quizQuestions.filter((_, i) => i !== idx));
  };

  const moveQuizQuestion = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= quizQuestions.length) return;
    const updated = [...quizQuestions];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setQuizQuestions(updated);
  };

  // Compile full lesson payload
  const buildPayload = () => {
    const content = {
      title,
      learningObjective: objectives[0] || 'Dars maqsadi',
      realLifeAnalogy,
      theory: theoryBlocks,
      commonMistakes,
      quiz: quizQuestions,
      summary,
    };

    const exercisePayload = hasExercise ? {
      title: exerciseTitle || `${title} - Amaliy mashq`,
      description: exerciseDesc || 'Mashqni bajaring',
      language: isMultiFile ? 'htmlcssjs' : language,
      difficulty,
      passingScore,
      xpReward,
      starterCode: isMultiFile ? '' : starterCode,
      starterFiles: isMultiFile ? starterFiles : undefined,
      instructions,
      testCases,
      hints: hints.filter(Boolean),
      solutionExplanation,
    } : undefined;

    return {
      title,
      slug,
      description,
      estimatedMinutes,
      objectives,
      content,
      changeSummary: changeSummary || 'Dars yangilandi',
      exercise: exercisePayload,
    };
  };

  // Save changes (Draft update)
  const handleSave = async () => {
    try {
      setSaving(true);
      setValidationErrors([]);
      const payload = buildPayload();

      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Saqlashda xatolik yuz berdi');
      }

      alert('Dars va topshiriq muvaffaqiyatli saqlandi!');
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert((err as Error).message || 'Xatolik');
    } finally {
      setSaving(false);
    }
  };

  // Submit for Review
  const handleSubmitReview = async () => {
    try {
      setSaving(true);
      await handleSave(); // first save latest changes

      const res = await fetch(`/api/admin/lessons/${lessonId}/publish`, {
        method: 'PUT',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Reviewga yuborishda xatolik');
      }

      alert('Dars muvaffaqiyatli tekshiruvga (review) yuborildi!');
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert((err as Error).message || 'Xatolik');
    } finally {
      setSaving(false);
    }
  };

  // Publish Lesson
  const handlePublish = async () => {
    try {
      setPublishing(true);
      setValidationErrors([]);
      await handleSave(); // Save latest changes first

      const res = await fetch(`/api/admin/lessons/${lessonId}/publish`, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        if (json.validationErrors) {
          setValidationErrors(json.validationErrors);
        } else {
          setValidationErrors([json.error || 'Nashr qilishda xatolik yuz berdi']);
        }
        return;
      }

      alert('Tabriklaymiz! Dars muvaffaqiyatli nashr qilindi (Published)!');
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      setValidationErrors([(err as Error).message || 'Xatolik']);
    } finally {
      setPublishing(false);
    }
  };

  // Rollback to version
  const handleRollback = async (targetVersion: number) => {
    if (!confirm(`Haqiqatan ham darsni ${targetVersion}-versiyaga qaytarmoqchimisiz? Joriy holat yangi versiya sifatida arxivlanadi.`)) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/lessons/${lessonId}/rollback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ version: targetVersion }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Versiyani tiklashda xatolik');
      }

      alert(`Dars ${targetVersion}-versiyadan yangi versiyaga muvaffaqiyatli tiklandi!`);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      alert((err as Error).message || 'Xatolik');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Dars ma’lumotlari yuklanmoqda...</p>
      </div>
    );
  }

  const isAdminOrSuper = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/70 p-4 rounded-2xl border border-border/70 backdrop-blur-md sticky top-16 z-30 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href={`/admin/courses/${courseId}`}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-foreground truncate">{title}</h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                lesson?.status === 'published'
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                  : lesson?.status === 'review'
                  ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                  : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
              }`}>
                {lesson?.status?.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-muted text-muted-foreground border border-border/40">
                v{lesson?.version || 1}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono truncate">/{slug}</p>
          </div>
        </div>

        {/* Buttons: Preview, Save Draft, Submit Review, Publish */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="gap-1.5 text-xs h-8"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Oldindan Ko‘rish</span>
          </Button>

          <input
            type="text"
            placeholder="O‘zgarish izohi (ixtiyoriy)..."
            value={changeSummary}
            onChange={(e) => setChangeSummary(e.target.value)}
            className="hidden sm:inline-block px-2.5 py-1 text-xs rounded-xl border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary w-44"
          />

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="gap-1.5 text-xs h-8"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saqlanmoqda...' : 'Qoralama Saqlash'}</span>
          </Button>

          {user?.role === 'instructor' && (
            <Button
              variant="default"
              size="sm"
              onClick={handleSubmitReview}
              disabled={saving}
              className="gap-1.5 text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Review ga Yuborish</span>
            </Button>
          )}

          {isAdminOrSuper && (
            <Button
              variant="gradient"
              size="sm"
              onClick={handlePublish}
              disabled={publishing}
              className="gap-1.5 text-xs h-8 shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{publishing ? 'Tekshirilmoqda...' : 'Nashr Qilish (Publish)'}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Validation Errors Alert if any */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-2xl border border-destructive/40 bg-destructive/10 text-destructive text-xs space-y-2 animate-in fade-in-50">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Nashr qilish uchun quyidagi talablar bajarilishi shart:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/70 pb-2">
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'theory'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Nazariya & Konseptlar</span>
        </button>

        <button
          onClick={() => setActiveTab('exercise')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'exercise'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Amaliy Mashq (Exercise)</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'quiz'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Test Savollari (Quiz)</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Versiyalar Tarixi ({versions.length})</span>
        </button>
      </div>

      {/* TAB 1: THEORY & CONCEPTS */}
      {activeTab === 'theory' && (
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-4">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              <span>Dars Ma’lumotlari</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-semibold text-foreground mb-1">Dars Nomi *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Davomiylik (daqiqa)</label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 20)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background outline-none text-center"
                />
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-foreground">Dars Maqsadlari (Objectives) *</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Yangi o‘quv maqsadi qo‘shish..."
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background outline-none"
                />
                <Button type="button" onClick={addObjective} size="sm" variant="outline">
                  Qo‘shish
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {objectives.map((obj, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-primary/10 text-primary border border-primary/20"
                  >
                    <span>{obj}</span>
                    <button onClick={() => removeObjective(i)} className="text-primary hover:opacity-70">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Real Life Analogy & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Hayotiy Misol (Real-life Analogy)</label>
                <textarea
                  rows={3}
                  value={realLifeAnalogy}
                  onChange={(e) => setRealLifeAnalogy(e.target.value)}
                  placeholder="Dasturlash tushunchasini hayotiy narsalarga o‘xshatib tushuntiring..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Xulosa (Summary)</label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Dars yakunida o‘rganilgan asosiy xulosalar..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background outline-none"
                />
              </div>
            </div>
          </div>

          {/* Theory Blocks Manager */}
          <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Nazariya Bloklari ({theoryBlocks.length}) *</span>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Dars matni, kod bloklari, maslahat va ogohlantirish bloklarini yarating.
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <Button onClick={() => addTheoryBlock('heading')} size="sm" variant="outline" className="text-xs h-7">
                  + Sarlavha
                </Button>
                <Button onClick={() => addTheoryBlock('text')} size="sm" variant="outline" className="text-xs h-7">
                  + Matn
                </Button>
                <Button onClick={() => addTheoryBlock('code')} size="sm" variant="outline" className="text-xs h-7">
                  + Kod Bloki
                </Button>
                <Button onClick={() => addTheoryBlock('tip')} size="sm" variant="outline" className="text-xs h-7">
                  + Maslahat
                </Button>
                <Button onClick={() => addTheoryBlock('warning')} size="sm" variant="outline" className="text-xs h-7">
                  + Ogohlantirish
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {theoryBlocks.map((block, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-border/60 bg-background/60 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-primary">
                      {block.type} Bloki #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveTheoryBlock(idx, 'up')}
                        disabled={idx === 0}
                        title="Yuqoriga surish"
                        className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveTheoryBlock(idx, 'down')}
                        disabled={idx === theoryBlocks.length - 1}
                        title="Pastga surish"
                        className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTheoryBlock(idx)}
                        className="text-destructive hover:opacity-70 p-1"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={block.type === 'code' ? 6 : block.type === 'heading' ? 1 : 3}
                    value={block.content}
                    onChange={(e) => updateTheoryBlock(idx, { content: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border border-border bg-background outline-none ${
                      block.type === 'code' ? 'font-mono text-[11px] bg-slate-900 text-slate-100' : ''
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXERCISE BUILDER */}
      {activeTab === 'exercise' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-primary" />
                  <span>Amaliy Mashq Sozlamalari</span>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Topshiriq turi, boshlang‘ich kod, test keyslar va hintlarni belgilang.
                </p>
              </div>

              {/* Multi-file toggle */}
              <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-xl border border-border/60 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setIsMultiFile(false)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    !isMultiFile ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  Single-file
                </button>
                <button
                  type="button"
                  onClick={() => setIsMultiFile(true)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    isMultiFile ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  Multi-file Web (HTML/CSS/JS)
                </button>
              </div>
            </div>

            {/* Basic exercise inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-semibold text-foreground mb-1">Topshiriq Nomi</label>
                <input
                  type="text"
                  value={exerciseTitle}
                  onChange={(e) => setExerciseTitle(e.target.value)}
                  placeholder="Masalan: console.log bilan salomlashish"
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Qiyinlik Darajasi</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Exercise['difficulty'])}
                  className="w-full px-2 py-2 rounded-xl border border-border bg-background outline-none"
                >
                  <option value="easy">Oson (Easy)</option>
                  <option value="medium">O‘rta (Medium)</option>
                  <option value="hard">Qiyin (Hard)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">O‘tish Bali (%)</label>
                <input
                  type="number"
                  min={50}
                  max={100}
                  value={passingScore}
                  onChange={(e) => setPassingScore(parseInt(e.target.value) || 80)}
                  className="w-full px-2 py-2 rounded-xl border border-border bg-background outline-none text-center"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-foreground">Topshiriq Ko‘rsatmalari (Instructions)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Yangi ko‘rsatma qo‘shish..."
                  value={newInstruction}
                  onChange={(e) => setNewInstruction(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInstruction())}
                  className="flex-1 px-3 py-2 rounded-xl border border-border bg-background outline-none"
                />
                <Button type="button" onClick={addInstruction} size="sm" variant="outline">
                  Qo‘shish
                </Button>
              </div>

              <div className="space-y-1.5 pt-1">
                {instructions.map((inst, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-xl border border-border/50 bg-background/50 text-xs"
                  >
                    <span>{i + 1}. {inst}</span>
                    <button onClick={() => removeInstruction(i)} className="text-destructive p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Starter Code Editor */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <label className="block font-semibold text-foreground">
                  {isMultiFile ? 'Boshlang‘ich Fayllar (Starter Files)' : 'Boshlang‘ich Kod (Starter Code)'} *
                </label>
                {isMultiFile && (
                  <div className="flex items-center gap-1 border border-border rounded-lg p-0.5 bg-muted/40 font-mono text-[11px]">
                    {(['index.html', 'style.css', 'script.js'] as const).map((file) => (
                      <button
                        key={file}
                        type="button"
                        onClick={() => setActiveFileTab(file)}
                        className={`px-2.5 py-1 rounded-md transition-all ${
                          activeFileTab === file
                            ? 'bg-background text-primary font-bold shadow-sm'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {file}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isMultiFile ? (
                <textarea
                  rows={10}
                  value={starterFiles[activeFileTab]}
                  onChange={(e) =>
                    setStarterFiles({ ...starterFiles, [activeFileTab]: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-border bg-slate-900 text-slate-100 font-mono text-xs outline-none"
                />
              ) : (
                <textarea
                  rows={8}
                  value={starterCode}
                  onChange={(e) => setStarterCode(e.target.value)}
                  placeholder="// Talabaga beriladigan boshlang‘ich kod..."
                  className="w-full p-3 rounded-xl border border-border bg-slate-900 text-slate-100 font-mono text-xs outline-none"
                />
              )}
            </div>

            {/* Test Cases Manager */}
            <div className="space-y-3 pt-3 border-t border-border/50 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-sm text-foreground">Test Keyslar ({testCases.length}) *</label>
                <Button onClick={addTestCase} size="sm" variant="outline" className="gap-1.5 h-7">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Test Case Qo‘shish</span>
                </Button>
              </div>

              <div className="space-y-2.5">
                {testCases.map((tc, idx) => (
                  <div
                    key={tc.id || idx}
                    className="p-3 rounded-xl border border-border/60 bg-background/60 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-primary text-[11px]">#{idx + 1} Test</span>
                      <button onClick={() => removeTestCase(idx)} className="text-destructive p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-muted-foreground mb-0.5">Tavsif *</label>
                        <input
                          type="text"
                          value={tc.description}
                          onChange={(e) => updateTestCase(idx, { description: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-muted-foreground mb-0.5">Tekshirish Turi</label>
                        <select
                          value={tc.type}
                          onChange={(e) => updateTestCase(idx, { type: e.target.value as TestCase['type'] })}
                          className="w-full px-2 py-1.5 rounded-lg border border-border bg-background outline-none"
                        >
                          <option value="output">Output (Konsol chiqishi)</option>
                          <option value="contains">Contains (Matn mavjudligi)</option>
                          <option value="regex">Regex</option>
                          <option value="dom-check">DOM tekshiruvi</option>
                          <option value="html-check">HTML tekshiruvi</option>
                          <option value="css-check">CSS tekshiruvi</option>
                          <option value="js-check">JS tekshiruvi</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-muted-foreground mb-0.5">Kutilgan Natija *</label>
                        <input
                          type="text"
                          value={tc.expectedOutput}
                          onChange={(e) => updateTestCase(idx, { expectedOutput: e.target.value })}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background font-mono text-[11px] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3-Level Hints */}
            <div className="space-y-3 pt-3 border-t border-border/50 text-xs">
              <label className="font-bold text-sm text-foreground">3 Bosqichli Maslahatlar (Hints)</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-amber-500 font-semibold mb-1">1-Bosqich: Kontseptual</label>
                  <textarea
                    rows={2}
                    value={hints[0]}
                    onChange={(e) => setHints([e.target.value, hints[1], hints[2]])}
                    placeholder="Qaysi mavzuga e’tibor qaratish kerak..."
                    className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-background outline-none"
                  />
                </div>
                <div>
                  <label className="block text-blue-500 font-semibold mb-1">2-Bosqich: Aniqlashtiruvchi</label>
                  <textarea
                    rows={2}
                    value={hints[1]}
                    onChange={(e) => setHints([hints[0], e.target.value, hints[2]])}
                    placeholder="Funksiya yoki sintaksis haqida..."
                    className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-background outline-none"
                  />
                </div>
                <div>
                  <label className="block text-emerald-500 font-semibold mb-1">3-Bosqich: To‘liq Yechim</label>
                  <textarea
                    rows={2}
                    value={hints[2]}
                    onChange={(e) => setHints([hints[0], hints[1], e.target.value])}
                    placeholder="Kod namunasi..."
                    className="w-full px-2.5 py-1.5 rounded-xl border border-border bg-background outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUIZ BUILDER */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div>
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  <span>Test Savollari ({quizQuestions.length})</span>
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Dars oxirida o‘quvchilar bilimini sinash uchun savollar qo‘shing.
                </p>
              </div>

              <Button onClick={addQuizQuestion} size="sm" variant="default" className="gap-1.5 text-xs">
                <Plus className="w-4 h-4" />
                <span>Savol Qo‘shish</span>
              </Button>
            </div>

            <div className="space-y-4">
              {quizQuestions.map((q, qIdx) => (
                <div
                  key={q.id || qIdx}
                  className="p-4 rounded-xl border border-border/70 bg-background/60 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">#{qIdx + 1}-Savol</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveQuizQuestion(qIdx, 'up')}
                        disabled={qIdx === 0}
                        title="Yuqoriga surish"
                        className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveQuizQuestion(qIdx, 'down')}
                        disabled={qIdx === quizQuestions.length - 1}
                        title="Pastga surish"
                        className="p-1 rounded text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => removeQuizQuestion(qIdx)} 
                        className="text-destructive p-1"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">Savol Matni *</label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => updateQuizQuestion(qIdx, { question: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background outline-none"
                    />
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    <label className="block font-semibold text-muted-foreground">
                      Javob Variantlari (To‘g‘ri javobni tanlang) *
                    </label>
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct_${qIdx}`}
                          checked={q.correctAnswer === optIdx}
                          onChange={() => updateQuizQuestion(qIdx, { correctAnswer: optIdx })}
                          className="w-4 h-4 accent-primary"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...q.options];
                            newOpts[optIdx] = e.target.value;
                            updateQuizQuestion(qIdx, { options: newOpts });
                          }}
                          className={`flex-1 px-2.5 py-1.5 rounded-lg border outline-none ${
                            q.correctAnswer === optIdx ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">To‘g‘ri Javob Tushuntirishi</label>
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => updateQuizQuestion(qIdx, { explanation: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-border bg-background outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VERSION HISTORY & ROLLBACK */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <span>Versiyalar Tarixi & Qaytarish (Rollback)</span>
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Har bir saqlash yoki o‘zgarish avtomatik versiyalanadi. Istalgan versiyaga qaytarishingiz mumkin.
              </p>
            </div>

            <div className="divide-y divide-border/60">
              {versions.map((ver) => (
                <div key={ver.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full font-mono font-bold bg-primary/10 text-primary border border-primary/20 text-[11px]">
                        v{ver.version}
                      </span>
                      <span className="font-semibold text-foreground truncate">
                        {ver.changeSummary || 'Dars yangilandi'}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(ver.createdAt).toLocaleString('uz-UZ')}
                    </p>
                  </div>

                  <Button
                    onClick={() => handleRollback(ver.version)}
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs h-7 shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-primary" />
                    <span>Tiklash</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="bg-card border border-border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-base text-foreground">{title} (Talaba Ko‘rinishi)</h3>
              </div>
              <button onClick={() => setPreviewOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Theory Render */}
            <div className="space-y-4 text-xs text-foreground leading-relaxed">
              {realLifeAnalogy && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
                  <span className="font-bold">💡 Hayotiy Misol: </span>
                  {realLifeAnalogy}
                </div>
              )}

              {theoryBlocks.map((block, idx) => (
                <div key={idx}>
                  {block.type === 'heading' && (
                    <h4 className="font-bold text-sm text-foreground">{block.content}</h4>
                  )}
                  {block.type === 'text' && <p>{block.content}</p>}
                  {block.type === 'code' && (
                    <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto">
                      <code>{block.content}</code>
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
