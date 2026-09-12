'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Lightbulb, 
  Code2, 
  Bot, 
  Check,
  Award,
  XCircle,
  BookOpen
} from 'lucide-react';
import type { Lesson, Exercise, TestResult, CodeError, ErrorExplanation } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CodeEditor } from '@/components/editor/CodeEditor';
import { CodePreview } from '@/components/editor/CodePreview';
import { MultiFileEditor } from '@/components/editor/MultiFileEditor';
import { MultiFilePreview } from '@/components/editor/MultiFilePreview';
import { ConsoleOutput } from '@/components/editor/ConsoleOutput';
import { TestResults } from '@/components/editor/TestResults';
import { ErrorExplanationPanel } from '@/components/editor/ErrorExplanationPanel';
import { HintPanel } from '@/components/editor/HintPanel';
import { QuizCard } from '@/components/quiz/QuizCard';
import { MentorPanel } from '@/components/mentor/MentorPanel';
import { executeCode, executeMultiFileProject } from '@/lib/code-runner/runner';
import { explainError } from '@/lib/error-explainer';
import { useToast } from '@/components/providers/ToastProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { Skeleton } from '@/components/ui/skeleton';

export default function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>;
}) {
  const { slug: courseSlug, lessonSlug } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  // Lesson & exercise state
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  // Coding & execution state
  const [userCode, setUserCode] = useState('');
  const [multiFiles, setMultiFiles] = useState<{
    'index.html': string;
    'style.css': string;
    'script.js': string;
  }>({
    'index.html': '',
    'style.css': '',
    'script.js': '',
  });
  const [consoleOutput, setConsoleOutput] = useState('');
  const [codeErrors, setCodeErrors] = useState<CodeError[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isPassed, setIsPassed] = useState(false);

  // Pedagogical & feedback state
  const [errorDiagnosis, setErrorDiagnosis] = useState<ErrorExplanation | null>(null);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [pasteCount, setPasteCount] = useState(0);
  const startTimeRef = React.useRef(0);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [mobileLessonTab, setMobileLessonTab] = useState<'theory' | 'practice'>('theory');

  // Load lesson details
  useEffect(() => {
    async function loadLesson() {
      try {
        setLoading(true);
        const res = await fetch(`/api/lessons/${lessonSlug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setLesson(json.data.lesson);
            setExercise(json.data.exercise);

            // Set starter code or multi-files
            if (json.data.exercise?.starterFiles) {
              setMultiFiles(json.data.exercise.starterFiles);
            }
            if (json.data.submissions && json.data.submissions.length > 0) {
              const latest = json.data.submissions[0];
              if (json.data.exercise?.isMultiFile || json.data.exercise?.starterFiles) {
                try {
                  setMultiFiles(JSON.parse(latest.code));
                } catch {
                  // Fallback to starterFiles
                }
              } else {
                setUserCode(latest.code);
              }
            } else if (json.data.exercise?.starterCode) {
              setUserCode(json.data.exercise.starterCode);
            } else if (json.data.lesson?.content?.interactiveExample?.code) {
              setUserCode(json.data.lesson.content.interactiveExample.code);
            }

            // Check if already completed
            if (json.data.progress?.status === 'completed') {
              setIsLessonCompleted(true);
              setQuizScore(json.data.progress.quizScore);
              setIsPassed(true);
            }
          }
        }
      } catch (err) {
        console.error('Lesson load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
  }, [lessonSlug]);

  // Run Code
  const handleRunCode = async () => {
    if (!lesson) return;
    setIsRunning(true);
    setErrorDiagnosis(null);
    setConsoleOutput('');
    setCodeErrors([]);

    const isMulti = Boolean(exercise?.isMultiFile || exercise?.starterFiles);
    const testCases = exercise ? [...exercise.testCases, ...exercise.hiddenTests] : [];
    let result;

    if (isMulti) {
      result = await executeMultiFileProject({
        files: multiFiles,
        testCases,
      });
    } else {
      const lang = (exercise?.language || lesson.content.interactiveExample?.language || 'javascript') as
        | 'javascript'
        | 'html'
        | 'css'
        | 'python';

      result = await executeCode({
        code: userCode,
        language: lang,
        testCases,
      });
    }

    setConsoleOutput(result.output);
    setCodeErrors(result.errors);
    setTestResults(result.testResults || []);

    if (result.errors.length > 0) {
      const firstErr = result.errors[0];
      const diag = explainError(firstErr.message, firstErr.line);
      setErrorDiagnosis(diag);
      setAttempts((a) => a + 1);
    } else if (exercise && result.testResults) {
      const allTestsPassed = result.testResults.length > 0 && result.testResults.every((t) => t.passed);
      setIsPassed(allTestsPassed);

      if (allTestsPassed) {
        toast({
          title: 'Topshiriq muvaffaqiyatli bajarildi!',
          description: 'Kodingiz barcha testlardan muvaffaqiyatli o‘tdi!',
          variant: 'success',
        });
        const codeToSubmit = isMulti ? JSON.stringify(multiFiles) : userCode;
        await submitExercise(true, result.testResults, 100, codeToSubmit);
      } else {
        setAttempts((a) => a + 1);
      }
    }

    setIsRunning(false);
  };

  // Submit exercise to backend API
  const submitExercise = async (passed: boolean, results: TestResult[], score: number, codeOverride?: string) => {
    if (!exercise) return;
    try {
      const codeToSend = codeOverride !== undefined ? codeOverride : userCode;
      const res = await fetch(`/api/exercises/${exercise.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToSend,
          testResults: results,
          passed,
          score,
          attempts,
          hintsUsed: hintsUsedCount,
          timeSpent: Math.round((Date.now() - (startTimeRef.current || Date.now())) / 1000),
          pasteCount,
          errors: codeErrors.map((e) => e.message),
        }),
      });

      const json = await res.json();
      if (json.success) {
        refreshUser();
        if (json.data.earnedXP > 0) {
          toast({
            title: `+${json.data.earnedXP} XP to‘pladingiz!`,
            description: 'Yangi tajriba ballari profilingizga qo‘shildi.',
            variant: 'default',
          });
        }
      }
    } catch (e) {
      console.error('Submit exercise error:', e);
    }
  };

  // Mark lesson as complete
  const handleCompleteLesson = async () => {
    if (!lesson) return;
    try {
      const res = await fetch('/api/progress/complete-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          courseId: lesson.courseId,
          quizScore: quizScore || 100,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setIsLessonCompleted(true);
        toast({
          title: 'Dars muvaffaqiyatli yakunlandi!',
          description: `+${json.data.earnedXP} XP qabul qilindi.`,
          variant: 'success',
        });
        refreshUser();

        // Navigate to next lesson if available
        if (lesson.content.nextLessonSlug && lesson.content.nextLessonSlug !== 'dashboard') {
          router.push(`/courses/${courseSlug}/lessons/${lesson.content.nextLessonSlug}`);
        } else {
          router.push('/dashboard');
        }
      }
    } catch (e) {
      console.error('Complete lesson error:', e);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40 rounded-lg" />
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-7 h-[600px] rounded-2xl" />
          <Skeleton className="lg:col-span-5 h-[600px] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold">Dars topilmadi</h2>
        <Link href={`/courses/${courseSlug}`}>
          <Button variant="outline">Kursga qaytish</Button>
        </Link>
      </div>
    );
  }

  const { content } = lesson;
  const currentLang = (exercise?.language || content.interactiveExample?.language || 'javascript') as
    | 'javascript'
    | 'html'
    | 'css'
    | 'python';

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* 1. Header Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href={`/courses/${courseSlug}`}
            className="flex items-center gap-1.5 font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kurs mundarijasi</span>
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground font-semibold line-clamp-1">{lesson.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Code Mentor floating toggle */}
          <Button
            onClick={() => setIsMentorOpen(!isMentorOpen)}
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
          >
            <Bot className="w-4 h-4" />
            <span>Code Mentor</span>
          </Button>

          {isLessonCompleted && (
            <Badge variant="success" className="gap-1 text-xs py-1">
              <Check className="w-3.5 h-3.5" />
              Tugallangan
            </Badge>
          )}
        </div>
      </div>

      {/* Mobile Segmented Tab Switcher (Visible on < lg screens) */}
      <div className="lg:hidden flex items-center p-1.5 rounded-2xl bg-muted/70 border border-border sticky top-16 z-30 backdrop-blur-xl shadow-md">
        <button
          type="button"
          onClick={() => {
            setMobileLessonTab('theory');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mobileLessonTab === 'theory'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="w-4 h-4 text-primary" />
          <span>1. Nazariya & Misollar</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setMobileLessonTab('practice');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            mobileLessonTab === 'practice'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Code2 className="w-4 h-4 text-primary" />
          <span>2. Kod & Amaliyot</span>
          {isPassed && <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />}
        </button>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Educational Content (Theory, Analogy, Code Example, Quiz) */}
        <div className={`lg:col-span-6 space-y-6 ${mobileLessonTab === 'theory' ? 'block' : 'hidden lg:block'}`}>
          {/* Lesson Title & Objectives */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{lesson.title}</h1>
            <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs text-foreground space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                Darsning asosiy maqsadi:
              </span>
              <p className="text-muted-foreground leading-relaxed">{content.learningObjective}</p>
            </div>
          </div>

          {/* Real-Life Analogy */}
          {content.realLifeAnalogy && (
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>Hayotiy Misol</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {content.realLifeAnalogy}
              </p>
            </div>
          )}

          {/* Theory Sections */}
          <div className="space-y-4 text-xs sm:text-sm text-foreground leading-relaxed">
            {content.theory.map((block, idx) => {
              if (block.type === 'heading') {
                return (
                  <h3 key={idx} className="text-base font-bold text-foreground pt-2">
                    {block.content}
                  </h3>
                );
              }
              if (block.type === 'note') {
                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-muted/60 border border-border/80 text-xs">
                    {block.content}
                  </div>
                );
              }
              return (
                <p key={idx} className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {block.content}
                </p>
              );
            })}
          </div>

          {/* Interactive Code Example */}
          {content.interactiveExample && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5 text-foreground">
                  <Code2 className="w-4 h-4 text-primary" />
                  {content.interactiveExample.title}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setUserCode(content.interactiveExample!.code);
                    setMobileLessonTab('practice');
                    toast({
                      title: 'Kod muharrirga nusxalandi',
                      description: 'Endi uni o‘zgartirishingiz va sinab ko‘rishingiz mumkin.',
                      variant: 'default',
                    });
                  }}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Muharrirga ko‘chirish</span>
                  <ArrowRight className="w-3 h-3 lg:hidden" />
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs overflow-x-auto border border-white/10 leading-relaxed">
                {content.interactiveExample.code}
              </pre>

              {content.interactiveExample.lineExplanations && (
                <div className="p-3 rounded-lg bg-muted/30 border border-border/60 text-[11px] text-muted-foreground space-y-1">
                  <span className="font-semibold text-foreground">Qatorlar izohi:</span>
                  {Object.entries(content.interactiveExample.lineExplanations).map(([line, text]) => (
                    <div key={line}>
                      <strong className="text-primary">{line}-qator:</strong> {text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Common Mistakes */}
          {content.commonMistakes && content.commonMistakes.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-sm text-foreground">Ko‘p uchraydigan xatolar</h4>
              {content.commonMistakes.map((mistake, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-border bg-card space-y-2 text-xs">
                  <span className="font-bold text-rose-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    {mistake.title}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="p-2 rounded bg-red-500/10 text-red-300 border border-red-500/20">
                      <span className="text-[9px] uppercase font-bold text-red-400 block">Xato kod:</span>
                      {mistake.wrongCode}
                    </div>
                    <div className="p-2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      <span className="text-[9px] uppercase font-bold text-emerald-400 block">To‘g‘ri kod:</span>
                      {mistake.correctCode}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">{mistake.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Mini Quiz */}
          {content.quiz && content.quiz.length > 0 && (
            <div className="pt-4">
              <QuizCard
                questions={content.quiz}
                onComplete={(score) => setQuizScore(score)}
                initialScore={quizScore}
              />
            </div>
          )}

          {/* Lesson Summary */}
          {content.summary && (
            <div className="p-4 rounded-xl bg-card border border-border space-y-1 text-xs">
              <span className="font-bold text-foreground">Xulosa:</span>
              <p className="text-muted-foreground leading-relaxed">{content.summary}</p>
            </div>
          )}

          {/* Mobile CTA: Switch to Practice */}
          <div className="lg:hidden pt-2">
            <Button
              type="button"
              onClick={() => {
                setMobileLessonTab('practice');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              variant="gradient"
              className="w-full font-bold gap-2 py-2.5 shadow-md"
            >
              <Code2 className="w-4 h-4" />
              <span>Amaliy topshiriqqa o‘tish</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: Code Editor, Execution, Tests, Hints, Diagnosis */}
        <div className={`lg:col-span-6 space-y-4 lg:sticky lg:top-20 ${mobileLessonTab === 'practice' ? 'block' : 'hidden lg:block'}`}>
          {/* Mobile back link to theory */}
          <div className="lg:hidden flex items-center justify-between pb-1">
            <button
              type="button"
              onClick={() => {
                setMobileLessonTab('theory');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Nazariyani qayta o‘qish</span>
            </button>
          </div>

          {/* Exercise Instructions banner if available */}
          {exercise && (
            <div className="p-4 rounded-xl border border-primary/30 bg-card space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-primary" />
                  Amaliy topshiriq: {exercise.title}
                </span>
                <Badge variant={isPassed ? 'success' : 'outline'}>
                  {isPassed ? 'Bajarildi' : 'Jarayonda'}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{exercise.description}</p>

              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-semibold text-foreground">Ko‘rsatmalar:</span>
                <ul className="space-y-0.5 text-xs text-muted-foreground list-disc pl-4">
                  {exercise.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Code Editor */}
          {exercise?.isMultiFile || exercise?.starterFiles ? (
            <div className="space-y-4">
              <MultiFileEditor
                files={multiFiles}
                onChange={(fileName, val) => {
                  setMultiFiles((prev) => ({ ...prev, [fileName]: val }));
                }}
                onRun={handleRunCode}
                onReset={() => {
                  if (exercise?.starterFiles) {
                    setMultiFiles(exercise.starterFiles);
                  }
                }}
                isLoading={isRunning}
                onPasteDetected={() => setPasteCount((p) => p + 1)}
                height="340px"
              />
              <MultiFilePreview files={multiFiles} height="320px" />
              <ConsoleOutput
                output={consoleOutput}
                errors={codeErrors}
                onClear={() => {
                  setConsoleOutput('');
                  setCodeErrors([]);
                  setErrorDiagnosis(null);
                }}
              />
            </div>
          ) : (
            <>
              <CodeEditor
                code={userCode}
                onChange={setUserCode}
                language={currentLang}
                onRun={handleRunCode}
                onReset={() => {
                  if (exercise?.starterCode) setUserCode(exercise.starterCode);
                }}
                isLoading={isRunning}
                onPasteDetected={() => setPasteCount((p) => p + 1)}
                height="320px"
              />

              {/* Live Preview for HTML/CSS or Console Output for JS */}
              {currentLang === 'html' || currentLang === 'css' ? (
                <CodePreview
                  htmlCode={currentLang === 'html' ? userCode : '<h1>CSS Preview</h1><p>Bu matn stillarini tekshiring.</p>'}
                  cssCode={currentLang === 'css' ? userCode : ''}
                />
              ) : (
                <ConsoleOutput
                  output={consoleOutput}
                  errors={codeErrors}
                  onClear={() => {
                    setConsoleOutput('');
                    setCodeErrors([]);
                    setErrorDiagnosis(null);
                  }}
                />
              )}
            </>
          )}

          {/* Error Explanation Panel if there are errors */}
          {errorDiagnosis && (
            <ErrorExplanationPanel
              explanation={errorDiagnosis}
              onRetry={handleRunCode}
            />
          )}

          {/* Test Results */}
          {testResults.length > 0 && (
            <TestResults results={testResults} passed={isPassed} />
          )}

          {/* 3-Stage Hint Panel */}
          {exercise && exercise.hints.length > 0 && (
            <HintPanel
              hints={exercise.hints}
              hintsUsedCount={hintsUsedCount}
              onRevealNextHint={() => setHintsUsedCount((h) => h + 1)}
            />
          )}

          {/* Complete Lesson / Next Lesson Action */}
          <div className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <p className="font-bold text-xs">
                {isLessonCompleted ? 'Dars yakunlangan' : 'Darsni tugatishga tayyormisiz?'}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Topshiriq va quizni bajarganingizdan so‘ng ballarni qabul qiling.
              </p>
            </div>

            <Button
              onClick={handleCompleteLesson}
              variant={isPassed ? 'gradient' : 'default'}
              size="sm"
              className="w-full sm:w-auto gap-1.5 font-bold shrink-0"
            >
              <span>{isLessonCompleted ? 'Keyingi dars' : 'Darsni tugatish'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Code Mentor Interactive Panel */}
      <MentorPanel
        isOpen={isMentorOpen}
        onClose={() => setIsMentorOpen(false)}
        context={{
          lessonTitle: lesson.title,
          code: userCode,
          language: currentLang,
          lastError: codeErrors[0]?.message,
          hints: exercise?.hints || [],
          hintsUsedCount,
        }}
      />
    </div>
  );
}
