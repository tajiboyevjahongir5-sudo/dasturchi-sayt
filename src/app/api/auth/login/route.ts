import { NextResponse } from 'next/server';
import { userRepo } from '@/db/repo';
import { verifyPassword, createSession } from '@/lib/auth';
import { SESSION_COOKIE_NAME } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email va parolni to‘ldiring' },
        { status: 400 }
      );
    }

    const user = userRepo.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email yoki parol noto‘g‘ri' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Email yoki parol noto‘g‘ri' },
        { status: 401 }
      );
    }

    // Streak calculation
    const today = new Date().toISOString().split('T')[0];
    let newStreak = user.streak;

    if (user.lastActiveDate) {
      const lastDate = new Date(user.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        newStreak = user.streak + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    userRepo.updateStats(user.id, {
      streak: newStreak,
      lastActiveDate: today,
    });

    const token = await createSession(user.id, user.email, user.role);

    const response = NextResponse.json({
      success: true,
      message: 'Xush kelibsiz!',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
        xp: user.xp,
        streak: newStreak,
        onboardingCompleted: user.onboardingCompleted,
      },
    });

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Serverda xatolik yuz berdi. Qayta urinib ko‘ring.' },
      { status: 500 }
    );
  }
}
