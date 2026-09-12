import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { adminRepo } from '@/db/adminRepo';

export async function GET(request: NextRequest) {
  try {
    const { user, errorResponse } = await requireRole(['admin', 'superadmin']);
    if (!user) return errorResponse;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const role = searchParams.get('role') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

    const result = adminRepo.getUsers(user, { search, role, limit, offset });

    // Sanitize user list: remove passwordHash before sending over wire
    const safeUsers = result.users.map((u) => {
      const copy = { ...u };
      delete (copy as { passwordHash?: string }).passwordHash;
      return copy;
    });

    return NextResponse.json({
      success: true,
      data: {
        users: safeUsers,
        total: result.total,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Foydalanuvchilarni yuklashda xatolik' },
      { status: err.message?.includes('Ruxsat') ? 403 : 500 }
    );
  }
}
