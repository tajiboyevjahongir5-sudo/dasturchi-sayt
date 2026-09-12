import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { adminRepo } from '@/db/adminRepo';
import { verifyCsrf, csrfErrorResponse } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Only admin and superadmin can publish!
    const { user, errorResponse } = await requireRole(['admin', 'superadmin']);
    if (!user) return errorResponse;

    const rate = checkRateLimit(`lesson_publish_${user.id}`, { max: 100 });
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Juda ko‘p so‘rov yuborildi. Iltimos, kuting.' },
        { status: 429 }
      );
    }

    const csrf = verifyCsrf(request);
    if (!csrf.valid) return csrfErrorResponse(csrf.error);

    const { id } = await context.params;
    const result = await adminRepo.publishLesson(id, user);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: 'Darsni nashr qilish uchun tekshiruvdan o‘tmadi',
        validationErrors: result.errors,
      }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      data: result.lesson,
      message: 'Dars muvaffaqiyatli nashr qilindi!',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Nashr qilishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Instructor, admin, or superadmin can submit for review
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    const rate = checkRateLimit(`lesson_review_${user.id}`, { max: 100 });
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Juda ko‘p so‘rov yuborildi. Iltimos, kuting.' },
        { status: 429 }
      );
    }

    const csrf = verifyCsrf(request);
    if (!csrf.valid) return csrfErrorResponse(csrf.error);

    const { id } = await context.params;
    const lesson = await adminRepo.submitLessonForReview(id, user);

    return NextResponse.json({
      success: true,
      data: lesson,
      message: 'Dars tekshiruvga (review) yuborildi',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Reviewga yuborishda xatolik' },
      { status: err.message?.includes('Ruxsat') ? 403 : 500 }
    );
  }
}
