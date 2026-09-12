'use client';

import React, { useMemo } from 'react';
import { Eye } from 'lucide-react';

interface CodePreviewProps {
  htmlCode: string;
  cssCode?: string;
  jsCode?: string;
  title?: string;
}

export function CodePreview({ htmlCode, cssCode = '', jsCode = '', title = 'Jonli Natija (Live Preview)' }: CodePreviewProps) {
  const srcDoc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              padding: 16px;
              color: #1e293b;
              background-color: #ffffff;
              margin: 0;
            }
            ${cssCode}
          </style>
        </head>
        <body>
          ${htmlCode}
          <script>
            try {
              ${jsCode}
            } catch(e) {
              console.error(e);
            }
          </script>
        </body>
      </html>
    `;
  }, [htmlCode, cssCode, jsCode]);

  return (
    <div className="flex flex-col rounded-xl border border-border/80 bg-card overflow-hidden shadow-md">
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/60 border-b border-border text-xs font-medium text-muted-foreground">
        <Eye className="w-3.5 h-3.5 text-primary" />
        <span>{title}</span>
      </div>
      <div className="w-full h-72 bg-white">
        <iframe
          srcDoc={srcDoc}
          title="Code Preview"
          sandbox="allow-scripts"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
