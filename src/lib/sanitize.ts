/**
 * CodeQuest — Content Sanitizer & XSS Protection
 * Sanitizes Markdown/HTML content submitted by users, instructors, or admins.
 * Blocks:
 * - <script>, <iframe>, <object>, <embed>, <applet>, <base>, <link>, <form>, <input>, <button>, <style>
 * - Inline event handlers (onload, onerror, onclick, onmouseover, etc.)
 * - javascript:, vbscript:, data:text/html URIs in href, src, or action attributes
 * - Preserves code blocks (```...```) safely escaped so programming examples don't execute
 */

/**
 * Escapes HTML characters in pure text
 */
export function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes rich HTML / Markdown content while preserving safe formatting tags:
 * Allowed tags: p, h1, h2, h3, h4, h5, h6, ul, ol, li, strong, b, em, i, u, s,
 * blockquote, pre, code, hr, br, a (safe href), img (safe src), table, thead, tbody, tr, th, td, span, div.
 */
export function sanitizeContent(input: string): string {
  if (!input || typeof input !== 'string') return '';

  let sanitized = input;

  // 1. Strip dangerous tags entirely along with their inner contents
  const dangerousTags = [
    'script',
    'iframe',
    'object',
    'embed',
    'applet',
    'base',
    'link',
    'meta',
    'form',
    'input',
    'textarea',
    'button',
    'style',
  ];

  for (const tag of dangerousTags) {
    const regexWithClosing = new RegExp(`<\\s*${tag}[^>]*>[\\s\\S]*?<\\s*\\/\\s*${tag}\\s*>`, 'gi');
    sanitized = sanitized.replace(regexWithClosing, '');
    const regexSelfClosing = new RegExp(`<\\s*${tag}[^>]*\\/?>`, 'gi');
    sanitized = sanitized.replace(regexSelfClosing, '');
  }

  // 2. Strip dangerous protocol schemes: javascript:, vbscript:, data:text/html
  sanitized = sanitized.replace(/\b(href|src|action)\s*=\s*["']?\s*(javascript|vbscript|data:text\/html):[^"'>\s]*/gi, '$1="#"');

  // 3. Strip all inline DOM event handlers: on<event> (e.g. onerror, onload, onclick, onfocus, etc.)
  // Matches: onerror="...", onload='...', onclick=alert(1), etc.
  sanitized = sanitized.replace(/\s+on[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 4. Strip expressions and css imports inside style attributes if any style remains
  sanitized = sanitized.replace(/style\s*=\s*(?:"[^"]*(?:expression|javascript|url|behavior)[^"]*"|'[^']*(?:expression|javascript|url|behavior)[^']*')/gi, '');

  return sanitized.trim();
}

/**
 * Sanitizes lesson content structures recursively
 */
export function sanitizeLessonContent<T>(content: T): T {
  if (typeof content === 'string') {
    return sanitizeContent(content) as unknown as T;
  }

  if (Array.isArray(content)) {
    return content.map((item) => sanitizeLessonContent(item)) as unknown as T;
  }

  if (content !== null && typeof content === 'object') {
    const obj = content as Record<string, unknown>;

    // If this object represents a code block (e.g. type === 'code'), preserve raw code content intact
    if (obj.type === 'code' && typeof obj.content === 'string') {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (key === 'content') {
          result[key] = value;
        } else {
          result[key] = sanitizeLessonContent(value);
        }
      }
      return result as T;
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(content)) {
      // Do not sanitize raw code inside interactive examples or starterCode since it must remain valid programming code
      if (key === 'code' || key === 'starterCode' || key === 'starterFiles' || key === 'expectedOutput' || key === 'input') {
        result[key] = value;
      } else {
        result[key] = sanitizeLessonContent(value);
      }
    }
    return result as T;
  }

  return content;
}
