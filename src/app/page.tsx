'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Sparkles, 
  Play, 
  Cpu, 
  Flame, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Layers, 
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAuth } from '@/components/providers/AuthProvider';

export default function LandingPage() {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Interactive demo code inside hero
  const [heroCode, setHeroCode] = useState(`// CodeQuest ga xush kelibsiz!
let maqsad = "Professional Dasturchi";
let tayyormisiz = true;

if (tayyormisiz) {
  console.log("Bugundan boshlaymiz: " + maqsad);
}`);
  const [heroOutput, setHeroOutput] = useState('');

  const runHeroCode = () => {
    try {
      const logs: string[] = [];
      const fakeConsole = {
        log: (...args: unknown[]) => logs.push(args.join(' ')),
      };
      const fn = new Function('console', `'use strict'; ${heroCode}`);
      fn(fakeConsole);
      setHeroOutput(logs.join('\n') || 'Bajarildi!');
    } catch (e: unknown) {
      setHeroOutput('Xatolik: ' + (e as Error).message);
    }
  };

  const features = [
    {
      icon: Terminal,
      title: 'Brauzerda Kod Yozing',
      desc: 'Hech qanday dastur o‘rnatish shart emas. Kodni to‘g‘ridan-to‘g‘ri brauzerda yozing va darhol natijasini ko‘ring.',
    },
    {
      icon: Sparkles,
      title: 'Xatolarni O‘zbekcha Tushuntirish',
      desc: 'Quruq qizil xato o‘rniga, xato nima sababdan kelib chiqqani va uni qanday tuzatish kerakligi oddiy o‘zbek tilida beriladi.',
    },
    {
      icon: ShieldCheck,
      title: '3-Bosqichli Hint Tizimi',
      desc: 'Tayyor yechim darhol berilmaydi. Avval yo‘nalish, keyin aniqroq maslahat berilib, mustaqil fikrlash rivojlantiriladi.',
    },
    {
      icon: Flame,
      title: 'O‘yin Tizimi (Gamification)',
      desc: 'XP to‘plang, streaklarni saqlang, darajalarga ko‘tariling va dasturlashni qiziqarli sarguzashtga aylantiring.',
    },
    {
      icon: Layers,
      title: '0 dan Real Loyihalargacha',
      desc: 'Nazariyani yodlamasdan, amaliy portfolio loyihalari orqali ishonchli bilimlarga ega bo‘ling.',
    },
    {
      icon: Cpu,
      title: 'Shaxsiy Code Mentor',
      desc: 'Dars davomida savollaringizga javob beruvchi va sizga individual maslahat beruvchi raqamli mentor.',
    },
  ];

  const faqs = [
    {
      q: 'Dasturlashni umuman bilmayman, o‘rgana olamanmi?',
      a: 'Albatta! CodeQuest aynan 0 dan boshlovchilar uchun mo‘ljallangan. Barcha tushunchalar sodda hayotiy misollar orqali o‘zbek tilida tushuntiriladi.',
    },
    {
      q: 'Kompyuterimga biror dastur o‘rnatishim kerakmi?',
      a: 'Yo‘q! Barcha amaliyotlar platformaning o‘zida joylashgan Monaco Code Editor orqali amalga oshiriladi. Sizga faqat internet va brauzer kifoya.',
    },
    {
      q: 'Kurslar bepulmi?',
      a: 'Boshlang‘ich barcha asosiy kurslar (Dasturlashga kirish, HTML, CSS va JavaScript asoslari) platformamizda bepul taqdim etiladi.',
    },
    {
      q: 'Telefon orqali o‘rganish mumkinmi?',
      a: 'Ha, CodeQuest to‘liq mobil moslashuvchan. Kod muharriri va darslar telefonda ham qulay ishlaydi.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-cyan-400/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Heading & CTA */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>O‘zbek tilidagi interaktiv dasturlash akademiyasi</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                  Dasturlashni <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 bg-clip-text text-transparent">yodlamang</span> — tushuning, yozing va yarating.
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  0 dan boshlab professional darajagacha. Zerikarli kitoblarsiz, brauzerda jonli kod yozish, o‘zbekcha xato tushuntirish va amaliy topshiriqlar bilan o‘rganing.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                  <Link href={user ? '/dashboard' : '/register'} className="w-full sm:w-auto">
                    <Button variant="gradient" size="lg" className="w-full sm:w-auto gap-2 text-base font-bold shadow-lg shadow-blue-500/20">
                      <span>{user ? 'Dashboardga o‘tish' : 'Bepul boshlash'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Link href="/courses" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base font-semibold">
                      <span>Kurslarni ko‘rish</span>
                    </Button>
                  </Link>
                </div>

                {/* Quick stats pills */}
                <div className="pt-6 grid grid-cols-3 gap-4 border-t border-border/40 max-w-lg mx-auto lg:mx-0">
                  <div>
                    <p className="text-2xl font-black text-foreground">4+</p>
                    <p className="text-xs text-muted-foreground">To‘liq kurs</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">19+</p>
                    <p className="text-xs text-muted-foreground">Amaliy dars</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-foreground">100%</p>
                    <p className="text-xs text-muted-foreground">O‘zbek tilida</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Code Sandbox Preview */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl border border-white/10 bg-[#12131e] shadow-[0_0_60px_rgba(99,102,241,0.18)] overflow-hidden transition-all">
                  {/* Fake Editor Bar */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#0d0e17] border-b border-white/10">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                      <span className="text-xs font-mono text-muted-foreground ml-2">demo.js</span>
                    </div>
                    <Button
                      onClick={runHeroCode}
                      size="sm"
                      variant="gradient"
                      className="h-7 text-xs px-3 gap-1.5 shadow-xs font-medium"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>Sinab ko‘rish</span>
                    </Button>
                  </div>

                  {/* Code Area */}
                  <div className="p-4 font-mono text-xs">
                    <textarea
                      value={heroCode}
                      onChange={(e) => setHeroCode(e.target.value)}
                      rows={6}
                      className="w-full bg-transparent text-[#cdd6f4] font-mono resize-none focus:outline-none leading-relaxed selection:bg-primary/30"
                      spellCheck={false}
                    />
                  </div>

                  {/* Output Preview */}
                  <div className="p-3.5 bg-[#090a10] border-t border-white/5 font-mono text-xs text-emerald-400 min-h-[52px]">
                    <div className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider">Konsol Natijasi:</div>
                    {heroOutput || '// "Sinab ko‘rish" tugmasini bosing'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-16 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight">
                Nima uchun aynan <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-400 bg-clip-text text-transparent">CodeQuest</span>?
              </h2>
              <p className="text-muted-foreground text-sm">
                Biz dasturlashni yodlatmaymiz — kompyuter qanday ishlashini mantiqiy tushuntiramiz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-border/60 bg-card hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 space-y-3 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary/20 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ROADMAP PREVIEW */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight">O‘quv Yo‘lingiz</h2>
              <p className="text-muted-foreground text-sm">
                Ketma-ketlikda qadam-baqadam o‘rganing va natijaga erishing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Dasturlashga Kirish', desc: 'Algoritmlar, kompyuter fikrlashi va ilk kod.', tag: '4 dars' },
                { step: '02', title: 'HTML Asoslari', desc: 'Veb saytlarning skeleti, teglari va formalari.', tag: '5 dars' },
                { step: '03', title: 'CSS Asoslari', desc: 'Go‘zallik: Flexbox, Grid va responsive dizayn.', tag: '5 dars' },
                { step: '04', title: 'JavaScript Asoslari', desc: 'Interaktivlik: o‘zgaruvchilar, funksiyalar va DOM.', tag: '5 dars' },
              ].map((step, idx) => (
                <div key={idx} className="relative p-6 rounded-2xl border border-border/80 bg-card space-y-3">
                  <span className="text-4xl font-black text-muted/50 block">{step.step}</span>
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base">{step.title}</h4>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {step.tag}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/learning-path">
                <Button variant="outline" className="gap-2">
                  <span>To‘liq o‘quv xaritasini ko‘rish</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center space-y-3 mb-10">
              <h2 className="text-3xl font-extrabold tracking-tight">Ko‘p Beriladigan Savollar</h2>
              <p className="text-muted-foreground text-sm">O‘rganishni boshlashdan oldin barcha savollaringizga javoblar.</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => {
                const isOpen = activeFaq === i;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-border bg-card overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : i)}
                      className="w-full text-left p-4 font-bold text-sm flex items-center justify-between gap-4"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-primary' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-muted-foreground leading-relaxed border-t border-border/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 text-center relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-500/20">
              <Zap className="w-8 h-8" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Bugunoq birinchi kodingizni yozing!
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Hech qanday to‘lov talab qilinmaydi. Ro‘yxatdan o‘ting va hoziroq Dasturlashga kirish kursini boshlang.
            </p>

            <Link href={user ? '/dashboard' : '/register'} className="inline-block">
              <Button variant="gradient" size="lg" className="px-8 font-bold gap-2">
                <span>{user ? 'Dashboardga o‘tish' : 'Bepul ro‘yxatdan o‘tish'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
