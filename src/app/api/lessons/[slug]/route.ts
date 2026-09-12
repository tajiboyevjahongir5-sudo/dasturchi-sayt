import { NextResponse } from 'next/server';
import { courseRepo, progressRepo } from '@/db/repo';
import { getCurrentUser } from '@/lib/session';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const lesson = courseRepo.getLessonBySlug(slug);

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: 'Dars topilmadi' },
        { status: 404 }
      );
    }

    const exercise = courseRepo.getExerciseByLesson(lesson.id);
    const modules = courseRepo.getModules(lesson.courseId);
    const courseLessons = courseRepo.getLessonsByCourse(lesson.courseId);

    const user = await getCurrentUser();
    let progress = null;
    let submissions: import('@/types').Submission[] = [];

    if (user) {
      progress = progressRepo.getUserLessonProgress(user.id, lesson.id);
      if (exercise) {
        submissions = progressRepo.getUserSubmissions(user.id, exercise.id);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        lesson,
        exercise,
        modules,
        courseLessons,
        progress,
        submissions,
      },
    });
  } catch (error) {
    console.error('Lesson GET by slug error:', error);
    return NextResponse.json(
      { success: false, error: 'Dars ma’lumotlarini olishda xatolik' },
      { status: 500 }
    );
  }
}
