import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { projectRepo } from '@/db/repo';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Tizimga kirishingiz shart' },
        { status: 401 }
      );
    }

    const projects = projectRepo.getUserProjects(user.id);
    return NextResponse.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Loyihalarni yuklashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Tizimga kirishingiz shart' },
        { status: 401 }
      );
    }

    // Limit request body reading
    const bodyText = await request.text();
    if (bodyText.length > 700 * 1024) {
      return NextResponse.json(
        { success: false, error: 'So‘rov hajmi juda katta (maksimal 700 KB)' },
        { status: 413 }
      );
    }

    const body = JSON.parse(bodyText);
    const { title, description, html, css, js } = body;

    const newProject = projectRepo.createProject({
      userId: user.id,
      title: title || 'Mening Yangi Veb Loyiham',
      description,
      html,
      css,
      js,
    });

    return NextResponse.json({
      success: true,
      data: newProject,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Projects POST error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Loyiha yaratishda xatolik yuz berdi' },
      { status: 400 }
    );
  }
}
