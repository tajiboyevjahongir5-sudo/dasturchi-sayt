'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Volume2, 
  VolumeX, 
  Square, 
  X, 
  GraduationCap, 
  Pause, 
  Play,
  BookOpen,
  Sparkles,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { RobotAvatar, RobotMood } from './RobotAvatar';
import { 
  getLessonGreeting, 
  getSiteWelcomeScript,
  getPageGuideScript,
  diagnoseErrorForSpeech, 
  getSuccessCelebration, 
  getHintSpeech, 
  formatTextForSpeech, 
  generateComprehensiveLectureSteps,
  ComprehensiveLectureStep as LectureStep,
  RobotSpeechScript 
} from './robot-dialogue';
import { useCompanion, LessonCompanionData } from '@/components/providers/CompanionProvider';

export type { LectureStep };

export interface RobotCompanionProps {
  lessonTitle?: string;
  lessonObjective?: string;
  lessonAnalogy?: string;
  theory?: Array<{ type?: string; content: string }>;
  interactiveExample?: {
    title: string;
    code: string;
    expectedOutput?: string;
    lineExplanations?: Record<string, string>;
  };
  commonMistakes?: Array<{
    title: string;
    wrongCode: string;
    correctCode: string;
    explanation: string;
  }>;
  exercise?: {
    title: string;
    description: string;
    instructions: string[];
    starterCode?: string;
    expectedConcepts?: string[];
  };
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
  autoStartOnMount?: boolean;
}

