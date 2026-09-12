import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { adminRepo } from '@/db/adminRepo';
import { verifyCsrf, csrfErrorResponse } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const createModuleSchema = z.object({
  courseId: z.string().min(1, 'Kurs ID bo‘lishi shart'),
  title: z.string().min(2, 'Modul nomi kamida 2 ta belgi bo‘lishi kerak').max(100),
  description: z.string().max(500).optional(),
});

const reorderModulesSchema = z.object({
  courseId: z.string().min(1),
  orderedIds: z.array(z.string()).min(1),
});

export async function POST(request: NextRequest) {
  try {
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    const csrf = verifyCsrf(request);
    if (!csrf.valid) return csrfErrorResponse(csrf.error);

    const rate = checkRateLimit(`module_create_${user.id}`, { max: 40 });
    if (!rate.allowed) {
      return NextResponse.json({ success: false, error: 'Juda ko‘p so‘rov' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = createModuleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message || 'Xato ma’lumot' }, { status: 400 });
    }

    const newMod = await adminRepo.createModule(parsed.data, user);

    return NextResponse.json({
      success: true,
      data: newMod,
      message: 'Modul muvaffaqiyatli qo‘shildi',
    }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Modul yaratishda xatolik' },
      { status: err.message?.includes('Ruxsat') ? 403 : 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    const csrf = verifyCsrf(request);
    if (!csrf.valid) return csrfErrorResponse(csrf.error);

    const body = await request.json();
    const parsed = reorderModulesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Tartib ma’lumotlari noto‘g‘ri' }, { status: 400 });
    }

    await adminRepo.reorderModules(parsed.data.courseId, parsed.data.orderedIds, user);

    return NextResponse.json({
      success: true,
      message: 'Modullar tartibi muvaffaqiyatli saqlandi',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Modullarni qayta tartiblashda xatolik' },
      { status: err.message?.includes('Ruxsat') ? 403 : 400 }
    );
  }
}
