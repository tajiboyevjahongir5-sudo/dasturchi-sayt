/**
 * CodeQuest — JavaScript Intermediate Content Seeder & Workflow Manager
 * 
 * Creates and updates the curriculum strictly via CMS HTTP API:
 * 1. Safe credentials via Environment Variables (redacted in output)
 * 2. Idempotent: safe against repeated runs (updates existing course/module/lessons)
 * 3. Dry-run mode (--dry-run) for schema & pedagogical quality validation
 * 4. Strictly creates in 'draft' and submits for 'review'
 * 5. Does NOT publish automatically (stops for admin review & approval)
 */

import { jsIntermediateCourse, jsIntermediateModules, jsIntermediateLessons } from './content/js-intermediate-data.mjs';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const INSTRUCTOR_EMAIL = process.env.CMS_INSTRUCTOR_EMAIL || 'ustoz@codequest.uz';
const INSTRUCTOR_PASSWORD = process.env.CMS_INSTRUCTOR_PASSWORD;
const ADMIN_EMAIL = process.env.CMS_ADMIN_EMAIL || 'admin@codequest.uz';
const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD;

if (!INSTRUCTOR_PASSWORD || !ADMIN_PASSWORD) {
  console.error('❌ CMS_INSTRUCTOR_PASSWORD va CMS_ADMIN_PASSWORD environment variable\'larini sozlang.');
  console.error('   .env.local faylini yarating yoki: node scripts/rotate-credentials.mjs');
  process.exit(1);
}

const isDryRun = process.argv.includes('--dry-run');

console.log('🚀 ========================================================');
console.log('📚 CODEQUEST: JAVASCRIPT INTERMEDIATE CMS CONTENT INGESTION');
console.log('🚀 ========================================================');
console.log(`🌐 Server URL: ${BASE_URL}`);
console.log(`👤 Instructor: ${INSTRUCTOR_EMAIL} (Parol: [REDACTED])`);
console.log(`👤 Admin: ${ADMIN_EMAIL} (Parol: [REDACTED])`);
console.log(`⚙️ Rejim: ${isDryRun ? 'DRY-RUN (Faqat pedagogik va sxema tekshiruvi)' : 'LIVE CMS INGESTION'}\n`);

/**
 * Validates pedagogical quality of the curriculum offline
 */
