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
  Move, 
  Bot, 
  AlertTriangle,
  Lightbulb,
  Headphones
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

export interface RobotCompanionProps {
  lessonTitle?: string;
  lessonObjective?: string;
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
  lastError,
  userCode = '',
  isPassed = false,
  hints = [],
  hintsUsedCount = 0,
  onHighlightLine,
}: RobotCompanionProps) {
  // Floating position state (default: bottom-right corner)
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop currently playing speech
  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsLoadingAudio(false);
    setMood((m) => (m === 'talking' ? 'idle' : m));
  }, []);

  // Fallback speech synthesizer
  const fallbackWebSpeech = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      setIsLoadingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'uz-UZ';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsLoadingAudio(false);
      setMood('idle');
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsLoadingAudio(false);
      setMood('idle');
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsLoadingAudio(false);
  }, []);

  // Play natural voice via /api/tts with graceful fallback
  const speakText = useCallback(async (textToSpeak: string, forcedVoice?: typeof voice) => {
    if (isMuted || !textToSpeak.trim()) return;

    stopSpeaking();
    setIsLoadingAudio(true);
    setMood('talking');

    const cleanText = formatTextForSpeech(textToSpeak);
    const selectedVoice = forcedVoice || voice;

    try {
      const res = await fetch(`/api/tts?text=${encodeURIComponent(cleanText)}&voice=${selectedVoice}`);
      
      if (!res.ok) {
        throw new Error('TTS API failed');
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = audioUrl;
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        setIsLoadingAudio(false);
        setMood('idle');
        URL.revokeObjectURL(audioUrl);
      };

      audioRef.current.onerror = () => {
        fallbackWebSpeech(cleanText);
      };

      await audioRef.current.play();
      setIsSpeaking(true);
      setIsLoadingAudio(false);
    } catch {
      // Fallback to browser Web Speech API
      fallbackWebSpeech(cleanText);
    }
  }, [isMuted, voice, stopSpeaking, fallbackWebSpeech]);

  // Toggle voice (Madina / Sardor)
  const toggleVoice = () => {
    const nextVoice = voice === 'uz-UZ-MadinaNeural' ? 'uz-UZ-SardorNeural' : 'uz-UZ-MadinaNeural';
    setVoice(nextVoice);
    if (currentScript) {
      speakText(currentScript.speechText, nextVoice);
    }
  };

  // 1. Initial Greeting when lesson opens
  useEffect(() => {
    const timer = setTimeout(() => {
      const greeting = getLessonGreeting(lessonTitle, lessonObjective);
      setCurrentScript(greeting);
      setMood('talking');
      setIsBubbleOpen(true);
      speakText(greeting.speechText);
    }, 1200);

    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [lessonTitle, lessonObjective, speakText, stopSpeaking]);

  // 2. React immediately when a Code Error occurs
  const prevErrorRef = useRef<string | null>(null);
  useEffect(() => {
    if (lastError && lastError.message) {
      const errorKey = `${lastError.line || 1}:${lastError.message}`;
      if (prevErrorRef.current !== errorKey) {
        prevErrorRef.current = errorKey;

        const diag = diagnoseErrorForSpeech(lastError, userCode);
        setCurrentScript(diag);
        setMood('alert');
        setIsBubbleOpen(true);
        speakText(diag.speechText);

        if (lastError.line && onHighlightLine) {
          onHighlightLine(lastError.line);
        }
      }
    }
  }, [lastError, userCode, onHighlightLine, speakText]);

  // 3. React when student passes all tests
  const prevPassedRef = useRef(false);
  useEffect(() => {
    if (isPassed && !prevPassedRef.current) {
      prevPassedRef.current = true;
      const celebration = getSuccessCelebration(50);
      setCurrentScript(celebration);
      setMood('celebrate');
      setIsBubbleOpen(true);
      speakText(celebration.speechText);
    } else if (!isPassed) {
      prevPassedRef.current = false;
    }
  }, [isPassed, speakText]);

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
    // Only drag from robot avatar or drag bar, not from inside buttons
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
        transform: `translate(${position.x}px, ${position.y}px)`,
        touchAction: 'none',
      }}
      className={`fixed z-50 transition-shadow ${
        isDragging ? 'cursor-grabbing select-none' : 'cursor-default'
      } ${
        isMinimized 
          ? 'bottom-4 right-4 sm:bottom-6 sm:right-6' 
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6'
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
          className="group relative flex items-center gap-2 p-2 rounded-2xl bg-card/90 backdrop-blur-xl border-2 border-primary shadow-2xl hover:scale-105 transition-all duration-300 active:scale-95"
          title="Robo-Ustozni ochish"
        >
          <RobotAvatar mood={mood} isSpeaking={isSpeaking} size={48} />
          <div className="hidden sm:flex flex-col text-left pr-2">
            <span className="font-black text-xs text-foreground flex items-center gap-1">
              Robo-Ustoz
              {isSpeaking && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
            </span>
            <span className="text-[10px] text-muted-foreground">Yordam berishga tayyorman</span>
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-primary flex items-center justify-center text-[9px] text-white font-bold">
            ✦
          </span>
        </button>
      ) : (
        /* EXPANDED INTERACTIVE COMPANION & SPEECH BUBBLE */
        <div className="flex flex-col items-end gap-2 max-w-[340px] sm:max-w-[380px]">
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
                      <span>Robo-Ustoz</span>
                      {isSpeaking && (
                        <span className="flex items-center gap-0.5 text-[9px] text-emerald-500 font-semibold px-1.5 py-0.2 rounded-full bg-emerald-500/10">
                          <Headphones className="w-2.5 h-2.5 animate-pulse" />
                          gapirmoqda...
                        </span>
                      )}
                      {isLoadingAudio && (
                        <span className="flex items-center gap-0.5 text-[9px] text-amber-500 font-semibold px-1.5 py-0.2 rounded-full bg-amber-500/10 animate-pulse">
                          ovoz yuklanmoqda...
                        </span>
                      )}
                    </h4>
                  </div>
                </div>

                {/* Voice Controls: Mute, Voice switch, Minimize */}
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

                  {/* Close bubble */}
                  <button
                    type="button"
                    onClick={() => {
                      stopSpeaking();
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
              <div className="text-xs leading-relaxed space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
                <p className="font-semibold text-primary flex items-center gap-1 text-[11px]">
                  {mood === 'alert' && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                  {mood === 'celebrate' && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                  {mood === 'talking' && <Lightbulb className="w-3.5 h-3.5 text-blue-500" />}
                  {currentScript.title}
                </p>

                <div className="text-muted-foreground whitespace-pre-wrap font-normal text-xs">
                  {currentScript.displayText}
                </div>
              </div>

              {/* Action Buttons if available */}
              {lastError && lastError.line && (
                <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    Xato qatori: <strong className="text-red-500">{lastError.line}</strong>
                  </span>

                  {onHighlightLine && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onHighlightLine(lastError.line || 1)}
                      className="h-7 text-[11px] font-bold gap-1 text-primary border-primary/40 hover:bg-primary/10"
                    >
                      <span>Qatorni ko‘rsat</span>
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Floating Robot Interactive Body */}
          <div className="flex items-center gap-2">
            {/* Quick action buttons floating beside robot */}
            <div className="flex flex-col gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
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

              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="w-8 h-8 rounded-xl bg-card border border-border/80 shadow-md hover:border-primary flex items-center justify-center text-muted-foreground hover:text-foreground text-xs transition-all hover:scale-110 active:scale-95"
                title="Yig‘ib qo‘yish"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Draggable Animated Robot Mascot */}
            <div
              onClick={() => {
                setIsBubbleOpen(!isBubbleOpen);
                if (!isBubbleOpen && currentScript) {
                  speakText(currentScript.speechText);
                }
              }}
              className="relative p-2 rounded-3xl bg-gradient-to-tr from-blue-600/10 via-card/80 to-purple-600/10 border-2 border-primary/40 backdrop-blur-xl shadow-2xl cursor-pointer hover:border-primary hover:scale-105 active:scale-95 transition-all duration-300 animate-bounce"
              style={{ animationDuration: isSpeaking ? '1.5s' : '4s' }}
              title="Robo-Ustoz bilan muloqot qilish (Ekranda sudrab ko‘chirishingiz mumkin)"
            >
              <RobotAvatar mood={mood} isSpeaking={isSpeaking} size={70} />

              {/* Drag indicator icon */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-muted/80 text-[8px] text-muted-foreground flex items-center gap-0.5 pointer-events-none">
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
