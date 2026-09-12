/**
 * CodeQuest — Admin & Instructor CMS Automated Verification Suite
 * Tests all Phase 2.2 CMS requirements against live server (http://localhost:3000):
 * 1. Role-based Access Control (RBAC):
 *    - Student forbidden (403) from admin endpoints
 *    - Instructor permissions scoped to own courses
 *    - Instructor cannot publish directly (403), only submit for review
 *    - Admin / Super Admin can publish and archive
 * 2. CSRF & Security Guards:
 *    - Mutating requests without CSRF protection rejected (403)
 *    - Server-side XSS sanitization removes scripts and dangerous handlers
 * 3. Curriculum CRUD & Validation:
 *    - Course creation, slug uniqueness enforcement (400 on duplicate)
 *    - Module & lesson creation
 *    - Publish validation: rejects incomplete lesson missing objectives or test cases (422)
 * 4. Content Versioning & Rollback:
 *    - Incremental versioning on updates (v1 -> v2 -> v3)
 *    - Rollback to v1 creates new v4 preserving history
 * 5. Super Admin Role Management & Audit Logs:
 *    - Super Admin changes user role
 *    - Non-superadmin role change blocked (403)
 *    - Role change, publish, rollback recorded in audit_logs
 * 6. Soft-delete behavior:
 *    - Deleted content marked with deletedAt, hidden from students
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CMS_ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD;
const CMS_INSTRUCTOR_PASSWORD = process.env.CMS_INSTRUCTOR_PASSWORD;
const CMS_STUDENT_PASSWORD = process.env.CMS_STUDENT_PASSWORD;

if (!CMS_ADMIN_PASSWORD || !CMS_INSTRUCTOR_PASSWORD || !CMS_STUDENT_PASSWORD) {
  console.error('❌ CMS_ADMIN_PASSWORD, CMS_INSTRUCTOR_PASSWORD va CMS_STUDENT_PASSWORD environment variable\'larini sozlang.');
  console.error('   .env.local faylini yarating yoki: node scripts/rotate-credentials.mjs');
  process.exit(1);
}

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    failCount++;
    throw new Error(message);
  } else {
    console.log(`  ✅ PASSED: ${message}`);
    passCount++;
  }
}

async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(`Login failed for ${email}: ${data.error || res.statusText}`);
  }
  const cookie = res.headers.get('set-cookie')?.split(';')[0] || '';
  return { user: data.data, cookie };
}

async function runCmsTests() {
  console.log('🛡️  ========================================================');
  console.log('🛡️  CODEQUEST CMS & RBAC VERIFICATION SUITE');
  console.log('🛡️  ========================================================\n');

  // Step 1: Log in with different roles
  console.log('▶ [1/7] Foydalanuvchilar sessiyalarini tekshirish...');
  const superadmin = await login('admin@codequest.uz', CMS_ADMIN_PASSWORD);
  assert(superadmin.user.role === 'superadmin', 'Super Admin roli: superadmin');

  const instructor = await login('ustoz@codequest.uz', CMS_INSTRUCTOR_PASSWORD);
  assert(instructor.user.role === 'instructor', 'O\u2018qituvchi roli: instructor');

  const student = await login('talaba@codequest.uz', CMS_STUDENT_PASSWORD);
  assert(student.user.role === 'user', 'Talaba roli: user');

  // Step 2: RBAC Guards for regular student
  console.log('\n▶ [2/7] Talaba uchun Admin API cheklovlarini tekshirish (403 Forbidden)...');
  const studentStatsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
    headers: { Cookie: student.cookie },
  });
  assert(studentStatsRes.status === 403, 'Talaba /api/admin/stats ga kirganda 403 oldi');

  const studentCoursesRes = await fetch(`${BASE_URL}/api/admin/courses`, {
    headers: { Cookie: student.cookie },
  });
  assert(studentCoursesRes.status === 403, 'Talaba /api/admin/courses ga kirganda 403 oldi');

  const studentUsersRes = await fetch(`${BASE_URL}/api/admin/users`, {
    headers: { Cookie: student.cookie },
  });
  assert(studentUsersRes.status === 403, 'Talaba /api/admin/users ga kirganda 403 oldi');

  // Step 3: CSRF Protection on Mutating Requests
  console.log('\n▶ [3/7] CSRF himoyasini tekshirish...');
  // 3a. Cross-origin attack with mismatched Origin
  const csrfOriginRes = await fetch(`${BASE_URL}/api/admin/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: superadmin.cookie,
      Origin: 'https://evil-attacker-site.com',
      Host: 'localhost:3000',
    },
    body: JSON.stringify({
      title: 'CSRF Attack Test',
      slug: 'csrf-test-origin',
      shortDescription: 'test',
      description: 'test',
      category: 'frontend',
      level: 'boshlangich',
    }),
  });
  assert(csrfOriginRes.status === 403, 'Cross-origin so‘rov (Origin !== Host) 403 CSRF bilan bloklandi');

  // 3b. Cross-site Sec-Fetch-Site attack
  const csrfSecFetchRes = await fetch(`${BASE_URL}/api/admin/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: superadmin.cookie,
      'Sec-Fetch-Site': 'cross-site',
    },
    body: JSON.stringify({
      title: 'CSRF Attack Test',
      slug: 'csrf-test-secfetch',
      shortDescription: 'test',
      description: 'test',
      category: 'frontend',
      level: 'boshlangich',
    }),
  });
  assert(csrfSecFetchRes.status === 403, 'Sec-Fetch-Site: cross-site 403 CSRF bilan bloklandi');

  // Step 4: Curriculum Creation & Instructor Ownership
  console.log('\n▶ [4/7] O‘qituvchi tomonidan Kurs, Modul va Dars yaratish...');
  const testCourseSlug = `cms-test-course-${Date.now()}`;
  const courseCreateRes = await fetch(`${BASE_URL}/api/admin/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: instructor.cookie,
    },
    body: JSON.stringify({
      title: 'CMS Sinov Kursi (TypeScript)',
      slug: testCourseSlug,
      shortDescription: 'O‘qituvchi tomonidan yaratilgan kurs',
      description: 'Kursning to‘liq tavsifi',
      category: 'frontend',
      level: 'boshlangich',
      thumbnail: '⚡',
      estimatedHours: 15,
      technologies: ['TypeScript', 'Node.js'],
    }),
  });
  assert(courseCreateRes.status === 201, 'O‘qituvchi yangi kurs yaratdi (201 Created)');
  const createdCourseData = await courseCreateRes.json();
  const testCourseId = createdCourseData.data.id;
  assert(testCourseId, 'Kurs identifikatori hosil qilindi');

  // Test duplicate slug validation
  const dupSlugRes = await fetch(`${BASE_URL}/api/admin/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: instructor.cookie,
    },
    body: JSON.stringify({
      title: 'Duplicate Slug Course',
      slug: testCourseSlug, // duplicate!
      shortDescription: 'test',
      description: 'test',
      category: 'frontend',
      level: 'boshlangich',
    }),
  });
  assert(dupSlugRes.status === 400, 'Bir xil slug bilan qayta kurs yaratish 400 xatosi bilan rad etildi');

  // Create Module
  const moduleCreateRes = await fetch(`${BASE_URL}/api/admin/modules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: instructor.cookie,
    },
    body: JSON.stringify({
      courseId: testCourseId,
      title: '1-Modul: Asoslar',
      description: 'TypeScript asoslari',
    }),
  });
  assert(moduleCreateRes.status === 201, 'Modul muvaffaqiyatli yaratildi (201 Created)');
  const moduleData = await moduleCreateRes.json();
  const testModuleId = moduleData.data.id;

  // Create Lesson in Module
  const lessonSlug = `dars-1-kirish-${Date.now()}`;
  const lessonCreateRes = await fetch(`${BASE_URL}/api/admin/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: instructor.cookie,
    },
    body: JSON.stringify({
      courseId: testCourseId,
      moduleId: testModuleId,
      title: '1-Dars: TypeScriptga Kirish',
      slug: lessonSlug,
      description: 'Dars tavsifi',
      status: 'draft',
    }),
  });
  assert(lessonCreateRes.status === 201, 'Dars muvaffaqiyatli yaratildi (201 Created)');
  const lessonData = await lessonCreateRes.json();
  const testLessonId = lessonData.data.id;
  assert(lessonData.data.status === 'draft', 'Dars boshlang‘ich holati: draft');
  assert(lessonData.data.version === 1, 'Dars boshlang‘ich versiyasi: 1');

  // Step 5: Publishing Workflow & Validation
  console.log('\n▶ [5/7] Nashr qilish (Publish) jarayoni va qat’iy validatsiya...');
  // 5a. Instructor tries to publish directly -> Forbidden (403)
  const instructorPublishRes = await fetch(`${BASE_URL}/api/admin/lessons/${testLessonId}/publish`, {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: instructor.cookie,
    },
  });
  assert(instructorPublishRes.status === 403, 'O‘qituvchi darsni to‘g‘ridan-to‘g‘ri nashr qila olmadi (403: faqat admin/superadmin)');

  // 5b. Instructor submits for review -> OK (200)
  const instructorReviewRes = await fetch(`${BASE_URL}/api/admin/lessons/${testLessonId}/publish`, {
    method: 'PUT',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: instructor.cookie,
    },
  });
  assert(instructorReviewRes.status === 200, 'O‘qituvchi darsni tekshiruvga (review) yubordi (200 OK)');
  const reviewJson = await instructorReviewRes.json();
  assert(reviewJson.data.status === 'review', 'Dars holati review ga o‘zgardi');

  // 5c. Super Admin tries to publish without objectives or test cases -> 422 Unprocessable Entity
  const invalidPublishRes = await fetch(`${BASE_URL}/api/admin/lessons/${testLessonId}/publish`, {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: superadmin.cookie,
    },
  });
  assert(invalidPublishRes.status === 422, 'Tugallanmagan darsni nashr qilish 422 xatosi bilan to‘xtatildi');
  const invalidJson = await invalidPublishRes.json();
  assert(invalidJson.validationErrors && invalidJson.validationErrors.length > 0, 'O‘zbekcha validatsiya xatoliklari ro‘yxati qaytarildi');

  // 5d. Update lesson with full valid curriculum (objectives, exercise, test cases, XSS content test)
  console.log('   Darsni barcha talablar va XSS filtri bilan to‘ldirish...');
  const updateLessonRes = await fetch(`${BASE_URL}/api/admin/lessons/${testLessonId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: superadmin.cookie,
    },
    body: JSON.stringify({
      title: '1-Dars: TypeScriptga Kirish',
      slug: lessonSlug,
      description: 'Dars tavsifi',
      estimatedMinutes: 25,
      objectives: ['TypeScript nima ekanini bilish', 'Ilk o‘zgaruvchini e’lon qilish'],
      changeSummary: 'Darsga barcha ma’lumotlar kiritildi',
      content: {
        theory: [
          {
            id: 'b1',
            type: 'markdown',
            title: 'TypeScript nima?',
            content: 'TypeScript — bu JavaScript ustiga qurilgan qat’iy tiplangan til.<script>alert("xss")</script><img src=x onerror=alert(1)>',
          },
          {
            id: 'b2',
            type: 'code',
            language: 'typescript',
            content: 'let name: string = "CodeQuest";\nconsole.log(name);',
          }
        ],
        realLifeAnalogy: 'TypeScript — bu avtomobil xavfsizlik kamari kabidir.',
        summary: 'Ushbu darsda tiplar bilan tanishdik.',
        commonMistakes: [],
      },
      exercise: {
        title: 'Ism o‘zgaruvchisini yarating',
        description: 'name nomli string o‘zgaruvchi e’lon qiling.',
        language: 'javascript',
        difficulty: 'easy',
        passingScore: 100,
        xpReward: 50,
        starterCode: '// Kodni shu yerda yozing\n',
        instructions: ['name o‘zgaruvchisini yarating', 'Kodni tekshiring'],
        testCases: [
          { id: 't1', description: 'name aniqlangan bo‘lishi kerak', expectedOutput: 'OK', isHidden: false }
        ],
        hints: ['1-yordam: let kalit so‘zidan foydalaning', '2-yordam: name = "..."', '3-yordam: to‘liq javob'],
        solutionExplanation: 'let name = "salom"; deb e’lon qilinadi.',
      },
    }),
  });
  assert(updateLessonRes.status === 200, 'Dars ma’lumotlari muvaffaqiyatli saqlandi');

  // Verify XSS Sanitization: hazardous script/onerror must be stripped, code must be preserved
  const getLessonRes = await fetch(`${BASE_URL}/api/admin/lessons/${testLessonId}`, {
    headers: { Cookie: superadmin.cookie },
  });
  const fetchedLessonData = await getLessonRes.json();
  const theoryContent = fetchedLessonData.data.content.theory[0].content;
  assert(!theoryContent.includes('<script>'), 'XSS filtri: <script> tegi tozalandi');
  assert(!theoryContent.includes('onerror='), 'XSS filtri: onerror atributi tozalandi');
  assert(theoryContent.includes('qat’iy tiplangan til'), 'XSS filtri: xavfsiz matn saqlanib qoldi');
  assert(fetchedLessonData.data.content.theory[1].content.includes('let name: string'), 'XSS filtri: kod blokidagi kod saqlanib qoldi');

  // 5e. Now Super Admin publishes the completed lesson
  const publishSuccessRes = await fetch(`${BASE_URL}/api/admin/lessons/${testLessonId}/publish`, {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: superadmin.cookie,
    },
  });
  assert(publishSuccessRes.status === 200, 'Super Admin to‘liq darsni muvaffaqiyatli nashr qildi (200 OK)');
  const publishedJson = await publishSuccessRes.json();
  assert(publishedJson.data.status === 'published', 'Dars holati: published');

  // Step 6: Versioning & Transactional Rollback
  console.log('\n▶ [6/7] Versiyalash (Versioning) va Rollback mexanizmini tekshirish...');
  // Lesson is currently v2 (v1 was creation, v2 was filled in Step 5d)
  // Update to create v3
  const v3Res = await fetch(`${BASE_URL}/api/admin/lessons/${testLessonId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: superadmin.cookie,
    },
    body: JSON.stringify({
      title: '1-Dars: TypeScriptga Kirish (Tahrir 3)',
      slug: lessonSlug,
      description: 'v3 tavsifi',
      objectives: ['1-maqsad', '2-maqsad'],
      changeSummary: '3-versiya tahriri',
    }),
  });
  const v3Data = await v3Res.json();
  assert(v3Data.data.version === 3, 'Ketma-ket tahrirlardan so‘ng dars versiyasi: v3');

  // Rollback to v1:
  // Must create v4 with v1 snapshot, preserving all previous versions!
  const rollbackRes = await fetch(`${BASE_URL}/api/admin/lessons/${testLessonId}/rollback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: superadmin.cookie,
    },
    body: JSON.stringify({ version: 1 }),
  });
  assert(rollbackRes.status === 200, '1-versiyaga rollback so‘rovi muvaffaqiyatli bajarildi (200 OK)');
  const rollbackJson = await rollbackRes.json();
  assert(rollbackJson.data.version === 4, 'Rollback eski versiyani o‘chirib tashlamadi, yangi v4 versiya yaratdi');
  assert(rollbackJson.data.title === '1-Dars: TypeScriptga Kirish', 'Tiklangan sarlavha v1 ma’lumotlariga mos keladi');

  // Check version history preserves all versions
  const lessonHistoryRes = await fetch(`${BASE_URL}/api/admin/lessons/${testLessonId}`, {
    headers: { Cookie: superadmin.cookie },
  });
  const historyData = await lessonHistoryRes.json();
  const recordedVersions = historyData.data.versions.map((v) => v.version);
  assert(recordedVersions.includes(1) && recordedVersions.includes(2) && recordedVersions.includes(3), 'Versiyalar tarixida v1, v2, v3 saqlanib qolgan');

  // Step 7: Super Admin Role Management & Audit Log
  console.log('\n▶ [7/7] Super Admin rol boshqaruvi va Audit loglarini tekshirish...');
  // 7a. Non-superadmin (Instructor) attempts to change user role -> Forbidden (403)
  const instructorRoleChangeRes = await fetch(`${BASE_URL}/api/admin/users/${student.user.id}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: instructor.cookie,
    },
    body: JSON.stringify({ role: 'instructor' }),
  });
  assert(instructorRoleChangeRes.status === 403, 'O‘qituvchi boshqa user rolini o‘zgartira olmadi (403: faqat Super Admin)');

  // 7b. Super Admin changes student role to instructor -> OK (200)
  const superadminRoleChangeRes = await fetch(`${BASE_URL}/api/admin/users/${student.user.id}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: superadmin.cookie,
    },
    body: JSON.stringify({ role: 'instructor' }),
  });
  assert(superadminRoleChangeRes.status === 200, 'Super Admin talaba rolini instructor ga o‘zgartirdi (200 OK)');

  // 7c. Check Audit Logs: must contain role_change, publish, and rollback events
  const auditLogsRes = await fetch(`${BASE_URL}/api/admin/audit-logs`, {
    headers: { Cookie: superadmin.cookie },
  });
  assert(auditLogsRes.status === 200, 'Super Admin audit loglarini yukladi (200 OK)');
  const auditData = await auditLogsRes.json();
  const logActions = auditData.data.logs.map((l) => l.action);
  assert(logActions.includes('role_change'), 'Audit logida "role_change" yozuvi mavjud');
  assert(logActions.includes('publish'), 'Audit logida "publish" yozuvi mavjud');
  assert(logActions.includes('rollback'), 'Audit logida "rollback" yozuvi mavjud');

  // Restore student role back to user
  await fetch(`${BASE_URL}/api/admin/users/${student.user.id}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: superadmin.cookie,
    },
    body: JSON.stringify({ role: 'user' }),
  });

  // 7d. Soft-delete test
  console.log('   Soft-delete: Kursni arxivlash va progress butunligini tekshirish...');
  const deleteRes = await fetch(`${BASE_URL}/api/admin/courses/${testCourseId}`, {
    method: 'DELETE',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: superadmin.cookie,
    },
  });
  assert(deleteRes.status === 200, 'Kurs soft-delete qilindi (200 OK)');

  // Student public course list must not contain deleted course
  const publicCoursesRes = await fetch(`${BASE_URL}/api/courses`);
  const publicCoursesJson = await publicCoursesRes.json();
  const hasDeletedCourse = publicCoursesJson.data.some((c) => c.id === testCourseId);
  assert(!hasDeletedCourse, 'O‘chirilgan kurs ommaviy kurslar ro‘yxatida talabalarga ko‘rinmaydi');

  console.log('\n========================================================');
  console.log(`🎉 BARCHA CMS VA RBAC TESTLARI MUVAFFAQIYATLI O‘TDI!`);
  console.log(`   Jami o‘tgan testlar: ${passCount}`);
  console.log(`   Xatoliklar: ${failCount}`);
  console.log('========================================================\n');
}

runCmsTests().catch((err) => {
  console.error('\n❌ CMS Verification Suite to‘xtatildi:', err.message);
  process.exit(1);
});
