import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { adminRepo } from '@/db/adminRepo';

export async function GET(request: NextRequest) {
  try {
    const { user, errorResponse } = await requireRole(['admin', 'superadmin']);
    if (!user) return errorResponse;

    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('targetType') || undefined;
    const action = searchParams.get('action') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

    const { logs, total } = adminRepo.getAuditLogs(user, {
      limit,
      offset,
      targetType,
      action,
      userId,
    });

    return NextResponse.json({
      success: true,
      data: {
        logs,
        total,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Audit loglarini yuklashda xatolik' },
      { status: err.message?.includes('Ruxsat') ? 403 : 500 }
    );
  }
}
