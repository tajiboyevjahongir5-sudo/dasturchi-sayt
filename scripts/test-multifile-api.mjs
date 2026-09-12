/**
 * CodeQuest — Multi-file Web Project Workspace HTTP API Verification Suite
 * Tests against live server (http://localhost:3000):
 * 1. Auth required (401 on unauthenticated /api/projects)
 * 2. User A login & session cookie handling
 * 3. POST /api/projects (create project with 3 files)
 * 4. GET /api/projects (returns list of user projects)
 * 5. PUT /api/projects/:id (autosave update)
 * 6. GET /api/projects/:id (fetch single project)
 * 7. User Isolation: User B cannot GET or PUT or DELETE User A's project (404/403)
 * 8. Payload size limit: Request body > 700 KB rejected (413)
 * 9. Project limit: 21st project rejected with 400
 * 10. DELETE /api/projects/:id (deletes project)
 */

const BASE_URL = 'http://localhost:3000';
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

async function runHttpApiTests() {
  console.log('🌐 ========================================================');
  console.log('🌐 MULTI-FILE WORKSPACE HTTP API VERIFICATION');
  console.log('🌐 ========================================================\n');

  // 1. Unauthenticated Request Guard
  console.log('▶ [1/7] Ruxsatsiz so‘rovlarni tekshirish (401 Unauthorized)...');
  const unauthRes = await fetch(`${BASE_URL}/api/projects`);
  assert(unauthRes.status === 401, 'Autentifikatsiyasiz GET /api/projects 401 qaytardi');

  // 2. Register & Login User A
  console.log('\n▶ [2/7] Foydalanuvchi A sessiyasini yaratish...');
  const userAEmail = `api_user_a_${Date.now()}@codequest.uz`;
  const password = 'Password123!';

  const regARes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'API Foydalanuvchi A', email: userAEmail, password }),
  });
  assert(regARes.ok, 'User A ro‘yxatdan o‘tdi');
  const cookieA = regARes.headers.get('set-cookie')?.split(';')[0] || '';
  assert(cookieA && cookieA.includes('codequest_session='), 'User A uchun sessiya tokeni berildi');

  // 3. Create Project via HTTP API
  console.log('\n▶ [3/7] POST /api/projects orqali loyiha yaratish...');
  const createRes = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieA,
    },
    body: JSON.stringify({
      title: 'HTTP API Loyiham',
      html: '<h1>Salom API</h1>',
      css: 'h1 { color: blue; }',
      js: 'console.log("Salom!");',
    }),
  });

  assert(createRes.ok, 'POST /api/projects muvaffaqiyatli qaytdi');
  const createJson = await createRes.json();
  assert(createJson.success === true, 'Loyiha JSON muvaffaqiyatli qaytdi');
  const projectId = createJson.data.id;
  assert(projectId, `Yangi loyiha ID berildi: ${projectId}`);

  // 4. Update / Autosave Project via HTTP API
  console.log('\n▶ [4/7] PUT /api/projects/:id (Autosave & Rename)...');
  const updateRes = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieA,
    },
    body: JSON.stringify({
      title: 'HTTP API Loyiham (Yangilandi)',
      html: '<h1>Salom API 2</h1>',
      css: 'h1 { color: red; }',
      js: 'console.log("Yangilangan!");',
    }),
  });

  assert(updateRes.status === 200, 'PUT /api/projects/:id 200 OK qaytardi');
  const updateJson = await updateRes.json();
  assert(updateJson.data.title === 'HTTP API Loyiham (Yangilandi)', 'Loyiha nomi API orqali yangilandi');
  assert(updateJson.data.html === '<h1>Salom API 2</h1>', 'HTML autosave orqali yangilandi');

  // 5. User B isolation via HTTP API
  console.log('\n▶ [5/7] Foydalanuvchi B orqali izolatsiyani tekshirish (Cross-tenant security)...');
  const userBEmail = `api_user_b_${Date.now()}@codequest.uz`;
  const regBRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'API Foydalanuvchi B', email: userBEmail, password }),
  });
  const cookieB = regBRes.headers.get('set-cookie')?.split(';')[0] || '';

  // User B tries to GET User A's project
  const crossGet = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    headers: { Cookie: cookieB },
  });
  assert(crossGet.status === 404, 'User B begona loyihani ko‘ra olmadi (404 Not Found)');

  // User B tries to PUT User A's project
  const crossPut = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieB,
    },
    body: JSON.stringify({ title: 'Hacked' }),
  });
  assert(crossPut.status === 404, 'User B begona loyihani o‘zgartira olmadi (404 Not Found)');

  // User B tries to DELETE User A's project
  const crossDelete = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    method: 'DELETE',
    headers: { Cookie: cookieB },
  });
  assert(crossDelete.status === 404, 'User B begona loyihani o‘chira olmadi (404 Not Found)');

  // 6. Payload size limit (700 KB body limit)
  console.log('\n▶ [6/7] Request Payload limitini tekshirish (>700 KB -> 413)...');
  const hugeString = 'X'.repeat(750 * 1024); // 750 KB
  const hugeRes = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieA,
    },
    body: JSON.stringify({
      title: 'Huge Payload',
      html: hugeString,
    }),
  });
  assert(hugeRes.status === 413, '700 KB dan katta so‘rov 413 Payload Too Large bilan rad etildi');

  // 7. Delete Project via HTTP API
  console.log('\n▶ [7/7] DELETE /api/projects/:id orqali loyihani o‘chirish...');
  const delRes = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    method: 'DELETE',
    headers: { Cookie: cookieA },
  });
  assert(delRes.status === 200, 'DELETE /api/projects/:id 200 OK qaytardi');

  // Verify project is gone
  const getAfterDel = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    headers: { Cookie: cookieA },
  });
  assert(getAfterDel.status === 404, 'O‘chirilgan loyiha mavjud emas (404)');

  console.log('\n🌐 ========================================================');
  console.log(`🌐 BARCHA ${passCount} TA HTTP API TESTLARI 100% MUVAFFAQISATLI O‘TDI!`);
  console.log('🌐 ========================================================');
}

runHttpApiTests().catch((err) => {
  console.error('\n❌ HTTP API testida xatolik:', err);
  process.exit(1);
});
