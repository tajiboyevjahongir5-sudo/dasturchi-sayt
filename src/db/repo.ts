import { db, schema } from './index';
import { eq, and, desc, asc, isNull } from 'drizzle-orm';
import type { 
  User, 
  UserProfile, 
  Course, 
  Module, 
  Lesson, 
  Exercise, 
  Submission, 
  LessonProgress, 
  Achievement,
  CourseProgress,
  UserProject
} from '@/types';

// ==========================================
// USER REPOSITORY
// ==========================================
export const userRepo = {
  findById: (id: string): User | null => {
    const res = db.select().from(schema.users).where(eq(schema.users.id, id)).get();
    if (!res) return null;
    return {
      ...res,
      role: res.role as User['role'],
      onboardingCompleted: Boolean(res.onboardingCompleted),
    };
  },

  findByEmail: (email: string): User | null => {
    const res = db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase().trim())).get();
    if (!res) return null;
    return {
      ...res,
      role: res.role as User['role'],
      onboardingCompleted: Boolean(res.onboardingCompleted),
    };
  },

  create: (data: { id: string; name: string; email: string; passwordHash: string; avatarUrl?: string; role?: User['role'] }): User => {
    const now = new Date().toISOString();
    const role = data.role || 'user';
    const newUser = {
      id: data.id,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      avatarUrl: data.avatarUrl || null,
      role,
      level: 1,
      xp: 0,
      streak: 1,
      lastActiveDate: now.split('T')[0],
      onboardingCompleted: 0,
      createdAt: now,
      updatedAt: now,
    };
    db.insert(schema.users).values(newUser).run();
    return {
      ...newUser,
      role,
      onboardingCompleted: false,
    };
  },

  updateRole: (userId: string, newRole: User['role']): User | null => {
    const now = new Date().toISOString();
    db.update(schema.users)
      .set({ role: newRole, updatedAt: now })
      .where(eq(schema.users.id, userId))
      .run();
    return userRepo.findById(userId);
  },

  updateStats: (id: string, updates: { xp?: number; level?: number; streak?: number; lastActiveDate?: string }): void => {
    const user = db.select().from(schema.users).where(eq(schema.users.id, id)).get();
    if (!user) return;

    const newXp = updates.xp !== undefined ? user.xp + updates.xp : user.xp;
    // Calculate new level if XP changed
    const newLevel = Math.max(1, Math.floor(newXp / 250) + 1);

    db.update(schema.users)
      .set({
        xp: newXp,
        level: newLevel,
        streak: updates.streak !== undefined ? updates.streak : user.streak,
        lastActiveDate: updates.lastActiveDate || user.lastActiveDate,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.users.id, id))
      .run();
  },

  updateOnboarding: (id: string, completed: boolean): void => {
    db.update(schema.users)
      .set({
        onboardingCompleted: completed ? 1 : 0,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.users.id, id))
      .run();
  },

  saveProfile: (data: UserProfile): void => {
    const existing = db.select().from(schema.profiles).where(eq(schema.profiles.userId, data.userId)).get();
    if (existing) {
      db.update(schema.profiles)
        .set({
          skillLevel: data.skillLevel,
          goals: JSON.stringify(data.goals),
          weeklyHours: data.weeklyHours,
          preferredLanguage: data.preferredLanguage,
        })
        .where(eq(schema.profiles.userId, data.userId))
        .run();
    } else {
      db.insert(schema.profiles).values({
        userId: data.userId,
        skillLevel: data.skillLevel,
        goals: JSON.stringify(data.goals),
        weeklyHours: data.weeklyHours,
        preferredLanguage: data.preferredLanguage,
      }).run();
    }
  },

  getProfile: (userId: string): UserProfile | null => {
    const p = db.select().from(schema.profiles).where(eq(schema.profiles.userId, userId)).get();
    if (!p) return null;
    return {
      userId: p.userId,
      skillLevel: p.skillLevel as UserProfile['skillLevel'],
      goals: JSON.parse(p.goals),
      weeklyHours: p.weeklyHours,
      preferredLanguage: p.preferredLanguage,
    };
  }
};

