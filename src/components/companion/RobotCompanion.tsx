'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Square, 
  RotateCcw, 
  Sparkles, 
  X, 
  Bot, 
  AlertTriangle, 
  Lightbulb, 
  Headphones,
  GraduationCap,
  Code2,
  Pause,
  Play
} from 'lucide-react';
import { RobotAvatar, RobotMood } from './RobotAvatar';
import { 
  getLessonGreeting, 
  diagnoseErrorForSpeech, 
  getSuccessCelebration, 
  getHintSpeech,
  formatTextForSpeech,
  RobotSpeechScript 
} from './robot-dialogue';
import { Button } from '@/components/ui/button';

export interface LectureStep {
  id: string;
  elementId: string;
  title: string;
  pointingDirection: 'left' | 'right';
  speechText: string;
  displayText: string;
}

export interface RobotCompanionProps {
  lessonTitle?: string;
  lessonObjective?: string;
  lessonAnalogy?: string;
  lastError?: {
    type?: string;
    message: string;
    line?: number;
    originalMessage?: string;
  } | null;
  userCode?: string;
  isPassed?: boolean;
  hints?: string[];
  hintsUsedCount?: number;
  onHighlightLine?: (line: number) => void;
}

export function RobotCompanion({
  lessonTitle = 'Dasturlash Darsi',
  lessonObjective,
  lessonAnalogy,
  lastError,
  userCode = '',
  isPassed = false,
  hints = [],
  hintsUsedCount = 0,
  onHighlightLine,
}: RobotCompanionProps) {
  // Navigation & Floating position state
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPointing, setIsPointing] = useState(false);
  const [pointingDirection, setPointingDirection] = useState<'left' | 'right'>('left');
  const [targetElementId, setTargetElementId] = useState<string | null>(null);
  const [targetLineNumber, setTargetLineNumber] = useState<number | null>(null);

  // Continuous Auto-Lecture State
  const [isLectureActive, setIsLectureActive] = useState(false);
  const [isLecturePaused, setIsLecturePaused] = useState(false);
  const [lectureStepIndex, setLectureStepIndex] = useState<number>(-1);

  const isLectureRunningRef = useRef(false);
  const activeStepRef = useRef<number>(-1);
  const lectureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({ startX: 0, startY: 0, posX: 0, posY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // UI state
  const [isMinimized, setIsMinimized] = useState(false);
  const [isBubbleOpen, setIsBubbleOpen] = useState(true);
  const [currentScript, setCurrentScript] = useState<RobotSpeechScript | null>(() => 
    getLessonGreeting(lessonTitle, lessonObjective)
  );
  const [mood, setMood] = useState<RobotMood>('idle');

  // Audio / Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voice, setVoice] = useState<'uz-UZ-MadinaNeural' | 'uz-UZ-SardorNeural'>('uz-UZ-MadinaNeural');
  const voiceRef = useRef<'uz-UZ-MadinaNeural' | 'uz-UZ-SardorNeural'>(voice);

  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speakSessionIdRef = useRef(0);

  // Stop any currently playing speech immediately
  const stopSpeaking = useCallback(() => {
    speakSessionIdRef.current++;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsLoadingAudio(false);
    setMood((m) => (m === 'talking' ? 'idle' : m));
  }, []);

  // Cancel any browser speech synthesis on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  // Clean title for teacher dialogue
  const cleanTitle = lessonTitle.replace(/^(\d+-Dars:?\s*)/i, '');

  // Build the complete step-by-step lecture steps
  const lectureSteps = React.useMemo<LectureStep[]>(() => [
    {
      id: 'step-title',
      elementId: 'lesson-title-section',
      title: `1. Mavzu: ${cleanTitle}`,
      pointingDirection: 'left',
      speechText: `Assalomu alaykum! Bugungi darsimizda dasturlash va algoritmlarning asosiy mohiyatini, kompyuterga buyruqlar berish sirlarini birgalikda o‘rganamiz. Dasturlash — bu qiziqarli mantiqiy jarayon bo‘lib, unda siz kompyuterga qanday ishlashni o‘rgatasiz.`,
      displayText: `🎓 **Assalomu alaykum!** Bugun biz **${cleanTitle}** mavzusini o‘rganamiz. Kompyuter bilan muloqot qilish asoslarini ko‘rib chiqamiz.`,
    },
    ...(lessonObjective ? [{
      id: 'step-objective',
      elementId: 'lesson-objective-section',
      title: '2. Darsning Asosiy Maqsadi',
      pointingDirection: 'left' as const,
      speechText: `Ushbu darsdagi asosiy maqsadimiz: ${lessonObjective}. Buni puxta tushunib olsangiz, keyingi murakkab mavzular siz uchun juda oson va ravon bo‘ladi.`,
      displayText: `🎯 **Asosiy Maqsad:**\n${lessonObjective}`,
    }] : []),
    ...(lessonAnalogy ? [{
      id: 'step-analogy',
      elementId: 'lesson-analogy-section',
      title: '3. Hayotiy Misol',
      pointingDirection: 'left' as const,
      speechText: `Mavzuni hayotimiz bilan bog‘laymiz: ${lessonAnalogy}. Ko‘rib turganingizdek, algoritm — bu kundalik hayotimizdagi oddiy tartib-qoidalarga o‘xshaydi.`,
      displayText: `💡 **Hayotiy Misol:**\n${lessonAnalogy}`,
    }] : []),
    {
      id: 'step-example',
      elementId: 'lesson-example-section',
      title: '4. Kod Namunasi',
      pointingDirection: 'left',
      speechText: `Endi esa amaliy kodga e’tibor bering. JavaScript tilida konsolga xabar chiqarish uchun console.log buyrug‘idan foydalanamiz. Qavs ichidagi matn ekranda aks etadi.`,
      displayText: `💻 **Kod Namunasi:**\n\`console.log\` buyrug‘i orqali ekranga ma’lumot chiqaramiz.`,
    },
    {
      id: 'step-editor',
      elementId: 'lesson-code-editor',
      title: '5. Amaliy Topshiriq',
      pointingDirection: 'right',
      speechText: `Endi navbat sizga! O‘ng tomondagi muharrirda topshiriq shartiga mos kodni yozing va 'Ishga tushirish' tugmasini bosing. Agar xatolik bo‘lsa, xavotir olmang — men darhol xato qatorga borib, qanday to‘g‘irlashni tushuntirib beraman!`,
      displayText: `🚀 **Amaliyot Vaqti!**\nMuharrirda kodingizni yozing va "Ishga tushirish" tugmasini bosing. Men yoningizdaman!`,
    }
  ], [cleanTitle, lessonObjective, lessonAnalogy]);

  const lectureStepsRef = useRef<LectureStep[]>(lectureSteps);
  useEffect(() => {
    lectureStepsRef.current = lectureSteps;
  }, [lectureSteps]);

  // Ref forward declaration for auto-advance
  const advanceLectureRef = useRef<() => void>(() => {});

  // Play natural voice via /api/tts with auto-advance capability
  const speakText = useCallback(async (textToSpeak: string, forcedVoice?: 'uz-UZ-MadinaNeural' | 'uz-UZ-SardorNeural') => {
    if (isMuted || !textToSpeak.trim()) return;

    const sessionId = ++speakSessionIdRef.current;

    // Stop current audio cleanly
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setIsLoadingAudio(true);
    setMood('talking');

    const cleanText = formatTextForSpeech(textToSpeak);
    const selectedVoice = forcedVoice || voiceRef.current;

    try {
      const res = await fetch(`/api/tts?text=${encodeURIComponent(cleanText)}&voice=${selectedVoice}`);
      
      if (sessionId !== speakSessionIdRef.current) {
        return;
      }

      if (!res.ok) {
        throw new Error('TTS API failed');
      }

      const audioBlob = await res.blob();
      if (sessionId !== speakSessionIdRef.current) {
        return;
      }

      const audioUrl = URL.createObjectURL(audioBlob);

      if (!audioRef.current) {
        audioRef.current = new Audio();
      } else {
        audioRef.current.pause();
      }

      audioRef.current.src = audioUrl;

      // When audio finishes: AUTO-ADVANCE CONTINUOUSLY TO NEXT SECTION!
      audioRef.current.onended = () => {
        if (sessionId === speakSessionIdRef.current) {
          setIsSpeaking(false);
          setIsLoadingAudio(false);
          setMood('idle');
        }
        URL.revokeObjectURL(audioUrl);

        // AUTO-CONTINUE LECTURE TO NEXT SECTION (NO MANUAL BUTTON PRESS REQUIRED!)
        if (isLectureRunningRef.current && !isLecturePaused) {
          if (lectureTimeoutRef.current) clearTimeout(lectureTimeoutRef.current);
          lectureTimeoutRef.current = setTimeout(() => {
            if (isLectureRunningRef.current && !isLecturePaused) {
              advanceLectureRef.current();
            }
          }, 1100);
        }
      };

      audioRef.current.onerror = () => {
        if (sessionId === speakSessionIdRef.current) {
          setIsSpeaking(false);
          setIsLoadingAudio(false);
          setMood('idle');
        }
        URL.revokeObjectURL(audioUrl);
      };

      await audioRef.current.play();
      if (sessionId === speakSessionIdRef.current) {
        setIsSpeaking(true);
        setIsLoadingAudio(false);
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        return;
      }
      if (sessionId === speakSessionIdRef.current) {
        setIsSpeaking(false);
        setIsLoadingAudio(false);
        setMood('idle');
      }
    }
  }, [isMuted, isLecturePaused]);

  // Toggle voice (Madina / Sardor)
  const toggleVoice = () => {
    const nextVoice = voice === 'uz-UZ-MadinaNeural' ? 'uz-UZ-SardorNeural' : 'uz-UZ-MadinaNeural';
    setVoice(nextVoice);
    voiceRef.current = nextVoice;
    if (currentScript) {
      speakText(currentScript.speechText, nextVoice);
    }
  };

  // --- Dynamic Physical Positioning & Pointing Engine ---
  const updatePosition = useCallback(() => {
    if (isDragging) return;

    // 1. Pointing to an error line inside code editor
    if (targetLineNumber !== null) {
      const editorEl = document.getElementById('lesson-code-editor');
      if (editorEl) {
        const rect = editorEl.getBoundingClientRect();
        const isMobile = window.innerWidth < 1024;
        
        // Monaco editor line vertical offset (~19px per line)
        const lineOffset = 42 + Math.min(Math.max(targetLineNumber - 1, 0), 25) * 19;
        const targetY = rect.top + lineOffset;

        if (rect.top < 80 || rect.bottom > window.innerHeight) {
          editorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const x = isMobile 
          ? Math.max(10, Math.min(window.innerWidth - 340, rect.left + 20))
          : Math.max(10, Math.min(window.innerWidth - 420, rect.right - 120));
        
        const y = Math.max(80, Math.min(window.innerHeight - 340, targetY - 40));

        setPosition({ x, y });
        setIsPointing(true);
        setPointingDirection('right');
        return;
      }
    }

    // 2. Pointing to an educational section during continuous lecture
    if (targetElementId) {
      const targetEl = document.getElementById(targetElementId);
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const isMobile = window.innerWidth < 1024;

        if (rect.top < 80 || rect.bottom > window.innerHeight) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Left column items -> Place robot near right edge of the card, pointing left
        // Right column items -> Place robot near left edge of the editor, pointing right
        const isRightColumn = targetElementId === 'lesson-code-editor';

        let x: number;
        let y: number;

        if (isMobile) {
          x = Math.max(10, Math.min(window.innerWidth - 340, rect.left + 10));
          y = Math.max(80, Math.min(window.innerHeight - 340, rect.top));
        } else if (isRightColumn) {
          x = Math.max(10, Math.min(window.innerWidth - 420, rect.right - 120));
          y = Math.max(80, Math.min(window.innerHeight - 340, rect.top + 20));
        } else {
          // Left column (theory/analogy): hover right alongside the content without covering the right column!
          x = Math.max(10, Math.min(window.innerWidth - 420, rect.right - 80));
          y = Math.max(80, Math.min(window.innerHeight - 340, rect.top - 10));
        }

        setPosition({ x, y });
        setIsPointing(true);
        setPointingDirection(isRightColumn ? 'right' : 'left');
        return;
      }
    }

    // 3. Default floating corner dock
    setIsPointing(false);
    const defaultX = Math.max(10, window.innerWidth - (window.innerWidth < 640 ? 330 : 400) - 20);
    const defaultY = Math.max(80, window.innerHeight - 320);
    setPosition({ x: defaultX, y: defaultY });
  }, [targetElementId, targetLineNumber, isDragging]);

  // Update position on mount, resize, or scroll (deferred with rAF to satisfy React 19 rules)
  useEffect(() => {
    const handleUpdate = () => updatePosition();
    const rafId = requestAnimationFrame(handleUpdate);
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate);
    };
  }, [updatePosition]);

  // Highlight active target element on page with neon halo
  useEffect(() => {
    document.querySelectorAll('.robo-pointer-highlight').forEach((el) => {
      el.classList.remove('robo-pointer-highlight', 'ring-2', 'ring-cyan-400', 'ring-offset-2', 'shadow-[0_0_25px_rgba(34,211,238,0.35)]');
    });

    if (targetElementId) {
      const el = document.getElementById(targetElementId);
      if (el) {
        el.classList.add('robo-pointer-highlight', 'ring-2', 'ring-cyan-400', 'ring-offset-2', 'shadow-[0_0_25px_rgba(34,211,238,0.35)]');
      }
    }

    return () => {
      document.querySelectorAll('.robo-pointer-highlight').forEach((el) => {
        el.classList.remove('robo-pointer-highlight', 'ring-2', 'ring-cyan-400', 'ring-offset-2', 'shadow-[0_0_25px_rgba(34,211,238,0.35)]');
      });
    };
  }, [targetElementId]);

  // --- Continuous Auto-Lecture Engine ---
  const playLectureStep = useCallback((stepIndex: number) => {
    const steps = lectureStepsRef.current;
    if (stepIndex < 0 || stepIndex >= steps.length) {
      // Finished full lecture!
      setIsLectureActive(false);
      isLectureRunningRef.current = false;
      activeStepRef.current = -1;
      setTargetElementId(null);
      setTargetLineNumber(null);
      setIsPointing(false);

      const doneScript: RobotSpeechScript = {
        id: 'lecture-finished',
        mood: 'celebrate',
        title: 'Dars tushuntirildi! 🌟',
        speechText: `Mana darsning barcha asosiy qismlari bilan tanishdik. Endi muharrirda o‘z kodingizni yozib, darsni bajaring. Omad!`,
        displayText: `🎉 **Dars tushuntirildi!**\nEndi amaliy topshiriqni bemalol bajarishingiz mumkin. Men yoningizdaman! 🚀`,
      };
      setCurrentScript(doneScript);
      speakText(doneScript.speechText);
      return;
    }

    const step = steps[stepIndex];
    setIsLectureActive(true);
    setIsLecturePaused(false);
    isLectureRunningRef.current = true;
    activeStepRef.current = stepIndex;
    setLectureStepIndex(stepIndex);

    setTargetLineNumber(null);
    setTargetElementId(step.elementId);
    setPointingDirection(step.pointingDirection);
    setIsPointing(true);
    setIsMinimized(false);
    setIsBubbleOpen(true);

    const script: RobotSpeechScript = {
      id: step.id,
      mood: 'talking',
      title: step.title,
      speechText: formatTextForSpeech(step.speechText),
      displayText: step.displayText,
    };

    setCurrentScript(script);
    speakText(script.speechText);
  }, [speakText]);

  useEffect(() => {
    advanceLectureRef.current = () => {
      const nextIndex = activeStepRef.current + 1;
      playLectureStep(nextIndex);
    };
  }, [playLectureStep]);

  // Start complete lecture from step 0
  const startCompleteLecture = useCallback(() => {
    if (lectureTimeoutRef.current) clearTimeout(lectureTimeoutRef.current);
    playLectureStep(0);
  }, [playLectureStep]);

  // Pause / Resume lecture
  const toggleLecturePause = () => {
    if (isLecturePaused) {
      setIsLecturePaused(false);
      isLectureRunningRef.current = true;
      if (currentScript) speakText(currentScript.speechText);
    } else {
      setIsLecturePaused(true);
      isLectureRunningRef.current = false;
      stopSpeaking();
      if (lectureTimeoutRef.current) clearTimeout(lectureTimeoutRef.current);
    }
  };

  // Stop lecture and return to corner
  const stopLecture = useCallback(() => {
    if (lectureTimeoutRef.current) clearTimeout(lectureTimeoutRef.current);
    setIsLectureActive(false);
    setIsLecturePaused(false);
    isLectureRunningRef.current = false;
    activeStepRef.current = -1;
    setLectureStepIndex(-1);
    setTargetElementId(null);
    setTargetLineNumber(null);
    setIsPointing(false);
    stopSpeaking();
  }, [stopSpeaking]);

  // Listen to external event to start lecture from header button
  useEffect(() => {
    const handleStartTourEvent = () => {
      startCompleteLecture();
    };
    window.addEventListener('start-robo-tour', handleStartTourEvent);
    return () => {
      window.removeEventListener('start-robo-tour', handleStartTourEvent);
    };
  }, [startCompleteLecture]);

  // 1. Initial Greeting on mount: Auto-starts teacher lecture after 1.5 seconds!
  const hasGreetedRef = useRef(false);
  useEffect(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;

    // Start complete continuous lecture automatically when entering the lesson!
    const timer = setTimeout(() => {
      startCompleteLecture();
    }, 1500);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [startCompleteLecture, stopSpeaking]);

  // 2. React immediately when a Code Error occurs: FLY DIRECTLY TO ERROR LINE & POINT 👉
  const prevErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (lastError && lastError.message) {
      const errorKey = `${lastError.line || 1}:${lastError.message}`;
      if (prevErrorRef.current !== errorKey) {
        prevErrorRef.current = errorKey;

        // Stop any active lecture
        stopLecture();

        const errorLine = lastError.line || 1;
        setTargetElementId(null);
        setTargetLineNumber(errorLine);
        setPointingDirection('right');
        setIsPointing(true);

        const diag = diagnoseErrorForSpeech(lastError, userCode);
        setCurrentScript(diag);
        setMood('alert');
        setIsBubbleOpen(true);
        setIsMinimized(false);

        speakText(diag.speechText);

        if (onHighlightLine) {
          onHighlightLine(errorLine);
        }
      }
    }
  }, [lastError, userCode, onHighlightLine, speakText, stopLecture]);

  // 3. React when student passes all tests: Celebrate with star eyes!
  const prevPassedRef = useRef(false);
  useEffect(() => {
    if (isPassed && !prevPassedRef.current) {
      prevPassedRef.current = true;
      stopLecture();
      const celebration = getSuccessCelebration(50);
      setCurrentScript(celebration);
      setMood('celebrate');
      setIsBubbleOpen(true);
      speakText(celebration.speechText);
    } else if (!isPassed) {
      prevPassedRef.current = false;
    }
  }, [isPassed, speakText, stopLecture]);

  // 4. React when a hint is revealed
  const prevHintCountRef = useRef(0);
  useEffect(() => {
    if (hintsUsedCount > prevHintCountRef.current && hints[hintsUsedCount - 1]) {
      prevHintCountRef.current = hintsUsedCount;
      const hintObj = getHintSpeech(hints[hintsUsedCount - 1], hintsUsedCount);
      setCurrentScript(hintObj);
      setMood('talking');
      setIsBubbleOpen(true);
      speakText(hintObj.speechText);
    }
  }, [hintsUsedCount, hints, speakText]);

  // Drag and Drop handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a, input')) return;

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;
    setPosition({
      x: dragStartRef.current.posX + deltaX,
      y: dragStartRef.current.posY + deltaY,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture already released
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
        transition: isDragging ? 'none' : 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      className={`fixed top-0 left-0 z-50 transition-shadow ${
        isDragging ? 'cursor-grabbing select-none' : 'cursor-default'
      }`}
    >
      {/* MINIMIZED FLOATING BADGE */}
      {isMinimized ? (
        <button
          type="button"
          onClick={() => {
            setIsMinimized(false);
            setIsBubbleOpen(true);
          }}
          className="group relative flex items-center gap-3 p-2 rounded-2xl bg-card/95 backdrop-blur-xl border-2 border-primary shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95"
          title="Robo-Ustozni ochish"
        >
          <RobotAvatar mood={mood} isSpeaking={isSpeaking} isPointing={isPointing} pointingDirection={pointingDirection} size={54} />
          <div className="hidden sm:flex flex-col text-left pr-2">
            <span className="font-black text-xs text-foreground flex items-center gap-1">
              Robo-Ustoz 3D
              {isSpeaking && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
            </span>
            <span className="text-[10px] text-muted-foreground">Jonli Ustoz</span>
          </div>
        </button>
      ) : (
        /* EXPANDED 3D TEACHER & SPEECH PANEL */
        <div className="flex flex-col items-end gap-1.5 max-w-[340px] sm:max-w-[400px]">
          {/* Visual Pointer Callout Badge */}
          {isPointing && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 text-[11px] font-black shadow-lg shadow-cyan-500/30 animate-bounce self-start mb-0.5">
              <span>{pointingDirection === 'left' ? '👈' : '👉'}</span>
              <span>
                {targetLineNumber !== null ? `${targetLineNumber}-qatorga qarang!` : 'Diqqat qiling!'}
              </span>
            </div>
          )}

          {/* Speech Bubble Card */}
          {isBubbleOpen && currentScript && (
            <div className="w-full rounded-2xl border-2 border-primary/40 bg-card/95 backdrop-blur-2xl shadow-2xl p-4 space-y-3 animate-in zoom-in-95 duration-200 text-foreground">
              {/* Bubble Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs leading-none flex items-center gap-1.5 text-foreground">
                      <span>Robo-Ustoz</span>
                      {isSpeaking && (
                        <span className="flex items-center gap-0.5 text-[9px] text-emerald-500 font-semibold px-1.5 py-0.2 rounded-full bg-emerald-500/10">
                          <Headphones className="w-2.5 h-2.5 animate-pulse" />
                          tushuntirmoqda...
                        </span>
                      )}
                      {isLoadingAudio && (
                        <span className="flex items-center gap-0.5 text-[9px] text-amber-500 font-semibold px-1.5 py-0.2 rounded-full bg-amber-500/10 animate-pulse">
                          ovoz tayyorlanmoqda...
                        </span>
                      )}
                    </h4>
                  </div>
                </div>

                {/* Voice & Window Controls */}
                <div className="flex items-center gap-1">
                  {/* Voice switcher (Madina / Sardor) */}
                  <button
                    type="button"
                    onClick={toggleVoice}
                    className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    title="Ovozni almashtirish (Madina / Sardor)"
                  >
                    {voice === 'uz-UZ-MadinaNeural' ? 'Madina 👩' : 'Sardor 👨'}
                  </button>

                  {/* Mute button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (!isMuted && isSpeaking) stopSpeaking();
                      setIsMuted(!isMuted);
                    }}
                    className={`p-1 rounded-md transition-colors ${
                      isMuted 
                        ? 'text-red-500 bg-red-500/10' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    title={isMuted ? 'Ovozni yoqish' : 'Ovozni o‘chirish'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>

                  {/* Stop / Replay */}
                  {isSpeaking ? (
                    <button
                      type="button"
                      onClick={stopSpeaking}
                      className="p-1 rounded-md text-amber-500 hover:bg-amber-500/10 transition-colors"
                      title="Ovozni to‘xtatish"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => speakText(currentScript.speechText)}
                      className="p-1 rounded-md text-primary hover:bg-primary/10 transition-colors"
                      title="Qayta tinglash"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Close / Dismiss */}
                  <button
                    type="button"
                    onClick={() => {
                      stopLecture();
                      setIsBubbleOpen(false);
                    }}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                    title="Yopish"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bubble Body Content */}
              <div className="text-xs leading-relaxed space-y-2 max-h-52 overflow-y-auto pr-1 no-scrollbar">
                <p className="font-semibold text-primary flex items-center gap-1.5 text-[11px]">
                  {mood === 'alert' && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                  {mood === 'celebrate' && <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  {mood === 'talking' && <Lightbulb className="w-3.5 h-3.5 text-cyan-500 shrink-0" />}
                  <span>{currentScript.title}</span>
                </p>

                <div className="text-muted-foreground whitespace-pre-wrap font-normal text-xs leading-relaxed">
                  {currentScript.displayText}
                </div>
              </div>

              {/* Continuous Auto-Lecture Controls */}
              {isLectureActive ? (
                <div className="pt-2 border-t border-border/50 space-y-2">
                  {/* Step indicator bar */}
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                    <span className="flex items-center gap-1 text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      Qadamma-qadam tushuntirilmoqda ({lectureStepIndex + 1}/{lectureSteps.length})
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={toggleLecturePause}
                        className="px-2 py-0.5 rounded bg-muted text-[10px] font-semibold text-foreground hover:bg-muted/80 flex items-center gap-1"
                      >
                        {isLecturePaused ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
                        <span>{isLecturePaused ? 'Davom etish' : 'Pauza'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={stopLecture}
                        className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[10px]"
                      >
                        To‘xtatish
                      </button>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-500"
                      style={{ width: `${((lectureStepIndex + 1) / lectureSteps.length) * 100}%` }}
                    />
                  </div>
                </div>
              ) : targetLineNumber !== null ? (
                // Error Navigation Controls
                <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    Xato qatori: <strong className="text-red-500 font-mono text-xs">{targetLineNumber}</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {onHighlightLine && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onHighlightLine(targetLineNumber)}
                        className="h-7 text-[11px] font-bold gap-1 text-primary border-primary/40 hover:bg-primary/10"
                      >
                        <Code2 className="w-3 h-3" />
                        <span>Qatorga o‘tish</span>
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={stopLecture}
                      className="h-7 text-[10px] text-muted-foreground"
                    >
                      Burchakka qaytish
                    </Button>
                  </div>
                </div>
              ) : (
                // Idle Tour Replay CTA
                <div className="pt-2 border-t border-border/50">
                  <Button
                    type="button"
                    variant="gradient"
                    size="sm"
                    onClick={startCompleteLecture}
                    className="h-7 text-[11px] font-bold gap-1.5 w-full shadow-md"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Darsni to‘liq tushuntirish 🎓</span>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Freely Floating 3D Robot Mascot (NO dark box wrapper!) */}
          <div className="flex items-center gap-2">
            {/* Quick action buttons floating beside robot */}
            <div className="flex flex-col gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={startCompleteLecture}
                className="w-8 h-8 rounded-xl bg-card border border-border shadow-lg hover:border-primary flex items-center justify-center text-primary text-xs transition-all hover:scale-110 active:scale-95"
                title="Darsni to‘liq tushuntirish"
              >
                <GraduationCap className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isBubbleOpen) setIsBubbleOpen(true);
                  if (currentScript) speakText(currentScript.speechText);
                }}
                className="w-8 h-8 rounded-xl bg-card border border-border shadow-lg hover:border-primary flex items-center justify-center text-primary text-xs transition-all hover:scale-110 active:scale-95"
                title="Robo-Ustozni gapirtirish"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="w-8 h-8 rounded-xl bg-card border border-border shadow-lg hover:border-primary flex items-center justify-center text-muted-foreground hover:text-foreground text-xs transition-all hover:scale-110 active:scale-95"
                title="Yig‘ib qo‘yish"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* True 3D Robot Canvas with Hover Shadow (Floating directly on screen) */}
            <div
              onClick={() => {
                setIsBubbleOpen(!isBubbleOpen);
                if (!isBubbleOpen && currentScript) {
                  speakText(currentScript.speechText);
                }
              }}
              className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title="Robo-Ustoz 3D — Haqiqiy Ustozdek Tushuntiruvchi Qahramon"
            >
              <RobotAvatar 
                mood={mood} 
                isSpeaking={isSpeaking} 
                isPointing={isPointing} 
                pointingDirection={pointingDirection}
                size={155} 
              />
              {/* Soft glowing elliptical hover shadow projected below */}
              <div className="w-24 h-3 rounded-full bg-cyan-400/25 blur-md mx-auto -mt-3 animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