export function RobotCompanion(props: RobotCompanionProps) {
  const pathname = usePathname();
  const { lessonData: contextLessonData, isGlobalCompanionActive } = useCompanion();

  // Combine props with context (context takes precedence on lesson pages)
  const isLessonPage = Boolean(pathname && pathname.includes('/lessons/'));
  const activeData: LessonCompanionData | RobotCompanionProps = isLessonPage && contextLessonData 
    ? contextLessonData 
    : props;

  const {
    lessonTitle = isLessonPage ? 'Dasturlash Darsi' : undefined,
    lessonObjective,
    lessonAnalogy,
    theory,
    interactiveExample,
    commonMistakes,
    exercise,
    lastError,
    userCode = '',
    isPassed = false,
    hints = [],
    hintsUsedCount = 0,
    onHighlightLine,
    autoStartOnMount = false,
  } = activeData;

  // Navigation & Floating position state (docked neatly in the bottom-right corner)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPointing, setIsPointing] = useState(false);
  const [pointingDirection, setPointingDirection] = useState<'left' | 'right'>('left');
  const [targetElementId, setTargetElementId] = useState<string | null>(null);
  const [targetLineNumber, setTargetLineNumber] = useState<number | null>(null);

  // Waving animation state for natural greetings and celebrations
  const [isWaving, setIsWaving] = useState(true);

  // Continuous Auto-Lecture State
  const [isLectureActive, setIsLectureActive] = useState(false);
  const [isLecturePaused, setIsLecturePaused] = useState(false);
  const [lectureStepIndex, setLectureStepIndex] = useState<number>(-1);

  const isLectureRunningRef = useRef(false);
  const isLecturePausedRef = useRef(false);
  const activeStepRef = useRef<number>(-1);
  const lectureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({ startX: 0, startY: 0, posX: 0, posY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // UI state
  const [isMinimized, setIsMinimized] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Speech script state
  const [currentScript, setCurrentScript] = useState<RobotSpeechScript | null>(() => {
    if (isLessonPage && lessonTitle) {
      return getLessonGreeting(lessonTitle, lessonObjective);
    }
    return getSiteWelcomeScript();
  });

  const [mood, setMood] = useState<RobotMood>('talking');
  const [flightTilt, setFlightTilt] = useState(0);
  const prevPosRef = useRef({ x: 0, y: 0 });

  // Audio / Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const voice = 'uz-UZ-SardorNeural';
  const voiceRef = useRef<'uz-UZ-SardorNeural'>(voice);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speakSessionIdRef = useRef(0);

  // --- ZERO-PAUSE AUDIO PRE-BUFFERING CACHE ---
  const audioCacheRef = useRef<Map<string, string>>(new Map());
  const inFlightFetchesRef = useRef<Map<string, Promise<string | null>>>(new Map());

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

  // Cancel any speech synthesis on unmount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  // Unlock audio on the very first gesture anywhere on document if browser blocked autoplay
  const setupUnlockOnGesture = useCallback((audioEl: HTMLAudioElement) => {
    const unlock = () => {
      audioEl.play().then(() => {
        setAutoplayBlocked(false);
        setIsSpeaking(true);
      }).catch(() => {});

      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('scroll', unlock);
      window.removeEventListener('mousemove', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('click', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('scroll', unlock, { once: true, passive: true });
    window.addEventListener('mousemove', unlock, { once: true, passive: true });
  }, []);

  // High-performance TTS fetcher with automatic caching
  const getAudioUrl = useCallback(async (rawText: string, voiceName: string = 'uz-UZ-SardorNeural'): Promise<string | null> => {
    const clean = formatTextForSpeech(rawText);
    if (!clean.trim()) return null;
    const cacheKey = `${voiceName}:${clean}`;

    // 1. Instant return if already pre-buffered in memory
    if (audioCacheRef.current.has(cacheKey)) {
      return audioCacheRef.current.get(cacheKey)!;
    }

    // 2. Return active in-flight promise to prevent duplicate requests
    if (inFlightFetchesRef.current.has(cacheKey)) {
      return inFlightFetchesRef.current.get(cacheKey)!;
    }

    // 3. Fetch from /api/tts and cache Object URL
    const fetchPromise = (async () => {
      try {
        const res = await fetch(`/api/tts?text=${encodeURIComponent(clean)}&voice=${voiceName}`);
        if (!res.ok) return null;
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        audioCacheRef.current.set(cacheKey, url);
        return url;
      } catch (err) {
        console.warn('[Robo-Ustoz TTS] Fetch error:', err);
        return null;
      } finally {
        inFlightFetchesRef.current.delete(cacheKey);
      }
    })();

    inFlightFetchesRef.current.set(cacheKey, fetchPromise);
    return fetchPromise;
  }, []);

  // Pre-buffer upcoming lecture steps into memory so transitions have ZERO delay
  const prefetchLectureSteps = useCallback((steps: LectureStep[], fromIndex: number) => {
    for (let i = fromIndex; i < Math.min(fromIndex + 2, steps.length); i++) {
      if (steps[i]?.speechText) {
        getAudioUrl(steps[i].speechText);
      }
    }
  }, [getAudioUrl]);

  // Build the complete step-by-step master teacher lecture steps
  const lectureSteps = useMemo<LectureStep[]>(() => {
    if (!isLessonPage || !lessonTitle) return [];
    return generateComprehensiveLectureSteps({
      lessonTitle,
      learningObjective: lessonObjective,
      realLifeAnalogy: lessonAnalogy,
      theory,
      interactiveExample,
      commonMistakes,
      exercise,
    });
  }, [isLessonPage, lessonTitle, lessonObjective, lessonAnalogy, theory, interactiveExample, commonMistakes, exercise]);

  const lectureStepsRef = useRef<LectureStep[]>(lectureSteps);
  useEffect(() => {
    lectureStepsRef.current = lectureSteps;
  }, [lectureSteps]);

  // Ref forward declaration for auto-advance
  const advanceLectureRef = useRef<() => void>(() => {});

  // Play natural voice via cached audio with zero pause auto-advance
  const speakText = useCallback(async (textToSpeak: string, forcedVoice?: 'uz-UZ-SardorNeural') => {
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

    const cleanText = formatTextForSpeech(textToSpeak);
    const selectedVoice = forcedVoice || voiceRef.current;
    const cacheKey = `${selectedVoice}:${cleanText}`;

    // Only show loading indicator if not already cached in memory
    const isCached = audioCacheRef.current.has(cacheKey);
    if (!isCached) {
      setIsLoadingAudio(true);
    }
    setMood('talking');
    setIsSpeaking(true);

    try {
      const audioUrl = await getAudioUrl(cleanText, selectedVoice);

      if (sessionId !== speakSessionIdRef.current) {
        return;
      }

      if (!audioUrl) {
        setIsLoadingAudio(false);
        setIsSpeaking(false);
        setMood('idle');
        return;
      }

      if (!audioRef.current) {
        audioRef.current = new Audio();
      } else {
        audioRef.current.pause();
      }

      audioRef.current.src = audioUrl;

      // When audio finishes: AUTO-ADVANCE SEAMLESSLY TO NEXT STEP (ZERO AWKWARD PAUSE!)
      audioRef.current.onended = () => {
        if (sessionId === speakSessionIdRef.current) {
          setIsSpeaking(false);
          setIsLoadingAudio(false);
          setMood('idle');
        }

        // AUTO-CONTINUE LECTURE TO NEXT SECTION (140ms realistic human breath pause instead of 3s lag!)
        if (isLectureRunningRef.current && !isLecturePausedRef.current) {
          if (lectureTimeoutRef.current) clearTimeout(lectureTimeoutRef.current);
          lectureTimeoutRef.current = setTimeout(() => {
            if (isLectureRunningRef.current && !isLecturePausedRef.current) {
              advanceLectureRef.current();
            }
          }, 140);
        }
      };

      audioRef.current.onerror = () => {
        if (sessionId === speakSessionIdRef.current) {
          setIsSpeaking(false);
          setIsLoadingAudio(false);
          setMood('idle');
        }
      };

      try {
        await audioRef.current.play();
        if (sessionId === speakSessionIdRef.current) {
          setIsSpeaking(true);
          setIsLoadingAudio(false);
          setAutoplayBlocked(false);
        }
      } catch (playErr: unknown) {
        if ((playErr as Error)?.name === 'NotAllowedError') {
          // Browser autoplay restriction: keep robot talking and listen for first touch/click/scroll to start voice
          setAutoplayBlocked(true);
          setIsSpeaking(true);
          setIsLoadingAudio(false);
          if (audioRef.current) {
            setupUnlockOnGesture(audioRef.current);
          }
        } else {
          throw playErr;
        }
      }
    } catch (err: unknown) {
      if (sessionId === speakSessionIdRef.current) {
        setIsSpeaking(false);
        setIsLoadingAudio(false);
        setMood('idle');
      }
    }
  }, [isMuted, getAudioUrl, setupUnlockOnGesture]);

  // --- Dynamic Physical Positioning & Pointing Engine ---
  const updatePosition = useCallback(() => {
    if (isDragging) return;

    // 1. Pointing to an error line inside code editor
    if (targetLineNumber !== null) {
      const editorEl = document.getElementById('lesson-code-editor');
      if (editorEl) {
        const rect = editorEl.getBoundingClientRect();
        const isMobile = window.innerWidth < 1024;
        
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
          x = Math.max(10, Math.min(window.innerWidth - 420, rect.right - 80));
          y = Math.max(80, Math.min(window.innerHeight - 340, rect.top - 10));
        }

        setPosition({ x, y });
        setIsPointing(true);
        setPointingDirection(isRightColumn ? 'right' : 'left');
        return;
      }
    }

    // 3. Default floating corner dock (docked cleanly in bottom-right corner)
    setIsPointing(false);
    const defaultX = Math.max(10, window.innerWidth - (window.innerWidth < 640 ? 190 : 240));
    const defaultY = Math.max(80, window.innerHeight - (window.innerWidth < 640 ? 250 : 270));
    setPosition({ x: defaultX, y: defaultY });
  }, [targetElementId, targetLineNumber, isDragging]);

  // Update position on mount, resize, or scroll
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
      setIsWaving(true);

      const doneScript: RobotSpeechScript = {
        id: 'lecture-finished',
        mood: 'celebrate',
        title: 'Dars tushuntirildi! 🌟',
        speechText: `Mana darsning barcha asosiy qismlari bilan tanishdik. Endi muharrirda o‘z kodingizni yozib, topshiriqni bajaring. Sizga ishonaman!`,
        displayText: `🎉 **Dars to‘liq tushuntirildi!**\nEndi amaliy topshiriqni bemalol bajarishingiz mumkin. Men yoningizdaman! 🚀`,
      };
      setCurrentScript(doneScript);
      speakText(doneScript.speechText);
      return;
    }

    const step = steps[stepIndex];
    setIsLectureActive(true);
    setIsLecturePaused(false);
    isLectureRunningRef.current = true;
    isLecturePausedRef.current = false;
    activeStepRef.current = stepIndex;
    setLectureStepIndex(stepIndex);

    setTargetLineNumber(null);
    setTargetElementId(step.elementId);
    setPointingDirection(step.pointingDirection);
    setIsPointing(true);
    setIsMinimized(false);
    setIsWaving(false);

    const script: RobotSpeechScript = {
      id: step.id,
      mood: 'talking',
      title: step.title,
      speechText: formatTextForSpeech(step.speechText),
      displayText: step.displayText,
    };

    setCurrentScript(script);

    // PRE-FETCH UPCOMING STEPS IMMEDIATELY IN THE BACKGROUND
    prefetchLectureSteps(steps, stepIndex + 1);

    // Play current step audio (instant if pre-fetched!)
    speakText(script.speechText);
  }, [prefetchLectureSteps, speakText]);

  useEffect(() => {
    advanceLectureRef.current = () => {
      const nextIndex = activeStepRef.current + 1;
      playLectureStep(nextIndex);
    };
  }, [playLectureStep]);

  // Start complete lecture from step 0
  const startCompleteLecture = useCallback(() => {
    if (lectureTimeoutRef.current) clearTimeout(lectureTimeoutRef.current);
    const steps = lectureStepsRef.current;
    if (steps.length > 0) {
      prefetchLectureSteps(steps, 0);
    }
    playLectureStep(0);
  }, [prefetchLectureSteps, playLectureStep]);

  // Pause / Resume lecture
  const toggleLecturePause = () => {
    if (isLecturePaused) {
      setIsLecturePaused(false);
      isLecturePausedRef.current = false;
      isLectureRunningRef.current = true;
      if (currentScript) speakText(currentScript.speechText);
    } else {
      setIsLecturePaused(true);
      isLecturePausedRef.current = true;
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
    isLecturePausedRef.current = false;
    activeStepRef.current = -1;
    setLectureStepIndex(-1);
    setTargetElementId(null);
    setTargetLineNumber(null);
    setIsPointing(false);
    setIsWaving(false);
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

  // 1. AUTO-START ON "KURSNI BOSHLASH" OR LESSON MOUNT
  const hasAutoStartedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isLessonPage || !lessonTitle) return;

    // Check if autostart was requested
    const isAutostartParam = typeof window !== 'undefined' && (
      new URLSearchParams(window.location.search).get('autostart') === '1' ||
      autoStartOnMount ||
      (activeData as LessonCompanionData)?.autostart === true
    );

    const lessonKey = `${pathname}:${lessonTitle}`;
    if (hasAutoStartedRef.current === lessonKey) return;

    if (isAutostartParam || autoStartOnMount) {
      hasAutoStartedRef.current = lessonKey;

      // Settle DOM briefly so highlighters and code blocks are positioned
      const timer = setTimeout(() => {
        startCompleteLecture();
      }, 400);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isLessonPage, lessonTitle, pathname, autoStartOnMount, activeData, startCompleteLecture]);

  // 2. Global Site-Wide Guide & Welcome Mode: START SPEAKING IMMEDIATELY ON SITE ENTRY!
  const hasSpokenWelcomeRef = useRef<string | null>(null);
  useEffect(() => {
    if (isLessonPage) {
      setIsWaving(false);
      return;
    }

    // On non-lesson pages: wave hand and set contextual guide script
    setIsWaving(true);
    const guideScript = getPageGuideScript(pathname || '/');
    setCurrentScript(guideScript);

    // Stop lecture if was active
    if (isLectureRunningRef.current) {
      stopLecture();
    }

    // "saytga kirishi bilan srazi gapirib boshlashi kerak"
    // Speak immediately as soon as the visitor enters the site!
    const pathKey = pathname || '/';
    if (hasSpokenWelcomeRef.current !== pathKey) {
      hasSpokenWelcomeRef.current = pathKey;

      // Small 300ms delay to let WebGL and page DOM settle, then speak immediately!
      const timer = setTimeout(() => {
        speakText(guideScript.speechText);
      }, 350);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [pathname, isLessonPage, stopLecture, speakText]);

  // 3. React immediately when a Code Error occurs: FLY DIRECTLY TO ERROR LINE & POINT 👉
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
        setIsWaving(false);

        const diag = diagnoseErrorForSpeech(lastError, userCode);
        setCurrentScript(diag);
        setMood('alert');
        setIsMinimized(false);

        speakText(diag.speechText);

        if (onHighlightLine) {
          onHighlightLine(errorLine);
        }
      }
    }
  }, [lastError, userCode, onHighlightLine, speakText, stopLecture]);

  // 4. React when student passes all tests: Celebrate with star eyes & hand wave!
  const prevPassedRef = useRef(false);
  useEffect(() => {
    if (isPassed && !prevPassedRef.current) {
      prevPassedRef.current = true;
      stopLecture();
      setIsWaving(true);
      const celebration = getSuccessCelebration(50);
      setCurrentScript(celebration);
      setMood('celebrate');
      speakText(celebration.speechText);
    } else if (!isPassed) {
      prevPassedRef.current = false;
    }
  }, [isPassed, speakText, stopLecture]);

  // 5. React when a hint is revealed
  const prevHintCountRef = useRef(0);
  useEffect(() => {
    if (hintsUsedCount > prevHintCountRef.current && hints[hintsUsedCount - 1]) {
      prevHintCountRef.current = hintsUsedCount;
      const hintObj = getHintSpeech(hints[hintsUsedCount - 1], hintsUsedCount);
      setCurrentScript(hintObj);
      setMood('talking');
      setIsWaving(false);
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

  // Calculate banking tilt during flight across screen
  useEffect(() => {
    const dx = position.x - prevPosRef.current.x;
    prevPosRef.current = position;
    if (Math.abs(dx) > 15) {
      const tilt = Math.max(-12, Math.min(12, dx * 0.05));
      setFlightTilt(tilt);
      const timer = setTimeout(() => setFlightTilt(0), 650);
      return () => clearTimeout(timer);
    }
  }, [position]);

  // Play visitor welcome speech manually if clicked
  const handlePlayWelcomeGreeting = () => {
    const welcome = getSiteWelcomeScript();
    setCurrentScript(welcome);
    setIsWaving(true);
    speakText(welcome.speechText);
  };

  if (!isGlobalCompanionActive) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) rotate(${flightTilt}deg)`,
        touchAction: 'none',
        transition: isDragging ? 'none' : 'transform 0.72s cubic-bezier(0.34, 1.25, 0.64, 1)',
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
          }}
          className="group relative flex items-center gap-3 p-2 rounded-2xl bg-card/95 backdrop-blur-xl border-2 border-primary shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95"
          title="Robo-Ustozni ochish"
        >
          <RobotAvatar 
            mood={mood} 
            isSpeaking={isSpeaking} 
            isPointing={isPointing} 
            pointingDirection={pointingDirection} 
            isWaving={isWaving}
            size={54} 
          />
          <div className="hidden sm:flex flex-col text-left pr-2">
            <span className="font-black text-xs text-foreground flex items-center gap-1">
              Robo-Ustoz 3D
              {isSpeaking && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {isLessonPage ? 'Jonli Dars Ustoz' : 'Sayt Hamrohingiz'}
            </span>
          </div>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-1 select-none">
          {/* Autoplay blocked tap-to-listen button badge */}
          {autoplayBlocked && (
            <button
              type="button"
              onClick={() => {
                setAutoplayBlocked(false);
                if (audioRef.current && audioRef.current.src) {
                  audioRef.current.play().then(() => {
                    setIsSpeaking(true);
                  }).catch(() => {});
                } else if (currentScript) {
                  speakText(currentScript.speechText);
                }
              }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-xl shadow-cyan-500/40 animate-pulse hover:scale-105 active:scale-95 transition-transform mb-1 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>Sardor Ustoz gapirmoqda (Ovozni yoqish 🔊)</span>
            </button>
          )}

          {/* Visual Pointer Callout Badge (Only shown when pointing to a code line or card) */}
          {isPointing && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 text-[11px] font-black shadow-lg shadow-cyan-500/40 animate-bounce mb-0.5">
              <span>{pointingDirection === 'left' ? '👈' : '👉'}</span>
              <span>
                {targetLineNumber !== null ? `${targetLineNumber}-qatorga qarang!` : 'Diqqat qiling!'}
              </span>
            </div>
          )}

          {/* Interactive Comic Speech Bubble (Shows what Sardor is saying in real-time) */}
          {isSpeaking && currentScript && (
            <div className="max-w-[270px] sm:max-w-[310px] p-3 rounded-2xl rounded-br-xs bg-slate-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl text-slate-100 mb-1 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-black text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Sardor Ustoz 👨‍🏫
                </span>
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="text-[10px] text-slate-400 hover:text-white p-0.5 rounded"
                  title="Ovozni to‘xtatish"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-200 font-medium line-clamp-4">
                {currentScript.speechText}
              </p>
              {!isLessonPage && (
                <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/80">
                  <Link
                    href="/courses"
                    className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Kurslarni ko‘rish &rarr;</span>
                  </Link>
                  <span className="text-[9px] text-slate-400">CodeQuest Hamrohi</span>
                </div>
              )}
            </div>
          )}

          {/* Freely Floating 3D Robot Mascot */}
          <div
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              } else if (isLessonPage) {
                if (isLectureActive) {
                  toggleLecturePause();
                } else {
                  startCompleteLecture();
                }
              } else {
                handlePlayWelcomeGreeting();
              }
            }}
            className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title={
              isSpeaking 
                ? "To'xtatish uchun bosing" 
                : isLessonPage 
                ? "Darsni to'liq tushuntirish uchun bosing" 
                : "Sardor Ustoz bilan salomlashish"
            }
          >
            <RobotAvatar 
              mood={mood} 
              isSpeaking={isSpeaking} 
              isPointing={isPointing} 
              pointingDirection={pointingDirection} 
              isWaving={isWaving}
              size={165} 
            />
            {/* Soft glowing elliptical hover shadow projected below */}
            <div className="w-28 h-3.5 rounded-full bg-cyan-400/30 blur-md mx-auto -mt-3 animate-pulse" />
          </div>

          {/* Compact Floating Controls Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/90 border border-cyan-500/30 shadow-2xl backdrop-blur-xl text-slate-200 mt-1">
            {/* Lecture Step Counter (Only in Lesson mode) */}
            {isLectureActive && (
              <span className="text-[10px] font-black text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/15 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                {lectureStepIndex + 1}/{lectureSteps.length}
              </span>
            )}

            {/* Play / Pause / Start Button */}
            {isLectureActive ? (
              <button
                type="button"
                onClick={toggleLecturePause}
                className="p-1.5 rounded-full hover:bg-slate-800 text-cyan-400 transition-colors"
                title={isLecturePaused ? 'Davom etish' : 'Pauza'}
              >
                {isLecturePaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
              </button>
            ) : isSpeaking ? (
              <button
                type="button"
                onClick={stopSpeaking}
                className="p-1.5 rounded-full hover:bg-slate-800 text-amber-400 transition-colors"
                title="Ovozni to‘xtatish"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : isLessonPage ? (
              <button
                type="button"
                onClick={startCompleteLecture}
                className="p-1.5 rounded-full hover:bg-slate-800 text-cyan-400 transition-colors"
                title="Darsni to‘liq tushuntirish"
              >
                <GraduationCap className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePlayWelcomeGreeting}
                className="p-1.5 rounded-full hover:bg-slate-800 text-cyan-400 transition-colors"
                title="Salomlashish va qayta gapirish"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Voice Indicator (Sardor - Robo-Ustoz) */}
            <div
              className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/20 text-cyan-300 flex items-center gap-1 select-none"
              title="Robo-Ustoz (Sardor ovozi)"
            >
              {isLoadingAudio ? (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
              <span>Sardor 👨‍🏫</span>
            </div>

            {/* Mute button */}
            <button
              type="button"
              onClick={() => {
                if (!isMuted && isSpeaking) stopSpeaking();
                setIsMuted(!isMuted);
              }}
              className={`p-1.5 rounded-full transition-colors ${
                isMuted ? 'text-red-400 bg-red-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isMuted ? 'Ovozni yoqish' : 'Ovozni o‘chirish'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Stop Lecture (if lecture active) */}
            {isLectureActive && (
              <button
                type="button"
                onClick={stopLecture}
                className="p-1.5 rounded-full hover:bg-red-500/20 text-red-400 transition-colors"
                title="Darsni to‘xtatish"
              >
                <Square className="w-3 h-3 fill-current" />
              </button>
            )}

            {/* Minimize button */}
            <button
              type="button"
              onClick={() => {
                setIsMinimized(true);
              }}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Yig‘ib qo‘yish"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
