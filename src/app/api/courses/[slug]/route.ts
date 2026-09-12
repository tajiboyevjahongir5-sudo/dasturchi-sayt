import { NextResponse } from 'next/server';
import { courseRepo, progressRepo } from '@/db/repo';
import { getCurrentUser } from '@/lib/session';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const course = courseRepo.findBySlug(slug);

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Kurs topilmadi' },
        { status: 404 }
      );
    }

    const modules = courseRepo.getModules(course.id);
    const lessons = courseRepo.getLessonsByCourse(course.id);

    const user = await getCurrentUser();
    let progress = undefined;
    let lessonProgressList: import('@/types').LessonProgress[] = [];

    if (user) {
      progress = progressRepo.getCourseProgress(user.id, course.id);
      lessonProgressList = progressRepo.getAllUserProgress(user.id).filter(
        (p) => p.courseId === course.id
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        course,
        modules,
        lessons,
        progress,
        lessonProgressList,
      },
    });
  } catch (error) {
    console.error('Course GET by slug error:', error);
    return NextResponse.json(
      { success: false, error: 'Kurs ma’lumotlarini olishda xatolik' },
      { status: 500 }
    );
  }
}
