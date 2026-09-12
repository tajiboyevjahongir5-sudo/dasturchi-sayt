'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RotateCcw, 
  ExternalLink, 
  Eye, 
  AlertCircle 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { createSandboxedPreviewHtml } from '@/lib/code-runner/runner';

export interface ConsoleEntry {
  id: string;
  level: 'log' | 'warn' | 'error' | 'info';
  message: string;
  time: string;
  line?: number;
}

interface MultiFilePreviewProps {
  files: {
    'index.html': string;
    'style.css': string;
    'script.js': string;
  };
  onConsoleMessage?: (entry: ConsoleEntry) => void;
  title?: string;
  className?: string;
  height?: string;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export function MultiFilePreview({
  files,
  onConsoleMessage,
  title = 'Jonli Natija (Live Preview)',
  className = '',
  height,
}: MultiFilePreviewProps) {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [key, setKey] = useState(0); // To force iframe reload
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const srcDoc = React.useMemo(() => {
    return createSandboxedPreviewHtml(files);
  }, [files]);

  // Handle incoming postMessage from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 1. Strict origin and source validation: must come from our iframe window
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) {
        return;
      }

      // 2. Strict schema verification
      const data = event.data;
      if (
        typeof data !== 'object' ||
        data === null ||
        data.type !== 'CODEQUEST_CONSOLE_LOG' ||
        typeof data.payload !== 'object' ||
        data.payload === null
      ) {
        return;
      }

      const { level, message, line } = data.payload;
      if (!['log', 'warn', 'error', 'info'].includes(level) || typeof message !== 'string') {
        return;
      }

      if (level === 'error') {
        setHasError(true);
      }

      const entry: ConsoleEntry = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        level: level as ConsoleEntry['level'],
        message,
        line,
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };

      if (onConsoleMessage) {
        onConsoleMessage(entry);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleMessage]);

  const handleRefresh = () => {
    setHasError(false);
    setKey((k) => k + 1);
  };

  const handleOpenNewWindow = () => {
    const blob = new Blob([srcDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  // Viewport width calculation
  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div className={`flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm ${className}`}>
      {/* 1. Header Toolbar with Viewport switchers & Refresh */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 bg-muted/40 border-b border-border">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground">{title}</span>
          {hasError && (
            <Badge variant="destructive" className="h-5 text-[10px] gap-1 px-1.5 py-0">
              <AlertCircle className="w-2.5 h-2.5" />
              <span>Xato bor</span>
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Viewport switchers (Desktop, Tablet, Mobile) */}
          <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-background border border-border/80">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`p-1 rounded-md transition-colors ${
                viewport === 'desktop' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Kompyuter ko‘rinishi (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              className={`p-1 rounded-md transition-colors ${
                viewport === 'tablet' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Planshet ko‘rinishi (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`p-1 rounded-md transition-colors ${
                viewport === 'mobile' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              title="Mobil telefon ko‘rinishi (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Refresh iframe */}
          <Button
            type="button"
            onClick={handleRefresh}
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Qayta yuklash"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>

          {/* Open in external window */}
          <Button
            type="button"
            onClick={handleOpenNewWindow}
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Alohida oynada ochish"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* 2. Iframe Preview Container */}
      <div 
        className="w-full flex-1 bg-muted/20 flex items-center justify-center p-2 min-h-[350px]"
        style={height ? { height, minHeight: height } : undefined}
      >
        <div 
          className={`w-full h-full min-h-[350px] transition-all duration-200 bg-white rounded-xl shadow-xs overflow-hidden border border-border/40 ${getViewportWidth()}`}
          style={height ? { height, minHeight: height } : undefined}
        >
          <iframe
            key={key}
            ref={iframeRef}
            srcDoc={srcDoc}
            title="CodeQuest Web Project Sandbox"
            sandbox="allow-scripts"
            className="w-full h-full min-h-[350px] border-0 block"
            style={height ? { height, minHeight: height } : undefined}
          />
        </div>
      </div>
    </div>
  );
}