// ==========================================
// COURSE & LESSON REPOSITORY
// ==========================================
export const courseRepo = {
  getAll: (options?: { includeAll?: boolean }): Course[] => {
    const list = db.select().from(schema.courses)
      .where(options?.includeAll ? undefined : and(isNull(schema.courses.deletedAt), eq(schema.courses.status, 'published')))
      .orderBy(asc(schema.courses.order))
      .all();
    return list.map(c => ({
      ...c,
      level: c.level as Course['level'],
      category: c.category as Course['category'],
      published: Boolean(c.published),
      status: (c.status || 'published') as Course['status'],
      technologies: JSON.parse(c.technologies || '[]'),
    }));
  },

  findBySlug: (slug: string, options?: { includeAll?: boolean }): Course | null => {
    const c = db.select().from(schema.courses).where(eq(schema.courses.slug, slug)).get();
    if (!c) return null;
    if (!options?.includeAll && (c.deletedAt || c.status !== 'published')) return null;
    return {
      ...c,
      level: c.level as Course['level'],
      category: c.category as Course['category'],
      published: Boolean(c.published),
      status: (c.status || 'published') as Course['status'],
      technologies: JSON.parse(c.technologies || '[]'),
    };
  },

  getModules: (courseId: string, options?: { includeAll?: boolean }): Module[] => {
    return db.select().from(schema.modules)
      .where(options?.includeAll 
        ? eq(schema.modules.courseId, courseId) 
        : and(eq(schema.modules.courseId, courseId), isNull(schema.modules.deletedAt)))
      .orderBy(asc(schema.modules.order))
      .all()
      .map(m => ({ ...m, deletedAt: m.deletedAt || null }));
  },

  getLessonsByCourse: (courseId: string, options?: { includeAll?: boolean }): Lesson[] => {
    const list = db.select().from(schema.lessons)
      .where(options?.includeAll
        ? eq(schema.lessons.courseId, courseId)
        : and(
            eq(schema.lessons.courseId, courseId),
            isNull(schema.lessons.deletedAt),
            eq(schema.lessons.status, 'published')
          ))
      .orderBy(asc(schema.lessons.order))
      .all();
    return list.map(l => ({
      ...l,
      published: Boolean(l.published),
      status: (l.status || 'published') as Lesson['status'],
      version: l.version || 1,
      deletedAt: l.deletedAt || null,
      objectives: JSON.parse(l.objectives || '[]'),
      content: JSON.parse(l.content),
    }));
  },

  getLessonsByModule: (moduleId: string, options?: { includeAll?: boolean }): Lesson[] => {
    const list = db.select().from(schema.lessons)
      .where(options?.includeAll
        ? eq(schema.lessons.moduleId, moduleId)
        : and(
            eq(schema.lessons.moduleId, moduleId),
            isNull(schema.lessons.deletedAt),
            eq(schema.lessons.status, 'published')
          ))
      .orderBy(asc(schema.lessons.order))
      .all();
    return list.map(l => ({
      ...l,
      published: Boolean(l.published),
      status: (l.status || 'published') as Lesson['status'],
      version: l.version || 1,
      deletedAt: l.deletedAt || null,
      objectives: JSON.parse(l.objectives || '[]'),
      content: JSON.parse(l.content),
    }));
  },

  getLessonBySlug: (slug: string, options?: { includeAll?: boolean }): Lesson | null => {
    const l = db.select().from(schema.lessons).where(eq(schema.lessons.slug, slug)).get();
    if (!l) return null;
    if (!options?.includeAll && (l.deletedAt || l.status !== 'published')) return null;
    return {
      ...l,
      published: Boolean(l.published),
      status: (l.status || 'published') as Lesson['status'],
      version: l.version || 1,
      deletedAt: l.deletedAt || null,
      objectives: JSON.parse(l.objectives || '[]'),
      content: JSON.parse(l.content),
    };
  },

  getExerciseByLesson: (lessonId: string): Exercise | null => {
    const e = db.select().from(schema.exercises).where(eq(schema.exercises.lessonId, lessonId)).get();
    if (!e) return null;
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
    };
  }
};

