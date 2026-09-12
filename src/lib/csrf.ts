/**
 * CodeQuest — CSRF Protection Guard for State-Changing Requests (POST, PUT, DELETE, PATCH)
 */

import { NextRequest, NextResponse } from 'next/server';

export function verifyCsrf(request: Request | NextRequest): { valid: boolean; error?: string } {
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }

  // Check Sec-Fetch-Site (modern browser standard protection)
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite && ['cross-site'].includes(secFetchSite)) {
    return { valid: false, error: 'CSRF tekshiruvi: Cross-site so‘rov rad etildi' };
  }

  // Check Origin / Host match
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return { valid: false, error: 'CSRF tekshiruvi: Origin hostga mos kelmadi' };
      }
    } catch {
      return { valid: false, error: 'CSRF tekshiruvi: Noto‘g‘ri Origin sarlavhasi' };
    }
  }

  // Check custom header: X-Requested-With or X-CSRF-Token or Content-Type json
  const customHeader = request.headers.get('x-requested-with') || request.headers.get('x-csrf-token');
  const contentType = request.headers.get('content-type') || '';

  // Browsers cannot send custom headers or application/json in cross-origin HTML form POSTs without preflight
  const isProtectedContentType = contentType.includes('application/json') || contentType.includes('multipart/form-data');

  if (!customHeader && !isProtectedContentType && !secFetchSite) {
    return { valid: false, error: 'CSRF tekshiruvi: Maxsus sarlavha yetishmaydi' };
  }

  return { valid: true };
}

export function csrfErrorResponse(error = 'CSRF tekshiruvidan o‘tmadi'): NextResponse {
  return NextResponse.json({ success: false, error }, { status: 403 });
}
