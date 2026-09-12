import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { projectRepo } from '@/db/repo';

export const dynamic = 'force-dynamic';

export async function GET(
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

    const { id } = await params;
    const project = projectRepo.getProjectById(id, user.id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Loyiha topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Project GET by ID error:', error);
    return NextResponse.json(
      { success: false, error: 'Loyihani olishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const { id } = await params;

    const bodyText = await request.text();
    if (bodyText.length > 700 * 1024) {
      return NextResponse.json(
        { success: false, error: 'So‘rov hajmi juda katta (maksimal 700 KB)' },
        { status: 413 }
      );
    }

    const body = JSON.parse(bodyText);
    const { title, description, html, css, js } = body;

    const updated = projectRepo.updateProject(id, user.id, {
      title,
      description,
      html,
      css,
      js,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Loyiha topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Project PUT error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Loyihani yangilashda xatolik yuz berdi' },
      { status: 400 }
    );
  }
}

export async function DELETE(
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

    const { id } = await params;
    const deleted = projectRepo.deleteProject(id, user.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Loyiha topilmadi yoki sizga tegishli emas' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Loyiha muvaffaqiyatli o‘chirildi',
    });
  } catch (error) {
    console.error('Project DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Loyihani o‘chirishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
