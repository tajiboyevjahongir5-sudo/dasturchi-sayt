import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'data', 'codequest.db');
const db = new Database(dbPath);

console.log('🧹 ========================================================');
console.log('🧹 CODEQUEST: CLEANUP TEST FIXTURES');
console.log('🧹 ========================================================\n');

// 1. Delete test courses (e.g. cms-test-course-*)
const testCourses = db.prepare("SELECT id, title, slug FROM courses WHERE slug LIKE 'cms-test-course-%'").all();
console.log(`Topilgan vaqtinchalik test kurslari: ${testCourses.length} ta`);

for (const tc of testCourses) {
  // Find modules
  const modules = db.prepare('SELECT id FROM modules WHERE course_id = ?').all(tc.id);
  for (const m of modules) {
    const lessons = db.prepare('SELECT id FROM lessons WHERE module_id = ?').all(m.id);
    for (const l of lessons) {
      db.prepare("DELETE FROM content_versions WHERE content_type = 'lesson' AND content_id = ?").run(l.id);
      db.prepare('DELETE FROM exercises WHERE lesson_id = ?').run(l.id);
      db.prepare('DELETE FROM lessons WHERE id = ?').run(l.id);
    }
    db.prepare('DELETE FROM modules WHERE id = ?').run(m.id);
  }
  db.prepare('DELETE FROM courses WHERE id = ?').run(tc.id);
  console.log(`  🗑️ O‘chirildi test kursi: ${tc.slug}`);
}

// 2. Delete test users (smoke_user_*, mf_test_user_*, qa_student_*)
const testUsers = db.prepare("SELECT id, email FROM users WHERE email LIKE 'smoke_user_%' OR email LIKE 'mf_test_user_%' OR email LIKE 'qa_student_%'").all();
console.log(`\nTopilgan vaqtinchalik test foydalanuvchilari: ${testUsers.length} ta`);

for (const u of testUsers) {
  try { db.prepare('DELETE FROM lesson_progress WHERE user_id = ?').run(u.id); } catch {}
  try { db.prepare('DELETE FROM submissions WHERE user_id = ?').run(u.id); } catch {}
  try { db.prepare('DELETE FROM user_achievements WHERE user_id = ?').run(u.id); } catch {}
  try { db.prepare('DELETE FROM projects WHERE user_id = ?').run(u.id); } catch {}
  db.prepare('DELETE FROM users WHERE id = ?').run(u.id);
  console.log(`  🗑️ O‘chirildi test user: ${u.email}`);
}

console.log('\n✅ Barcha test fixture’lari tozalandi!\n');
