import { db, schema } from './index';
import { eq } from 'drizzle-orm';
import { SEED_COURSES, SEED_MODULES, SEED_ACHIEVEMENTS } from './seed-data';
import { INTRO_LESSONS } from './lessons-intro';
import { HTML_LESSONS } from './lessons-html';
import { CSS_LESSONS } from './lessons-css';
import { JS_LESSONS } from './lessons-js';
import { PROMPT_LESSONS } from './lessons-prompt';
import { EXTENDED_LESSONS } from './lessons-extended';
import { PROFILING_LESSONS } from './lessons-profiling';
import bcrypt from 'bcryptjs';

export async function runSeed() {
  console.log('🌱 CodeQuest Database Seeding boshlandi...');

  // 1. Achievements
  for (const ach of SEED_ACHIEVEMENTS) {
    const existing = db.select().from(schema.achievements).where(eq(schema.achievements.id, ach.id)).get();
    if (!existing) {
      db.insert(schema.achievements).values(ach).run();
    }
  }
  console.log('✅ Yutuqlar (achievements) yuklandi.');

  // 2. Courses
  for (const course of SEED_COURSES) {
    const existing = db.select().from(schema.courses).where(eq(schema.courses.id, course.id)).get();
    if (!existing) {
      db.insert(schema.courses).values({
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        shortDescription: course.shortDescription,
        level: course.level,
        category: course.category,
        thumbnail: course.thumbnail,
        estimatedHours: course.estimatedHours,
        published: course.published ? 1 : 0,
        order: course.order,
        technologies: JSON.stringify(course.technologies),
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      }).run();
    } else {
      db.update(schema.courses)
        .set({
          thumbnail: course.thumbnail,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.courses.id, course.id))
        .run();
    }
  }
  console.log('✅ Kurslar yuklandi.');

  // 3. Modules
  for (const mod of SEED_MODULES) {
    const existing = db.select().from(schema.modules).where(eq(schema.modules.id, mod.id)).get();
    if (!existing) {
      db.insert(schema.modules).values({
        id: mod.id,
        courseId: mod.courseId,
        title: mod.title,
        description: mod.description,
        order: mod.order,
      }).run();
    }
  }
  console.log('✅ Modullar yuklandi.');

  // 4. Lessons & Exercises
  const allLessonGroups = [
    ...INTRO_LESSONS,
    ...HTML_LESSONS,
    ...CSS_LESSONS,
    ...JS_LESSONS,
    ...PROMPT_LESSONS,
    ...EXTENDED_LESSONS,
    ...PROFILING_LESSONS,
  ];

  for (const group of allLessonGroups) {
    const { lesson, exercise } = group;
    const existingLesson = db.select().from(schema.lessons).where(eq(schema.lessons.id, lesson.id)).get();
    if (!existingLesson) {
      db.insert(schema.lessons).values({
        id: lesson.id,
        moduleId: lesson.moduleId,
        courseId: lesson.courseId,
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description,
        objectives: JSON.stringify(lesson.objectives),
        estimatedMinutes: lesson.estimatedMinutes,
        order: lesson.order,
        published: lesson.published ? 1 : 0,
        content: JSON.stringify(lesson.content),
      }).run();
    }

    if (exercise) {
      const existingExercise = db.select().from(schema.exercises).where(eq(schema.exercises.id, exercise.id)).get();
      if (!existingExercise) {
        db.insert(schema.exercises).values({
          id: exercise.id,
          lessonId: exercise.lessonId,
          title: exercise.title,
          description: exercise.description,
          instructions: JSON.stringify(exercise.instructions),
          starterCode: exercise.starterCode,
          starterFiles: exercise.starterFiles ? JSON.stringify(exercise.starterFiles) : null,
          language: exercise.language,
          difficulty: exercise.difficulty,
          testCases: JSON.stringify(exercise.testCases),
          hiddenTests: JSON.stringify(exercise.hiddenTests),
          hints: JSON.stringify(exercise.hints),
          solutionExplanation: exercise.solutionExplanation,
          passingScore: exercise.passingScore,
          expectedConcepts: JSON.stringify(exercise.expectedConcepts),
        }).run();
      } else if (exercise.starterFiles) {
        db.update(schema.exercises)
          .set({
            title: exercise.title,
            description: exercise.description,
            instructions: JSON.stringify(exercise.instructions),
            starterFiles: JSON.stringify(exercise.starterFiles),
            testCases: JSON.stringify(exercise.testCases),
            hints: JSON.stringify(exercise.hints),
            expectedConcepts: JSON.stringify(exercise.expectedConcepts),
          })
          .where(eq(schema.exercises.id, exercise.id))
          .run();
      }
    }
  }
  console.log(`✅ Jami ${allLessonGroups.length} ta dars va amaliy topshiriqlar yuklandi.`);

  // 5. Default Demo User
  const demoEmail = 'talaba@codequest.uz';
  const existingUser = db.select().from(schema.users).where(eq(schema.users.email, demoEmail)).get();
  if (!existingUser) {
    const salt = bcrypt.genSaltSync(10);
    const demoPassword = process.env.CMS_STUDENT_PASSWORD || 'change-me-immediately';
    const passwordHash = bcrypt.hashSync(demoPassword, salt);
    const now = new Date().toISOString();

    db.insert(schema.users).values({
      id: 'demo-user-1',
      name: 'Azizbek Rahimiy',
      email: demoEmail,
      passwordHash,
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Azizbek',
      role: 'user',
      level: 2,
      xp: 350,
      streak: 3,
      lastActiveDate: now.split('T')[0],
      onboardingCompleted: 1,
      createdAt: now,
      updatedAt: now,
    }).run();

    db.insert(schema.profiles).values({
      userId: 'demo-user-1',
      skillLevel: 'beginner',
      goals: JSON.stringify(['Frontend developer bo‘lish', 'Web sayt yaratish']),
      weeklyHours: 7,
      preferredLanguage: 'uz',
    }).run();

    db.insert(schema.lessonProgress).values({
      id: crypto.randomUUID(),
      userId: 'demo-user-1',
      lessonId: 'les-intro-1',
      courseId: 'course-intro',
      status: 'completed',
      quizScore: 100,
      exerciseScore: 100,
      completedAt: now,
      createdAt: now,
      updatedAt: now,
    }).run();

    db.insert(schema.userAchievements).values({
      id: crypto.randomUUID(),
      userId: 'demo-user-1',
      achievementId: 'first_code',
      unlockedAt: now,
    }).run();

    console.log('✅ Demo foydalanuvchi yaratildi: talaba@codequest.uz (parol: <configured via environment>)');
  }

  // 6. Default Super Admin
  const adminEmail = 'admin@codequest.uz';
  const existingAdmin = db.select().from(schema.users).where(eq(schema.users.email, adminEmail)).get();
  if (!existingAdmin) {
    const salt = bcrypt.genSaltSync(10);
    const adminPassword = process.env.CMS_ADMIN_PASSWORD || 'change-me-immediately';
    const passwordHash = bcrypt.hashSync(adminPassword, salt);
    const now = new Date().toISOString();

    db.insert(schema.users).values({
      id: 'superadmin-1',
      name: 'Bosh Administrator',
      email: adminEmail,
      passwordHash,
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=SuperAdmin',
      role: 'superadmin',
      level: 10,
      xp: 10000,
      streak: 30,
      lastActiveDate: now.split('T')[0],
      onboardingCompleted: 1,
      createdAt: now,
      updatedAt: now,
    }).run();

    console.log('✅ Super Admin yaratildi: admin@codequest.uz (parol: <configured via environment>)');
  }

  // 7. Default Instructor
  const instructorEmail = 'ustoz@codequest.uz';
  const existingInstructor = db.select().from(schema.users).where(eq(schema.users.email, instructorEmail)).get();
  if (!existingInstructor) {
    const salt = bcrypt.genSaltSync(10);
    const instructorPassword = process.env.CMS_INSTRUCTOR_PASSWORD || 'change-me-immediately';
    const passwordHash = bcrypt.hashSync(instructorPassword, salt);
    const now = new Date().toISOString();

    db.insert(schema.users).values({
      id: 'instructor-1',
      name: 'Jamshid Ustoz',
      email: instructorEmail,
      passwordHash,
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=JamshidUstoz',
      role: 'instructor',
      level: 5,
      xp: 2500,
      streak: 14,
      lastActiveDate: now.split('T')[0],
      onboardingCompleted: 1,
      createdAt: now,
      updatedAt: now,
    }).run();

    // Assign instructor to existing courses if instructor_id is null
    db.update(schema.courses)
      .set({ instructorId: 'instructor-1', status: 'published' })
      .where(eq(schema.courses.published, 1))
      .run();

    console.log('✅ Instructor yaratildi: ustoz@codequest.uz (parol: <configured via environment>)');
  }

  console.log('🎉 Seed muvaffaqiyatli yakunlandi!');
}

if (require.main === module) {
  runSeed().catch(console.error);
}