// ==========================================
// PROGRESS REPOSITORY
// ==========================================
export const progressRepo = {
  getUserLessonProgress: (userId: string, lessonId: string): LessonProgress | null => {
    const p = db.select().from(schema.lessonProgress)
      .where(and(eq(schema.lessonProgress.userId, userId), eq(schema.lessonProgress.lessonId, lessonId)))
      .get();
    if (!p) return null;
    return {
      ...p,
      status: p.status as LessonProgress['status'],
    };
  },

  getAllUserProgress: (userId: string): LessonProgress[] => {
    const list = db.select().from(schema.lessonProgress)
      .where(eq(schema.lessonProgress.userId, userId))
      .all();
    return list.map(p => ({
      ...p,
      status: p.status as LessonProgress['status'],
    }));
  },

  saveLessonProgress: (data: {
    userId: string;
    lessonId: string;
    courseId: string;
    status: 'in-progress' | 'completed';
    quizScore?: number;
    exerciseScore?: number;
  }): void => {
    const now = new Date().toISOString();
    const existing = db.select().from(schema.lessonProgress)
      .where(and(eq(schema.lessonProgress.userId, data.userId), eq(schema.lessonProgress.lessonId, data.lessonId)))
      .get();

    if (existing) {
      db.update(schema.lessonProgress)
        .set({
          status: data.status,
          quizScore: data.quizScore !== undefined ? data.quizScore : existing.quizScore,
          exerciseScore: data.exerciseScore !== undefined ? data.exerciseScore : existing.exerciseScore,
          completedAt: data.status === 'completed' ? (existing.completedAt || now) : existing.completedAt,
          updatedAt: now,
        })
        .where(eq(schema.lessonProgress.id, existing.id))
        .run();
    } else {
      db.insert(schema.lessonProgress).values({
        id: crypto.randomUUID(),
        userId: data.userId,
        lessonId: data.lessonId,
        courseId: data.courseId,
        status: data.status,
        quizScore: data.quizScore ?? null,
        exerciseScore: data.exerciseScore ?? null,
        completedAt: data.status === 'completed' ? now : null,
        createdAt: now,
        updatedAt: now,
      }).run();
    }
  },

  getCourseProgress: (userId: string, courseId: string): CourseProgress => {
    const course = db.select().from(schema.courses).where(eq(schema.courses.id, courseId)).get();
    const allLessons = db.select().from(schema.lessons).where(eq(schema.lessons.courseId, courseId)).orderBy(asc(schema.lessons.order)).all();
    const completedProgress = db.select().from(schema.lessonProgress)
      .where(and(
        eq(schema.lessonProgress.userId, userId),
        eq(schema.lessonProgress.courseId, courseId),
        eq(schema.lessonProgress.status, 'completed')
      ))
      .all();

    const completedLessonIds = new Set(completedProgress.map(p => p.lessonId));
    let nextLesson = allLessons.find(l => !completedLessonIds.has(l.id));
    if (!nextLesson && allLessons.length > 0) {
      nextLesson = allLessons[0];
    }

    const percentage = allLessons.length > 0 ? Math.round((completedProgress.length / allLessons.length) * 100) : 0;

    return {
      courseId,
      courseTitle: course?.title || '',
      courseSlug: course?.slug || '',
      totalLessons: allLessons.length,
      completedLessons: completedProgress.length,
      percentage,
      currentLessonSlug: nextLesson ? nextLesson.slug : null,
      currentLessonTitle: nextLesson ? nextLesson.title : null,
    };
  },

  recordSubmission: (data: {
    userId: string;
    exerciseId: string;
    code: string;
    score: number;
    passed: boolean;
    errors: string[];
    testResults: unknown[];
    attempts: number;
    hintsUsed: number;
    timeSpent: number;
    pasteCount: number;
    keystrokeCount: number;
  }): void => {
    db.insert(schema.submissions).values({
      id: crypto.randomUUID(),
      userId: data.userId,
      exerciseId: data.exerciseId,
      code: data.code,
      score: data.score,
      passed: data.passed ? 1 : 0,
      errors: JSON.stringify(data.errors),
      testResults: JSON.stringify(data.testResults),
      attempts: data.attempts,
      hintsUsed: data.hintsUsed,
      timeSpent: data.timeSpent,
      pasteCount: data.pasteCount,
      keystrokeCount: data.keystrokeCount,
      createdAt: new Date().toISOString(),
    }).run();
  },

  getUserSubmissions: (userId: string, exerciseId: string): Submission[] => {
    const list = db.select().from(schema.submissions)
      .where(and(eq(schema.submissions.userId, userId), eq(schema.submissions.exerciseId, exerciseId)))
      .orderBy(desc(schema.submissions.createdAt))
      .all();

    return list.map(s => ({
      ...s,
      passed: Boolean(s.passed),
      errors: JSON.parse(s.errors || '[]'),
      testResults: JSON.parse(s.testResults || '[]'),
    }));
  }
};

// ==========================================
// ACHIEVEMENTS REPOSITORY
// ==========================================
export const achievementRepo = {
  getAll: (): Achievement[] => {
    const list = db.select().from(schema.achievements).all();
    return list.map(a => ({
      ...a,
      category: a.category as Achievement['category'],
    }));
  },

  getUserAchievements: (userId: string): (Achievement & { unlockedAt: string })[] => {
    const uas = db.select().from(schema.userAchievements).where(eq(schema.userAchievements.userId, userId)).all();
    const allAchievements = achievementRepo.getAll();
    const achMap = new Map(allAchievements.map(a => [a.id, a]));

    return uas
      .map(ua => {
        const ach = achMap.get(ua.achievementId);
        if (!ach) return null;
        return {
          ...ach,
          unlockedAt: ua.unlockedAt,
        };
      })
      .filter((x): x is Achievement & { unlockedAt: string } => x !== null);
  },

  unlock: (userId: string, achievementId: string): boolean => {
    const exists = db.select().from(schema.userAchievements)
      .where(and(eq(schema.userAchievements.userId, userId), eq(schema.userAchievements.achievementId, achievementId)))
      .get();
    if (exists) return false;

    db.insert(schema.userAchievements).values({
      id: crypto.randomUUID(),
      userId,
      achievementId,
      unlockedAt: new Date().toISOString(),
    }).run();

    // Reward XP
    const ach = db.select().from(schema.achievements).where(eq(schema.achievements.id, achievementId)).get();
    if (ach) {
      userRepo.updateStats(userId, { xp: ach.xpReward });
    }
    return true;
  }
};

