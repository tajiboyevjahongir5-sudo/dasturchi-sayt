import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import type { SessionPayload, UserRole } from '@/types';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Xavfsizlik ogohlantirishi: Production uchun JWT_SECRET sozlanmagan, zaxira kalit ishlatilmoqda.');
    }
    return new TextEncoder().encode('codequest-dev-fallback-secret-2026');
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string, email: string, role: string): Promise<string> {
  return new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecret());
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      role: payload.role as UserRole,
      exp: payload.exp as number,
    };
  } catch {
    return null;
  }
}
