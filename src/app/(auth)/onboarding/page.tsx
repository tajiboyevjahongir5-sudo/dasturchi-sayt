'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/providers/ToastProvider';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Code, 
  Globe, 
  Laptop, 
  Briefcase, 
  Clock, 
  Target 
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Web sayt yaratish']);
  const [weeklyHours, setWeeklyHours] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goalOptions = [
    { id: 'web', label: 'Web sayt yaratish', icon: Globe },
    { id: 'frontend', label: 'Frontend dasturchi bo‘lish', icon: Code },
    { id: 'backend', label: 'Backend dasturchi bo‘lish', icon: Laptop },
    { id: 'fullstack', label: 'Full-stack dasturchi bo‘lish', icon: Sparkles },
    { id: 'freelance', label: 'Frilansda daromad topish', icon: Briefcase },
    { id: 'interest', label: 'Shunchaki qiziqish uchun', icon: Target },
  ];

  const toggleGoal = (label: string) => {
    if (selectedGoals.includes(label)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== label));
    } else {
      setSelectedGoals([...selectedGoals, label]);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skillLevel,
          goals: selectedGoals,
          weeklyHours,
          preferredLanguage: 'uz',
        }),
      });

      toast({
        title: 'Shaxsiy rejangiz tuzildi!',
        description: 'CodeQuest sizga mos o‘quv yo‘lini tayyorladi.',
        variant: 'success',
      });

      router.push('/dashboard');
    } catch {
      router.push('/dashboard');
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background relative">
      <div className="w-full max-w-xl space-y-6">
        {/* Progress Bar & Skip */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-primary font-bold">{step}-bosqich / {totalSteps}</span>
            <button
              onClick={handleSkip}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Keyinroq o‘tkazib yuborish
            </button>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2" />
        </div>

        {/* Step Container */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl min-h-[380px] flex flex-col justify-between">
          {/* STEP 1: Skill Level */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Dasturlash tajribangiz qanday?</h3>
                <p className="text-xs text-muted-foreground">
                  Sizga eng mos keladigan tushuntirish darajasini tanlang.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'beginner', title: 'Mutlaqo 0 dan boshlayman', desc: 'Dasturlash haqida hali tasavvurim yo‘q, 0 dan o‘rganmoqchiman.' },
                  { id: 'intermediate', title: 'Bir oz asoslarni bilaman', desc: 'HTML va CSS dan xabarim bor, lekin mustaqil loyiha qila olmayman.' },
                  { id: 'advanced', title: 'Boshqa tilda tajribam bor', desc: 'Sintaksisni tez o‘zlashtiraman va chuqurlashtirmoqchiman.' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSkillLevel(item.id as 'beginner' | 'intermediate' | 'advanced')}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      skillLevel === item.id
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-muted/20 hover:bg-muted/50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-sm text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    {skillLevel === item.id && (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 ml-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Goals */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Asosiy maqsadingiz nima?</h3>
                <p className="text-xs text-muted-foreground">
                  Bir nechta variantni belgilashingiz mumkin.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goalOptions.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoals.includes(goal.label);
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.label)}
                      className={`p-3.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary shadow-sm'
                          : 'border-border bg-muted/20 hover:bg-muted/50 text-foreground'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0 text-primary" />
                      <span>{goal.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Weekly Commitment */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Haftasiga qancha vaqt ajrata olasiz?</h3>
                <p className="text-xs text-muted-foreground">
                  Muntazamlik — muvaffaqiyat garovidir. Kuniga 15-30 daqiqa ham katta natija beradi.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { hours: 3, title: 'Haftasiga 3 soat (Kuniga ~25 daqiqa)', desc: 'Sekin va xotirjam o‘rganuvchilar uchun' },
                  { hours: 5, title: 'Haftasiga 5 soat (Kuniga ~45 daqiqa) — Tavsiya etiladi', desc: 'Optimal tezlik va mustahkam bilim' },
                  { hours: 10, title: 'Haftasiga 10+ soat (Intensiv)', desc: 'Tezroq kasb egallashni xohlovchilar uchun' },
                ].map((item) => (
                  <button
                    key={item.hours}
                    type="button"
                    onClick={() => setWeeklyHours(item.hours)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      weeklyHours === item.hours
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border bg-muted/20 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary shrink-0" />
                      <div>
                        <p className="font-bold text-sm text-foreground">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    {weeklyHours === item.hours && (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 ml-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Ready & Summary */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200 text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-xl">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-xl font-black">Hammasi tayyor!</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sizning darajangiz va maqsadingiz asosida &quot;Dasturlashga Kirish&quot; kursi siz uchun 1-bosqich sifatida tanlandi.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/80 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Boshlang‘ich daraja:</span>
                  <span className="font-semibold capitalize">{skillLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Haftalik maqsad:</span>
                  <span className="font-semibold">{weeklyHours} soat / hafta</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Birinchi dars:</span>
                  <span className="font-semibold text-primary">Dasturlash va Algoritm Nima?</span>
                </div>
              </div>
            </div>
          )}

          {/* Buttons Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border/50">
            {step > 1 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
              >
                Orqaga
              </Button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <Button
                variant="gradient"
                size="sm"
                onClick={() => setStep((s) => s + 1)}
                className="gap-1.5"
              >
                <span>Davom etish</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="gradient"
                size="sm"
                onClick={handleFinish}
                disabled={isSubmitting}
                className="gap-1.5"
              >
                <span>{isSubmitting ? 'Tayyorlanmoqda...' : 'O‘qishni boshlash'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
