import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { progressRepo, userRepo, achievementRepo } from '@/db/repo';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Tizimga kirishingiz shart' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { lessonId, courseId, quizScore } = body;

    if (!lessonId || !courseId) {
      return NextResponse.json(
        { success: false, error: 'Dars yoki kurs ID si ko‘rsatilmadi' },
        { status: 400 }
      );
    }

    progressRepo.saveLessonProgress({
      userId: user.id,
      lessonId,
      courseId,
      status: 'completed',
      quizScore: quizScore !== undefined ? quizScore : 100,
    });

    // Reward completion XP (+30 XP)
    const earnedXP = 30 + (quizScore === 100 ? 20 : 0);
    userRepo.updateStats(user.id, { xp: earnedXP });

    // Check achievement: first_lesson
    const unlockedAchievements: string[] = [];
    if (achievementRepo.unlock(user.id, 'first_lesson')) {
      unlockedAchievements.push('first_lesson');
    }
    if (quizScore === 100) {
      if (achievementRepo.unlock(user.id, 'quiz_master')) {
        unlockedAchievements.push('quiz_master');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Dars muvaffaqiyatli yakunlandi!',
      data: {
        earnedXP,
        unlockedAchievements,
      },
    });
  } catch (error) {
    console.error('Complete lesson error:', error);
    return NextResponse.json(
      { success: false, error: 'Darsni yakunlashda xatolik' },
      { status: 500 }
    );
  }
}
