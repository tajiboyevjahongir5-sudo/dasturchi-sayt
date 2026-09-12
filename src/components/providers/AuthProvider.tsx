'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  level: number;
  levelTitle: string;
  currentXP: number;
  requiredXP: number;
  totalXP: number;
  streak: number;
  onboardingCompleted: boolean;
  achievementsCount: number;
  completedLessonsCount: number;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
});

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setUser(json.data);
          return;
        }
      }
      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const json = await res.json();
          if (!ignore) {
            setUser(json.success && json.data ? json.data : null);
          }
        } else {
          if (!ignore) setUser(null);
        }
      } catch {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
