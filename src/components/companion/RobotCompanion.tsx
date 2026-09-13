'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Square, 
  RotateCcw, 
  Sparkles, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Move, 
  Bot, 
  AlertTriangle, 
  Lightbulb, 
  Headphones,
  GraduationCap,
  Code2
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

export interface TourStep {
  elementId: string;
  title: string;
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
  const [targetElementId, setTargetElementId] = useState<string | null>(null);
  const [targetLineNumber, setTargetLineNumber] = useState<number | null>(null);
  const [activeTourStep, setActiveTourStep] = useState<number>(-1); // -1 = not in guided tour

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

  // Play pure human neural Uzbek voice via /api/tts (NO robotic synthesis fallback)
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
      
      // If user started another speech or stopped, discard this response
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
      audioRef.current.onended = () => {
        if (sessionId === speakSessionIdRef.current) {
          setIsSpeaking(false);
          setIsLoadingAudio(false);
          setMood('idle');
        }
        URL.revokeObjectURL(audioUrl);
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
        // Normal user interruption
        return;
      }
      if (sessionId === speakSessionIdRef.current) {
        setIsSpeaking(false);
        setIsLoadingAudio(false);
        setMood('idle');
      }
    }
  }, [isMuted]);

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
        
        // Vertical line offset inside Monaco editor (~19px per line, ~40px toolbar offset)
        const lineOffset = 42 + Math.min(Math.max(targetLineNumber - 1, 0), 25) * 19;
        const targetY = rect.top + lineOffset;

        // Scroll editor into comfortable view if off-screen
        if (rect.top < 80 || rect.bottom > window.innerHeight) {
          editorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const x = isMobile 
          ? Math.max(10, Math.min(window.innerWidth - 340, rect.left + 20))
          : Math.max(10, Math.min(window.innerWidth - 380, rect.right - 60));
        
        const y = Math.max(80, Math.min(window.innerHeight - 340, targetY - 40));

        setPosition({ x, y });
        setIsPointing(true);
        return;
      }
    }

    // 2. Pointing to a lesson section during guided tour
    if (targetElementId) {
      const targetEl = document.getElementById(targetElementId);
      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const isMobile = window.innerWidth < 1024;

        if (rect.top < 80 || rect.bottom > window.innerHeight) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        const x = isMobile
          ? Math.max(10, Math.min(window.innerWidth - 340, rect.left + 10))
          : Math.max(10, Math.min(window.innerWidth - 380, rect.right + 20));

        const y = Math.max(80, Math.min(window.innerHeight - 340, rect.top));

        setPosition({ x, y });
        setIsPointing(true);
        return;
      }
    }

    // 3. Default floating corner dock
    setIsPointing(false);
    const defaultX = Math.max(10, window.innerWidth - (window.innerWidth < 640 ? 330 : 380) - 20);
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

  // Highlight active target element on page
  useEffect(() => {
    // Remove previous highlights
    document.querySelectorAll('.robo-pointer-highlight').forEach((el) => {
      el.classList.remove('robo-pointer-highlight', 'ring-2', 'ring-primary', 'ring-offset-2', 'shadow-lg');
    });

    if (targetElementId) {
      const el = document.getElementById(targetElementId);
      if (el) {
        el.classList.add('robo-pointer-highlight', 'ring-2', 'ring-primary', 'ring-offset-2', 'shadow-lg');
      }
    }

    return () => {
      document.querySelectorAll('.robo-pointer-highlight').forEach((el) => {
        el.classList.remove('robo-pointer-highlight', 'ring-2', 'ring-primary', 'ring-offset-2', 'shadow-lg');
      });
    };
  }, [targetElementId]);

  // --- Guided Tour Definition ---
  const cleanTitle = lessonTitle.replace(/^(\d+-Dars:?\s*)/i, '');
  const tourSteps: TourStep[] = [
    {
      elementId: 'lesson-title-section',
      title: '1. Dars Mavzusi',
      speechText: `Assalomu alaykum, aziz do‘stim! Bugungi darsimiz mavzusi — ${cleanTitle}. Keling, darsni barmog‘im bilan ko‘rsatib, birgalikda o‘rganamiz!`,
      displayText: `👋 **${cleanTitle}** darsiga xush kelibsiz! Men barmog‘im bilan har bir bo‘limni ko‘rsatib tushuntiraman.`,
    },
    ...(lessonObjective ? [{
      elementId: 'lesson-objective-section',
      title: '2. Asosiy Maqsad',
      speechText: `Bu darsdagi asosiy maqsadimiz: ${lessonObjective}. Ushbu bilimlarni o‘rganish orqali haqiqiy dasturchi kabi fikrlashni boshlaysiz.`,
      displayText: `🎯 **Asosiy maqsad:**\n${lessonObjective}`,
    }] : []),
    ...(lessonAnalogy ? [{
      elementId: 'lesson-analogy-section',
      title: '3. Hayotiy Misol',
      speechText: `Mavzuni osonroq tushunish uchun hayotiy misol keltiraman: ${lessonAnalogy}`,
      displayText: `💡 **Hayotiy Misol:**\n${lessonAnalogy}`,
    }] : []),
    {
      elementId: 'lesson-example-section',
      title: '4. Kod Namunasi',
      speechText: `Mana bu kod namunasiga qarang. Bu yerda kompyuterga aniq buyruqlar berilgan va ekranga xabar chiqarish ko‘rsatilgan.`,
      displayText: `💻 **Kod Namunasi:**\nNamuna kodini ko‘rib chiqing. "Muharrirga ko‘chirish" tugmasi orqali uni sinab ko‘rishingiz mumkin.`,
    },
    {
      elementId: 'lesson-code-editor',
      title: '5. Amaliy Topshiriq',
      speechText: `Endi esa navbat sizga! Mana bu muharrirda topshiriq kodingizni yozing va Ishga tushirish tugmasini bosing. Agar xatolik bo‘lsa, men o‘sha qatorga borib, to‘g‘rilashni o‘rgataman!`,
      displayText: `🚀 **Amaliyot Vaqti!**\nO‘ng tomondagi muharrirda kodingizni yozing va "Ishga tushirish" tugmasini bosing!`,
    }
  ];

  // Start Guided Tour
  const startGuidedTour = (stepIndex = 0) => {
    const step = tourSteps[stepIndex];
    if (!step) {
      // Tour completed, dock to corner
      setActiveTourStep(-1);
      setTargetElementId(null);
      setTargetLineNumber(null);
      setIsPointing(false);
      return;
    }

    setActiveTourStep(stepIndex);
    setTargetLineNumber(null);
    setTargetElementId(step.elementId);
    setIsMinimized(false);
    setIsBubbleOpen(true);

    const script: RobotSpeechScript = {
      id: `tour-${stepIndex}`,
      mood: 'talking',
      title: step.title,
      speechText: formatTextForSpeech(step.speechText),
      displayText: step.displayText,
    };

    setCurrentScript(script);
    speakText(script.speechText);
  };

  // Next Step in Tour
  const nextTourStep = () => {
    if (activeTourStep < tourSteps.length - 1) {
      startGuidedTour(activeTourStep + 1);
    } else {
      // Finished
      setActiveTourStep(-1);
      setTargetElementId(null);
      setTargetLineNumber(null);
      setIsPointing(false);
      const doneScript: RobotSpeechScript = {
        id: 'tour-complete',
        mood: 'celebrate',
        title: 'Tushuntirish yakunlandi! 🌟',
        speechText: 'Dars bilan tanishib chiqdingiz. Endi kodingizni yozib, topshiriqni bajaring!',
        displayText: '🎉 **Dars bilan tanishib chiqdingiz!**\nEndi amaliy topshiriqni bajarib ko‘ring. Omad!',
      };
      setCurrentScript(doneScript);
      speakText(doneScript.speechText);
    }
  };

  // Prev Step in Tour
  const prevTourStep = () => {
    if (activeTourStep > 0) {
      startGuidedTour(activeTourStep - 1);
    }
  };

  // Dock to corner / Cancel pointing
  const dockToCorner = useCallback(() => {
    setActiveTourStep(-1);
    setTargetElementId(null);
    setTargetLineNumber(null);
    setIsPointing(false);
    stopSpeaking();
  }, [stopSpeaking]);

  // Listen to external event to start guided tour from anywhere (e.g. Header button)
  const startTourRef = useRef<(step?: number) => void>(() => {});
  useEffect(() => {
    startTourRef.current = startGuidedTour;
  });

  useEffect(() => {
    const handleStartTourEvent = () => {
      if (startTourRef.current) startTourRef.current(0);
    };
    window.addEventListener('start-robo-tour', handleStartTourEvent);
    return () => {
      window.removeEventListener('start-robo-tour', handleStartTourEvent);
    };
  }, []);

  // 1. Initial Greeting when lesson opens (prompts to start guided tour)
  const hasGreetedRef = useRef(false);
  useEffect(() => {
    if (hasGreetedRef.current) return;
    hasGreetedRef.current = true;

    const greeting = getLessonGreeting(lessonTitle, lessonObjective);
    setCurrentScript(greeting);
    setIsBubbleOpen(true);

    const timer = setTimeout(() => {
      setMood('talking');
      speakText(greeting.speechText);
    }, 1200);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [lessonTitle, lessonObjective, speakText, stopSpeaking]);

  // 2. React immediately when a Code Error occurs: FLY TO ERROR LINE & POINT 👉
  const prevErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (lastError && lastError.message) {
      const errorKey = `${lastError.line || 1}:${lastError.message}`;
      if (prevErrorRef.current !== errorKey) {
        prevErrorRef.current = errorKey;

        // Cancel any active reading tour
        setActiveTourStep(-1);

        const errorLine = lastError.line || 1;
        setTargetElementId(null);
        setTargetLineNumber(errorLine);

        const diag = diagnoseErrorForSpeech(lastError, userCode);
        setCurrentScript(diag);
        setMood('alert');
        setIsBubbleOpen(true);
        setIsMinimized(false);
        setIsPointing(true);

        speakText(diag.speechText);

        if (onHighlightLine) {
          onHighlightLine(errorLine);
        }
      }
    }
  }, [lastError, userCode, onHighlightLine, speakText]);

  // 3. React when student passes all tests: Celebrate with star eyes!
  const prevPassedRef = useRef(false);
  useEffect(() => {
    if (isPassed && !prevPassedRef.current) {
      prevPassedRef.current = true;
      dockToCorner();
      const celebration = getSuccessCelebration(50);
      setCurrentScript(celebration);
      setMood('celebrate');
      setIsBubbleOpen(true);
      speakText(celebration.speechText);
    } else if (!isPassed) {
      prevPassedRef.current = false;
    }
  }, [isPassed, speakText, dockToCorner]);

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
        transition: isDragging ? 'none' : 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
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
          className="group relative flex items-center gap-2 p-2 rounded-2xl bg-card/95 backdrop-blur-xl border-2 border-primary shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95"
          title="Robo-Ustozni ochish"
        >
          <RobotAvatar mood={mood} isSpeaking={isSpeaking} isPointing={isPointing} size={48} />
          <div className="hidden sm:flex flex-col text-left pr-2">
            <span className="font-black text-xs text-foreground flex items-center gap-1">
              Robo-Ustoz 3D
              {isSpeaking && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
            </span>
            <span className="text-[10px] text-muted-foreground">Barmog‘im bilan ko‘rsataman</span>
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center text-[9px] text-white font-bold">
            ✦
          </span>
        </button>
      ) : (
        /* EXPANDED 3D COMPANION & SPEECH BALLOON */
        <div className="flex flex-col items-end gap-2 max-w-[340px] sm:max-w-[380px]">
          {/* Visual Pointer Guide when actively pointing 👉 */}
          {isPointing && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-white text-[11px] font-bold shadow-lg shadow-primary/30 animate-bounce self-start mb-1">
              <span>👉</span>
              <span>
                {targetLineNumber !== null ? `${targetLineNumber}-qatorga qarang!` : 'Ushbu matnga qarang!'}
              </span>
            </div>
          )}

          {/* Speech Bubble */}
          {isBubbleOpen && currentScript && (
            <div className="w-full rounded-2xl border-2 border-primary/30 bg-card/95 backdrop-blur-2xl shadow-2xl p-4 space-y-3 animate-in zoom-in-95 duration-200 text-foreground">
              {/* Bubble Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs leading-none flex items-center gap-1.5 text-foreground">
                      <span>Robo-Ustoz 3D</span>
                      {isSpeaking && (
                        <span className="flex items-center gap-0.5 text-[9px] text-emerald-500 font-semibold px-1.5 py-0.2 rounded-full bg-emerald-500/10">
                          <Headphones className="w-2.5 h-2.5 animate-pulse" />
                          gapirmoqda...
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

                {/* Voice Controls: Mute, Voice switch, Close */}
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

                  {/* Close / Dock */}
                  <button
                    type="button"
                    onClick={() => {
                      dockToCorner();
                      setIsBubbleOpen(false);
                    }}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                    title="Burchakka yig‘ish"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bubble Body Content */}
              <div className="text-xs leading-relaxed space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                <p className="font-semibold text-primary flex items-center gap-1 text-[11px]">
                  {mood === 'alert' && <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />}
                  {mood === 'celebrate' && <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                  {mood === 'talking' && <Lightbulb className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                  <span>{currentScript.title}</span>
                </p>

                <div className="text-muted-foreground whitespace-pre-wrap font-normal text-xs">
                  {currentScript.displayText}
                </div>
              </div>

              {/* Action Buttons: Guided Tour Controls OR Error Fix Controls */}
              {activeTourStep >= 0 ? (
                // Guided Tour Navigation Footer
                <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                    <span>Qadam {activeTourStep + 1} / {tourSteps.length}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {activeTourStep > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={prevTourStep}
                        className="h-7 text-[11px] px-2 gap-1"
                      >
                        <ChevronLeft className="w-3 h-3" />
                        <span>Oldingisi</span>
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="gradient"
                      size="sm"
                      onClick={nextTourStep}
                      className="h-7 text-[11px] px-2.5 gap-1 font-bold"
                    >
                      <span>{activeTourStep < tourSteps.length - 1 ? 'Keyingisi' : 'Tugatish'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ) : targetLineNumber !== null ? (
                // Error Navigation Footer
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
                      onClick={dockToCorner}
                      className="h-7 text-[10px] text-muted-foreground"
                    >
                      Burchakka qaytish
                    </Button>
                  </div>
                </div>
              ) : (
                // Start Tour CTA when in idle greeting
                <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => startGuidedTour(0)}
                    className="h-7 text-[11px] font-bold gap-1.5 w-full text-primary border-primary/30 hover:bg-primary/10"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    <span>Darsni barmog‘ing bilan ko‘rsatib tushuntir 👉</span>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Floating 3D Robot Interactive Mascot */}
          <div className="flex items-center gap-2">
            {/* Quick action buttons floating beside robot */}
            <div className="flex flex-col gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
              {/* Guided tour button */}
              <button
                type="button"
                onClick={() => {
                  if (activeTourStep >= 0) {
                    dockToCorner();
                  } else {
                    startGuidedTour(0);
                  }
                }}
                className={`w-8 h-8 rounded-xl border shadow-md flex items-center justify-center text-xs transition-all hover:scale-110 active:scale-95 ${
                  activeTourStep >= 0 
                    ? 'bg-primary text-white border-primary' 
                    : 'bg-card border-border/80 text-primary hover:border-primary'
                }`}
                title={activeTourStep >= 0 ? 'Tushuntirishni to‘xtatish' : 'Darsni o‘qib tushuntirish'}
              >
                <GraduationCap className="w-4 h-4" />
              </button>

              {/* Speak button */}
              <button
                type="button"
                onClick={() => {
                  if (!isBubbleOpen) setIsBubbleOpen(true);
                  if (currentScript) speakText(currentScript.speechText);
                }}
                className="w-8 h-8 rounded-xl bg-card border border-border/80 shadow-md hover:border-primary flex items-center justify-center text-primary text-xs transition-all hover:scale-110 active:scale-95"
                title="Robo-Ustozni gapirtirish"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              {/* Minimize button */}
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="w-8 h-8 rounded-xl bg-card border border-border/80 shadow-md hover:border-primary flex items-center justify-center text-muted-foreground hover:text-foreground text-xs transition-all hover:scale-110 active:scale-95"
                title="Yig‘ib qo‘yish"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Draggable Animated 3D Robot Mascot */}
            <div
              onClick={() => {
                setIsBubbleOpen(!isBubbleOpen);
                if (!isBubbleOpen && currentScript) {
                  speakText(currentScript.speechText);
                }
              }}
              className="relative p-1.5 rounded-3xl bg-gradient-to-tr from-blue-600/15 via-card/90 to-purple-600/15 border-2 border-primary/50 backdrop-blur-xl shadow-2xl cursor-pointer hover:border-primary hover:scale-105 active:scale-95 transition-all duration-300"
              title="Robo-Ustoz 3D — Barmog‘i bilan ko‘rsatuvchi yordamchi (Ekranda sudrashingiz mumkin)"
            >
              <RobotAvatar 
                mood={mood} 
                isSpeaking={isSpeaking} 
                isPointing={isPointing} 
                size={84} 
              />

              {/* Drag indicator icon */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-muted/90 text-[8px] text-muted-foreground flex items-center gap-0.5 pointer-events-none">
                <Move className="w-2 h-2" />
                <span>suzish</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
