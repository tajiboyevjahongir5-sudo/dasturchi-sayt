'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/providers/ToastProvider';
import { useAuth } from '@/components/providers/AuthProvider';
import { ArrowRight, Lock, Mail, User, ShieldAlert } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { refreshUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Parollar bir-biriga mos kelmadi');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Parol kamida 6 ta belgidan iborat bo‘lishi kerak');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErrorMessage(json.error || 'Ro‘yxatdan o‘tishda xatolik yuz berdi');
        setIsLoading(false);
        return;
      }

      toast({
        title: 'Muvaffaqiyatli ro‘yxatdan o‘tdingiz!',
        description: 'CodeQuest oilasiga xush kelibsiz.',
        variant: 'success',
      });

      await refreshUser();
      router.push('/onboarding');
    } catch {
      setErrorMessage('Server bilan aloqa uzildi. Qayta urinib ko‘ring.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="text-center space-y-2">
          <div className="inline-block">
            <Logo showTagline={false} />
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-4">CodeQuest ga qo‘shiling</h2>
          <p className="text-xs text-muted-foreground">
            Dasturlash sarguzashtingizni hoziroq boshlang
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
              <label className="text-xs font-semibold text-foreground">Ismingiz</label>
              <Input
                type="text"
                placeholder="Jasur Olimov"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email manzil</label>
              <Input
                type="email"
                placeholder="jasur@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Parol</label>
              <Input
                type="password"
                placeholder="Kamida 6 ta belgi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Parolni tasdiqlang</label>
              <Input
                type="password"
                placeholder="Parolni qayta tering"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span>{isLoading ? 'Yaratilmoqda...' : 'Hisob yaratish'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Profilingiz bormi?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Tizimga kiring
          </Link>
        </p>
      </div>
    </div>
  );
}
