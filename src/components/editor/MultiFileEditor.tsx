'use client';

import React, { useState, useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from '../providers/ThemeProvider';
import { useToast } from '../providers/ToastProvider';
import { 
  Play, 
  RotateCcw, 
  Save, 
  FileCode, 
  Palette, 
  Zap, 
  Check, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export type ProjectFileName = 'index.html' | 'style.css' | 'script.js';

interface MultiFileEditorProps {
  files: {
    'index.html': string;
    'style.css': string;
    'script.js': string;
  };
  onChange: (fileName: ProjectFileName, value: string) => void;
  onRun?: () => void;
  onSave?: () => void;
  onReset?: () => void;
  isLoading?: boolean;
  saveStatus?: 'saved' | 'saving' | 'error' | 'idle';
  height?: string;
  readOnly?: boolean;
  onPasteDetected?: () => void;
}

export function MultiFileEditor({
  files,
  onChange,
  onRun,
  onSave,
  onReset,
  isLoading = false,
  saveStatus = 'idle',
  height = '420px',
  readOnly = false,
  onPasteDetected,
}: MultiFileEditorProps) {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [activeFile, setActiveFile] = useState<ProjectFileName>('index.html');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  const pasteWarnedRef = useRef(false);

  const fileTabs: Array<{ id: ProjectFileName; label: string; icon: React.ElementType; lang: string }> = [
    { id: 'index.html', label: 'index.html', icon: FileCode, lang: 'html' },
    { id: 'style.css', label: 'style.css', icon: Palette, lang: 'css' },
    { id: 'script.js', label: 'script.js', icon: Zap, lang: 'javascript' },
  ];

  const currentTab = fileTabs.find((t) => t.id === activeFile) || fileTabs[0];

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Keyboard shortcut: Ctrl+Enter or Cmd+Enter to Run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRun) onRun();
    });

    // Keyboard shortcut: Ctrl+S or Cmd+S to Save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) onSave();
    });

    // Paste detection with pedagogical warning
    editor.onDidPaste(() => {
      if (onPasteDetected) onPasteDetected();
      if (!pasteWarnedRef.current) {
        pasteWarnedRef.current = true;
        toast({
          title: 'Diqqat: Kod nusxalandi 📋',
          description: 'Kodni qo‘lda yozish dasturlash tushunchalarini eslab qolishni 3 baravarga oshiradi!',
          variant: 'default',
        });
        setTimeout(() => {
          pasteWarnedRef.current = false;
        }, 8000);
      }
    });
  };

  // Keyboard shortcut fallback on window
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (onRun) onRun();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (onSave) onSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRun, onSave]);

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      {/* 1. Header Toolbar with File Tabs and Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-muted/40 border-b border-border">
        {/* File Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
          {fileTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFile === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFile(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-background text-foreground shadow-xs border border-border/80'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  tab.id === 'index.html' ? 'text-amber-500' :
                  tab.id === 'style.css' ? 'text-sky-500' : 'text-emerald-500'
                }`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Status & Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
          {/* Autosave Status Badge */}
          {saveStatus !== 'idle' && (
            <div className="hidden sm:flex items-center">
              {saveStatus === 'saving' && (
                <Badge variant="outline" className="gap-1 text-[11px] text-muted-foreground py-0.5 px-2">
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                  <span>Saqlanmoqda...</span>
                </Badge>
              )}
              {saveStatus === 'saved' && (
                <Badge variant="outline" className="gap-1 text-[11px] text-emerald-500 border-emerald-500/20 bg-emerald-500/10 py-0.5 px-2">
                  <Check className="w-3 h-3" />
                  <span>Saqlangan</span>
                </Badge>
              )}
              {saveStatus === 'error' && (
                <Badge variant="destructive" className="gap-1 text-[11px] py-0.5 px-2 cursor-pointer" onClick={onSave}>
                  <AlertCircle className="w-3 h-3" />
                  <span>Saqlanmadi — qayta urinish</span>
                </Badge>
              )}
            </div>
          )}

          {/* Reset button */}
          {onReset && (
            <Button
              type="button"
              onClick={onReset}
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground gap-1.5"
              title="Boshlang‘ich holatga qaytarish"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Qaytarish</span>
            </Button>
          )}

          {/* Save button */}
          {onSave && (
            <Button
              type="button"
              onClick={onSave}
              variant="outline"
              size="sm"
              className="h-8 px-2.5 sm:px-3 text-xs gap-1.5 font-semibold"
              disabled={isLoading || saveStatus === 'saving'}
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saqlash</span>
            </Button>
          )}

          {/* Run button */}
          {onRun && (
            <Button
              type="button"
              onClick={onRun}
              variant="gradient"
              size="sm"
              className="h-8 px-3 sm:px-3.5 text-xs gap-1.5 font-bold shadow-xs"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden xs:inline">Bajarilmoqda...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Ishga tushirish</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* 2. Monaco Code Editor Area */}
      <div className="relative w-full" style={{ height }}>
        <Editor
          height="100%"
          language={currentTab.lang}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={files[activeFile]}
          onChange={(val) => onChange(activeFile, val || '')}
          onMount={handleEditorMount}
          options={{
            readOnly,
            minimap: { enabled: false },
            fontSize: 13,
            lineHeight: 20,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            lineNumbersMinChars: 3,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
}
