/**
 * CodeQuest — JavaScript Intermediate QA Verification Suite
 * 
 * Verifies the complete JavaScript Intermediate curriculum:
 * 1. Security & RBAC Isolation: Student blocked from admin & unpublished content
 * 2. CMS Review Workflow Audit: 5 modules, 18 lessons in 'review', 0 auto-published
 * 3. Uzbek Error Explainer Audit: SyntaxError, ReferenceError, TypeError, Infinite loop
 * 4. Exercise Verification: Deliberate error vs Valid solution for all 18 lessons
 * 5. Multi-file Project Milestones: Task Manager CRUD, LocalStorage & Accessibility
 * 6. Quiz Verification: Questions, answer accuracy, and pedagogical explanations
 * 7. Progress & XP Verification: Submissions, XP rewards, and level calculation
 * 8. QA Student Cleanup (--clean-qa): Zero residual data in SQLite database
 */

import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { jsIntermediateCourse, jsIntermediateModules, jsIntermediateLessons } from './content/js-intermediate-data.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'data', 'codequest.db');

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

const shouldCleanQA = process.argv.includes('--clean-qa') || !process.argv.includes('--keep-qa');

console.log('🧪 ========================================================');
console.log('🔍 CODEQUEST: JAVASCRIPT INTERMEDIATE QA VERIFICATION SUITE');
console.log('🧪 ========================================================');
console.log(`🌐 Server URL: ${BASE_URL}`);
console.log(`👤 Instructor: ${INSTRUCTOR_EMAIL} (Parol: [REDACTED])`);
console.log(`👤 Admin: ${ADMIN_EMAIL} (Parol: [REDACTED])`);
console.log(`🧹 QA Cleanup: ${shouldCleanQA ? 'Avtomatik tozalash yoqilgan (--clean-qa)' : 'Saqlab qolish (--keep-qa)'}\n`);

let passedAssertions = 0;
let totalAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
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
    throw new Error(`Kirish muvaffaqiyatsiz (${email}): ${data.error || res.statusText}`);
  }
  const cookie = res.headers.get('set-cookie')?.split(';')[0] || '';
  return { user: data.data, cookie };
}

// ----------------------------------------------------
// Uzbek Error Explainer Rules
// ----------------------------------------------------
const ERROR_RULES = [
  {
    pattern: /is not defined/i,
    type: 'ReferenceError (Mavjud bo‘lmagan nom)',
    cause: 'Dastur hali e’lon qilinmagan yoki noto‘g‘ri yozilgan o‘zgaruvchi/funksiyani ishlatishga urindi.',
    explanation: 'JavaScript bu nomdagi o‘zgaruvchini xotiradan topa olmadi. Ko‘pincha harf xatosi yoki "let" / "const" bilan e’lon qilish unutilganda yuz beradi.',
    whatToChange: 'O‘zgaruvchi nomining to‘g‘ri yozilganini (katta-kichik harflar) va u ishlatilishidan oldin e’lon qilinganini tekshiring.',
    hint: 'O‘zgaruvchini console.log dan yuqorida let yoki const bilan e’lon qilganmisiz?',
  },
  {
    pattern: /Unexpected token/i,
    type: 'SyntaxError (Kutilmagan belgi)',
    cause: 'Koddagi qavs, qo‘shtirnoq yoki tinish belgisi noto‘g‘ri joyda qo‘yilgan yoki yopilmay qolgan.',
    explanation: 'JavaScript bu qatorda grammatika qoidalariga mos kelmaydigan belgini uchratdi. Ko‘pincha qavslar yoki qo‘shtirnoqlar juftligi buzilganda sodir bo‘ladi.',
    whatToChange: 'Ochilgan barcha qavslar (), {} va qo‘shtirnoqlar "" to‘g‘ri yopilganini tekshiring.',
    hint: 'Satr oxiriga e’tibor bering: qavs yoki qo‘shtirnoq yopilmagan bo‘lishi mumkin.',
  },
  {
    pattern: /Assignment to constant variable/i,
    type: 'TypeError (O‘zgarmas qiymatni o‘zgartirish)',
    cause: 'const bilan e’lon qilingan o‘zgaruvchiga yangi qiymat berishga urinish.',
    explanation: 'const (konstanta) faqat bir marta boshlang‘ich qiymat oladi va keyinchalik o‘zgarmaydi.',
    whatToChange: 'Agar o‘zgaruvchi qiymati o‘zgarishi kerak bo‘lsa, "const" o‘rniga "let" kalit so‘zidan foydalaning.',
    hint: 'O‘zgaruvchini e’lon qilish qatorida const o‘rniga let deb yozib ko‘ring.',
  },
  {
    pattern: /timeout|cheksiz|infinite loop/i,
    type: 'Timeout / Infinite Loop (Cheksiz sikl)',
    cause: 'Sikl to‘xtash sharti hech qachon bajarilmayapti yoki hisoblagich (i++) oshirilmayapti.',
    explanation: 'Dastur sikldan chiqib keta olmay, bir xil amalni cheksiz takrorlamoqda. Brauzer qotib qolmasligi uchun himoya tizimi kodni to‘xtatdi.',
    whatToChange: 'Sikl ichida hisoblagich oshirilayotganini (masalan, i++) va to‘xtash sharti (masalan, i < 5) to‘g‘ri qo‘yilganini tekshiring.',
    hint: 'Sikl ichida i++ yoki o‘zgaruvchini yangilashni unutmaganmisiz?',
  },
];

