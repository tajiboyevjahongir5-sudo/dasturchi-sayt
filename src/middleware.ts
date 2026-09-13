import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return new TextEncoder().encode('codequest-dev-fallback-secret-2026');
  }
  return new TextEncoder().encode(secret);
}

const SESSION_COOKIE_NAME = 'codequest_session';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/profile',
  '/progress',
  '/achievements',
  '/onboarding',
  '/workspace',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let isValid = false;
  let userId: string | null = null;
  let userRole: string | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, getJwtSecret());
      isValid = true;
      userId = payload.userId as string;
      userRole = payload.role as string;
    } catch {
      isValid = false;
    }
  }

  // 1. Admin route access guard: only instructor, admin, superadmin
  if (pathname.startsWith('/admin')) {
    if (!isValid) {
      const url = new URL('/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    if (!userRole || !['instructor', 'admin', 'superadmin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // 2. If accessing protected page without valid token -> redirect to /login
  if (isProtected && !isValid) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // 3. If logged in and accessing /login or /register -> redirect to /dashboard
  if (isAuthPage && isValid) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const response = NextResponse.next();
  if (userId) {
    response.headers.set('x-user-id', userId);
  }
  return response;
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/dashboard',
    '/dashboard/:path*',
    '/profile',
    '/profile/:path*',
    '/progress',
    '/progress/:path*',
    '/achievements',
    '/achievements/:path*',
    '/onboarding',
    '/onboarding/:path*',
    '/workspace',
    '/workspace/:path*',
    '/login',
    '/register',
  ],
};
