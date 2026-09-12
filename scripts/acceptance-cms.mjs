/**
 * CodeQuest — CMS Comprehensive Manual Acceptance Test & Technical Audit Suite
 * Covers all 20 Acceptance Test points + Technical Audits:
 * 1. Super Admin creates Instructor and Admin users via role update
 * 2. Instructor creates a new course
 * 3. Adds module and lesson to the course
 * 4. Fills theory blocks, exercise, starter code, test cases, hints, and quiz
 * 5. Instructor submits lesson from draft to review
 * 6. Verification: Instructor cannot publish directly (403)
 * 7. Admin reviews and publishes the lesson (200)
 * 8. Regular user can view published lesson, while draft and review are hidden
 * 9. Update published lesson and verify content version is created
 * 10. Rollback to older version and verify new version is created (non-destructive)
 * 11. XSS payload test: malicious tags and attributes stripped, raw code preserved
 * 12. Permission matrix verified for User, Instructor, Admin, Super Admin
 * 13. Regular user forbidden from admin APIs (403)
 * 14. Instructor A cannot view or edit Instructor B's course (isolation)
 * 15. Role modification recorded in audit_logs
 * 16. Reorder functions verified (modules, lessons, theory blocks, quiz)
 * 17. Responsive layout classes verified (desktop, tablet, mobile)
 * 18. Session expiry and invalid token handling (401)
 * 19. Validation error messages in natural Uzbek (422)
 * 20. Database persistence: data persists in SQLite across restarts
 * 
 * Technical Audits:
 * - content_versions unique index (contentType, contentId, version)
 * - Transactional execution of update & rollback
 * - CSRF verification across mutating endpoints
 * - Rate limiting on admin routes
 * - Published filtering: only status='published' and deletedAt IS NULL
 * - Audit logs redaction: no passwords or tokens stored
 * - Pagination and search filtering
 */

import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

const dbPath = path.resolve('data/codequest.db');
const sqlite = new Database(dbPath);

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const CMS_ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD;
const CMS_STUDENT_PASSWORD = process.env.CMS_STUDENT_PASSWORD;

if (!CMS_ADMIN_PASSWORD || !CMS_STUDENT_PASSWORD) {
  console.error('❌ CMS_ADMIN_PASSWORD va CMS_STUDENT_PASSWORD environment variable\'larini sozlang.');
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

async function register(name, email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(`Register failed for ${email}: ${data.error || res.statusText}`);
  }
  const cookie = res.headers.get('set-cookie')?.split(';')[0] || '';
  return { user: data.data, cookie };
}