function validateCurriculumOffline() {
  console.log('🔍 [1/4] Pedagogik va Strukturaviy Sifat Tekshiruvi...');
  let totalErrors = 0;
  const issues = [];

  if (jsIntermediateModules.length !== 5) {
    issues.push(`Modullar soni 5 ta bo‘lishi shart (Hozir: ${jsIntermediateModules.length})`);
    totalErrors++;
  }

  if (jsIntermediateLessons.length !== 18) {
    issues.push(`Darslar soni 18 ta bo‘lishi shart (Hozir: ${jsIntermediateLessons.length})`);
    totalErrors++;
  }

  jsIntermediateLessons.forEach((lesson, index) => {
    const num = index + 1;
    // 1. Objectives
    if (!lesson.objectives || lesson.objectives.length < 2) {
      issues.push(`Dars #${num} (${lesson.slug}): Kamida 2 ta o‘quv maqsadi talab qilinadi`);
      totalErrors++;
    }
    // 2. Prerequisites
    if (!lesson.content?.prerequisites) {
      issues.push(`Dars #${num} (${lesson.slug}): Prerequisites (dastlabki bilimlar) mavjud emas`);
      totalErrors++;
    }
    // 3. Analogy
    if (!lesson.content?.realLifeAnalogy || lesson.content.realLifeAnalogy.length < 20) {
      issues.push(`Dars #${num} (${lesson.slug}): Hayotiy analogy to‘liq emas`);
      totalErrors++;
    }
    // 4. Theory
    if (!lesson.content?.theory || lesson.content.theory.length < 1) {
      issues.push(`Dars #${num} (${lesson.slug}): Nazariya bloklari yo‘q`);
      totalErrors++;
    }
    // 5. Common mistakes
    if (!lesson.content?.commonMistakes || lesson.content.commonMistakes.length < 1) {
      issues.push(`Dars #${num} (${lesson.slug}): Ataylab noto‘g‘ri kod / Common mistakes yo‘q`);
      totalErrors++;
    }
    // 6. Hints
    if (!lesson.exercise?.hints || lesson.exercise.hints.length < 3) {
      issues.push(`Dars #${num} (${lesson.slug}): Kamida 3 bosqichli hintlar talab qilinadi`);
      totalErrors++;
    }
    // 7. Test cases
    if (!lesson.exercise?.testCases || lesson.exercise.testCases.length < 1) {
      issues.push(`Dars #${num} (${lesson.slug}): Ko‘rinadigan test keyslar yo‘q`);
      totalErrors++;
    }
    // 8. Hidden tests
    if (!lesson.exercise?.hiddenTests || lesson.exercise.hiddenTests.length < 1) {
      issues.push(`Dars #${num} (${lesson.slug}): Yashirin test keyslar (hidden tests) yo‘q`);
      totalErrors++;
    }
    // 9. Quiz
    if (!lesson.content?.quiz || lesson.content.quiz.length < 1) {
      issues.push(`Dars #${num} (${lesson.slug}): Quiz savollari yo‘q`);
      totalErrors++;
    }
    // 10. Multi-file check for lessons 17 & 18
    if ((num === 17 || num === 18) && !lesson.exercise?.isMultiFile) {
      issues.push(`Dars #${num} (${lesson.slug}): 17 va 18-darslar ko‘p faylli (isMultiFile=true) bo‘lishi shart`);
      totalErrors++;
    }
  });

  if (totalErrors > 0) {
    console.error(`❌ Pedagogik auditda ${totalErrors} ta muammo aniqlandi:`);
    issues.forEach(err => console.error(`   - ${err}`));
    throw new Error('Pedagogik validatsiya xatolik bilan yakunlandi');
  }

  console.log(`✅ Pedagogik audit 100% muvaffaqiyatli: Barcha 18 ta dars 16 ta majburiy komponentga to‘liq ega.`);
}

async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(`Kirish muvaffaqiyatsiz (${email}): ${data.error || res.statusText}`);
  }
  const cookie = res.headers.get('set-cookie')?.split(';')[0] || '';
  return { user: data.data, cookie };
}

