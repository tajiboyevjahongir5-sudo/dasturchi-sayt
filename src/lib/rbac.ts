/**
 * CodeQuest — Role-Based Access Control (RBAC) & Authorization Helper
 */

import { NextResponse } from 'next/server';
import { getCurrentUser } from './session';
import type { User, UserRole, Course } from '@/types';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  superadmin: 4,
  admin: 3,
  instructor: 2,
  user: 1,
};

export interface AuthGuardResult {
  user: User | null;
  errorResponse?: NextResponse;
}

/**
 * Ensures user is authenticated
 */
export async function requireAuth(): Promise<AuthGuardResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { success: false, error: 'Tizimga kirishingiz shart' },
        { status: 401 }
      ),
    };
  }
  return { user };
}

/**
 * Ensures user has one of the allowed roles
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AuthGuardResult> {
  const { user, errorResponse } = await requireAuth();
  if (!user) return { user: null, errorResponse };

  if (!allowedRoles.includes(user.role)) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        { success: false, error: 'Ushbu amalni bajarish uchun ruxsatingiz yetarli emas' },
        { status: 403 }
      ),
    };
  }

  return { user };
}

/**
 * Checks if user is permitted to edit a specific course
 * - superadmin and admin: can edit any course
 * - instructor: can only edit courses where course.instructorId === user.id
 */
export function canEditCourse(user: User, course: Course): boolean {
  if (user.role === 'superadmin' || user.role === 'admin') return true;
  if (user.role === 'instructor') {
    return course.instructorId === user.id;
  }
  return false;
}

/**
 * Checks if user can publish or archive courses/lessons
 * - Only superadmin and admin can publish or archive
 * - Instructors can only submit for review or save draft
 */
export function canPublish(user: User): boolean {
  return user.role === 'superadmin' || user.role === 'admin';
}