// ==========================================
// USER PROJECTS REPOSITORY (MULTI-FILE WORKSPACE)
// ==========================================
export const projectRepo = {
  getUserProjects: (userId: string): UserProject[] => {
    return db.select().from(schema.userProjects)
      .where(eq(schema.userProjects.userId, userId))
      .orderBy(desc(schema.userProjects.updatedAt))
      .all();
  },

  countUserProjects: (userId: string): number => {
    const list = db.select({ id: schema.userProjects.id })
      .from(schema.userProjects)
      .where(eq(schema.userProjects.userId, userId))
      .all();
    return list.length;
  },

  getProjectById: (id: string, userId: string): UserProject | null => {
    const p = db.select().from(schema.userProjects)
      .where(and(eq(schema.userProjects.id, id), eq(schema.userProjects.userId, userId)))
      .get();
    return p || null;
  },

  createProject: (data: {
    userId: string;
    title: string;
    description?: string;
    html?: string;
    css?: string;
    js?: string;
  }): UserProject => {
    const MAX_PROJECTS_PER_USER = 20;
    const count = projectRepo.countUserProjects(data.userId);
    if (count >= MAX_PROJECTS_PER_USER) {
      throw new Error(`Siz bitta hisob uchun ruxsat etilgan maksimal (${MAX_PROJECTS_PER_USER} ta) loyihalar soniga yetdingiz. Yangi loyiha yaratish uchun keraksiz loyihalardan birini o‘chiring.`);
    }

    const MAX_FILE_SIZE = 200 * 1024; // 200 KB per file limit
    const html = data.html !== undefined ? data.html : '<h1>Salom, Dunyo!</h1>\n<p>CodeQuest Multi-file Workspace</p>';
    const css = data.css !== undefined ? data.css : 'body {\n  font-family: sans-serif;\n  padding: 24px;\n  color: #1e293b;\n}\nh1 {\n  color: #2563eb;\n}';
    const js = data.js !== undefined ? data.js : 'console.log("Multi-file Web loyihasi ishga tushdi! 🚀");';

    if (html.length > MAX_FILE_SIZE || css.length > MAX_FILE_SIZE || js.length > MAX_FILE_SIZE) {
      throw new Error('Fayl hajmi 200 KB dan oshmasligi kerak.');
    }

    const now = new Date().toISOString();
    const newProject: UserProject = {
      id: crypto.randomUUID(),
      userId: data.userId,
      title: (data.title || 'Mening Yangi Loyiham').trim().slice(0, 100),
      description: (data.description || '').trim().slice(0, 500),
      html,
      css,
      js,
      createdAt: now,
      updatedAt: now,
    };

    db.insert(schema.userProjects).values(newProject).run();
    return newProject;
  },

  updateProject: (
    id: string,
    userId: string,
    data: {
      title?: string;
      description?: string;
      html?: string;
      css?: string;
      js?: string;
    }
  ): UserProject | null => {
    const existing = projectRepo.getProjectById(id, userId);
    if (!existing) return null;

    const MAX_FILE_SIZE = 200 * 1024; // 200 KB per file
    if (
      (data.html && data.html.length > MAX_FILE_SIZE) ||
      (data.css && data.css.length > MAX_FILE_SIZE) ||
      (data.js && data.js.length > MAX_FILE_SIZE)
    ) {
      throw new Error('Fayl hajmi 200 KB dan oshmasligi kerak.');
    }

    const now = new Date().toISOString();
    const updated = {
      title: data.title !== undefined ? data.title.trim().slice(0, 100) : existing.title,
      description: data.description !== undefined ? data.description.trim().slice(0, 500) : existing.description,
      html: data.html !== undefined ? data.html : existing.html,
      css: data.css !== undefined ? data.css : existing.css,
      js: data.js !== undefined ? data.js : existing.js,
      updatedAt: now,
    };

    db.update(schema.userProjects)
      .set(updated)
      .where(and(eq(schema.userProjects.id, id), eq(schema.userProjects.userId, userId)))
      .run();

    return {
      ...existing,
      ...updated,
    };
  },

  deleteProject: (id: string, userId: string): boolean => {
    const existing = projectRepo.getProjectById(id, userId);
    if (!existing) return false;

    db.delete(schema.userProjects)
      .where(and(eq(schema.userProjects.id, id), eq(schema.userProjects.userId, userId)))
      .run();
    return true;
  }
};

export { adminRepo } from './adminRepo';

