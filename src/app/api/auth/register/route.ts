import { NextResponse } from 'next/server';
import { userRepo } from '@/db/repo';
import { hashPassword, createSession } from '@/lib/auth';
import { SESSION_COOKIE_NAME } from '@/lib/session';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Ism kamida 2 ta belgidan iborat bo‘lishi kerak' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Haqiqiy email manzilini kiriting' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak' },
        { status: 400 }
      );
    }

    const existingUser = userRepo.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Bu email bilan allaqachon ro‘yxatdan o‘tilgan' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const userId = crypto.randomUUID();

    const user = userRepo.create({
      id: userId,
      name: name.trim(),
      email: email.trim(),
      passwordHash,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
    });

    // Create session token
    const token = await createSession(user.id, user.email, user.role);

    const response = NextResponse.json({
      success: true,
      message: 'Muvaffaqiyatli ro‘yxatdan o‘tdingiz',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        onboardingCompleted: user.onboardingCompleted,
      },
    });

    // Set HTTP-only session cookie
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
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: 'Serverda xatolik yuz berdi. Qayta urinib ko‘ring.' },
      { status: 500 }
    );
  }
}
