import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { adminRepo } from '@/db/adminRepo';
import { verifyCsrf, csrfErrorResponse } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const createLessonSchema = z.object({
  courseId: z.string().min(1, 'Kurs ID bo‘lishi shart'),
  moduleId: z.string().min(1, 'Modul ID bo‘lishi shart'),
  title: z.string().min(3, 'Dars nomi kamida 3 ta belgi bo‘lishi kerak').max(150),
  slug: z.string().min(2).max(150).optional(),
  description: z.string().max(1000).optional(),
  objectives: z.array(z.string()).optional(),
  estimatedMinutes: z.number().int().min(1).max(180).optional(),
  content: z.any().optional(),
  status: z.enum(['draft', 'review', 'published', 'archived']).optional(),
  exercise: z.any().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    const csrf = verifyCsrf(request);
    if (!csrf.valid) return csrfErrorResponse(csrf.error);

    const rate = checkRateLimit(`lesson_create_${user.id}`, { max: 100 });
    if (!rate.allowed) {
      return NextResponse.json({ success: false, error: 'Juda ko‘p so‘rov' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = createLessonSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message || 'Xato ma’lumot' }, { status: 400 });
    }

    const newLesson = await adminRepo.createLesson(parsed.data, user);

    return NextResponse.json({
      success: true,
      data: newLesson,
      message: 'Dars muvaffaqiyatli yaratildi',
    }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Dars yaratishda xatolik' },
      { status: err.message?.includes('Ruxsat') ? 403 : 400 }
    );
  }
}

const reorderLessonsSchema = z.object({
  moduleId: z.string().min(1, 'Modul ID kiritilishi shart'),
  orderedIds: z.array(z.string()).min(1, 'Kamida bitta dars bo‘lishi kerak'),
});

export async function PUT(request: NextRequest) {
  try {
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    const csrf = verifyCsrf(request);
    if (!csrf.valid) return csrfErrorResponse(csrf.error);

    const body = await request.json();
    const parsed = reorderLessonsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Tartib ma’lumotlari noto‘g‘ri' }, { status: 400 });
    }

    await adminRepo.reorderLessons(parsed.data.moduleId, parsed.data.orderedIds, user);

    return NextResponse.json({
      success: true,
      message: 'Darslar tartibi muvaffaqiyatli saqlandi',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Darslarni qayta tartiblashda xatolik' },
      { status: err.message?.includes('Ruxsat') ? 403 : 400 }
    );
  }
}