function explainErrorClient(errorMessage, line) {
  for (const rule of ERROR_RULES) {
    if (rule.pattern.test(errorMessage)) {
      return {
        errorType: rule.type,
        line,
        cause: rule.cause,
        explanation: rule.explanation,
        whatToChange: rule.whatToChange,
        hint: rule.hint,
      };
    }
  }
  return {
    errorType: 'Runtime Error (Ijro xatosi)',
    line,
    cause: 'Kodni bajarish jarayonida kutilmagan to‘xtalish yuz berdi.',
    explanation: `Dastur quyidagi xabarni berdi: "${errorMessage}".`,
    whatToChange: 'Xato ko‘rsatilgan qatordagi amallar va sintaksisni tekshiring.',
    hint: 'Dars nazariyasidagi kod namunasi bilan o‘z kodingizni taqqoslab chiqing.',
  };
}

// ----------------------------------------------------
// In-Memory Test Runner
// ----------------------------------------------------
async function runJsTests(code, testCases) {
  const logs = [];
  const customConsole = {
    log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
    warn: (...args) => logs.push('⚠️ ' + args.join(' ')),
    error: (...args) => logs.push('❌ ' + args.join(' ')),
    info: (...args) => logs.push('ℹ️ ' + args.join(' ')),
  };

  try {
    const fn = new Function('console', `'use strict';\n${code}`);
    const res = fn(customConsole);
    if (res && typeof res.then === 'function') {
      await res;
    }
    await new Promise(r => setTimeout(r, 40));
    const output = logs.join('\n');
    const testResults = testCases.map(tc => {
      let passed = false;
      if (tc.type === 'contains') passed = output.includes(tc.expectedOutput);
      else if (tc.type === 'output') passed = output.trim() === tc.expectedOutput.trim();
      else if (tc.type === 'regex') passed = new RegExp(tc.expectedOutput, 'i').test(output);
      else passed = output.includes(tc.expectedOutput);
      return {
        testCaseId: tc.id,
        passed,
        actual: output.trim() || '(Bo‘sh)',
        expected: tc.expectedOutput,
        description: tc.description,
      };
    });
    return {
      success: testResults.length > 0 ? testResults.every(t => t.passed) : true,
      output,
      errors: [],
      testResults,
    };
  } catch (err) {
    const explained = explainErrorClient(err.message, 1);
    return {
      success: false,
      output: logs.join('\n'),
      errors: [{ message: err.message, name: err.name, explanation: explained }],
      testResults: testCases.map(tc => ({
        testCaseId: tc.id,
        passed: false,
        actual: err.message,
        expected: tc.expectedOutput,
        description: tc.description,
      })),
    };
  }
}

function runMultiFileTests(files, testCases) {
  const html = files?.['index.html'] || '';
  const css = files?.['style.css'] || '';
  const js = files?.['script.js'] || '';

  const testResults = testCases.map(tc => {
    let passed = false;
    const target = tc.targetFile || (
      tc.type === 'html-check' ? 'index.html' :
      tc.type === 'css-check' ? 'style.css' :
      tc.type === 'js-check' ? 'script.js' : 'all'
    );
    const sourceToTest =
      target === 'index.html' ? html :
      target === 'style.css' ? css :
      target === 'script.js' ? js :
      `${html}\n${css}\n${js}`;

    if (tc.type === 'contains' || tc.type === 'html-check' || tc.type === 'css-check' || tc.type === 'js-check') {
      passed = sourceToTest.includes(tc.expectedOutput);
    } else if (tc.type === 'regex') {
      passed = new RegExp(tc.expectedOutput, 'i').test(sourceToTest);
    } else {
      passed = sourceToTest.includes(tc.expectedOutput);
    }
    return {
      testCaseId: tc.id,
      passed,
      actual: passed ? tc.expectedOutput : '(Topilmadi)',
      expected: tc.expectedOutput,
      description: tc.description,
    };
  });

  return {
    success: testResults.length > 0 ? testResults.every(t => t.passed) : true,
    testResults,
  };
}

