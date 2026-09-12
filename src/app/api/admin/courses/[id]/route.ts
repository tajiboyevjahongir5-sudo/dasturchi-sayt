import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { adminRepo } from '@/db/adminRepo';
import { verifyCsrf, csrfErrorResponse } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const updateCourseSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(2000).optional(),
  shortDescription: z.string().min(5).max(300).optional(),
  level: z.enum(['boshlangich', 'orta', 'professional']).optional(),
  category: z.enum(['kirish', 'frontend', 'backend', 'database', 'fullstack', 'career']).optional(),
  thumbnail: z.string().max(100).optional(),
  estimatedHours: z.number().int().min(1).max(200).optional(),
  technologies: z.array(z.string()).optional(),
  status: z.enum(['draft', 'review', 'published', 'archived']).optional(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    const { id } = await context.params;
    const course = adminRepo.getCourseById(id, user);

    if (!course) {
      return NextResponse.json({ success: false, error: 'Kurs topilmadi' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: course,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Kursni yuklashda xatolik' },
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

    const rate = checkRateLimit(`course_update_${user.id}`, { max: 60 });
    if (!rate.allowed) {
      return NextResponse.json({ success: false, error: 'Juda ko‘p so‘rov' }, { status: 429 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateCourseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message || 'Xato ma’lumot' }, { status: 400 });
    }

    const updated = await adminRepo.updateCourse(id, parsed.data, user);

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Kurs muvaffaqiyatli yangilandi',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Kursni yangilashda xatolik' },
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
    const deleted = await adminRepo.deleteCourse(id, user);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Kurs topilmadi yoki allaqachon o‘chirilgan' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Kurs muvaffaqiyatli arxivlandi/o‘chirildi',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Kursni o‘chirishda xatolik' },
      { status: err.message?.includes('Ruxsat') ? 403 : 500 }
    );
  }
}
