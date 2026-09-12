'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Award, Sparkles, BookOpen } from 'lucide-react';
import type { QuizQuestion } from '@/types';
import { Button } from '../ui/button';

interface QuizCardProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  initialScore?: number | null;
}

export function QuizCard({ questions, onComplete, initialScore }: QuizCardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(Boolean(initialScore !== undefined && initialScore !== null));
  const [score, setScore] = useState(initialScore || 0);

  if (questions.length === 0) return null;

  const currentQ = questions[currentIdx];
  const selectedOption = selectedAnswers[currentIdx];
  const hasAnsweredCurrent = selectedOption !== undefined;

  const handleSelect = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Calculate score
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correctAnswer) {
          correctCount++;
        }
      });
      const finalScore = Math.round((correctCount / questions.length) * 100);
      setScore(finalScore);
      setIsSubmitted(true);
      onComplete(finalScore);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-xs">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-base">Bilimni mustahkamlash uchun mini-quiz</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
          {currentIdx + 1} / {questions.length} savol
        </span>
      </div>

      {!isSubmitted ? (
        <div className="space-y-4">
          <p className="font-semibold text-sm leading-relaxed">{currentQ.question}</p>

          {currentQ.codeSnippet && (
            <pre className="p-3.5 rounded-xl bg-[#181825] text-emerald-300 font-mono text-xs overflow-x-auto border border-white/10 leading-relaxed">
              {currentQ.codeSnippet}
            </pre>
          )}

          {/* Options */}
          <div className="space-y-2">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(optIdx)}
                  type="button"
                  className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all duration-200 active:scale-[0.99] flex items-center justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary shadow-xs'
                      : 'border-border bg-muted/30 hover:bg-muted/70 text-foreground'
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? 'border-primary bg-primary text-white' : 'border-muted-foreground/40'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
              variant="gradient"
              size="sm"
            >
              {currentIdx === questions.length - 1 ? 'Natijani ko‘rish' : 'Keyingi savol'}
            </Button>
          </div>
        </div>
      ) : (
        /* Quiz Results */
        <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full mx-auto bg-primary/10 border-2 border-primary flex items-center justify-center">
            <Award className="w-8 h-8 text-primary" />
          </div>

          <div>
            <h4 className="text-xl font-black tracking-tight flex items-center justify-center gap-2">
              {score >= 80 ? (
                <>
                  <span>A’lo natija!</span>
                  <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
                </>
              ) : score >= 50 ? (
                <>
                  <span>Yaxshi natija!</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </>
              ) : (
                <>
                  <span>Yana o‘qib ko‘ring</span>
                  <BookOpen className="w-5 h-5 text-blue-500" />
                </>
              )}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              Siz quizdan <strong>{score}%</strong> to‘pladingiz.
            </p>
          </div>

          <div className="max-w-md mx-auto text-left space-y-2.5 pt-2">
            {questions.map((q, idx) => {
              const userAns = selectedAnswers[idx];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs space-y-1 ${
                    isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    )}
                    <span className="font-semibold">{q.question}</span>
                  </div>
                  <p className="text-muted-foreground text-[11px] pl-6">{q.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-center gap-3">
            <Button onClick={handleRetry} variant="outline" size="sm">
              Qayta topshirish
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
