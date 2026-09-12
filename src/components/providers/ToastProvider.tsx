"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type ToastVariant = "default" | "success" | "error";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  toast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-md shadow-lg border ${
              t.variant === "error"
                ? "bg-destructive text-destructive-foreground border-destructive"
                : t.variant === "success"
                ? "bg-emerald-500 text-white border-emerald-600"
                : "bg-card text-card-foreground border-border"
            }`}
          >
            <h4 className="font-semibold text-sm">{t.title}</h4>
            {t.description && <p className="text-sm opacity-90">{t.description}</p>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
