import { db, schema, sqlite } from './index';
import { eq, and, desc, asc, isNull, sql } from 'drizzle-orm';
import type { 
  User, 
  UserRole,
  ContentStatus,
  Course, 
  Module, 
  Lesson, 
  Exercise, 
  ContentVersion, 
  AuditLog, 
  CMSStats 
} from '@/types';
import { canEditCourse, canPublish } from '@/lib/rbac';
import { sanitizeContent, sanitizeLessonContent } from '@/lib/sanitize';
import { logAudit } from '@/lib/audit';
import crypto from 'crypto';

// Helper to convert DB course to Course type
function mapDbCourse(c: typeof schema.courses.$inferSelect): Course {
  return {
    ...c,
    instructorId: c.instructorId || null,
    level: c.level as Course['level'],
    category: c.category as Course['category'],
    status: (c.status || 'published') as ContentStatus,
    deletedAt: c.deletedAt || null,
    published: Boolean(c.published),
    technologies: JSON.parse(c.technologies || '[]'),
  };
}

// Helper to convert DB module to Module type
function mapDbModule(m: typeof schema.modules.$inferSelect): Module {
  return {
    ...m,
    deletedAt: m.deletedAt || null,
  };
}

// Helper to convert DB lesson to Lesson type
function mapDbLesson(l: typeof schema.lessons.$inferSelect): Lesson {
  return {
    ...l,
    status: (l.status || 'published') as ContentStatus,
    version: l.version || 1,
    deletedAt: l.deletedAt || null,
    published: Boolean(l.published),
    objectives: JSON.parse(l.objectives || '[]'),
    content: JSON.parse(l.content),
  };
}

// Helper to convert DB exercise to Exercise type
function mapDbExercise(e: typeof schema.exercises.$inferSelect): Exercise {
  return {
    ...e,
    language: e.language as Exercise['language'],
    difficulty: e.difficulty as Exercise['difficulty'],
    instructions: JSON.parse(e.instructions || '[]'),
    testCases: JSON.parse(e.testCases || '[]'),
    hiddenTests: JSON.parse(e.hiddenTests || '[]'),
    hints: JSON.parse(e.hints || '[]'),
    expectedConcepts: JSON.parse(e.expectedConcepts || '[]'),
    starterFiles: e.starterFiles ? JSON.parse(e.starterFiles) : undefined,
    isMultiFile: Boolean(e.starterFiles),
    xpReward: e.xpReward ?? 50,
  };
}

