import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/rbac';
import { adminRepo } from '@/db/adminRepo';
import { verifyCsrf, csrfErrorResponse } from '@/lib/csrf';
import { checkRateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const createCourseSchema = z.object({
  title: z.string().min(3, 'Kurs nomi kamida 3 ta belgidan iborat bo‘lishi kerak').max(100),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().min(10, 'Kurs tavsifi kamida 10 ta belgidan iborat bo‘lishi kerak').max(2000),
  shortDescription: z.string().min(5, 'Qisqa tavsif kamida 5 ta belgidan iborat bo‘lishi kerak').max(300),
  level: z.enum(['boshlangich', 'orta', 'professional']).optional(),
  category: z.enum(['kirish', 'frontend', 'backend', 'database', 'fullstack', 'career']).optional(),
  thumbnail: z.string().max(100).optional(),
  estimatedHours: z.number().int().min(1).max(200).optional(),
  technologies: z.array(z.string()).optional(),
  status: z.enum(['draft', 'review', 'published', 'archived']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const courses = adminRepo.getCourses(user, { status, search });

    return NextResponse.json({
      success: true,
      data: courses,
    });
  } catch (error: unknown) {
    console.error('Admin Courses GET error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Kurslarni yuklashda xatolik' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, errorResponse } = await requireRole(['instructor', 'admin', 'superadmin']);
    if (!user) return errorResponse;

    // CSRF Check
    const csrf = verifyCsrf(request);
    if (!csrf.valid) {
      return csrfErrorResponse(csrf.error);
    }

    // Rate Limit Check
    const rate = checkRateLimit(`course_create_${user.id}`, { max: 30, windowMs: 60_000 });
    if (!rate.allowed) {
      return NextResponse.json(
        { success: false, error: 'Juda ko‘p so‘rov yuborildi. Iltimos, biroz kuting.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = createCourseSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Kiritilgan ma’lumotlarda xatolik bor';
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const newCourse = await adminRepo.createCourse(parsed.data, user);

    return NextResponse.json({
      success: true,
      data: newCourse,
      message: 'Kurs muvaffaqiyatli yaratildi',
    }, { status: 201 });
  } catch (error: unknown) {
    console.error('Admin Course Create error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message || 'Kurs yaratishda xatolik yuz berdi' },
      { status: 400 }
    );
  }
}