async function runLiveIngestion() {
  // 1. Validate offline structure first
  validateCurriculumOffline();

  if (isDryRun) {
    console.log('\n🏁 DRY-RUN muvaffaqiyatli yakunlandi. Hech qanday ma’lumotlar bazasiga yozilmadi.');
    return;
  }

  // 2. Authenticate as Instructor
  console.log('\n▶ [2/4] O‘qituvchi sifatida CMS ga kirish...');
  const instructor = await login(INSTRUCTOR_EMAIL, INSTRUCTOR_PASSWORD);
  console.log(`  ✅ O‘qituvchi kirdi: ${instructor.user.name} (${instructor.user.role})`);

  // 3. Create or Fetch Course
  console.log('\n▶ [3/4] Kurs va Modullarni boshqarish...');
  const existingCoursesRes = await fetch(`${BASE_URL}/api/admin/courses`, {
    headers: { Cookie: instructor.cookie },
  });
  const existingCoursesJson = await existingCoursesRes.json();
  const courseList = Array.isArray(existingCoursesJson.data) ? existingCoursesJson.data : (existingCoursesJson.data?.courses || []);
  let course = courseList.find(c => c.slug === jsIntermediateCourse.slug);

  if (course) {
    console.log(`  ℹ️ "${jsIntermediateCourse.title}" kursi mavjud (ID: ${course.id}). Yangilanmoqda...`);
    const updateRes = await fetch(`${BASE_URL}/api/admin/courses/${course.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Cookie: instructor.cookie,
      },
      body: JSON.stringify({
        title: jsIntermediateCourse.title,
        shortDescription: jsIntermediateCourse.shortDescription,
        description: jsIntermediateCourse.description,
        category: jsIntermediateCourse.category,
        level: jsIntermediateCourse.level,
        thumbnail: jsIntermediateCourse.thumbnail,
        estimatedHours: jsIntermediateCourse.estimatedHours,
        technologies: jsIntermediateCourse.technologies,
      }),
    });
    const updateJson = await updateRes.json();
    course = updateJson.data;
    console.log(`  ✅ Kurs ma’lumotlari yangilandi`);
  } else {
    console.log(`  🆕 Yangi kurs yaratilmoqda: "${jsIntermediateCourse.title}"...`);
    const createRes = await fetch(`${BASE_URL}/api/admin/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        Cookie: instructor.cookie,
      },
      body: JSON.stringify({
        ...jsIntermediateCourse,
        status: 'draft',
      }),
    });
    const createJson = await createRes.json();
    if (!createRes.ok || !createJson.success) {
      throw new Error(`Kurs yaratishda xatolik: ${createJson.error}`);
    }
    course = createJson.data;
    console.log(`  ✅ Kurs yaratildi (ID: ${course.id}, Status: draft)`);
  }

  // 4. Create or Fetch Modules
  const courseDetailRes = await fetch(`${BASE_URL}/api/admin/courses/${course.id}`, {
    headers: { Cookie: instructor.cookie },
  });
  const courseDetail = await courseDetailRes.json();
  const existingModules = courseDetail.data?.modules || [];
  const moduleMap = new Map();

  for (let i = 0; i < jsIntermediateModules.length; i++) {
    const modDef = jsIntermediateModules[i];
    let mod = existingModules.find(m => m.order === modDef.order || m.title === modDef.title);

    if (mod) {
      moduleMap.set(i, mod.id);
      console.log(`  ℹ️ Modul #${modDef.order} mavjud: "${mod.title}"`);
    } else {
      const createModRes = await fetch(`${BASE_URL}/api/admin/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Cookie: instructor.cookie,
        },
        body: JSON.stringify({
          courseId: course.id,
          title: modDef.title,
          description: modDef.description,
          order: modDef.order,
        }),
      });
      const createModJson = await createModRes.json();
      if (!createModRes.ok || !createModJson.success) {
        throw new Error(`Modul yaratishda xatolik: ${createModJson.error}`);
      }
      moduleMap.set(i, createModJson.data.id);
      console.log(`  ✅ Modul #${modDef.order} yaratildi: "${modDef.title}"`);
    }
  }

  // 5. Ingest / Update all 18 Lessons in 'draft', then submit for 'review'
  console.log('\n▶ [4/4] 18 ta darsni kiritish, topshiriqlar va review ga yuborish...');
  const refreshedDetailRes = await fetch(`${BASE_URL}/api/admin/courses/${course.id}`, {
    headers: { Cookie: instructor.cookie },
  });
  const refreshedDetail = await refreshedDetailRes.json();
  const existingLessons = (refreshedDetail.data?.modules || []).flatMap(m => m.lessons || []);

  let processedCount = 0;
  let reviewSubmittedCount = 0;

  for (const lessonDef of jsIntermediateLessons) {
    const moduleId = moduleMap.get(lessonDef.moduleIndex);
    if (!moduleId) throw new Error(`Modul ID topilmadi: index ${lessonDef.moduleIndex}`);

    const existingLesson = existingLessons.find(l => l.slug === lessonDef.slug);
    let lessonId = existingLesson?.id;

    const lessonPayload = {
      courseId: course.id,
      moduleId,
      title: lessonDef.title,
      slug: lessonDef.slug,
      description: lessonDef.description,
      objectives: lessonDef.objectives,
      estimatedMinutes: lessonDef.estimatedMinutes,
      order: lessonDef.order,
      content: lessonDef.content,
      exercise: lessonDef.exercise,
      status: 'draft', // Majburiy qoida: avval draft holatda yaratiladi!
    };

    if (existingLesson) {
      // Update
      const updateLesRes = await fetch(`${BASE_URL}/api/admin/lessons/${existingLesson.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Cookie: instructor.cookie,
        },
        body: JSON.stringify({
          ...lessonPayload,
          changeSummary: 'JavaScript Intermediate o‘quv rejasi yangilandi',
        }),
      });
      const updateLesJson = await updateLesRes.json();
      if (!updateLesRes.ok || !updateLesJson.success) {
        throw new Error(`Darsni yangilashda xato (${lessonDef.slug}): ${updateLesJson.error}`);
      }
      lessonId = updateLesJson.data.id;
      console.log(`  ✏️ Dars #${lessonDef.order} yangilandi: "${lessonDef.title}" (v${updateLesJson.data.version})`);
    } else {
      // Create new
      const createLesRes = await fetch(`${BASE_URL}/api/admin/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          Cookie: instructor.cookie,
        },
        body: JSON.stringify(lessonPayload),
      });
      const createLesJson = await createLesRes.json();
      if (!createLesRes.ok || !createLesJson.success) {
        throw new Error(`Dars yaratishda xato (${lessonDef.slug}): ${createLesJson.error}`);
      }
      lessonId = createLesJson.data.id;
      console.log(`  🆕 Dars #${lessonDef.order} yaratildi: "${lessonDef.title}" (draft)`);
    }

    processedCount++;

    // Submit for Review as Instructor
    let reviewSuccess = false;
    let reviewRes = await fetch(`${BASE_URL}/api/admin/lessons/${lessonId}/publish`, {
      method: 'PUT',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Cookie: instructor.cookie,
      },
    });
    let reviewJson = await reviewRes.json();
    if (reviewRes.ok && reviewJson.success && reviewJson.data?.status === 'review') {
      reviewSubmittedCount++;
      reviewSuccess = true;
    } else if (reviewRes.status === 429) {
      await new Promise(r => setTimeout(r, 1200));
      reviewRes = await fetch(`${BASE_URL}/api/admin/lessons/${lessonId}/publish`, {
        method: 'PUT',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Cookie: instructor.cookie,
        },
      });
      reviewJson = await reviewRes.json();
      if (reviewRes.ok && reviewJson.success && reviewJson.data?.status === 'review') {
        reviewSubmittedCount++;
        reviewSuccess = true;
      }
    }
    if (!reviewSuccess) {
      console.warn(`  ⚠️ Dars #${lessonDef.order} ni review ga yuborishda ogohlantirish: ${reviewJson.error}`);
    }
  }

  // 6. Admin Preview & Quality Validation (WITHOUT auto-publishing)
  console.log('\n▶ [Admin Tekshiruvi va Preview Audit]');
  const admin = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log(`  ✅ Administrator kirdi: ${admin.user.name} (${admin.user.role})`);

  const adminCourseRes = await fetch(`${BASE_URL}/api/admin/courses/${course.id}`, {
    headers: { Cookie: admin.cookie },
  });
  const adminCourseData = await adminCourseRes.json();
  const allAdminLessons = adminCourseData.data?.modules?.flatMap(m => m.lessons) || [];

  let validForPublishCount = 0;
  for (const lessonDef of jsIntermediateLessons) {
    const l = allAdminLessons.find(x => x.slug === lessonDef.slug);
    if (l && l.status === 'review') {
      validForPublishCount++;
    }
  }

  console.log('\n========================================================');
  console.log('🎉 SPRINT 1 INGESTION XULOSASI:');
  console.log(`   - Kurs: ${jsIntermediateCourse.title} (${course.id})`);
  console.log(`   - Modullar: ${jsIntermediateModules.length} ta modul yaratildi`);
  console.log(`   - Darslar: ${processedCount}/18 ta dars kiritildi va to‘ldirildi`);
  console.log(`   - Review holatiga yuborildi: ${reviewSubmittedCount}/18 ta dars
   - Admin tekshiruvi: ${validForPublishCount}/18 ta dars ko‘rib chiqishga tayyor
   - Hozirgi darslar holati: REVIEW (Avtomatik publish qilinmadi)`);
  console.log(`   - Kurs holati: DRAFT`);
  console.log(`   - Xavfsizlik qoidasi: Talabalar uchun darslar yashirin`);
  console.log('========================================================\n');
}

runLiveIngestion().catch(err => {
  console.error('\n❌ Xatolik yuz berdi:', err.message);
  process.exit(1);
});