export const adminRepo = {
  // ==========================================
  // DASHBOARD STATS
  // ==========================================
  getDashboardStats: async (actorUser: User): Promise<CMSStats> => {
    const isInstructor = actorUser.role === 'instructor';

    if (isInstructor) {
      // Scoped only to instructor's courses
      const instructorCourses = db.select({ id: schema.courses.id })
        .from(schema.courses)
        .where(and(eq(schema.courses.instructorId, actorUser.id), isNull(schema.courses.deletedAt)))
        .all();
      const courseIds = instructorCourses.map(c => c.id);

      if (courseIds.length === 0) {
        return {
          totalUsers: 0,
          activeUsers7d: 0,
          totalCourses: 0,
          totalLessons: 0,
          totalExercises: 0,
          totalSubmissions: 0,
          avgQuizScore: 0,
          frequentErrors: [],
          recentActivity: [],
        };
      }

      const lessonList = db.select({ id: schema.lessons.id })
        .from(schema.lessons)
        .where(and(
          sql`${schema.lessons.courseId} IN (${sql.raw(courseIds.map(id => `'${id}'`).join(','))})`,
          isNull(schema.lessons.deletedAt)
        ))
        .all();
      const lessonIds = lessonList.map(l => l.id);

      let totalExercises = 0;
      let totalSubmissions = 0;
      let avgQuiz = 0;
      let frequentErrors: Array<{ concept: string; errorCount: number }> = [];

      if (lessonIds.length > 0) {
        const lessonInClause = sql.raw(lessonIds.map(id => `'${id}'`).join(','));
        const exList = db.select({ id: schema.exercises.id })
          .from(schema.exercises)
          .where(sql`${schema.exercises.lessonId} IN (${lessonInClause})`)
          .all();
        totalExercises = exList.length;

        const exIds = exList.map(e => e.id);
        if (exIds.length > 0) {
          const subCount = sqlite.prepare(`SELECT COUNT(*) as count FROM submissions WHERE exercise_id IN (${exIds.map(id => `'${id}'`).join(',')})`).get() as { count: number };
          totalSubmissions = subCount?.count || 0;

          // Aggregating frequent errors
          const subRows = sqlite.prepare(`SELECT errors FROM submissions WHERE exercise_id IN (${exIds.map(id => `'${id}'`).join(',')}) AND passed = 0 ORDER BY created_at DESC LIMIT 100`).all() as { errors: string }[];
          const errorCounts: Record<string, number> = {};
          for (const row of subRows) {
            try {
              const errs: string[] = JSON.parse(row.errors || '[]');
              for (const err of errs) {
                const clean = err.split(':')[0].trim().slice(0, 50) || 'SyntaxError';
                errorCounts[clean] = (errorCounts[clean] || 0) + 1;
              }
            } catch {}
          }
          frequentErrors = Object.entries(errorCounts)
            .map(([concept, count]) => ({ concept, errorCount: count }))
            .sort((a, b) => b.errorCount - a.errorCount)
            .slice(0, 5);
        }

        // Avg quiz score on these lessons
        const avgRow = sqlite.prepare(`SELECT AVG(quiz_score) as avgScore FROM lesson_progress WHERE lesson_id IN (${lessonIds.map(id => `'${id}'`).join(',')}) AND quiz_score IS NOT NULL`).get() as { avgScore: number | null };
        avgQuiz = avgRow?.avgScore ? Math.round(avgRow.avgScore) : 0;
      }

      // Unique students with progress on instructor courses
      const studentCount = sqlite.prepare(`SELECT COUNT(DISTINCT user_id) as count FROM lesson_progress WHERE course_id IN (${courseIds.map(id => `'${id}'`).join(',')})`).get() as { count: number };
      
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
      const active7dCount = sqlite.prepare(`SELECT COUNT(DISTINCT user_id) as count FROM lesson_progress WHERE course_id IN (${courseIds.map(id => `'${id}'`).join(',')}) AND updated_at >= ?`).get(sevenDaysAgo) as { count: number };

      // Recent activity from audit logs
      const logs = sqlite.prepare(`SELECT a.*, u.name as userName FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id WHERE a.user_id = ? ORDER BY a.created_at DESC LIMIT 10`).all(actorUser.id) as Array<{
        id: string;
        action: string;
        target_type: string;
        userName: string | null;
        created_at: string;
        details: string;
      }>;

      return {
        totalUsers: studentCount?.count || 0,
        activeUsers7d: active7dCount?.count || 0,
        totalCourses: courseIds.length,
        totalLessons: lessonIds.length,
        totalExercises,
        totalSubmissions,
        avgQuizScore: avgQuiz,
        frequentErrors,
        recentActivity: logs.map(l => ({
          id: l.id,
          action: l.action,
          targetType: l.target_type,
          userName: l.userName || actorUser.name,
          createdAt: l.created_at,
          details: l.details,
        })),
      };
    }

    // Admin / Super Admin (System-wide statistics)
    const userCount = sqlite.prepare('SELECT COUNT(*) as count FROM users WHERE role = "user"').get() as { count: number };
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const activeUsers7d = sqlite.prepare('SELECT COUNT(*) as count FROM users WHERE role = "user" AND last_active_date >= ?').get(sevenDaysAgo) as { count: number };
    const courseCount = sqlite.prepare('SELECT COUNT(*) as count FROM courses WHERE deleted_at IS NULL').get() as { count: number };
    const lessonCount = sqlite.prepare('SELECT COUNT(*) as count FROM lessons WHERE deleted_at IS NULL').get() as { count: number };
    const exerciseCount = sqlite.prepare('SELECT COUNT(*) as count FROM exercises').get() as { count: number };
    const submissionCount = sqlite.prepare('SELECT COUNT(*) as count FROM submissions').get() as { count: number };
    const avgQuizRow = sqlite.prepare('SELECT AVG(quiz_score) as avgScore FROM lesson_progress WHERE quiz_score IS NOT NULL').get() as { avgScore: number | null };

    // Top frequent errors from submissions
    const subRows = sqlite.prepare('SELECT errors FROM submissions WHERE passed = 0 ORDER BY created_at DESC LIMIT 200').all() as { errors: string }[];
    const errorCounts: Record<string, number> = {};
    for (const row of subRows) {
      try {
        const errs: string[] = JSON.parse(row.errors || '[]');
        for (const err of errs) {
          const clean = err.split(':')[0].trim().slice(0, 50) || 'SyntaxError';
          errorCounts[clean] = (errorCounts[clean] || 0) + 1;
        }
      } catch {}
    }
    const frequentErrors = Object.entries(errorCounts)
      .map(([concept, count]) => ({ concept, errorCount: count }))
      .sort((a, b) => b.errorCount - a.errorCount)
      .slice(0, 6);

    const logs = sqlite.prepare(`
      SELECT a.*, u.name as userName 
      FROM audit_logs a 
      LEFT JOIN users u ON a.user_id = u.id 
      ORDER BY a.created_at DESC 
      LIMIT 10
    `).all() as Array<{
      id: string;
      action: string;
      target_type: string;
      userName: string | null;
      created_at: string;
      details: string;
    }>;

    return {
      totalUsers: userCount?.count || 0,
      activeUsers7d: activeUsers7d?.count || 0,
      totalCourses: courseCount?.count || 0,
      totalLessons: lessonCount?.count || 0,
      totalExercises: exerciseCount?.count || 0,
      totalSubmissions: submissionCount?.count || 0,
      avgQuizScore: avgQuizRow?.avgScore ? Math.round(avgQuizRow.avgScore) : 0,
      frequentErrors,
      recentActivity: logs.map(l => ({
        id: l.id,
        action: l.action,
        targetType: l.target_type,
        userName: l.userName || 'Tizim',
        createdAt: l.created_at,
        details: l.details,
      })),
    };
  },

  // ==========================================
  // COURSES MANAGEMENT
  // ==========================================
  getCourses: (actorUser: User, filters?: { status?: string; search?: string }): Course[] => {
    let list = db.select().from(schema.courses)
      .where(isNull(schema.courses.deletedAt))
      .orderBy(asc(schema.courses.order))
      .all();

    // Instructor filter: can only see their own courses
    if (actorUser.role === 'instructor') {
      list = list.filter(c => c.instructorId === actorUser.id);
    }

    if (filters?.status && filters.status !== 'all') {
      list = list.filter(c => c.status === filters.status);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.slug.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q)
      );
    }

    return list.map(mapDbCourse);
  },

  getCourseById: (id: string, actorUser: User): (Course & { modules: (Module & { lessons: Lesson[] })[] }) | null => {
    const c = db.select().from(schema.courses)
      .where(and(eq(schema.courses.id, id), isNull(schema.courses.deletedAt)))
      .get();
    if (!c) return null;

    const course = mapDbCourse(c);
    if (!canEditCourse(actorUser, course)) {
      throw new Error('Ruxsat etilmagan: Siz bu kursni ko‘rish yoki tahrirlash huquqiga ega emassiz.');
    }

    // Get modules and nested lessons
    const dbMods = db.select().from(schema.modules)
      .where(and(eq(schema.modules.courseId, id), isNull(schema.modules.deletedAt)))
      .orderBy(asc(schema.modules.order))
      .all();

    const dbLessons = db.select().from(schema.lessons)
      .where(and(eq(schema.lessons.courseId, id), isNull(schema.lessons.deletedAt)))
      .orderBy(asc(schema.lessons.order))
      .all();

    const lessonsByModule = new Map<string, Lesson[]>();
    for (const l of dbLessons) {
      const mapped = mapDbLesson(l);
      if (!lessonsByModule.has(l.moduleId)) {
        lessonsByModule.set(l.moduleId, []);
      }
      lessonsByModule.get(l.moduleId)!.push(mapped);
    }

    const modules = dbMods.map(m => ({
      ...mapDbModule(m),
      lessons: lessonsByModule.get(m.id) || [],
    }));

    return {
      ...course,
      modules,
    };
  },

  createCourse: async (
    data: {
      title: string;
      slug?: string;
      description: string;
      shortDescription: string;
      level?: Course['level'];
      category?: Course['category'];
      thumbnail?: string;
      estimatedHours?: number;
      technologies?: string[];
      instructorId?: string;
      status?: ContentStatus;
    },
    actorUser: User
  ): Promise<Course> => {
    // Generate clean slug if not provided
    const baseSlug = (data.slug || data.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check slug uniqueness
    const existing = db.select().from(schema.courses)
      .where(and(eq(schema.courses.slug, baseSlug), isNull(schema.courses.deletedAt)))
      .get();
    if (existing) {
      throw new Error(`Ushbu slug ("${baseSlug}") bilan kurs allaqachon mavjud. Boshqa nom yoki slug tanlang.`);
    }

    const now = new Date().toISOString();
    const id = crypto.randomUUID();

    // Determine instructorId
    let instructorId: string | null = actorUser.id;
    if (actorUser.role === 'admin' || actorUser.role === 'superadmin') {
      instructorId = data.instructorId || actorUser.id;
    }

    // Role check for initial status
    let status: ContentStatus = 'draft';
    if (data.status) {
      if ((data.status === 'published' || data.status === 'archived') && !canPublish(actorUser)) {
        status = 'review';
      } else {
        status = data.status;
      }
    }

    // Max order
    const maxOrderRow = sqlite.prepare('SELECT MAX("order") as maxOrder FROM courses WHERE deleted_at IS NULL').get() as { maxOrder: number | null };
    const nextOrder = (maxOrderRow?.maxOrder || 0) + 1;

    const newCourse = {
      id,
      instructorId,
      title: sanitizeContent(data.title.trim()),
      slug: baseSlug,
      description: sanitizeContent(data.description.trim()),
      shortDescription: sanitizeContent(data.shortDescription.trim()),
      level: data.level || 'boshlangich',
      category: data.category || 'frontend',
      thumbnail: data.thumbnail?.trim() || '📘',
      estimatedHours: data.estimatedHours || 10,
      published: status === 'published' ? 1 : 0,
      status,
      deletedAt: null,
      order: nextOrder,
      technologies: JSON.stringify(data.technologies || []),
      createdAt: now,
      updatedAt: now,
    };

    db.insert(schema.courses).values(newCourse).run();

    await logAudit({
      userId: actorUser.id,
      action: 'create',
      targetType: 'course',
      targetId: id,
      details: { title: newCourse.title, slug: newCourse.slug, status },
    });

    return mapDbCourse(newCourse);
  },

  updateCourse: async (
    id: string,
    data: {
      title?: string;
      slug?: string;
      description?: string;
      shortDescription?: string;
      level?: Course['level'];
      category?: Course['category'];
      thumbnail?: string;
      estimatedHours?: number;
      technologies?: string[];
      instructorId?: string;
      status?: ContentStatus;
    },
    actorUser: User
  ): Promise<Course> => {
    const existing = db.select().from(schema.courses).where(eq(schema.courses.id, id)).get();
    if (!existing || existing.deletedAt) {
      throw new Error('Kurs topilmadi');
    }

    const course = mapDbCourse(existing);
    if (!canEditCourse(actorUser, course)) {
      throw new Error('Ruxsat etilmagan: Siz faqat o‘zingiz yaratgan kurslarni tahrirlashingiz mumkin');
    }

    // Slug validation if changed
    let updatedSlug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      const cleanSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const slugConflict = db.select().from(schema.courses)
        .where(and(eq(schema.courses.slug, cleanSlug), sql`id != ${id}`, isNull(schema.courses.deletedAt)))
        .get();
      if (slugConflict) {
        throw new Error(`Ushbu slug ("${cleanSlug}") boshqa kursda ishlatilmoqda`);
      }
      updatedSlug = cleanSlug;
    }

    // Status changes check
    let updatedStatus = existing.status as ContentStatus;
    if (data.status && data.status !== existing.status) {
      if ((data.status === 'published' || data.status === 'archived') && !canPublish(actorUser)) {
        throw new Error('Faqat Admin va Super Admin kursni nashr qilishi yoki arxivlashi mumkin. O‘qituvchi faqat review ga yuborishi mumkin.');
      }
      updatedStatus = data.status;
    }

    const now = new Date().toISOString();
    const updates = {
      title: data.title !== undefined ? sanitizeContent(data.title.trim()) : existing.title,
      slug: updatedSlug,
      description: data.description !== undefined ? sanitizeContent(data.description.trim()) : existing.description,
      shortDescription: data.shortDescription !== undefined ? sanitizeContent(data.shortDescription.trim()) : existing.shortDescription,
      level: data.level || existing.level,
      category: data.category || existing.category,
      thumbnail: data.thumbnail !== undefined ? data.thumbnail.trim() : existing.thumbnail,
      estimatedHours: data.estimatedHours !== undefined ? data.estimatedHours : existing.estimatedHours,
      technologies: data.technologies !== undefined ? JSON.stringify(data.technologies) : existing.technologies,
      instructorId: (actorUser.role === 'admin' || actorUser.role === 'superadmin') && data.instructorId !== undefined ? data.instructorId : existing.instructorId,
      status: updatedStatus,
      published: updatedStatus === 'published' ? 1 : 0,
      updatedAt: now,
    };

    db.update(schema.courses).set(updates).where(eq(schema.courses.id, id)).run();

    await logAudit({
      userId: actorUser.id,
      action: updatedStatus !== existing.status ? (updatedStatus === 'published' ? 'publish' : updatedStatus === 'archived' ? 'archive' : 'update') : 'update',
      targetType: 'course',
      targetId: id,
      details: { title: updates.title, status: updatedStatus },
    });

    const updated = db.select().from(schema.courses).where(eq(schema.courses.id, id)).get()!;
    return mapDbCourse(updated);
  },

  deleteCourse: async (id: string, actorUser: User): Promise<boolean> => {
    const existing = db.select().from(schema.courses).where(eq(schema.courses.id, id)).get();
    if (!existing || existing.deletedAt) return false;

    const course = mapDbCourse(existing);
    if (!canEditCourse(actorUser, course)) {
      throw new Error('Ruxsat etilmagan: Kursni o‘chirish uchun ruxsatingiz yo‘q');
    }

    const now = new Date().toISOString();
    // Soft delete: sets deletedAt
    db.update(schema.courses).set({ deletedAt: now, updatedAt: now }).where(eq(schema.courses.id, id)).run();

    await logAudit({
      userId: actorUser.id,
      action: 'delete',
      targetType: 'course',
      targetId: id,
      details: { title: existing.title },
    });

    return true;
  },

  // ==========================================
  // MODULES MANAGEMENT
  // ==========================================
  createModule: async (
    data: { courseId: string; title: string; description?: string },
    actorUser: User
  ): Promise<Module> => {
    const course = db.select().from(schema.courses).where(and(eq(schema.courses.id, data.courseId), isNull(schema.courses.deletedAt))).get();
    if (!course) throw new Error('Kurs topilmadi');

    if (!canEditCourse(actorUser, mapDbCourse(course))) {
      throw new Error('Ruxsat etilmagan: Bu kursga modul qo‘sha olmaysiz');
    }

    const maxOrderRow = sqlite.prepare('SELECT MAX("order") as maxOrder FROM modules WHERE course_id = ? AND deleted_at IS NULL').get(data.courseId) as { maxOrder: number | null };
    const nextOrder = (maxOrderRow?.maxOrder || 0) + 1;

    const id = crypto.randomUUID();
    const newMod = {
      id,
      courseId: data.courseId,
      title: sanitizeContent(data.title.trim()),
      description: sanitizeContent((data.description || '').trim()),
      order: nextOrder,
      deletedAt: null,
    };

    db.insert(schema.modules).values(newMod).run();

    await logAudit({
      userId: actorUser.id,
      action: 'create',
      targetType: 'module',
      targetId: id,
      details: { title: newMod.title, courseId: data.courseId },
    });

    return mapDbModule(newMod);
  },

  updateModule: async (
    id: string,
    data: { title?: string; description?: string; order?: number },
    actorUser: User
  ): Promise<Module> => {
    const existing = db.select().from(schema.modules).where(eq(schema.modules.id, id)).get();
    if (!existing || existing.deletedAt) throw new Error('Modul topilmadi');

    const course = db.select().from(schema.courses).where(eq(schema.courses.id, existing.courseId)).get();
    if (!course || !canEditCourse(actorUser, mapDbCourse(course))) {
      throw new Error('Ruxsat etilmagan');
    }

    const updates = {
      title: data.title !== undefined ? sanitizeContent(data.title.trim()) : existing.title,
      description: data.description !== undefined ? sanitizeContent(data.description.trim()) : existing.description,
      order: data.order !== undefined ? data.order : existing.order,
    };

    db.update(schema.modules).set(updates).where(eq(schema.modules.id, id)).run();

    await logAudit({
      userId: actorUser.id,
      action: 'update',
      targetType: 'module',
      targetId: id,
      details: updates,
    });

    return mapDbModule({ ...existing, ...updates });
  },

  reorderModules: async (courseId: string, orderedIds: string[], actorUser: User): Promise<boolean> => {
    const course = db.select().from(schema.courses).where(eq(schema.courses.id, courseId)).get();
    if (!course || !canEditCourse(actorUser, mapDbCourse(course))) {
      throw new Error('Ruxsat etilmagan');
    }

    db.transaction(() => {
      for (let i = 0; i < orderedIds.length; i++) {
        db.update(schema.modules)
          .set({ order: i + 1 })
          .where(and(eq(schema.modules.id, orderedIds[i]), eq(schema.modules.courseId, courseId)))
          .run();
      }
    });

    return true;
  },

  reorderLessons: async (moduleId: string, orderedIds: string[], actorUser: User): Promise<boolean> => {
    const mod = db.select().from(schema.modules).where(eq(schema.modules.id, moduleId)).get();
    if (!mod || mod.deletedAt) throw new Error('Modul topilmadi');

    const course = db.select().from(schema.courses).where(eq(schema.courses.id, mod.courseId)).get();
    if (!course || !canEditCourse(actorUser, mapDbCourse(course))) {
      throw new Error('Ruxsat etilmagan');
    }

    db.transaction(() => {
      for (let i = 0; i < orderedIds.length; i++) {
        db.update(schema.lessons)
          .set({ order: i + 1 })
          .where(and(eq(schema.lessons.id, orderedIds[i]), eq(schema.lessons.moduleId, moduleId)))
          .run();
      }
    });

    return true;
  },

  deleteModule: async (id: string, actorUser: User): Promise<boolean> => {
    const existing = db.select().from(schema.modules).where(eq(schema.modules.id, id)).get();
    if (!existing || existing.deletedAt) return false;

    const course = db.select().from(schema.courses).where(eq(schema.courses.id, existing.courseId)).get();
    if (!course || !canEditCourse(actorUser, mapDbCourse(course))) {
      throw new Error('Ruxsat etilmagan');
    }

    const now = new Date().toISOString();
    db.update(schema.modules).set({ deletedAt: now }).where(eq(schema.modules.id, id)).run();

    await logAudit({
      userId: actorUser.id,
      action: 'delete',
      targetType: 'module',
      targetId: id,
      details: { title: existing.title },
    });

    return true;
  },

  // ==========================================
  // LESSONS MANAGEMENT & VERSIONING
  // ==========================================
  getLessonById: (id: string, actorUser: User): (Lesson & { exercise?: Exercise; versions: ContentVersion[] }) | null => {
    const l = db.select().from(schema.lessons).where(and(eq(schema.lessons.id, id), isNull(schema.lessons.deletedAt))).get();
    if (!l) return null;

    const course = db.select().from(schema.courses).where(eq(schema.courses.id, l.courseId)).get();
    if (!course || !canEditCourse(actorUser, mapDbCourse(course))) {
      throw new Error('Ruxsat etilmagan');
    }

    const lesson = mapDbLesson(l);
    const dbEx = db.select().from(schema.exercises).where(eq(schema.exercises.lessonId, id)).get();
    const exercise = dbEx ? mapDbExercise(dbEx) : undefined;

    const dbVersions = db.select().from(schema.contentVersions)
      .where(and(eq(schema.contentVersions.contentType, 'lesson'), eq(schema.contentVersions.contentId, id)))
      .orderBy(desc(schema.contentVersions.version))
      .all();

    const versions: ContentVersion[] = dbVersions.map(v => ({
      ...v,
      contentType: v.contentType as ContentVersion['contentType'],
      changeSummary: v.changeSummary || null,
    }));

    return {
      ...lesson,
      exercise,
      versions,
    };
  },

  createLesson: async (
    data: {
      moduleId: string;
      courseId: string;
      title: string;
      slug?: string;
      description?: string;
      objectives?: string[];
      estimatedMinutes?: number;
      content?: unknown;
      status?: ContentStatus;
      exercise?: Partial<Exercise>;
    },
    actorUser: User
  ): Promise<Lesson> => {
    const course = db.select().from(schema.courses).where(and(eq(schema.courses.id, data.courseId), isNull(schema.courses.deletedAt))).get();
    if (!course) throw new Error('Kurs topilmadi');

    if (!canEditCourse(actorUser, mapDbCourse(course))) {
      throw new Error('Ruxsat etilmagan: Ushbu kursga dars qo‘sha olmaysiz');
    }

    const baseSlug = (data.slug || data.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingSlug = db.select().from(schema.lessons)
      .where(and(eq(schema.lessons.slug, baseSlug), isNull(schema.lessons.deletedAt)))
      .get();
    if (existingSlug) {
      throw new Error(`Ushbu slug ("${baseSlug}") bilan dars allaqachon mavjud.`);
    }

    const maxOrderRow = sqlite.prepare('SELECT MAX("order") as maxOrder FROM lessons WHERE module_id = ? AND deleted_at IS NULL').get(data.moduleId) as { maxOrder: number | null };
    const nextOrder = (maxOrderRow?.maxOrder || 0) + 1;

    let status: ContentStatus = 'draft';
    if (data.status) {
      if ((data.status === 'published' || data.status === 'archived') && !canPublish(actorUser)) {
        status = 'review';
      } else {
        status = data.status;
      }
    }

    const id = crypto.randomUUID();
    const sanitizedTitle = sanitizeContent(data.title.trim());
    const sanitizedDesc = sanitizeContent((data.description || '').trim());
    const sanitizedObjectives = (data.objectives || []).map(o => sanitizeContent(o.trim())).filter(Boolean);

    const defaultContent = {
      title: sanitizedTitle,
      learningObjective: sanitizedObjectives[0] || 'Dars maqsadi',
      realLifeAnalogy: 'Hayotiy misol keltirilmagan',
      theory: [{ type: 'text', content: sanitizedDesc || 'Dars nazariyasi' }],
      commonMistakes: [],
      quiz: [],
      summary: 'Dars xulosasi',
    };

    const initialContent = data.content ? sanitizeLessonContent(data.content) : defaultContent;

    const newLesson = {
      id,
      moduleId: data.moduleId,
      courseId: data.courseId,
      title: sanitizedTitle,
      slug: baseSlug,
      description: sanitizedDesc,
      objectives: JSON.stringify(sanitizedObjectives),
      estimatedMinutes: data.estimatedMinutes || 20,
      order: nextOrder,
      published: status === 'published' ? 1 : 0,
      status,
      version: 1,
      deletedAt: null,
      content: JSON.stringify(initialContent),
    };

    db.insert(schema.lessons).values(newLesson).run();

    // Create exercise if provided
    if (data.exercise) {
      const exId = crypto.randomUUID();
      db.insert(schema.exercises).values({
        id: exId,
        lessonId: id,
        title: sanitizeContent(data.exercise.title || `${sanitizedTitle} - Amaliy mashq`),
        description: sanitizeContent(data.exercise.description || 'Amaliy topshiriqni bajaring'),
        instructions: JSON.stringify(data.exercise.instructions || []),
        starterCode: data.exercise.starterCode || '',
        starterFiles: data.exercise.starterFiles ? JSON.stringify(data.exercise.starterFiles) : null,
        language: data.exercise.language || 'javascript',
        difficulty: data.exercise.difficulty || 'easy',
        testCases: JSON.stringify(data.exercise.testCases || []),
        hiddenTests: JSON.stringify(data.exercise.hiddenTests || []),
        hints: JSON.stringify(data.exercise.hints || []),
        solutionExplanation: sanitizeContent(data.exercise.solutionExplanation || 'To‘g‘ri yechim'),
        passingScore: data.exercise.passingScore || 80,
        expectedConcepts: JSON.stringify(data.exercise.expectedConcepts || []),
        xpReward: data.exercise.xpReward || 50,
      }).run();
    }

    // Save initial version 1 snapshot
    const now = new Date().toISOString();
    db.insert(schema.contentVersions).values({
      id: crypto.randomUUID(),
      contentType: 'lesson',
      contentId: id,
      version: 1,
      data: JSON.stringify({ lesson: newLesson, exercise: data.exercise || null }),
      authorId: actorUser.id,
      changeSummary: 'Dars dastlabki nusxasi yaratildi (v1)',
      createdAt: now,
    }).run();

    await logAudit({
      userId: actorUser.id,
      action: 'create',
      targetType: 'lesson',
      targetId: id,
      details: { title: sanitizedTitle, slug: baseSlug, status },
    });

    return mapDbLesson(newLesson);
  },

  updateLesson: async (
    id: string,
    data: {
      title?: string;
      slug?: string;
      description?: string;
      objectives?: string[];
      estimatedMinutes?: number;
      order?: number;
      status?: ContentStatus;
      content?: unknown;
      changeSummary?: string;
      exercise?: Partial<Exercise>;
    },
    actorUser: User
  ): Promise<Lesson> => {
    const existing = db.select().from(schema.lessons).where(eq(schema.lessons.id, id)).get();
    if (!existing || existing.deletedAt) throw new Error('Dars topilmadi');

    const course = db.select().from(schema.courses).where(eq(schema.courses.id, existing.courseId)).get();
    if (!course || !canEditCourse(actorUser, mapDbCourse(course))) {
      throw new Error('Ruxsat etilmagan: Bu darsni tahrirlay olmaysiz');
    }

    // Slug check
    let updatedSlug = existing.slug;
    if (data.slug && data.slug !== existing.slug) {
      const cleanSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const conflict = db.select().from(schema.lessons)
        .where(and(eq(schema.lessons.slug, cleanSlug), sql`id != ${id}`, isNull(schema.lessons.deletedAt)))
        .get();
      if (conflict) {
        throw new Error(`Ushbu slug ("${cleanSlug}") boshqa darsda mavjud`);
      }
      updatedSlug = cleanSlug;
    }

    // Status permission check
    let updatedStatus = (data.status || existing.status) as ContentStatus;
    if (data.status && data.status !== existing.status) {
      if ((data.status === 'published' || data.status === 'archived') && !canPublish(actorUser)) {
        throw new Error('Faqat Admin va Super Admin darsni nashr qilishi yoki arxivlashi mumkin.');
      }
      updatedStatus = data.status;
    }

    const currentVersion = existing.version || 1;
    const nextVersion = currentVersion + 1;
    const now = new Date().toISOString();

    const sanitizedTitle = data.title !== undefined ? sanitizeContent(data.title.trim()) : existing.title;
    const sanitizedDesc = data.description !== undefined ? sanitizeContent(data.description.trim()) : existing.description;
    const sanitizedObjectives = data.objectives !== undefined 
      ? JSON.stringify(data.objectives.map(o => sanitizeContent(o.trim())).filter(Boolean)) 
      : existing.objectives;

    const sanitizedContent = data.content !== undefined 
      ? JSON.stringify(sanitizeLessonContent(data.content)) 
      : existing.content;

    const lessonUpdates = {
      title: sanitizedTitle,
      slug: updatedSlug,
      description: sanitizedDesc,
      objectives: sanitizedObjectives,
      estimatedMinutes: data.estimatedMinutes !== undefined ? data.estimatedMinutes : existing.estimatedMinutes,
      order: data.order !== undefined ? data.order : existing.order,
      status: updatedStatus,
      published: updatedStatus === 'published' ? 1 : 0,
      version: nextVersion,
      content: sanitizedContent,
    };

    // Execute in transaction
    db.transaction(() => {
      // 1. Update lesson record
      db.update(schema.lessons).set(lessonUpdates).where(eq(schema.lessons.id, id)).run();

      // 2. Update or insert exercise if provided
      if (data.exercise) {
        const existingEx = db.select().from(schema.exercises).where(eq(schema.exercises.lessonId, id)).get();
        if (existingEx) {
          db.update(schema.exercises).set({
            title: data.exercise.title !== undefined ? sanitizeContent(data.exercise.title) : existingEx.title,
            description: data.exercise.description !== undefined ? sanitizeContent(data.exercise.description) : existingEx.description,
            instructions: data.exercise.instructions !== undefined ? JSON.stringify(data.exercise.instructions) : existingEx.instructions,
            starterCode: data.exercise.starterCode !== undefined ? data.exercise.starterCode : existingEx.starterCode,
            starterFiles: data.exercise.starterFiles !== undefined ? JSON.stringify(data.exercise.starterFiles) : existingEx.starterFiles,
            language: data.exercise.language || existingEx.language,
            difficulty: data.exercise.difficulty || existingEx.difficulty,
            testCases: data.exercise.testCases !== undefined ? JSON.stringify(data.exercise.testCases) : existingEx.testCases,
            hiddenTests: data.exercise.hiddenTests !== undefined ? JSON.stringify(data.exercise.hiddenTests) : existingEx.hiddenTests,
            hints: data.exercise.hints !== undefined ? JSON.stringify(data.exercise.hints) : existingEx.hints,
            solutionExplanation: data.exercise.solutionExplanation !== undefined ? sanitizeContent(data.exercise.solutionExplanation) : existingEx.solutionExplanation,
            passingScore: data.exercise.passingScore !== undefined ? data.exercise.passingScore : existingEx.passingScore,
            expectedConcepts: data.exercise.expectedConcepts !== undefined ? JSON.stringify(data.exercise.expectedConcepts) : existingEx.expectedConcepts,
            xpReward: data.exercise.xpReward !== undefined ? data.exercise.xpReward : existingEx.xpReward,
          }).where(eq(schema.exercises.id, existingEx.id)).run();
        } else {
          db.insert(schema.exercises).values({
            id: crypto.randomUUID(),
            lessonId: id,
            title: sanitizeContent(data.exercise.title || `${sanitizedTitle} - Amaliy mashq`),
            description: sanitizeContent(data.exercise.description || 'Amaliy topshiriq'),
            instructions: JSON.stringify(data.exercise.instructions || []),
            starterCode: data.exercise.starterCode || '',
            starterFiles: data.exercise.starterFiles ? JSON.stringify(data.exercise.starterFiles) : null,
            language: data.exercise.language || 'javascript',
            difficulty: data.exercise.difficulty || 'easy',
            testCases: JSON.stringify(data.exercise.testCases || []),
            hiddenTests: JSON.stringify(data.exercise.hiddenTests || []),
            hints: JSON.stringify(data.exercise.hints || []),
            solutionExplanation: sanitizeContent(data.exercise.solutionExplanation || ''),
            passingScore: data.exercise.passingScore || 80,
            expectedConcepts: JSON.stringify(data.exercise.expectedConcepts || []),
            xpReward: data.exercise.xpReward || 50,
          }).run();
        }
      }

      // 3. Create content version snapshot
      const currentEx = db.select().from(schema.exercises).where(eq(schema.exercises.lessonId, id)).get();
      const snapshot = {
        lesson: { ...existing, ...lessonUpdates },
        exercise: currentEx ? mapDbExercise(currentEx) : null,
      };

      db.insert(schema.contentVersions).values({
        id: crypto.randomUUID(),
        contentType: 'lesson',
        contentId: id,
        version: nextVersion,
        data: JSON.stringify(snapshot),
        authorId: actorUser.id,
        changeSummary: data.changeSummary?.trim() || `Versiya ${nextVersion} ga yangilandi`,
        createdAt: now,
      }).run();
    });

    await logAudit({
      userId: actorUser.id,
      action: updatedStatus !== existing.status ? (updatedStatus === 'published' ? 'publish' : updatedStatus === 'archived' ? 'archive' : 'update') : 'update',
      targetType: 'lesson',
      targetId: id,
      details: { title: sanitizedTitle, version: nextVersion, status: updatedStatus },
    });

    const updated = db.select().from(schema.lessons).where(eq(schema.lessons.id, id)).get()!;
    return mapDbLesson(updated);
  },

  deleteLesson: async (id: string, actorUser: User): Promise<boolean> => {
    const existing = db.select().from(schema.lessons).where(eq(schema.lessons.id, id)).get();
    if (!existing || existing.deletedAt) return false;

    const course = db.select().from(schema.courses).where(eq(schema.courses.id, existing.courseId)).get();
    if (!course || !canEditCourse(actorUser, mapDbCourse(course))) {
      throw new Error('Ruxsat etilmagan');
    }

    const now = new Date().toISOString();
    db.update(schema.lessons).set({ deletedAt: now }).where(eq(schema.lessons.id, id)).run();

    await logAudit({
      userId: actorUser.id,
      action: 'delete',
      targetType: 'lesson',
      targetId: id,
      details: { title: existing.title },
    });

    return true;
  },

  // ==========================================
  // PUBLISH VALIDATION & WORKFLOW
  // ==========================================
  validateLessonForPublish: (lessonId: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const lesson = db.select().from(schema.lessons).where(and(eq(schema.lessons.id, lessonId), isNull(schema.lessons.deletedAt))).get();
    if (!lesson) {
      return { valid: false, errors: ['Dars topilmadi yoki o‘chirilgan'] };
    }

    const course = db.select().from(schema.courses).where(and(eq(schema.courses.id, lesson.courseId), isNull(schema.courses.deletedAt))).get();
    if (!course) {
      errors.push('Dars biriktirilgan kurs topilmadi');
    }

    // Check course has at least 1 module
    const moduleCount = sqlite.prepare('SELECT COUNT(*) as count FROM modules WHERE course_id = ? AND deleted_at IS NULL').get(lesson.courseId) as { count: number };
    if (!moduleCount || moduleCount.count === 0) {
      errors.push('Kursda kamida 1 ta modul bo‘lishi shart');
    }

    // Validate title and slug
    if (!lesson.title || lesson.title.trim().length < 3) {
      errors.push('Dars sarlavhasi kamida 3 ta belgidan iborat bo‘lishi kerak');
    }
    if (!lesson.slug || lesson.slug.trim().length < 2) {
      errors.push('Dars slugi to‘g‘ri kiritilishi kerak');
    }

    // Validate objectives
    const objectives: string[] = JSON.parse(lesson.objectives || '[]');
    if (!objectives || objectives.length === 0) {
      errors.push('Darsda kamida 1 ta o‘quv maqsadi (objective) ko‘rsatilishi shart');
    }

    // Validate theory content
    let content: { theory?: unknown[]; quiz?: Array<{ question?: string; options?: string[]; correctAnswer?: number }> } = {};
    try {
      content = JSON.parse(lesson.content);
    } catch {
      errors.push('Dars kontent strukturasi noto‘g‘ri');
    }

    if (!content.theory || !Array.isArray(content.theory) || content.theory.length === 0) {
      errors.push('Darsda kamida 1 ta nazariya bloki (theory) bo‘lishi shart');
    }

    // Validate exercise if present
    const ex = db.select().from(schema.exercises).where(eq(schema.exercises.lessonId, lessonId)).get();
    if (ex) {
      const hasSingleCode = Boolean(ex.starterCode && ex.starterCode.trim().length > 0);
      let hasMultiCode = false;
      if (ex.starterFiles) {
        try {
          const files = JSON.parse(ex.starterFiles);
          hasMultiCode = Boolean(files['index.html'] || files['style.css'] || files['script.js']);
        } catch {}
      }

      if (!hasSingleCode && !hasMultiCode) {
        errors.push('Mashqda boshlang‘ich kod (starter code yoki starter files) kiritilishi shart');
      }

      let testCases: Array<{ description?: string; expectedOutput?: string }> = [];
      try {
        testCases = JSON.parse(ex.testCases || '[]');
      } catch {}

      if (!testCases || testCases.length === 0) {
        errors.push('Mashqda kamida 1 ta test case kiritilishi shart');
      } else {
        const invalidTest = testCases.some(tc => !tc.description || tc.expectedOutput === undefined);
        if (invalidTest) {
          errors.push('Mashq test keyslarida tavsif va kutilgan natija to‘liq bo‘lishi kerak');
        }
      }

      if (ex.passingScore < 50 || ex.passingScore > 100) {
        errors.push('Mashq o‘tish bali 50 dan 100 gacha bo‘lishi kerak');
      }
    }

    // Validate quiz if present
    if (content.quiz && Array.isArray(content.quiz) && content.quiz.length > 0) {
      for (let i = 0; i < content.quiz.length; i++) {
        const q = content.quiz[i];
        if (!q.question || q.question.trim().length < 3) {
          errors.push(`${i + 1}-test savoli matni kiritilmagan`);
        }
        if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
          errors.push(`${i + 1}-test savolida kamida 2 ta javob varianti bo‘lishi kerak`);
        }
        if (q.correctAnswer === undefined || q.correctAnswer < 0 || q.correctAnswer >= (q.options?.length || 0)) {
          errors.push(`${i + 1}-test savolida to‘g‘ri javob ko‘rsatilmagan`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },

  publishLesson: async (lessonId: string, actorUser: User): Promise<{ success: boolean; lesson?: Lesson; errors?: string[] }> => {
    if (!canPublish(actorUser)) {
      return { success: false, errors: ['Faqat Admin va Super Admin darsni nashr qilishi mumkin'] };
    }

    const validation = adminRepo.validateLessonForPublish(lessonId);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    db.update(schema.lessons)
      .set({ status: 'published', published: 1 })
      .where(eq(schema.lessons.id, lessonId))
      .run();

    await logAudit({
      userId: actorUser.id,
      action: 'publish',
      targetType: 'lesson',
      targetId: lessonId,
      details: { status: 'published' },
    });

    const updated = db.select().from(schema.lessons).where(eq(schema.lessons.id, lessonId)).get()!;
    return { success: true, lesson: mapDbLesson(updated) };
  },

  submitLessonForReview: async (lessonId: string, actorUser: User): Promise<Lesson> => {
    const l = db.select().from(schema.lessons).where(eq(schema.lessons.id, lessonId)).get();
    if (!l) throw new Error('Dars topilmadi');

    const course = db.select().from(schema.courses).where(eq(schema.courses.id, l.courseId)).get();
    if (!course || !canEditCourse(actorUser, mapDbCourse(course))) {
      throw new Error('Ruxsat etilmagan');
    }

    db.update(schema.lessons)
      .set({ status: 'review' })
      .where(eq(schema.lessons.id, lessonId))
      .run();

    await logAudit({
      userId: actorUser.id,
      action: 'review',
      targetType: 'lesson',
      targetId: lessonId,
      details: { status: 'review' },
    });

    const updated = db.select().from(schema.lessons).where(eq(schema.lessons.id, lessonId)).get()!;
    return mapDbLesson(updated);
  },

  // ==========================================
  // VERSION ROLLBACK (TRANSACTIONAL & PRESERVING)
  // ==========================================
  rollbackLessonVersion: async (lessonId: string, targetVersion: number, actorUser: User): Promise<Lesson> => {
    const currentLesson = db.select().from(schema.lessons).where(eq(schema.lessons.id, lessonId)).get();
    if (!currentLesson) throw new Error('Dars topilmadi');

    const course = db.select().from(schema.courses).where(eq(schema.courses.id, currentLesson.courseId)).get();
    if (!course || !canEditCourse(actorUser, mapDbCourse(course))) {
      throw new Error('Ruxsat etilmagan');
    }

    // Find target version snapshot
    const targetSnapshotRecord = db.select().from(schema.contentVersions)
      .where(and(
        eq(schema.contentVersions.contentType, 'lesson'),
        eq(schema.contentVersions.contentId, lessonId),
        eq(schema.contentVersions.version, targetVersion)
      ))
      .get();

    if (!targetSnapshotRecord) {
      throw new Error(`Belgilangan versiya (${targetVersion}) topilmadi`);
    }

    let parsedSnapshot: { 
      lesson: { title: string; description: string; objectives: string; content: string; estimatedMinutes: number }; 
      exercise?: Partial<Exercise>;
    };
    try {
      parsedSnapshot = JSON.parse(targetSnapshotRecord.data);
    } catch {
      throw new Error('Versiya ma’lumoti buzilgan');
    }

    const currentVer = currentLesson.version || 1;
    const newVersionNumber = currentVer + 1;
    const now = new Date().toISOString();

    db.transaction(() => {
      // 1. Restore lesson fields with new version number
      db.update(schema.lessons).set({
        title: parsedSnapshot.lesson.title,
        description: parsedSnapshot.lesson.description,
        objectives: parsedSnapshot.lesson.objectives,
        content: parsedSnapshot.lesson.content,
        estimatedMinutes: parsedSnapshot.lesson.estimatedMinutes,
        version: newVersionNumber,
      }).where(eq(schema.lessons.id, lessonId)).run();

      // 2. Restore exercise if was in snapshot
      if (parsedSnapshot.exercise) {
        const existingEx = db.select().from(schema.exercises).where(eq(schema.exercises.lessonId, lessonId)).get();
        if (existingEx) {
          db.update(schema.exercises).set({
            title: parsedSnapshot.exercise.title,
            description: parsedSnapshot.exercise.description,
            instructions: JSON.stringify(parsedSnapshot.exercise.instructions || []),
            starterCode: parsedSnapshot.exercise.starterCode || '',
            starterFiles: parsedSnapshot.exercise.starterFiles ? JSON.stringify(parsedSnapshot.exercise.starterFiles) : null,
            language: parsedSnapshot.exercise.language || 'javascript',
            difficulty: parsedSnapshot.exercise.difficulty || 'easy',
            testCases: JSON.stringify(parsedSnapshot.exercise.testCases || []),
            hiddenTests: JSON.stringify(parsedSnapshot.exercise.hiddenTests || []),
            hints: JSON.stringify(parsedSnapshot.exercise.hints || []),
            solutionExplanation: parsedSnapshot.exercise.solutionExplanation || '',
            passingScore: parsedSnapshot.exercise.passingScore || 80,
            xpReward: parsedSnapshot.exercise.xpReward || 50,
          }).where(eq(schema.exercises.id, existingEx.id)).run();
        }
      }

      // 3. Save as a NEW version snapshot
      db.insert(schema.contentVersions).values({
        id: crypto.randomUUID(),
        contentType: 'lesson',
        contentId: lessonId,
        version: newVersionNumber,
        data: targetSnapshotRecord.data,
        authorId: actorUser.id,
        changeSummary: `Versiya ${targetVersion} dan tiklandi (Rollback)`,
        createdAt: now,
      }).run();
    });

    await logAudit({
      userId: actorUser.id,
      action: 'rollback',
      targetType: 'lesson',
      targetId: lessonId,
      details: { restoredFromVersion: targetVersion, newVersion: newVersionNumber },
    });

    const updated = db.select().from(schema.lessons).where(eq(schema.lessons.id, lessonId)).get()!;
    return mapDbLesson(updated);
  },

  // ==========================================
  // SUPER ADMIN USER & ROLE MANAGEMENT
  // ==========================================
  getUsers: (
    actorUser: User,
    filters?: { search?: string; role?: string; limit?: number; offset?: number }
  ): { users: User[]; total: number } => {
    if (actorUser.role !== 'superadmin' && actorUser.role !== 'admin') {
      throw new Error('Ruxsat etilmagan');
    }

    let allUsers = db.select().from(schema.users).orderBy(desc(schema.users.createdAt)).all();

    if (filters?.role && filters.role !== 'all') {
      allUsers = allUsers.filter(u => u.role === filters.role);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      allUsers = allUsers.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    const total = allUsers.length;
    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;
    const paginated = allUsers.slice(offset, offset + limit);

    return {
      users: paginated.map(u => ({
        ...u,
        role: u.role as UserRole,
        onboardingCompleted: Boolean(u.onboardingCompleted),
      })),
      total,
    };
  },

  updateUserRole: async (targetUserId: string, newRole: UserRole, actorUser: User): Promise<User> => {
    if (actorUser.role !== 'superadmin') {
      throw new Error('Foydalanuvchi rolini o‘zgartirish huquqi faqat Super Admin uchun ruxsat etilgan!');
    }

    const validRoles: UserRole[] = ['user', 'instructor', 'admin', 'superadmin'];
    if (!validRoles.includes(newRole)) {
      throw new Error('Noto‘g‘ri rol berildi');
    }

    const targetUser = db.select().from(schema.users).where(eq(schema.users.id, targetUserId)).get();
    if (!targetUser) throw new Error('Foydalanuvchi topilmadi');

    // Prevent demoting the last superadmin
    if (targetUser.role === 'superadmin' && newRole !== 'superadmin') {
      const superadminCount = sqlite.prepare('SELECT COUNT(*) as count FROM users WHERE role = "superadmin"').get() as { count: number };
      if (superadminCount.count <= 1) {
        throw new Error('Tizimdagi yagona Super Admin rolini pasaytirish mumkin emas!');
      }
    }

    const now = new Date().toISOString();
    db.update(schema.users).set({ role: newRole, updatedAt: now }).where(eq(schema.users.id, targetUserId)).run();

    await logAudit({
      userId: actorUser.id,
      action: 'role_change',
      targetType: 'user',
      targetId: targetUserId,
      details: { oldRole: targetUser.role, newRole, userEmail: targetUser.email },
    });

    const updated = db.select().from(schema.users).where(eq(schema.users.id, targetUserId)).get()!;
    return {
      ...updated,
      role: updated.role as UserRole,
      onboardingCompleted: Boolean(updated.onboardingCompleted),
    };
  },

  // ==========================================
  // AUDIT LOGS
  // ==========================================
  getAuditLogs: (
    actorUser: User,
    filters?: { limit?: number; offset?: number; targetType?: string; action?: string; userId?: string }
  ): { logs: AuditLog[]; total: number } => {
    if (actorUser.role !== 'superadmin' && actorUser.role !== 'admin') {
      throw new Error('Faqat Admin va Super Admin audit loglarini ko‘ra oladi');
    }

    let sqlQuery = `
      SELECT a.*, u.name as userName, u.email as userEmail, u.role as userRole
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params: Array<string | number> = [];

    if (filters?.targetType) {
      sqlQuery += ` AND a.target_type = ?`;
      params.push(filters.targetType);
    }
    if (filters?.action) {
      sqlQuery += ` AND a.action = ?`;
      params.push(filters.action);
    }
    if (filters?.userId) {
      sqlQuery += ` AND a.user_id = ?`;
      params.push(filters.userId);
    }

    const countRow = sqlite.prepare(`SELECT COUNT(*) as count FROM (${sqlQuery})`).get(...params) as { count: number };
    const total = countRow?.count || 0;

    sqlQuery += ` ORDER BY a.created_at DESC LIMIT ? OFFSET ?`;
    const limit = filters?.limit || 50;
    const offset = filters?.offset || 0;
    params.push(limit, offset);

    const rows = sqlite.prepare(sqlQuery).all(...params) as Array<{
      id: string;
      user_id: string;
      action: string;
      target_type: string;
      target_id: string;
      details: string;
      ip_address: string | null;
      created_at: string;
      userName: string | null;
      userEmail: string | null;
      userRole: string | null;
    }>;

    const logs: AuditLog[] = rows.map(r => ({
      id: r.id,
      userId: r.user_id,
      userName: r.userName || undefined,
      userEmail: r.userEmail || undefined,
      userRole: (r.userRole as UserRole) || undefined,
      action: r.action as AuditLog['action'],
      targetType: r.target_type as AuditLog['targetType'],
      targetId: r.target_id,
      details: r.details,
      ipAddress: r.ip_address,
      createdAt: r.created_at,
    }));

    return { logs, total };
  },
};
