import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { adminRepo } from '@/db/adminRepo';
import { verifyCsrf, csrfErrorResponse } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const updateLessonSchema = z.object({
  title: z.string().min(3).max(150).optional(),
  slug: z.string().min(2).max(150).optional(),
  description: z.string().max(1000).optional(),
  objectives: z.array(z.string()).optional(),
  estimatedMinutes: z.number().int().min(1).max(180).optional(),
  order: z.number().int().min(1).optional(),
  status: z.enum(['draft', 'review', 'published', 'archived']).optional(),
  content: z.any().optional(),
  changeSummary: z.string().max(300).optional(),
  exercise: z.any().optional(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    const { id } = await context.params;
    const lessonData = adminRepo.getLessonById(id, user);

    if (!lessonData) {
      return NextResponse.json({ success: false, error: 'Dars topilmadi' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: lessonData,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Darsni yuklashda xatolik' },
      { status: err.message?.includes('Ruxsat') ? 403 : 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    const csrf = verifyCsrf(request);
    if (!csrf.valid) return csrfErrorResponse(csrf.error);

    const rate = checkRateLimit(`lesson_update_${user.id}`, { max: 100 });
    if (!rate.allowed) {
      return NextResponse.json({ success: false, error: 'Juda ko‘p so‘rov' }, { status: 429 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateLessonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message || 'Xato ma’lumot' }, { status: 400 });
    }

    const updated = await adminRepo.updateLesson(id, parsed.data, user);

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Dars muvaffaqiyatli yangilandi',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Darsni yangilashda xatolik' },
      { status: err.message?.includes('Ruxsat') ? 403 : 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    const csrf = verifyCsrf(request);
    if (!csrf.valid) return csrfErrorResponse(csrf.error);

    const { id } = await context.params;
    const deleted = await adminRepo.deleteLesson(id, user);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Dars topilmadi' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Dars muvaffaqiyatli o‘chirildi',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Darsni o‘chirishda xatolik' },
      { status: err.message?.includes('Ruxsat') ? 403 : 500 }
    );
  }
}
