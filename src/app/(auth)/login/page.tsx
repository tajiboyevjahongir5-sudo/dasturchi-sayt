'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/providers/ToastProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { ArrowRight, Lock, Mail, ShieldAlert, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.error || 'Kirishda xatolik yuz berdi');
        setIsLoading(false);
        return;
      }

      toast({
        title: 'Xush kelibsiz!',
        description: 'Tizimga muvaffaqiyatli kirdingiz.',
        variant: 'success',
      });

      await refreshUser();
      router.push('/dashboard');
    } catch {
      setErrorMessage('Server bilan aloqa uzildi. Qayta urinib ko‘ring.');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('talaba@codequest.uz');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-background">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-block">
            <Logo showTagline={false} />
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-4">Shaxsiy kabinetga kirish</h2>
          <p className="text-xs text-muted-foreground">
            Kodingizni davom ettirish uchun profilingizga kiring
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email manzil</label>
              <Input
                type="email"
                placeholder="azizbek@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Parol</label>
                <button
                  type="button"
                  onClick={() => {
                    toast({
                      title: 'Parolni tiklash',
                      description: 'Parolni tiklash uchun qo‘llab-quvvatlash xizmatiga murojaat qiling (support@codequest.uz).',
                      variant: 'default',
                    });
                  }}
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Parolni unutdingizmi?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full font-bold gap-2 mt-2"
              disabled={isLoading}
            >
              <span>{isLoading ? 'Tekshirilmoqda...' : 'Kirish'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          {/* Demo account quick login (development & test only) */}
          {(process.env.NEXT_PUBLIC_ENABLE_DEMO_LOGIN === 'true' || process.env.NODE_ENV !== 'production') && (
            <div className="pt-2 border-t border-border/50 text-center">
              <p className="text-[11px] text-muted-foreground mb-2">Tezkor sinov uchun demo profil:</p>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full py-2 px-3 rounded-xl border border-border hover:bg-muted text-xs font-medium text-foreground transition-colors flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-primary" />
                <span>Demo foydalanuvchi ma’lumotlarini to‘ldirish</span>
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Profilingiz yo‘qmi?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Bepul ro‘yxatdan o‘ting
          </Link>
        </p>
      </div>
    </div>
  );
}
