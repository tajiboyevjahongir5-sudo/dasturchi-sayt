import { cookies } from 'next/headers';
import { verifySession } from './auth';
import { userRepo } from '@/db/repo';
import type { User } from '@/types';

export const SESSION_COOKIE_NAME = 'codequest_session';

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = await verifySession(token);
  if (!payload) return null;

  return userRepo.findById(payload.userId);
}
