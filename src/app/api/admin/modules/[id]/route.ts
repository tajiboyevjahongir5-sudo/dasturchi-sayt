import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { adminRepo } from '@/db/adminRepo';
import { verifyCsrf, csrfErrorResponse } from '@/lib/csrf';
import { z } from 'zod';

const updateModuleSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  description: z.string().max(500).optional(),
  order: z.number().int().min(1).optional(),
});

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    const csrf = verifyCsrf(request);
    if (!csrf.valid) return csrfErrorResponse(csrf.error);

    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateModuleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message || 'Xato ma’lumot' }, { status: 400 });
    }

    const updated = await adminRepo.updateModule(id, parsed.data, user);

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Modul yangilandi',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Modulni yangilashda xatolik' },
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
    const deleted = await adminRepo.deleteModule(id, user);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Modul topilmadi' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Modul o‘chirildi',
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Modulni o‘chirishda xatolik' },
      { status: err.message?.includes('Ruxsat') ? 403 : 500 }
    );
  }
}
