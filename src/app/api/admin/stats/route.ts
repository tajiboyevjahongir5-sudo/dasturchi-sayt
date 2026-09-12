import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { adminRepo } from '@/db/adminRepo';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    const rate = checkRateLimit(`admin_stats_${user.id}`, { max: 60 });
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Juda ko‘p so‘rov yuborildi. Iltimos, kuting.' },
        { status: 429 }
      );
    }

    const stats = await adminRepo.getDashboardStats(user);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error: unknown) {
    console.error('Admin Stats API error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Statistikani yuklashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
