import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { adminRepo } from '@/db/adminRepo';
import { verifyCsrf, csrfErrorResponse } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import type { UserRole } from '@/types';

const updateRoleSchema = z.object({
  role: z.enum(['user', 'instructor', 'admin', 'superadmin']),
});

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // STRICT: Only superadmin can change roles!
    const { user, errorResponse } = await requireRole(['superadmin']);
    if (!user) return errorResponse;

    const rate = checkRateLimit(`user_role_${user.id}`, { max: 30 });
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Juda ko‘p so‘rov yuborildi. Iltimos, kuting.' },
        { status: 429 }
      );
    }

    const csrf = verifyCsrf(request);
    if (!csrf.valid) return csrfErrorResponse(csrf.error);

    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateRoleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Noto‘g‘ri rol' }, { status: 400 });
    }

    const updatedUser = await adminRepo.updateUserRole(id, parsed.data.role as UserRole, user);

    const safeUser = { ...updatedUser };
    delete (safeUser as { passwordHash?: string }).passwordHash;

    return NextResponse.json({
      success: true,
      data: safeUser,
      message: `Foydalanuvchi roli ${parsed.data.role} ga o‘zgartirildi`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Rolni o‘zgartirishda xatolik' },
      { status: err.message?.includes('Super Admin') || err.message?.includes('Ruxsat') ? 403 : 400 }
    );
  }
}
