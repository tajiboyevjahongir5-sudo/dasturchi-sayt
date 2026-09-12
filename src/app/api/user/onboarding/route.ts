import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { userRepo } from '@/db/repo';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Tizimga kirmagansiz' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { skillLevel = 'beginner', goals = [], weeklyHours = 5, preferredLanguage = 'uz' } = body;

    userRepo.saveProfile({
      userId: user.id,
      skillLevel,
      goals,
      weeklyHours,
      preferredLanguage,
    });

    userRepo.updateOnboarding(user.id, true);

    return NextResponse.json({
      success: true,
      message: 'Onboarding yakunlandi',
    });
  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json(
      { success: false, error: 'Onboarding saqlashda xatolik' },
      { status: 500 }
    );
  }
}
