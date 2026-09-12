import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { courseRepo, progressRepo, achievementRepo } from '@/db/repo';
import { calculateLevel } from '@/lib/utils';
import type { WeeklyDataPoint } from '@/types';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Tizimga kirishingiz shart' },
        { status: 401 }
      );
    }

    const levelInfo = calculateLevel(user.xp);
    const allCourses = courseRepo.getAll();
    const allProgress = progressRepo.getAllUserProgress(user.id);
    const userAchievements = achievementRepo.getUserAchievements(user.id);

    const completedProgress = allProgress.filter((p) => p.status === 'completed');
    const coursesProgress = allCourses.map((c) => progressRepo.getCourseProgress(user.id, c.id));

    // Generate weekly activity dataset (last 7 days)
    const daysUz = ['Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan', 'Yak'];
    const today = new Date();
    const weeklyProgress: WeeklyDataPoint[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dayIndex = (d.getDay() + 6) % 7; // Monday = 0

      // Calculate mock/derived activity for visualization
      const isToday = i === 0;
      const isYesterday = i === 1;

      weeklyProgress.push({
        day: daysUz[dayIndex],
        xp: isToday ? 80 : isYesterday ? 50 : (i % 2 === 0 ? 40 : 20),
        lessons: isToday ? 2 : isYesterday ? 1 : (i % 2 === 0 ? 1 : 0),
        minutes: isToday ? 35 : isYesterday ? 25 : (i % 2 === 0 ? 20 : 10),
      });
    }

    // Recent in-progress or next recommended course
    const activeCourse = coursesProgress.find((cp) => cp.percentage < 100) || coursesProgress[0];

    return NextResponse.json({
      success: true,
      data: {
        user: {
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
        },
        stats: {
          completedLessons: completedProgress.length,
          totalAchievements: userAchievements.length,
          activeCourse,
          coursesProgress,
          weeklyProgress,
          strongTopics: ['HTML teglari va formalar', 'CSS selektorlari', 'console.log buyrug‘i'],
          weakTopics: ['CSS Grid repeat()', 'Sintaksis xatolarini tuzatish'],
        },
        achievements: userAchievements,
      },
    });
  } catch (error) {
    console.error('User stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Statistikalarni olishda xatolik' },
      { status: 500 }
    );
  }
}
