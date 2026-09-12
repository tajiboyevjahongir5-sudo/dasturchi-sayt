import { NextResponse } from 'next/server';
import { courseRepo, progressRepo } from '@/db/repo';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  try {
    const user = await getCurrentUser();
    const courses = courseRepo.getAll();

    const coursesWithProgress = courses.map((course) => {
      let progress = undefined;
      if (user) {
        progress = progressRepo.getCourseProgress(user.id, course.id);
      }
      return {
        ...course,
        progress,
      };
    });

    return NextResponse.json({
      success: true,
      data: coursesWithProgress,
    });
  } catch (error) {
    console.error('Courses GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Kurslarni yuklashda xatolik' },
      { status: 500 }
    );
  }
}
