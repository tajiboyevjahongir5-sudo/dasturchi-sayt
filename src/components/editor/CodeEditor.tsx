'use client';

import React, { useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from '../providers/ThemeProvider';
import { useToast } from '../providers/ToastProvider';
import { Play, RotateCcw, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: 'javascript' | 'html' | 'css' | 'python';
  onRun?: () => void;
  onReset?: () => void;
  isLoading?: boolean;
  onPasteDetected?: () => void;
  onKeystroke?: () => void;
  height?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  code,
  onChange,
  language,
  onRun,
  onReset,
  isLoading = false,
  onPasteDetected,
  onKeystroke,
  height = '360px',
  readOnly = false,
}: CodeEditorProps) {
  const { theme } = useTheme();
  const { toast } = useToast();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Ctrl+Enter / Cmd+Enter to run code
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRun) onRun();
    });

    // Paste event detection
    editor.onDidPaste(() => {
      toast({
        title: 'Nusxa ko‘chirish aniqlandi',
        description: 'Kodni o‘zingiz yozib ko‘ring — shunda yaxshiroq o‘zlashtirasiz!',
        variant: 'default',
      });
      if (onPasteDetected) onPasteDetected();
    });

    // Keystroke listener
    editor.onKeyDown(() => {
      if (onKeystroke) onKeystroke();
    });
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const monacoLang = language === 'python' ? 'python' : language === 'html' ? 'html' : language === 'css' ? 'css' : 'javascript';

  return (
    <div className="flex flex-col rounded-xl border border-border/80 bg-[#1e1e2e] overflow-hidden shadow-lg">
      {/* Editor Header Toolbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-[#181825] border-b border-white/10 text-xs gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 mr-1 shrink-0">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="font-mono text-muted-foreground uppercase font-semibold tracking-wider text-[10px] sm:text-[11px] truncate">
            {language} muharriri
          </span>
          {language === 'python' && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
              <AlertCircle className="w-3 h-3" />
              Tez kunda
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={handleFormat}
            type="button"
            className="hidden sm:inline-flex px-2 sm:px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors text-[10px] sm:text-[11px]"
            title="Kodni chiroyli tartiblash"
          >
            Formatlash
          </button>
          {onReset && (
            <button
              onClick={onReset}
              type="button"
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors text-[10px] sm:text-[11px]"
              title="Boshlang‘ich holatga qaytarish"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Tiklash</span>
            </button>
          )}
          {onRun && (
            <Button
              onClick={onRun}
              disabled={isLoading}
              size="sm"
              variant="gradient"
              className="h-7 text-xs px-2.5 sm:px-3 gap-1 sm:gap-1.5 shadow-none font-bold"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>{isLoading ? '...' : 'Ishga tushirish'}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="relative">
        <Editor
          height={height}
          language={monacoLang}
          value={code}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorMount}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            readOnly,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            padding: { top: 12, bottom: 12 },
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}