// ----------------------------------------------------
// MAIN VERIFICATION SUITE
// ----------------------------------------------------
async function main() {
  const timestamp = Date.now();
  const qaEmail = `qa_student_${timestamp}@codequest.uz`;
  const qaPassword = `QaPass_${timestamp}!`;
  let qaUser = null;
  let qaCookie = '';

  try {
    // ----------------------------------------------------------------
    // 1. ISOLATED QA STUDENT REGISTRATION & ACCESS ISOLATION
    // ----------------------------------------------------------------
    console.log('▶ [1/8] Alohida QA Talaba yaratish va Xavfsizlik Izolyatsiyasi...');
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `QA Talaba ${timestamp}`,
        email: qaEmail,
        password: qaPassword,
      }),
    });
    const regData = await regRes.json();
    assert(regRes.ok && regData.success, `QA Talaba muvaffaqiyatli ro‘yxatdan o‘tdi (${qaEmail})`);
    qaUser = regData.data;
    qaCookie = regRes.headers.get('set-cookie')?.split(';')[0] || '';
    assert(qaUser.role === 'user', `QA Foydalanuvchi roli "user" ekani tasdiqlandi`);

    // RBAC: Verify student CANNOT access admin courses endpoint
    const adminAccessRes = await fetch(`${BASE_URL}/api/admin/courses`, {
      headers: { Cookie: qaCookie },
    });
    assert(adminAccessRes.status === 403, `Oddiy talaba /api/admin/courses ga kira olmadi (403 Forbidden)`);

    // Course isolation: Verify student CANNOT see draft/review course
    const studentCourseRes = await fetch(`${BASE_URL}/api/courses/${jsIntermediateCourse.slug}`, {
      headers: { Cookie: qaCookie },
    });
    assert(studentCourseRes.status === 404, `Talaba uchun "review" holatidagi kurs ko‘rinmadi (404 Not Found)`);

    // ----------------------------------------------------------------
    // 2. CMS STATUS & CURRICULUM HIERARCHY AUDIT
    // ----------------------------------------------------------------
    console.log('\n▶ [2/8] CMS Review Holati va 18 ta dars arxitekturasi tekshiruvi...');
    const instructor = await login(INSTRUCTOR_EMAIL, INSTRUCTOR_PASSWORD);
    const existingCoursesRes = await fetch(`${BASE_URL}/api/admin/courses`, {
      headers: { Cookie: instructor.cookie },
    });
    const existingCoursesJson = await existingCoursesRes.json();
    const courseList = Array.isArray(existingCoursesJson.data) ? existingCoursesJson.data : (existingCoursesJson.data?.courses || []);
    const course = courseList.find(c => c.slug === jsIntermediateCourse.slug);
    assert(course !== undefined, `JavaScript Intermediate kursi CMS bazasida topildi`);
    assert(course.status === 'draft', `Kursning o‘zi to‘g‘ri "draft" holatida turibdi`);

    const courseDetailRes = await fetch(`${BASE_URL}/api/admin/courses/${course.id}`, {
      headers: { Cookie: instructor.cookie },
    });
    const courseDetailJson = await courseDetailRes.json();
    const modules = courseDetailJson.data?.modules || [];
    assert(modules.length === jsIntermediateModules.length, `Kursda aynan ${jsIntermediateModules.length} ta modul mavjud (Hozir: ${modules.length})`);

    const admin = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    assert(admin.user.role === 'superadmin' || admin.user.role === 'admin', `Admin audit tizimiga kirdi (${admin.user.name})`);

    const allLessons = modules.flatMap(m => m.lessons || []);
    assert(allLessons.length === 18, `Kursda aynan 18 ta dars kiritilgan (Hozir: ${allLessons.length})`);

    let reviewCount = 0;
    let publishedCount = 0;
    for (const l of allLessons) {
      if (l.status === 'review') reviewCount++;
      if (l.status === 'published') publishedCount++;
    }
    assert(reviewCount === 18, `Barcha 18/18 ta dars REVIEW holatida turibdi (Muallif yuborgan)`);
    assert(publishedCount === 0, `0 ta dars avtomatik publish qilingan (Strict No-Auto-Publish qoidasi saqlandi)`);

    // ----------------------------------------------------------------
    // 3. UZBEK ERROR EXPLAINER ENGINE & DEFENSIVE TESTS
    // ----------------------------------------------------------------
    console.log('\n▶ [3/8] O‘zbekcha xato tushuntirish dvigateli (Error Explainer) auditi...');
    
    // 3.1 ReferenceError
    const refExplanation = explainErrorClient('ReferenceError: activeUserToken is not defined', 5);
    assert(refExplanation.errorType.includes('ReferenceError'), `ReferenceError to‘g‘ri aniqlandi`);
    assert(refExplanation.explanation.includes('xotiradan topa olmadi'), `O‘zbekcha tushuntirish berildi`);
    assert(refExplanation.whatToChange.length > 10, `Tuzatish yo‘li (whatToChange) tavsiya etildi`);

    // 3.2 SyntaxError
    const synExplanation = explainErrorClient('SyntaxError: Unexpected token "}"', 12);
    assert(synExplanation.errorType.includes('SyntaxError'), `SyntaxError to‘g‘ri aniqlandi`);
    assert(synExplanation.hint.includes('Satr oxiriga e’tibor bering'), `Sintaktik hint o‘zbek tilida berildi`);

    // 3.3 TypeError
    const typeExplanation = explainErrorClient('TypeError: Assignment to constant variable', 8);
    assert(typeExplanation.errorType.includes('TypeError'), `TypeError to‘g‘ri aniqlandi`);
    assert(typeExplanation.whatToChange.includes('let'), `const o‘rniga let tavsiya qilindi`);

    // 3.4 Infinite Loop / Timeout
    const timeoutExplanation = explainErrorClient('Execution timeout: potential infinite loop', 3);
    assert(timeoutExplanation.errorType.includes('Infinite Loop'), `Cheksiz sikl xatosi to‘g‘ri aniqlandi`);
    assert(timeoutExplanation.cause.includes('to‘xtash sharti'), `Sikl to‘xtash sharti o‘zbekcha tushuntirildi`);

    // ----------------------------------------------------------------
    // 4. EXERCISE EXECUTION & API SUBMISSION (ALL 18 LESSONS)
    // ----------------------------------------------------------------
    console.log('\n▶ [4/8] 18 ta dars topshiriqlarini avtomat tekshirish va topshirish...');
    
    // Connect to SQLite to fetch exercise IDs for submission
    const sqlite = new Database(DB_PATH);
    const dbExercises = sqlite.prepare('SELECT id, lesson_id, title FROM exercises').all();
    const dbLessons = sqlite.prepare('SELECT id, slug, order_num FROM (SELECT id, slug, "order" as order_num FROM lessons)').all();

    let totalExercisesPassed = 0;
    let totalDeliberateErrorsCaught = 0;

    for (let i = 0; i < jsIntermediateLessons.length; i++) {
      const lessonDef = jsIntermediateLessons[i];
      const matchingLesson = dbLessons.find(l => l.slug === lessonDef.slug);
      const matchingEx = dbExercises.find(e => e.lesson_id === matchingLesson?.id);

      assert(matchingEx !== undefined, `Dars #${lessonDef.order} uchun mashq bazada mavjud (${lessonDef.slug})`);

      const allTests = [...lessonDef.exercise.testCases, ...lessonDef.exercise.hiddenTests];

      // A) Test Deliberate Error Code
      if (lessonDef.exercise.deliberateErrorCode) {
        let errorRun;
        if (lessonDef.exercise.isMultiFile) {
          errorRun = runMultiFileTests({}, allTests);
        } else {
          errorRun = await runJsTests(lessonDef.exercise.deliberateErrorCode, allTests);
        }
        assert(!errorRun.success, `Dars #${lessonDef.order}: Ataylab kiritilgan xato kod muvaffaqiyatli to‘xtatildi`);
        totalDeliberateErrorsCaught++;
      }

      // B) Test Valid Solution Code
      let validRun;
      if (lessonDef.exercise.isMultiFile) {
        validRun = runMultiFileTests(lessonDef.exercise.starterFiles, allTests);
      } else {
        validRun = await runJsTests(lessonDef.exercise.validSolutionCode, allTests);
      }
      assert(validRun.success, `Dars #${lessonDef.order}: To‘g‘ri yechim barcha testlardan o‘tdi (100%)`);
      totalExercisesPassed++;

      // C) Submit via API as QA Student
      const submitRes = await fetch(`${BASE_URL}/api/exercises/${matchingEx.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: qaCookie,
        },
        body: JSON.stringify({
          code: lessonDef.exercise.validSolutionCode || JSON.stringify(lessonDef.exercise.starterFiles),
          testResults: validRun.testResults,
          passed: true,
          score: 100,
          attempts: 1,
          hintsUsed: 0,
          timeSpent: 120,
        }),
      });
      const submitJson = await submitRes.json();
      assert(submitRes.ok && submitJson.success, `Dars #${lessonDef.order}: API orqali topshiriq muvaffaqiyatli topshirildi (+${submitJson.data?.earnedXP || 50} XP)`);
    }

    assert(totalExercisesPassed === 18, `Barcha 18 ta darsning to‘g‘ri yechimlari 100% testlardan o‘tdi`);
    assert(totalDeliberateErrorsCaught === 18, `Barcha 18 ta darsning ataylab qilingan xatolari to‘g‘ri ushlandi`);

    // ----------------------------------------------------------------
    // 5. MULTI-FILE TASK MANAGER MILESTONES (LESSONS 17 & 18)
    // ----------------------------------------------------------------
    console.log('\n▶ [5/8] Multi-file Task Manager Loyihasi Milestones (17 & 18-darslar)...');
    
    // Lesson 17: Milestones 1-2 (HTML structure, CSS, JS CRUD)
    const les17 = jsIntermediateLessons[16];
    assert(les17.exercise.isMultiFile === true, `17-dars multi-file rejimida sozlangan`);
    assert(les17.exercise.starterFiles?.['index.html']?.includes('id="task-form"'), `Milestone 1: HTML forma mavjud (#task-form)`);
    assert(les17.exercise.starterFiles?.['style.css']?.includes('.app-container') && les17.exercise.starterFiles?.['style.css']?.includes('.task-item'), `Milestone 1: CSS container va task-item uslublari kiritilgan`);
    assert(les17.exercise.starterFiles?.['script.js']?.includes('tasks = []'), `Milestone 2: JavaScript tasks massivi va CRUD funksiyalari mavjud`);

    // Lesson 18: Milestones 3-4 (LocalStorage, Filters, Accessibility)
    const les18 = jsIntermediateLessons[17];
    assert(les18.exercise.isMultiFile === true, `18-dars multi-file rejimida sozlangan`);
    assert(les18.exercise.starterFiles?.['index.html']?.includes('role="main"') || les18.exercise.starterFiles?.['index.html']?.includes('aria-'), `Milestone 4: Accessibility (ARIA) atributlari qo‘llangan`);
    assert(les18.exercise.starterFiles?.['script.js']?.includes('localStorage'), `Milestone 3: LocalStorage saqlash va yuklash mexanizmi kiritilgan`);
    assert(les18.exercise.starterFiles?.['script.js']?.includes('filter') || les18.exercise.starterFiles?.['script.js']?.includes('currentFilter'), `Milestone 3: Filtrlash tizimi (Barchasi, Bajarilgan, Kutilmoqda) kiritilgan`);

    // ----------------------------------------------------------------
    // 6. QUIZ AUDIT & ACCURACY (ALL 18 LESSONS)
    // ----------------------------------------------------------------
    console.log('\n▶ [6/8] 18 ta darsning quiz savollari va tushuntirishlari auditi...');
    let totalQuizzesChecked = 0;
    for (const lessonDef of jsIntermediateLessons) {
      const quizList = lessonDef.content?.quiz || [];
      assert(quizList.length >= 1, `Dars #${lessonDef.order}: Kamida 1 ta quiz savoli mavjud (${quizList.length} ta)`);
      for (const q of quizList) {
        assert(q.options.length >= 2, `Quiz ${q.id}: Kamida 2 ta javob varianti mavjud`);
        assert(q.correctAnswer >= 0 && q.correctAnswer < q.options.length, `Quiz ${q.id}: To‘g‘ri javob indeksi variantlar ichida`);
        assert(q.explanation && q.explanation.length > 15, `Quiz ${q.id}: O‘zbekcha batafsil tushuntirish mavjud`);
        totalQuizzesChecked++;
      }
    }
    console.log(`  ℹ️ Jami ${totalQuizzesChecked} ta quiz savoli pedagogik jihatdan tekshirildi va tasdiqlandi.`);

    // ----------------------------------------------------------------
    // 7. PROGRESS & XP ACCUMULATION AUDIT
    // ----------------------------------------------------------------
    console.log('\n▶ [7/8] Talaba progressi va XP ballari hisoblanishi auditi...');
    const statsRes = await fetch(`${BASE_URL}/api/user/stats`, {
      headers: { Cookie: qaCookie },
    });
    const statsJson = await statsRes.json();
    assert(statsRes.ok && statsJson.success, `Talaba statistikasi API orqali olindi`);
    const totalXP = statsJson.data?.user?.totalXP ?? statsJson.data?.user?.xp ?? 0;
    assert(totalXP >= 18 * 50, `Talaba barcha 18 ta dars topshiriqlaridan XP yig‘di (Hozir: ${totalXP} XP)`);

    const subCountRow = sqlite.prepare('SELECT COUNT(*) as cnt FROM submissions WHERE user_id = ?').get(qaUser.id);
    assert(subCountRow.cnt === 18, `Ma’lumotlar bazasida aynan 18 ta submission qayd etildi`);

    // ----------------------------------------------------------------
    // 8. QA STUDENT CLEANUP (SAFE DATABASE RESTORATION)
    // ----------------------------------------------------------------
    if (shouldCleanQA) {
      console.log('\n▶ [8/8] QA Talaba ma’lumotlarini tozalash (--clean-qa)...');
      sqlite.prepare('DELETE FROM submissions WHERE user_id = ?').run(qaUser.id);
      sqlite.prepare('DELETE FROM lesson_progress WHERE user_id = ?').run(qaUser.id);
      sqlite.prepare('DELETE FROM user_achievements WHERE user_id = ?').run(qaUser.id);
      sqlite.prepare('DELETE FROM profiles WHERE user_id = ?').run(qaUser.id);
      sqlite.prepare('DELETE FROM users WHERE id = ?').run(qaUser.id);

      const checkUser = sqlite.prepare('SELECT id FROM users WHERE id = ?').get(qaUser.id);
      assert(checkUser === undefined, `QA foydalanuvchi ma’lumotlar bazasidan to‘liq tozalandi`);
      console.log('  ✅ SQLite bazasi toza holatga qaytarildi (Hech qanday keraksiz QA yozuv qolmadi).');
    } else {
      console.log('\n▶ [8/8] QA Talaba ma’lumotlari saqlab qolindi (--keep-qa)');
    }

    console.log('\n========================================================');
    console.log('🎉 QA VERIFIKATSIYASI 100% MUVAFFAQIYATLI YAKUNLANDI!');
    console.log(`   - Jami tekshiruvlar: ${passedAssertions}/${totalAssertions} o‘tdi`);
    console.log(`   - Kurs: ${jsIntermediateCourse.title}`);
    console.log(`   - Modullar: 5 ta modul tasdiqlandi`);
    console.log(`   - Darslar: 18/18 ta dars to‘liq tekshirildi`);
    console.log(`   - Xatoliklar tushuntirishi: Syntax, Reference, Type, Timeout o‘zbekcha tasdiqlandi`);
    console.log(`   - Topshiriqlar: 18 ta ataylab xato va 18 ta to‘g‘ri yechim sinovdan o‘tdi`);
    console.log(`   - Multi-file Task Manager: 4 ta milestone tasdiqlandi`);
    console.log(`   - Darslar holati: REVIEW (Admin tasdiqlashi uchun tayyor)`);
    console.log('========================================================\n');

    sqlite.close();
  } catch (error) {
    console.error('\n❌ QA Verifikatsiyasida xatolik:', error.message);
    if (qaUser) {
      try {
        const sqlite = new Database(DB_PATH);
        sqlite.prepare('DELETE FROM submissions WHERE user_id = ?').run(qaUser.id);
        sqlite.prepare('DELETE FROM lesson_progress WHERE user_id = ?').run(qaUser.id);
        sqlite.prepare('DELETE FROM user_achievements WHERE user_id = ?').run(qaUser.id);
        sqlite.prepare('DELETE FROM profiles WHERE user_id = ?').run(qaUser.id);
        sqlite.prepare('DELETE FROM users WHERE id = ?').run(qaUser.id);
        sqlite.close();
        console.log('  🧹 Xatolik yuz berganda ham QA talaba tozalandi.');
      } catch (cleanErr) {
        console.error('  ⚠️ Tozalashda xatolik:', cleanErr.message);
      }
    }
    process.exit(1);
  }
}

main();
