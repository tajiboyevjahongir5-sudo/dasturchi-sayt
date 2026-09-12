import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { adminRepo } from '@/db/adminRepo';
import { verifyCsrf, csrfErrorResponse } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const rollbackSchema = z.object({
  version: z.number().int().min(1, 'To‘g‘ri versiya raqami ko‘rsatilishi kerak'),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    const rate = checkRateLimit(`lesson_rollback_${user.id}`, { max: 30 });
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
    const parsed = rollbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Versiya raqami noto‘g‘ri' }, { status: 400 });
    }

    const restoredLesson = await adminRepo.rollbackLessonVersion(id, parsed.data.version, user);

    return NextResponse.json({
      success: true,
      data: restoredLesson,
      message: `Dars muvaffaqiyatli ${parsed.data.version}-versiyadan yangi versiyaga tiklandi`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Versiyani tiklashda xatolik yuz berdi' },
      { status: err.message?.includes('Ruxsat') ? 403 : 400 }
    );
  }
}
