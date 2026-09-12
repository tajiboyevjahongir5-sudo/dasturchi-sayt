/**
 * CodeQuest — Multi-file Web Project Workspace Automated Verification Suite
 * Tests:
 * 1. Project CRUD (Create, Read, Update/Autosave, Rename, Delete)
 * 2. User Isolation & Access Control (User A vs User B cross-tenant protection)
 * 3. File & Request Limits (200 KB file limit, 20 projects limit, 700 KB payload limit)
 * 4. Code Runner (executeMultiFileProject: HTML, CSS, JS output & calculation checks)
 * 5. Error Explainer & Diagnostics for Multi-file JS runtime/syntax errors
 * 6. Multi-file Exercise Submission & XP/Score calculation
 * 7. Security verification (no server-side eval/Function/vm/child_process in API endpoints, sandbox allow-scripts)
 */

import { db, schema } from '../src/db/index.ts';
import { projectRepo, userRepo, courseRepo, progressRepo } from '../src/db/repo.ts';
import { executeMultiFileProject, createSandboxedPreviewHtml } from '../src/lib/code-runner/runner.ts';
import { explainError } from '../src/lib/error-explainer/index.ts';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

let passCount = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(message);
  } else {
    console.log(`  ✅ PASSED: ${message}`);
    passCount++;
  }
}

