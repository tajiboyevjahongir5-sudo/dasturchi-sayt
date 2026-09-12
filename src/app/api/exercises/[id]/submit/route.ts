import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { progressRepo, userRepo, achievementRepo } from '@/db/repo';
import { db, schema } from '@/db';
import { eq } from 'drizzle-orm';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Tizimga kirishingiz shart' },
        { status: 401 }
      );
    }

    const { id: exerciseId } = await params;
    const body = await request.json();
    const {
      code,
      testResults = [],
      passed = false,
      score = 0,
      attempts = 1,
      hintsUsed = 0,
      timeSpent = 0,
      pasteCount = 0,
      keystrokeCount = 0,
      errors = [],
    } = body;

    if (typeof code === 'string' && code.length > 700 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Kod hajmi juda katta (maksimal 700 KB)' },
        { status: 413 }
      );
    }

    // 1. Fetch exercise to get lessonId and courseId
    const exercise = db.select().from(schema.exercises).where(eq(schema.exercises.id, exerciseId)).get();
    if (!exercise) {
      return NextResponse.json(
        { success: false, error: 'Topshiriq topilmadi' },
        { status: 404 }
      );
    }

    const lesson = db.select().from(schema.lessons).where(eq(schema.lessons.id, exercise.lessonId)).get();

    // 2. Save submission record
    progressRepo.recordSubmission({
      userId: user.id,
      exerciseId,
      code,
      score,
      passed,
      errors,
      testResults,
      attempts,
      hintsUsed,
      timeSpent,
      pasteCount,
      keystrokeCount,
    });

    // 3. If passed: calculate XP, achievements, and progress
    let earnedXP = 0;
    const unlockedAchievements: string[] = [];

    if (passed) {
      // Base XP
      earnedXP += 50;

      // Bonus: No hints used (+20 XP)
      if (hintsUsed === 0) earnedXP += 20;

      // Bonus: No copy-paste (+25 XP)
      if (pasteCount === 0) earnedXP += 25;

      // Bonus: First attempt (+15 XP)
      if (attempts === 1) earnedXP += 15;

      userRepo.updateStats(user.id, { xp: earnedXP });

      // Update lesson progress
      if (lesson) {
        progressRepo.saveLessonProgress({
          userId: user.id,
          lessonId: lesson.id,
          courseId: lesson.courseId,
          status: 'completed',
          exerciseScore: score,
        });
      }

      // Check achievements:
      // A. first_code
      if (achievementRepo.unlock(user.id, 'first_code')) {
        unlockedAchievements.push('first_code');
      }

      // B. pure_coder
      if (pasteCount === 0) {
        if (achievementRepo.unlock(user.id, 'pure_coder')) {
          unlockedAchievements.push('pure_coder');
        }
      }

      // C. first_lesson
      const completedCount = progressRepo.getAllUserProgress(user.id).filter(
        (p) => p.status === 'completed'
      ).length;
      if (completedCount >= 1) {
        if (achievementRepo.unlock(user.id, 'first_lesson')) {
          unlockedAchievements.push('first_lesson');
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        passed,
        score,
        earnedXP,
        unlockedAchievements,
      },
    });
  } catch (error) {
    console.error('Exercise submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Topshiriqni topshirishda xatolik' },
      { status: 500 }
    );
  }
}