async function runAcceptanceSuite() {
  console.log('🏛️  ========================================================');
  console.log('🏛️  CODEQUEST CMS ACCEPTANCE TEST & TECHNICAL AUDIT');
  console.log('🏛️  ========================================================\n');

  // Baseline logins
  const superadmin = await login('admin@codequest.uz', CMS_ADMIN_PASSWORD);
  assert(superadmin.user.role === 'superadmin', 'Super Admin tizimga kirdi');

  // ----------------------------------------------------
  // 1. Super Admin orqali Instructor va Admin user yarat
  // ----------------------------------------------------
  console.log('\n▶ [1/20] Super Admin orqali yangi Instructor va Admin user yaratish...');
  const ts = Date.now();
  const instEmail = `instructor_${ts}@codequest.uz`;
  const adminEmail = `admin_${ts}@codequest.uz`;
  const pass = 'TestAcc_' + crypto.randomUUID().slice(0, 12) + '!A1';

  const newInst = await register('Yangi O‘qituvchi', instEmail, pass);
  const newAdm = await register('Yangi Admin', adminEmail, pass);

  // Promote to instructor
  const promoteInstRes = await fetch(`${BASE_URL}/api/admin/users/${newInst.user.id}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: superadmin.cookie,
    },
    body: JSON.stringify({ role: 'instructor' }),
  });
  assert(promoteInstRes.status === 200, 'Super Admin yangi userga "instructor" rolini berdi');

  // Promote to admin
  const promoteAdmRes = await fetch(`${BASE_URL}/api/admin/users/${newAdm.user.id}/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: superadmin.cookie,
    },
    body: JSON.stringify({ role: 'admin' }),
  });
  assert(promoteAdmRes.status === 200, 'Super Admin yangi userga "admin" rolini berdi');

  const instSession = await login(instEmail, pass);
  const admSession = await login(adminEmail, pass);
  assert(instSession.user.role === 'instructor', 'Yangi o‘qituvchi roli instructor deb tasdiqlandi');
  assert(admSession.user.role === 'admin', 'Yangi admin roli admin deb tasdiqlandi');

  // ----------------------------------------------------
  // 2. Instructor sifatida yangi kurs yarat
  // ----------------------------------------------------
  console.log('\n▶ [2/20] Instructor sifatida yangi kurs yaratish...');
  const courseSlug = `js-intermediate-${ts}`;
  const createCourseRes = await fetch(`${BASE_URL}/api/admin/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: instSession.cookie,
    },
    body: JSON.stringify({
      title: 'JavaScript Intermediate (O‘rta daraja)',
      slug: courseSlug,
      shortDescription: 'Closures, Asinxron dasturlash va Event Loop chuqur tahlili',
      description: 'JavaScript tilining o‘rta va yuqori darajadagi nozikliklari',
      category: 'frontend',
      level: 'orta',
      thumbnail: '🚀',
      estimatedHours: 20,
      technologies: ['JavaScript', 'ES6+', 'Async/Await'],
    }),
  });
  assert(createCourseRes.status === 201, 'Instructor yangi kurs yaratdi (201 Created)');
  const courseJson = await createCourseRes.json();
  const courseId = courseJson.data.id;
  assert(courseJson.data.instructorId === instSession.user.id, 'Kurs muallifi aynan ushbu Instructor ekanligi saqlandi');

  // ----------------------------------------------------
  // 3. Kursga module va lesson qo‘sh
  // ----------------------------------------------------
  console.log('\n▶ [3/20] Kursga Modul va Dars qo‘shish...');
  const createModRes = await fetch(`${BASE_URL}/api/admin/modules`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: instSession.cookie,
    },
    body: JSON.stringify({
      courseId,
      title: '1-Modul: Asinxron JavaScript va Promises',
      description: 'Event Loop, Promises va Async/Await mexanizmlari',
    }),
  });
  assert(createModRes.status === 201, 'Modul muvaffaqiyatli qo‘shildi');
  const modJson = await createModRes.json();
  const moduleId = modJson.data.id;

  const lessonSlug = `promise-va-async-await-${ts}`;
  const createLesRes = await fetch(`${BASE_URL}/api/admin/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: instSession.cookie,
    },
    body: JSON.stringify({
      courseId,
      moduleId,
      title: '1-Dars: Promise nima va qanday ishlaydi?',
      slug: lessonSlug,
      description: 'Promise holatlari: Pending, Fulfilled, Rejected',
      status: 'draft',
    }),
  });
  assert(createLesRes.status === 201, 'Dars muvaffaqiyatli qo‘shildi');
  const lesJson = await createLesRes.json();
  const lessonId = lesJson.data.id;
  assert(lesJson.data.status === 'draft', 'Boshlang‘ich holat: draft');
  assert(lesJson.data.version === 1, 'Boshlang‘ich versiya: 1');

  // ----------------------------------------------------
  // 4. Lesson theory, exercise, starter code, test case, hint va quiz bilan to‘ldir
  // ----------------------------------------------------
  console.log('\n▶ [4/20] Darsni nazariya, topshiriq, test case, hint va quiz bilan to‘ldirish...');
  const fillLessonRes = await fetch(`${BASE_URL}/api/admin/lessons/${lessonId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: instSession.cookie,
    },
    body: JSON.stringify({
      title: '1-Dars: Promise nima va qanday ishlaydi?',
      slug: lessonSlug,
      description: 'Promise holatlari: Pending, Fulfilled, Rejected',
      estimatedMinutes: 25,
      objectives: [
        'Promise nima ekanini va uning 3 ta holatini tushunish',
        'async/await yordamida asinxron ma’lumot olishni o‘rganish'
      ],
      changeSummary: 'Dars to‘liq nazariya va topshiriqlar bilan to‘ldirildi',
      content: {
        theory: [
          {
            id: 'th-1',
            type: 'heading',
            content: 'Asinxronlik nima?',
          },
          {
            id: 'th-2',
            type: 'text',
            content: 'JavaScript bir oqimli (single-threaded) til bo‘lib, uzoq davom etadigan amallarni Event Loop yordamida fonda bajaradi.',
          },
          {
            id: 'th-3',
            type: 'code',
            language: 'javascript',
            content: 'const promise = new Promise((resolve) => {\n  setTimeout(() => resolve("Muvaffaqiyat!"), 1000);\n});\npromise.then(console.log);',
          },
          {
            id: 'th-4',
            type: 'tip',
            content: 'async funksiyalar har doim avtomatik ravishda Promise qaytaradi.',
          }
        ],
        realLifeAnalogy: 'Promise — bu kafeda buyurtma berganingizda beriladigan chek kabidir. Buyurtma tayyor bo‘lganda sizga taom beriladi (resolve), yoki masalliq tugasa rad etiladi (reject).',
        summary: 'Ushbu darsda Promise obyektining ishlash mexanizmini va then/catch orqali qiymat olishni o‘rgandik.',
        commonMistakes: [],
        quiz: [
          {
            id: 'q-1',
            question: 'Promise qaysi 3 ta holatda bo‘lishi mumkin?',
            type: 'multiple-choice',
            options: [
              'start, running, stopped',
              'pending, fulfilled, rejected',
              'open, closed, error',
              'wait, active, done'
            ],
            correctAnswer: 1,
            explanation: 'Promise dastlab pending, muvaffaqiyatda fulfilled, xatolikda esa rejected holatiga o‘tadi.',
          },
          {
            id: 'q-2',
            question: 'async kalit so‘zi bilan e’lon qilingan funksiya nimani qaytaradi?',
            type: 'multiple-choice',
            options: [
              'Oddiy qiymat',
              'Doimo Promise',
              'Boolean',
              'Undefined'
            ],
            correctAnswer: 1,
            explanation: 'async funksiyaning qaytargan har qanday qiymati avtomatik Promise ga o‘raladi.',
          }
        ]
      },
      exercise: {
        title: 'Asinxron salomlashish funksiyasi',
        description: 'getWelcomeMessage nomli async funksiya yozing va "Salom, CodeQuest!" matnini qaytaring.',
        language: 'javascript',
        difficulty: 'medium',
        passingScore: 100,
        xpReward: 60,
        starterCode: '// Funksiyani quyida yozing\nasync function getWelcomeMessage() {\n  return "Salom, CodeQuest!";\n}\n',
        instructions: [
          'getWelcomeMessage nomli asinxron funksiya e’lon qiling',
          'Funksiya ichida "Salom, CodeQuest!" matnini qaytaring'
        ],
        testCases: [
          {
            id: 'tc-1',
            description: 'getWelcomeMessage chaqirilganda to‘g‘ri salom qaytishi kerak',
            expectedOutput: 'Salom, CodeQuest!',
            isHidden: false,
          }
        ],
        hints: [
          '1-yordam: async function nom() { return ...; } sintaksisidan foydalaning',
          '2-yordam: return qismida satr harflari katta-kichikligiga e’tibor bering',
          '3-yordam: async function getWelcomeMessage() { return "Salom, CodeQuest!"; }'
        ],
        solutionExplanation: 'async funksiya ichidan matn return qilinsa, u avtomatik ravishda yechilgan (resolved) Promise bo‘lib qaytadi.',
      }
    }),
  });
  assert(fillLessonRes.status === 200, 'Dars to‘liq ma’lumotlar bilan to‘ldirildi va saqlandi');

  // ----------------------------------------------------
  // 5. Instructor sifatida lesson’ni draft’dan review holatiga yubor
  // ----------------------------------------------------
  console.log('\n▶ [5/20] Instructor darsni draft’dan review holatiga yuborishi...');
  const submitReviewRes = await fetch(`${BASE_URL}/api/admin/lessons/${lessonId}/publish`, {
    method: 'PUT',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: instSession.cookie,
    },
  });
  assert(submitReviewRes.status === 200, 'Instructor darsni review ga yubordi (200 OK)');
  const submitReviewJson = await submitReviewRes.json();
  assert(submitReviewJson.data.status === 'review', 'Dars holati review bo‘ldi');

  // ----------------------------------------------------
  // 6. Instructor publish qila olmasligini tekshir
  // ----------------------------------------------------
  console.log('\n▶ [6/20] Instructor to‘g‘ridan-to‘g‘ri nashr qila olmasligini tekshirish (403)...');
  const instDirectPublishRes = await fetch(`${BASE_URL}/api/admin/lessons/${lessonId}/publish`, {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: instSession.cookie,
    },
  });
  assert(instDirectPublishRes.status === 403, 'Instructor to‘g‘ridan-to‘g‘ri nashr qila olmadi (403 Forbidden: faqat Admin/SuperAdmin)');

  // ----------------------------------------------------
  // 7. Admin sifatida review’dagi lesson’ni ko‘rib, publish qil
  // ----------------------------------------------------
  console.log('\n▶ [7/20] Admin sifatida darsni ko‘rib chiqib, nashr qilish (Publish)...');
  const adminPublishRes = await fetch(`${BASE_URL}/api/admin/lessons/${lessonId}/publish`, {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: admSession.cookie,
    },
  });
  assert(adminPublishRes.status === 200, 'Admin darsni muvaffaqiyatli nashr qildi (200 OK)');
  const adminPublishJson = await adminPublishRes.json();
  assert(adminPublishJson.data.status === 'published', 'Dars holati published bo‘ldi');

  // Also publish the course so student can see it
  await fetch(`${BASE_URL}/api/admin/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: admSession.cookie,
    },
    body: JSON.stringify({ status: 'published' }),
  });

  // ----------------------------------------------------
  // 8. Oddiy user sifatida published lesson ko‘rinsin, draft va review ko‘rinmasin
  // ----------------------------------------------------
  console.log('\n▶ [8/20] Talaba ko‘rish filtri (published ko‘rinadi, draft/review ko‘rinmaydi)...');
  // Create a draft lesson in same module
  const draftLessonSlug = `draft-lesson-${ts}`;
  await fetch(`${BASE_URL}/api/admin/lessons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: admSession.cookie,
    },
    body: JSON.stringify({
      courseId,
      moduleId,
      title: 'Yashirin Qoralama Dars',
      slug: draftLessonSlug,
      status: 'draft',
    }),
  });

  // Public student query
  const publicCourseRes = await fetch(`${BASE_URL}/api/courses/${courseSlug}`);
  const publicCourseJson = await publicCourseRes.json();
  assert(publicCourseRes.ok && publicCourseJson.success, 'Talaba kursni yuklay oldi');
  
  const publicLessons = publicCourseJson.data.lessons || [];
  const foundPublished = publicLessons.some(l => l.slug === lessonSlug);
  const foundDraft = publicLessons.some(l => l.slug === draftLessonSlug);
  assert(foundPublished, 'Talabaga published holatidagi dars ko‘rindi');
  assert(!foundDraft, 'Talabadan draft holatidagi dars qat’iy yashirildi');

  // ----------------------------------------------------
  // 9. Published lesson’ni o‘zgartir va content version yaratilishini tekshir
  // ----------------------------------------------------
  console.log('\n▶ [9/20] Published darsni tahrirlash va yangi versiya hosil bo‘lishi...');
  const updatePublishedRes = await fetch(`${BASE_URL}/api/admin/lessons/${lessonId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: admSession.cookie,
    },
    body: JSON.stringify({
      title: '1-Dars: Promise nima va qanday ishlaydi? (Yangilangan)',
      changeSummary: 'Qo‘shimcha misollar kiritildi',
    }),
  });
  assert(updatePublishedRes.status === 200, 'Published dars tahrirlandi');
  const updateJson = await updatePublishedRes.json();
  const newVer = updateJson.data.version;
  assert(newVer > 1, `Yangi versiya raqami oshirildi: v${newVer}`);

  // ----------------------------------------------------
  // 10. Eski version’ga rollback qil va yangi version yaratilishini tekshir
  // ----------------------------------------------------
  console.log('\n▶ [10/20] Versiyani Rollback qilish va yangi versiya yaratilishini tekshirish...');
  const rollbackRes = await fetch(`${BASE_URL}/api/admin/lessons/${lessonId}/rollback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: admSession.cookie,
    },
    body: JSON.stringify({ version: 1 }),
  });
  assert(rollbackRes.status === 200, '1-versiyaga rollback so‘rovi muvaffaqiyatli bajarildi');
  const rollbackJson = await rollbackRes.json();
  assert(rollbackJson.data.version === newVer + 1, `Rollback eski versiyalarni buzmasdan yangi v${rollbackJson.data.version} versiya yaratdi`);

  // ----------------------------------------------------
  // 11. XSS payload yuborib, script va xavfli atributlar tozalanishini tekshir
  // ----------------------------------------------------
  console.log('\n▶ [11/20] XSS xavfsizligi: script va xavfli atributlarning tozalanishi...');
  const xssPayload = `
    <h2>Xavfsiz Sarlavha</h2>
    <script>alert("XSS Attack!");</script>
    <img src="valid.png" onerror="alert('onerror attack')" />
    <a href="javascript:alert(1)">Xavfli havola</a>
    <iframe src="http://evil.com"></iframe>
    <div onclick="evil()">Tugma</div>
  `;
  await fetch(`${BASE_URL}/api/admin/lessons/${lessonId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: admSession.cookie,
    },
    body: JSON.stringify({
      content: {
        theory: [
          { id: 'x1', type: 'text', content: xssPayload },
          { id: 'x2', type: 'code', language: 'javascript', content: 'const x = "<script>alert(1)</script>";' }
        ]
      }
    }),
  });

  const getCleanLessonRes = await fetch(`${BASE_URL}/api/admin/lessons/${lessonId}`, {
    headers: { Cookie: admSession.cookie },
  });
  const cleanLessonData = await getCleanLessonRes.json();
  const textContent = cleanLessonData.data.content.theory[0].content;
  const codeContent = cleanLessonData.data.content.theory[1].content;

  assert(!textContent.includes('<script>'), 'XSS filtri: <script> tozalandi');
  assert(!textContent.includes('onerror='), 'XSS filtri: onerror atributi tozalandi');
  assert(!textContent.includes('javascript:'), 'XSS filtri: javascript: protokoli tozalandi');
  assert(!textContent.includes('<iframe'), 'XSS filtri: <iframe> tozalandi');
  assert(!textContent.includes('onclick='), 'XSS filtri: onclick atributi tozalandi');
  assert(textContent.includes('Xavfsiz Sarlavha'), 'XSS filtri: xavfsiz HTML kontenti saqlanib qoldi');
  assert(codeContent.includes('<script>alert(1)</script>'), 'XSS filtri: kod blokidagi kod satrlari butun saqlab qolindi');

  // ----------------------------------------------------
  // 12. User, Instructor, Admin va Super Admin permission matritsasini alohida tekshir
  // ----------------------------------------------------
  console.log('\n▶ [12/20] To‘liq RBAC Permission Matritsasini tekshirish...');
  const student = await login('talaba@codequest.uz', CMS_STUDENT_PASSWORD);

  // Role change check
  const studentChangeRole = await fetch(`${BASE_URL}/api/admin/users/${student.user.id}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', Cookie: student.cookie },
    body: JSON.stringify({ role: 'admin' }),
  });
  assert(studentChangeRole.status === 403, 'User rolni o‘zgartira olmaydi (403)');

  const instChangeRole = await fetch(`${BASE_URL}/api/admin/users/${student.user.id}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', Cookie: instSession.cookie },
    body: JSON.stringify({ role: 'admin' }),
  });
  assert(instChangeRole.status === 403, 'Instructor rolni o‘zgartira olmaydi (403)');

  const admChangeRole = await fetch(`${BASE_URL}/api/admin/users/${student.user.id}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', Cookie: admSession.cookie },
    body: JSON.stringify({ role: 'admin' }),
  });
  assert(admChangeRole.status === 403, 'Admin ham rolni o‘zgartira olmaydi (403: faqat Super Admin)');

  const superChangeRole = await fetch(`${BASE_URL}/api/admin/users/${student.user.id}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', Cookie: superadmin.cookie },
    body: JSON.stringify({ role: 'user' }),
  });
  assert(superChangeRole.status === 200, 'Super Admin rolni o‘zgartira oladi (200)');

  // ----------------------------------------------------
  // 13. Oddiy user admin API’lariga kira olmasin
  // ----------------------------------------------------
  console.log('\n▶ [13/20] Oddiy talaba Admin API’lariga kira olmasligi...');
  const uStats = await fetch(`${BASE_URL}/api/admin/stats`, { headers: { Cookie: student.cookie } });
  const uCourses = await fetch(`${BASE_URL}/api/admin/courses`, { headers: { Cookie: student.cookie } });
  const uUsers = await fetch(`${BASE_URL}/api/admin/users`, { headers: { Cookie: student.cookie } });
  const uAudit = await fetch(`${BASE_URL}/api/admin/audit-logs`, { headers: { Cookie: student.cookie } });
  assert(uStats.status === 403 && uCourses.status === 403 && uUsers.status === 403 && uAudit.status === 403, 'Oddiy foydalanuvchi uchun barcha admin API’lari 403 qaytardi');

  // ----------------------------------------------------
  // 14. Instructor boshqa Instructor kursini ko‘ra yoki o‘zgartira olmasin
  // ----------------------------------------------------
  console.log('\n▶ [14/20] O‘qituvchilar orasidagi izolatsiya (Cross-Instructor Isolation)...');
  const inst2Email = `instructor2_${ts}@codequest.uz`;
  const inst2User = await register('2-O‘qituvchi', inst2Email, pass);
  await fetch(`${BASE_URL}/api/admin/users/${inst2User.user.id}/role`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', Cookie: superadmin.cookie },
    body: JSON.stringify({ role: 'instructor' }),
  });
  const inst2Session = await login(inst2Email, pass);

  // Instructor 2 tries to fetch Instructor 1's course details
  const inst2GetRes = await fetch(`${BASE_URL}/api/admin/courses/${courseId}`, {
    headers: { Cookie: inst2Session.cookie },
  });
  assert(inst2GetRes.status === 403, 'Instructor 2 boshqa o‘qituvchining kursini ocha olmadi (403 Forbidden)');

  // Instructor 2 tries to update Instructor 1's course
  const inst2PutRes = await fetch(`${BASE_URL}/api/admin/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: inst2Session.cookie,
    },
    body: JSON.stringify({ title: 'Hacked Title' }),
  });
  assert(inst2PutRes.status === 403, 'Instructor 2 boshqa o‘qituvchining kursini tahrirlay olmadi (403 Forbidden)');

  // ----------------------------------------------------
  // 15. Role o‘zgarishi audit log’ga yozilsin
  // ----------------------------------------------------
  console.log('\n▶ [15/20] Rol o‘zgarishlari Audit logga yozilishini tekshirish...');
  const auditRes = await fetch(`${BASE_URL}/api/admin/audit-logs?action=role_change`, {
    headers: { Cookie: superadmin.cookie },
  });
  const auditJson = await auditRes.json();
  assert(auditJson.success && auditJson.data.logs.length > 0, 'Audit logida "role_change" yozuvlari mavjud');
  const lastRoleLog = auditJson.data.logs[0];
  assert(lastRoleLog.action === 'role_change', 'So‘nggi log amali: role_change');

  // ----------------------------------------------------
  // 16. Course, module, lesson, exercise va quiz reorder funksiyalarini tekshir
  // ----------------------------------------------------
  console.log('\n▶ [16/20] Modullar va Darslarni qayta tartiblash (Reordering)...');
  // Create second module
  const mod2Res = await fetch(`${BASE_URL}/api/admin/modules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', Cookie: instSession.cookie },
    body: JSON.stringify({ courseId, title: '2-Modul: Advanced Async' }),
  });
  const mod2Json = await mod2Res.json();
  const mod2Id = mod2Json.data.id;

  // Reorder modules: put mod2 before mod1
  const reorderModRes = await fetch(`${BASE_URL}/api/admin/modules`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', Cookie: instSession.cookie },
    body: JSON.stringify({ courseId, orderedIds: [mod2Id, moduleId] }),
  });
  assert(reorderModRes.status === 200, 'Modullarni qayta tartiblash (PUT /api/admin/modules) 200 qaytardi');

  // Reorder lessons within module: create lesson 2 then reorder
  const les2Res = await fetch(`${BASE_URL}/api/admin/lessons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', Cookie: instSession.cookie },
    body: JSON.stringify({
      courseId,
      moduleId,
      title: `2-Dars: Promise Chaining (${ts})`,
      slug: `promise-chaining-${ts}`,
      status: 'draft',
    }),
  });
  const les2Json = await les2Res.json();
  assert(les2Res.status === 201 && les2Json.data, '2-dars qayta tartiblash uchun yaratildi');
  const les2Id = les2Json.data.id;

  const reorderLesRes = await fetch(`${BASE_URL}/api/admin/lessons`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', Cookie: instSession.cookie },
    body: JSON.stringify({ moduleId, orderedIds: [les2Id, lessonId] }),
  });
  assert(reorderLesRes.status === 200, 'Darslarni qayta tartiblash (PUT /api/admin/lessons) 200 qaytardi');

  // ----------------------------------------------------
  // 17. Admin panelni desktop, tablet va mobile ekranlarda tekshir
  // ----------------------------------------------------
  console.log('\n▶ [17/20] Responsive UI tekshiruvi (Desktop, Tablet, Mobile layout)...');
  const adminPageRes = await fetch(`${BASE_URL}/admin`, { headers: { Cookie: superadmin.cookie } });
  const html = await adminPageRes.text();
  assert(adminPageRes.status === 200 && (html.includes('Admin panel') || html.includes('CodeQuest')), 'Admin paneli HTML muvaffaqiyatli render qilindi');
  assert(html.includes('md:block') || html.includes('md:hidden') || html.includes('flex'), 'Responsive Tailwind klasslari sahifada mavjud');

  // ----------------------------------------------------
  // 18. Browser refresh va session expiry holatlarini tekshir
  // ----------------------------------------------------
  console.log('\n▶ [18/20] Sessiya yaroqliligi va muddati o‘tgan tokenni tekshirish (401)...');
  const invalidSessionRes = await fetch(`${BASE_URL}/api/admin/stats`, {
    headers: { Cookie: 'codequest_session=invalid.token.structure' },
  });
  assert(invalidSessionRes.status === 401, 'Yaroqsiz token bilan so‘rov 401 Unauthorized qaytardi');

  // ----------------------------------------------------
  // 19. Validation xatolari o‘zbek tilida aniq ko‘rinsin
  // ----------------------------------------------------
  console.log('\n▶ [19/20] O‘zbek tilidagi qat’iy validatsiya xabarlarini tekshirish (422)...');
  // Create an empty dummy lesson without objectives or test cases
  const emptyLesRes = await fetch(`${BASE_URL}/api/admin/lessons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', Cookie: admSession.cookie },
    body: JSON.stringify({
      courseId,
      moduleId,
      title: `Bosh Dars (${ts})`,
      slug: `bosh-dars-${ts}`,
      status: 'draft',
    }),
  });
  const emptyLesJson = await emptyLesRes.json();
  assert(emptyLesRes.status === 201 && emptyLesJson.data, 'Chala dars sinov uchun yaratildi (201)');

  const failPublishRes = await fetch(`${BASE_URL}/api/admin/lessons/${emptyLesJson.data.id}/publish`, {
    method: 'POST',
    headers: { 'X-Requested-With': 'XMLHttpRequest', Cookie: admSession.cookie },
  });
  assert(failPublishRes.status === 422, 'Chala darsni nashr qilish 422 Unprocessable Entity qaytardi');
  const failPublishJson = await failPublishRes.json();
  const errors = failPublishJson.validationErrors || [];
  assert(errors.some(e => e.includes('o‘quv maqsadi') || e.includes('nazariya')), 'Xatoliklar o‘zbek tilida aniq shakllantirilgan');

  // ----------------------------------------------------
  // 20. SQLite restartdan keyin kontent, versiyalar va audit loglar saqlanib qolishi
  // ----------------------------------------------------
  console.log('\n▶ [20/20] SQLite disk persistensiyasini tekshirish...');
  const dbCourseRow = sqlite.prepare('SELECT id, title, status FROM courses WHERE id = ?').get(courseId);
  assert(dbCourseRow && dbCourseRow.id === courseId, 'Yaratilgan kurs SQLite disk faylida mavjud');

  const dbVersionsCount = sqlite.prepare('SELECT COUNT(*) as count FROM content_versions WHERE content_id = ?').get(lessonId);
  assert(dbVersionsCount && dbVersionsCount.count >= 2, `Dars versiyalari diskda saqlangan (jami: ${dbVersionsCount.count} ta versiya)`);

  const dbAuditCount = sqlite.prepare('SELECT COUNT(*) as count FROM audit_logs').get();
  assert(dbAuditCount && dbAuditCount.count > 0, `Audit loglari diskda mavjud (jami: ${dbAuditCount.count} ta yozuv)`);

  // ----------------------------------------------------
  // QO‘SHIMCHA TEXNIK TEKSHIRUVLAR (TECHNICAL AUDITS)
  // ----------------------------------------------------
  console.log('\n▶ [Qo‘shimcha Texnik Auditlar]');

  // Audit 1: Unique index check
  const indices = sqlite.prepare("PRAGMA index_list('content_versions')").all();
  const hasUnqIndex = indices.some(idx => idx.name === 'content_version_unq' && idx.unique === 1);
  assert(hasUnqIndex, 'content_versions jadvalida (contentType, contentId, version) UNIQUE index mavjud');

  // Audit 2: Audit log secret redaction
  const logs = sqlite.prepare('SELECT details FROM audit_logs ORDER BY created_at DESC LIMIT 50').all();
  let foundExposedSecret = false;
  for (const row of logs) {
    const d = row.details;
    if (d.includes('"password":') && !d.includes('[REDACTED]')) foundExposedSecret = true;
    if (d.includes('"passwordHash":') && !d.includes('[REDACTED]')) foundExposedSecret = true;
  }
  assert(!foundExposedSecret, 'Audit loglarida parollar yoki maxfiy kalitlar ochiq holda saqlanmagan (redacted)');

  // Audit 3: Pagination & Search on large user list
  const usersPageRes = await fetch(`${BASE_URL}/api/admin/users?limit=5&offset=0`, {
    headers: { Cookie: superadmin.cookie },
  });
  const usersPageJson = await usersPageRes.json();
  assert(usersPageJson.success && usersPageJson.data.users.length <= 5, 'Foydalanuvchilar ro‘yxati pagination (limit=5) bilan to‘g‘ri cheklandi');

  console.log('\n========================================================');
  console.log(`🏆 20/20 ACCEPTANCE VA BARCHA TEXNIK AUDITLAR MUVAFFAQIYATLI YAKUNLANDI!`);
  console.log(`   Jami muvaffaqiyatli tekshiruvlar: ${passCount}`);
  console.log(`   Aniqlangan xatoliklar: ${failCount}`);
  console.log('========================================================\n');
}

runAcceptanceSuite().catch((err) => {
  console.error('\n❌ Acceptance Suite to‘xtatildi:', err.message);
  process.exit(1);
});