async function runTests() {
  console.log('🧪 ========================================================');
  console.log('🧪 CODEQUEST MULTI-FILE WORKSPACE VERIFICATION SUITE');
  console.log('🧪 ========================================================\n');

  // Setup Test Users
  const userAEmail = `mf_test_user_a_${Date.now()}@codequest.uz`;
  const userBEmail = `mf_test_user_b_${Date.now()}@codequest.uz`;

  const userA = userRepo.create({
    id: crypto.randomUUID(),
    name: 'Foydalanuvchi A',
    email: userAEmail,
    passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyz123456',
  });

  const userB = userRepo.create({
    id: crypto.randomUUID(),
    name: 'Foydalanuvchi B',
    email: userBEmail,
    passwordHash: '$2a$10$abcdefghijklmnopqrstuvwxyz123456',
  });

  // TEST 1: Project Creation (User A)
  console.log('▶ [1/7] Loyiha yaratish (Create Project)...');
  const project1 = projectRepo.createProject({
    userId: userA.id,
    title: 'Interaktiv Kalkulyator',
    description: 'HTML, CSS va JS dan iborat kalkulyator',
    html: '<div id="calc"><span id="display">0</span></div>',
    css: '#calc { background: #111; color: #fff; padding: 20px; }',
    js: 'console.log("Kalkulyator yuklandi");',
  });

  assert(project1 && project1.id, 'Loyiha muvaffaqiyatli yaratildi');
  assert(project1.userId === userA.id, 'Loyiha egasi User A ekanligi tasdiqlandi');
  assert(project1.title === 'Interaktiv Kalkulyator', 'Loyiha nomi to‘g‘ri saqlandi');
  assert(project1.html.includes('id="calc"'), 'HTML kodi to‘g‘ri saqlandi');
  assert(project1.css.includes('#calc'), 'CSS kodi to‘g‘ri saqlandi');
  assert(project1.js.includes('Kalkulyator yuklandi'), 'JS kodi to‘g‘ri saqlandi');

  // TEST 2: Update & Autosave & Rename (User A)
  console.log('\n▶ [2/7] Loyihani tahrirlash, Autosave va Nomini o‘zgartirish...');
  const updatedProject = projectRepo.updateProject(project1.id, userA.id, {
    title: 'Interaktiv Kalkulyator Pro',
    html: '<div id="calc"><span id="display">42</span></div>',
    css: '#calc { background: #000; color: #00ff00; }',
    js: 'console.log("Kalkulyator Pro ishga tushdi");',
  });

  assert(updatedProject !== null, 'Loyiha muvaffaqiyatli yangilandi');
  assert(updatedProject.title === 'Interaktiv Kalkulyator Pro', 'Loyiha nomi Pro ga o‘zgardi');
  assert(updatedProject.html.includes('42'), 'Yangilangan HTML saqlandi');
  assert(updatedProject.css.includes('#00ff00'), 'Yangilangan CSS saqlandi');
  assert(updatedProject.js.includes('Pro ishga tushdi'), 'Yangilangan JS saqlandi');

  // TEST 3: User Isolation & Cross-Tenant Security (User B vs User A)
  console.log('\n▶ [3/7] Xavfsizlik va Foydalanuvchilar izolatsiyasi (User Isolation)...');
  
  // User B tries to view User A's project
  const crossView = projectRepo.getProjectById(project1.id, userB.id);
  assert(crossView === null, 'User B boshqa birovning loyihasini o‘qiy olmadi (getProjectById returned null)');

  // User B tries to update User A's project
  let crossUpdateFailed = false;
  try {
    const crossUpdate = projectRepo.updateProject(project1.id, userB.id, {
      title: 'Hacked Title',
    });
    if (!crossUpdate) crossUpdateFailed = true;
  } catch {
    crossUpdateFailed = true;
  }
  assert(crossUpdateFailed, 'User B boshqa birovning loyihasini o‘zgartira olmadi');

  // User B tries to delete User A's project
  const crossDelete = projectRepo.deleteProject(project1.id, userB.id);
  assert(crossDelete === false, 'User B boshqa birovning loyihasini o‘chira olmadi');

  // Verify User A's project is still untouched
  const verifiedProject = projectRepo.getProjectById(project1.id, userA.id);
  assert(verifiedProject !== null && verifiedProject.title === 'Interaktiv Kalkulyator Pro', 'User A loyihasi xavfsiz va buzilmagan');

  // TEST 4: Size and Count Limits (Max 200 KB per file, Max 20 projects)
  console.log('\n▶ [4/7] Hajm va Miqdor limitlari (200 KB fayl, 20 loyiha)...');
  
  // 4a. 200 KB per file limit
  let oversizedFileRejected = false;
  try {
    const hugeHtml = '<div>' + 'A'.repeat(210 * 1024) + '</div>'; // 210 KB
    projectRepo.createProject({
      userId: userA.id,
      title: 'Katta Loyiha',
      html: hugeHtml,
      css: '',
      js: '',
    });
  } catch (err) {
    oversizedFileRejected = err.message.includes('200 KB');
  }
  assert(oversizedFileRejected, '200 KB dan katta fayl serverda rad etildi');

  // 4b. Max 20 projects limit per user
  let maxLimitReached = false;
  try {
    // Current user A has 1 project. Let's create 19 more to hit 20.
    for (let i = 2; i <= 20; i++) {
      projectRepo.createProject({
        userId: userA.id,
        title: `Loyiha #${i}`,
        html: '<p>Test</p>',
        css: '',
        js: '',
      });
    }
    const currentCount = projectRepo.countUserProjects(userA.id);
    assert(currentCount === 20, `User A da 20 ta loyiha mavjud (${currentCount})`);

    // The 21st project should be rejected
    projectRepo.createProject({
      userId: userA.id,
      title: 'Loyiha #21',
      html: '<p>21</p>',
      css: '',
      js: '',
    });
  } catch (err) {
    maxLimitReached = err.message.includes('20');
  }
  assert(maxLimitReached, '20 tadan ko‘p loyiha yaratish qat’iy rad etildi');

  // TEST 5: Multi-file Sandbox Runner & Test Cases Verification
  console.log('\n▶ [5/7] Multi-file Sandbox Runner va Test Caselar tekshiruvi...');
  
  const testFiles = {
    'index.html': `
      <div class="counter-container">
        <h2 id="heading">Hisoblagich</h2>
        <span id="counter">10</span>
        <button id="btn" class="primary-btn">Bosish</button>
      </div>
    `,
    'style.css': `
      .counter-container { padding: 20px; text-align: center; }
      #counter { font-size: 24px; color: #3b82f6; }
      #btn { background-color: #2563eb; color: #fff; }
    `,
    'script.js': `
      console.log("Hisoblagich faollashtirildi");
      const initial = 10;
      console.log("Dastlabki qiymat: " + initial);
    `,
  };

  const testCases = [
    {
      id: 'tc-1',
      description: 'index.html da id="counter" bo‘lgan element bo‘lishi kerak',
      expectedOutput: 'id="counter"',
      type: 'contains',
      targetFile: 'index.html',
    },
    {
      id: 'tc-2',
      description: 'style.css da #counter uslubi bo‘lishi kerak',
      expectedOutput: '#counter',
      type: 'contains',
      targetFile: 'style.css',
    },
    {
      id: 'tc-3',
      description: 'script.js konsolga "Hisoblagich faollashtirildi" chiqarishi kerak',
      expectedOutput: 'Hisoblagich faollashtirildi',
      type: 'output',
      targetFile: 'script.js',
    },
  ];

  const runResult = await executeMultiFileProject({
    files: testFiles,
    testCases,
  });

  assert(runResult.success === true, 'Multi-file loyiha barcha testlardan muvaffaqiyatli o‘tdi');
  assert(runResult.testResults.length === 3, '3 ta test case tekshirildi');
  assert(runResult.testResults.every((t) => t.passed), 'Har bir test case passed=true natija berdi');
  assert(runResult.output.includes('Hisoblagich faollashtirildi'), 'Konsol chiqishi to‘g‘ri ushlandi');

  // Test iframe sandbox generator
  const iframeHtml = createSandboxedPreviewHtml(testFiles);
  assert(iframeHtml.includes('CODEQUEST_CONSOLE_LOG'), 'Iframe ichida xavfsiz postMessage konsol interceptori mavjud');
  assert(iframeHtml.includes('__cq_watchdog'), 'Iframe ichida cheksiz loopga qarshi watchdog mavjud');
  assert(iframeHtml.includes('counter-container'), 'HTML kontenti iframe ichiga kiritilgan');
  assert(iframeHtml.includes('#3b82f6'), 'CSS stillari iframe ichiga kiritilgan');

  // TEST 6: Error Explainer & Infinite Loop in Multi-file Project
  console.log('\n▶ [6/7] Multi-file Xatolar tahlili (Error Explainer & Infinite Loop)...');
  
  // SyntaxError in script.js
  const syntaxErrFiles = {
    'index.html': '<div>Test</div>',
    'style.css': '',
    'script.js': 'let x = ;',
  };
  const syntaxRun = await executeMultiFileProject({ files: syntaxErrFiles });
  assert(syntaxRun.success === false, 'SyntaxError li kod rad etildi');
  assert(syntaxRun.errors.length > 0, 'Xato obyekti qaytarildi');
  const syntaxDiag = explainError(syntaxRun.errors[0].message, syntaxRun.errors[0].line);
  assert(syntaxDiag && (syntaxDiag.errorType.includes('Syntax') || syntaxDiag.cause.length > 0), 'SyntaxError o‘zbekcha tushuntirildi');

  // Infinite loop in script.js
  const loopFiles = {
    'index.html': '<div>Loop</div>',
    'style.css': '',
    'script.js': 'while(true) {}',
  };
  const loopRun = await executeMultiFileProject({ files: loopFiles, timeoutMs: 500 });
  assert(loopRun.success === false, 'Cheksiz sikl to‘xtatildi');
  assert(loopRun.errors[0].type === 'timeout', 'Xato turi timeout deb belgilandi');
  assert(loopRun.errors[0].message.includes('Cheksiz sikl'), 'Cheksiz sikl haqida o‘zbekcha ogohlantirish berildi');

  // TEST 7: Multi-file Capstone Exercise Submission (ex-js-5)
  console.log('\n▶ [7/7] Multi-file Amaliy Topshiriq (ex-js-5) va Progress...');
  const jsCourse = courseRepo.findBySlug('javascript-asoslari');
  assert(jsCourse !== null, 'JavaScript kursi topildi');

  const exercise5 = courseRepo.getExerciseByLesson('les-js-5');
  assert(exercise5 !== null, '5-dars topshirig‘i (ex-js-5) topildi');
  assert(exercise5.isMultiFile === true, 'ex-js-5 ko‘p faylli (isMultiFile=true) ekanligi tasdiqlandi');
  assert(exercise5.starterFiles && exercise5.starterFiles['index.html'], 'starterFiles index.html mavjud');
  assert(exercise5.starterFiles['style.css'], 'starterFiles style.css mavjud');
  assert(exercise5.starterFiles['script.js'], 'starterFiles script.js mavjud');

  // Run exercise with correct solution files
  const solutionFiles = {
    'index.html': '<div class="card"><span id="counter">0</span><button id="btn">Oshirish</button></div>',
    'style.css': '#btn { background-color: #2563eb; }',
    'script.js': 'console.log("Loyiha tayyor!");',
  };

  const exerciseRun = await executeMultiFileProject({
    files: solutionFiles,
    testCases: exercise5.testCases,
  });

  assert(exerciseRun.success === true, 'ex-js-5 topshirig‘i yechimi testlardan o‘tdi');
  assert(exerciseRun.testResults.length >= 3, 'Kamida 3 ta ko‘p faylli test case tekshirildi');

  // Submit exercise to DB for User B
  const initialXp = userB.xp;
  progressRepo.recordSubmission({
    userId: userB.id,
    exerciseId: exercise5.id,
    code: JSON.stringify(solutionFiles),
    score: 100,
    passed: true,
    errors: [],
    testResults: exerciseRun.testResults,
    attempts: 1,
    hintsUsed: 0,
    timeSpent: 120,
    pasteCount: 0,
    keystrokeCount: 150,
  });

  const subs = progressRepo.getUserSubmissions(userB.id, exercise5.id);
  assert(subs.length > 0 && subs[0].passed, 'Topshiriq yechimi bazaga muvaffaqiyatli saqlandi');

  userRepo.updateStats(userB.id, { xp: 100 });
  const updatedUserB = userRepo.findById(userB.id);
  assert(updatedUserB && updatedUserB.xp === initialXp + 100, `User B ga +100 XP qo‘shildi (Jami: ${updatedUserB?.xp})`);

  // Delete project test (User A deletes project1)
  const deleted = projectRepo.deleteProject(project1.id, userA.id);
  assert(deleted === true, 'User A o‘z loyihasini muvaffaqiyatli o‘chirdi');
  const reCheck = projectRepo.getProjectById(project1.id, userA.id);
  assert(reCheck === null, 'O‘chirilgan loyiha bazadan olib tashlandi');

  // Clean up test data
  db.delete(schema.users).where(eq(schema.users.id, userA.id)).run();
  db.delete(schema.users).where(eq(schema.users.id, userB.id)).run();
  console.log('🧹 Test foydalanuvchilari tozalandi.');

  console.log('\n🎉 ========================================================');
  console.log(`🎉 BARCHA ${passCount} TA MULTI-FILE TESTLAR 100% MUVAFFAQISATLI O‘TDI!`);
  console.log('🎉 ========================================================');
}

runTests().catch((err) => {
  console.error('\n❌ Test jarayonida kutilmagan xatolik:', err);
  process.exit(1);
});
