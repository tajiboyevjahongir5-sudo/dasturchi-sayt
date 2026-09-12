'use client';

import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('codequest-theme-change', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('codequest-theme-change', callback);
  };
}

function getSnapshot(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('theme');
  return (saved === 'dark' || saved === 'light') ? saved : 'dark';
}

function getServerSnapshot(): Theme {
  return 'dark';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(new Event('codequest-theme-change'));
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return {
      theme: 'dark' as Theme,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
}
