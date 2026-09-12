import assert from 'node:assert';

const CMS_STUDENT_PASSWORD = process.env.CMS_STUDENT_PASSWORD;
if (!CMS_STUDENT_PASSWORD) {
  console.error('❌ CMS_STUDENT_PASSWORD environment variable sozlang.');
  process.exit(1);
}

async function test() {
  console.log('Testing CodeQuest API flows...');
  
  // 1. Login
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'talaba@codequest.uz', password: CMS_STUDENT_PASSWORD })
  });
  const cookieHeader = loginRes.headers.get('set-cookie');
  const sessionCookie = cookieHeader ? cookieHeader.split(';')[0] : '';
  const loginJson = await loginRes.json();
  assert(loginJson.success, 'Login failed: ' + JSON.stringify(loginJson));
  console.log('1. Login OK:', loginJson.data.name, 'XP:', loginJson.data.xp);

  // 2. Auth me
  const meRes = await fetch('http://localhost:3000/api/auth/me', {
    headers: { Cookie: sessionCookie }
  });
  const meJson = await meRes.json();
  assert(meJson.success, 'Auth me failed');
  console.log('2. Auth Me OK:', meJson.data.email, 'Streak:', meJson.data.streak);

  // 3. User stats
  const statsRes = await fetch('http://localhost:3000/api/user/stats', {
    headers: { Cookie: sessionCookie }
  });
  const statsJson = await statsRes.json();
  assert(statsJson.success, 'Stats failed');
  console.log('3. Stats OK:', statsJson.data.stats.coursesProgress.length, 'courses loaded');

  // 4. Course detail
  const courseRes = await fetch('http://localhost:3000/api/courses/javascript-asoslari');
  const courseJson = await courseRes.json();
  assert(courseJson.success, 'Course detail failed');
  console.log('4. Course OK:', courseJson.data.course.title, 'Modules:', courseJson.data.modules.length);

  // 5. Lesson detail
  const lessonRes = await fetch('http://localhost:3000/api/lessons/ozgaruvchilar-va-malumot-turlari', {
    headers: { Cookie: sessionCookie }
  });
  const lessonJson = await lessonRes.json();
  assert(lessonJson.success, 'Lesson detail failed');
  console.log('5. Lesson OK:', lessonJson.data.lesson.title);
  assert(lessonJson.data.exercise, 'Exercise must exist');

  // 6. Exercise Submit
  const submitRes = await fetch('http://localhost:3000/api/exercises/' + lessonJson.data.exercise.id + '/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({
      code: 'console.log("Salom, Dunyo!");',
      testResults: [{ testId: 't1', passed: true, description: 'Test', actual: 'Salom, Dunyo!', expected: 'Salom, Dunyo!' }],
      passed: true,
      score: 100,
      attempts: 1,
      hintsUsed: 0,
      timeSpent: 30,
      pasteCount: 0,
      errors: []
    })
  });
  const submitJson = await submitRes.json();
  assert(submitJson.success, 'Submit failed: ' + JSON.stringify(submitJson));
  console.log('6. Submit OK: Earned XP:', submitJson.data.earnedXP, 'Total XP:', submitJson.data.totalXP);

  // 7. Complete Lesson
  const compRes = await fetch('http://localhost:3000/api/progress/complete-lesson', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: sessionCookie },
    body: JSON.stringify({
      lessonId: lessonJson.data.lesson.id,
      courseId: lessonJson.data.lesson.courseId,
      quizScore: 100
    })
  });
  const compJson = await compRes.json();
  assert(compJson.success, 'Complete lesson failed: ' + JSON.stringify(compJson));
  console.log('7. Complete Lesson OK: Earned XP:', compJson.data.earnedXP, 'Total XP:', compJson.data.totalXP);

  console.log('\n>>> ALL 7 E2E INTEGRATION CHECKS PASSED SUCCESSFULLY! <<<');
}

test().catch(e => {
  console.error('FAIL:', e);
  process.exit(1);
});
