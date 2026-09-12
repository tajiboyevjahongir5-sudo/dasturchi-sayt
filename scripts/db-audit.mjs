import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'data', 'codequest.db');
const db = new Database(dbPath);

console.log('========================================================');
console.log('📊 CODEQUEST: CURRENT DB AUDIT');
console.log('========================================================\n');

// 1. Course Status
console.log('▶ 1. JAVASCRIPT INTERMEDIATE KURS MA’LUMOTLARI:');
const course = db.prepare('SELECT id, title, slug, status, created_at, updated_at FROM courses WHERE slug = ?').get('javascript-intermediate');
console.log(course);

// 2. All 18 Lessons with status & versions
console.log('\n▶ 2. 18 TA DARS STATUS VA VERSIYALARI:');
const lessons = db.prepare(`
  SELECT l.id, l."order", l.slug, l.title, l.status,
         (SELECT MAX(version) FROM content_versions WHERE content_type = 'lesson' AND content_id = l.id) as latest_version,
         (SELECT COUNT(*) FROM content_versions WHERE content_type = 'lesson' AND content_id = l.id) as version_count
  FROM lessons l
  JOIN modules m ON l.module_id = m.id
  WHERE m.course_id = ?
  ORDER BY l."order" ASC
`).all(course.id);

console.table(lessons.map(l => ({
  '#': l.order,
  'Slug': l.slug,
  'Status': l.status,
  'Oxirgi Versiya': 'v' + l.latest_version,
  'Jami Versiyalar': l.version_count,
  'Dars Sarlavhasi': l.title
})));

// 3. Status Breakdown
console.log('\n▶ 3. STATUS TAQSIMOTI:');
const statusCounts = db.prepare(`
  SELECT l.status, COUNT(*) as darslar_soni
  FROM lessons l
  JOIN modules m ON l.module_id = m.id
  WHERE m.course_id = ?
  GROUP BY l.status
`).all(course.id);
console.table(statusCounts);

// 4. Published check
const publishedCount = db.prepare(`
  SELECT COUNT(*) as cnt
  FROM lessons l
  JOIN modules m ON l.module_id = m.id
  WHERE m.course_id = ? AND l.status = 'published'
`).get(course.id);
console.log(`\n🔒 JS Intermediate kursida Published darslar: ${publishedCount.cnt} ta (0 ta kutilmoqda)`);

// 5. Test fixtures audit
console.log('\n▶ 4. TEST FOYDALANUVCHILARI / TEST FIXTURES AUDITI:');
const testUsers = db.prepare(`SELECT id, email, role, created_at FROM users WHERE email LIKE '%qa_student%' OR email LIKE '%smoke_user%' OR email LIKE '%test_%' OR email LIKE '%acceptance%'`).all();
console.log(`Test foydalanuvchilari soni: ${testUsers.length} ta`);
if (testUsers.length > 0) {
  console.table(testUsers);
} else {
  console.log('✅ Barcha test foydalanuvchilari tozalangan.');
}

const testCourses = db.prepare(`SELECT id, title, slug, status FROM courses WHERE title LIKE '%Test%' OR slug LIKE '%test%'`).all();
console.log(`Test kurslari soni: ${testCourses.length} ta`);
if (testCourses.length > 0) console.table(testCourses);

// 6. Submissions audit
const submissionsCount = db.prepare('SELECT COUNT(*) as cnt FROM submissions').get();
console.log(`Jami submissions soni: ${submissionsCount.cnt}`);

// 7. Audit logs count
const auditLogsCount = db.prepare('SELECT COUNT(*) as cnt FROM audit_logs').get();
console.log(`Audit loglar soni: ${auditLogsCount.cnt}`);

console.log('\n========================================================');
