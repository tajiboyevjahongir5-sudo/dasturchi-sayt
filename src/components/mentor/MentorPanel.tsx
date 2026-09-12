'use client';

import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, MessageSquare, Lightbulb, CheckCircle } from 'lucide-react';
import type { MentorMessage, MentorMode } from '@/types';
import { generateMentorResponse, type MentorContext } from '@/lib/mentor';
import { Button } from '../ui/button';

interface MentorPanelProps {
  context: MentorContext;
  isOpen: boolean;
  onClose: () => void;
}

export function MentorPanel({ context, isOpen, onClose }: MentorPanelProps) {
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      id: 'init',
      role: 'mentor',
      content: `Salom! Men sizning **Code Mentor** yordamchingizman. "${context.lessonTitle || 'Ushbu dars'}" bo‘yicha har qanday savolingiz bo‘lsa yoki kodingizda qiyinchilikka duch kelsangiz, quyidagi tugmalardan birini bosing yoki savol yozing!`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');

  if (!isOpen) return null;

  const quickModes: { mode: MentorMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'explain', label: 'Tushuntirib ber', icon: MessageSquare },
    { mode: 'hint', label: 'Hint ber', icon: Lightbulb },
    { mode: 'error', label: 'Xatoni tushuntir', icon: Sparkles },
    { mode: 'review', label: 'Kodimni review qil', icon: CheckCircle },
    { mode: 'real-world', label: 'Real loyihada qayerda?', icon: Sparkles },
    { mode: 'question', label: 'Meni sinab ko‘r', icon: MessageSquare },
  ];

  const handleModeClick = (mode: MentorMode) => {
    const userMsg: MentorMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: quickModes.find((m) => m.mode === mode)?.label || mode,
      timestamp: new Date().toISOString(),
    };

    const mentorReply = generateMentorResponse(mode, context);
    setMessages((prev) => [...prev, userMsg, mentorReply]);
  };

  const handleSendCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim()) return;

    const userMsg: MentorMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputPrompt,
      timestamp: new Date().toISOString(),
    };

    const mentorReply = generateMentorResponse('explain', context, inputPrompt);
    setMessages((prev) => [...prev, userMsg, mentorReply]);
    setInputPrompt('');
  };

  return (
    <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 w-full sm:w-96 max-h-[85vh] sm:max-h-[560px] h-[520px] rounded-t-3xl sm:rounded-2xl border-t sm:border border-primary/30 bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
      {/* Mobile grab bar */}
      <div className="sm:hidden flex justify-center pt-2 pb-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20">
        <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
      </div>

      {/* Mentor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight flex items-center gap-1.5">
              Code Mentor
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h4>
            <span className="text-[10px] text-muted-foreground">Interaktiv o‘qituvchi</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Mode Chips */}
      <div className="p-2 border-b border-border/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {quickModes.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.mode}
              onClick={() => handleModeClick(item.mode)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-medium whitespace-nowrap transition-colors"
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                  : 'bg-muted/70 text-foreground border border-border/50 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              {msg.content}
            </div>
            <span className="text-[9px] text-muted-foreground/60 px-1 mt-0.5">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendCustom} className="p-3 border-t border-border flex items-center gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          placeholder="Savolingizni yozing..."
          className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Button type="submit" size="sm" variant="gradient" className="h-8 w-8 p-0 rounded-xl">
          <Send className="w-3.5 h-3.5 fill-white" />
        </Button>
      </form>
    </div>
  );
}
