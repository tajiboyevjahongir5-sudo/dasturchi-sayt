import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { calculateLevel } from '@/lib/utils';
import { achievementRepo, progressRepo } from '@/db/repo';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Tizimga kirmagansiz' },
        { status: 401 }
      );
    }

    const levelInfo = calculateLevel(user.xp);
    const achievements = achievementRepo.getUserAchievements(user.id);
    const progressList = progressRepo.getAllUserProgress(user.id);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        level: levelInfo.level,
        levelTitle: levelInfo.title,
        currentXP: levelInfo.currentXP,
        requiredXP: levelInfo.requiredXP,
        totalXP: user.xp,
        streak: user.streak,
        onboardingCompleted: user.onboardingCompleted,
        achievementsCount: achievements.length,
        completedLessonsCount: progressList.filter((p) => p.status === 'completed').length,
      },
    });
  } catch (error) {
    console.error('Me endpoint error:', error);
    return NextResponse.json(
      { success: false, error: 'Foydalanuvchi ma’lumotlarini olishda xatolik' },
      { status: 500 }
    );
  }
}
