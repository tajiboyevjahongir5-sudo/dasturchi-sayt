/**
 * CodeQuest — Credential Rotation Script
 * 
 * Generates strong random passwords for development accounts,
 * updates their bcrypt hashes in the SQLite database,
 * and writes the credentials to .env.local.
 * 
 * Usage:
 *   node scripts/rotate-credentials.mjs
 * 
 * The script will:
 * 1. Generate cryptographically secure random passwords
 * 2. Update password hashes in the database for:
 *    - admin@codequest.uz (superadmin)
 *    - ustoz@codequest.uz (instructor)
 *    - talaba@codequest.uz (demo user)
 * 3. Write credentials to .env.local (git-ignored)
 * 4. Never print actual passwords to stdout
 */

import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'data', 'codequest.db');
const ENV_LOCAL_PATH = path.join(__dirname, '..', '.env.local');

function generateStrongPassword(length = 24) {
  // Use characters safe from dotenv interpolation and comment markers ($ and #)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!%*+=-_';
  const bytes = crypto.randomBytes(length);
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[bytes[i] % chars.length];
  }
  return password;
}

async function main() {
  console.log('🔐 ========================================================');
  console.log('🔐 CODEQUEST: CREDENTIAL ROTATION');
  console.log('🔐 ========================================================\n');

  const db = new Database(DB_PATH);

  // Generate strong passwords
  const adminPassword = generateStrongPassword();
  const instructorPassword = generateStrongPassword();
  const studentPassword = generateStrongPassword();

  const accounts = [
    { email: 'admin@codequest.uz', password: adminPassword, label: 'Super Admin' },
    { email: 'ustoz@codequest.uz', password: instructorPassword, label: 'Instructor' },
    { email: 'talaba@codequest.uz', password: studentPassword, label: 'Demo Student' },
  ];

  for (const account of accounts) {
    const user = db.prepare('SELECT id, role FROM users WHERE email = ?').get(account.email);
    if (!user) {
      console.log(`  ⚠️  ${account.label} (${account.email}) bazada topilmadi — o'tkazib yuborildi`);
      continue;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(account.password, salt);
    db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE email = ?')
      .run(hash, new Date().toISOString(), account.email);

    console.log(`  ✅ ${account.label} (${account.email}) — parol yangilandi [REDACTED]`);
  }

  // Write to .env.local
  const envContent = `# CodeQuest Development Credentials — GENERATED ${new Date().toISOString()}
# Bu fayl .gitignore ichida — hech qachon git'ga push qilmang!

CMS_ADMIN_EMAIL=admin@codequest.uz
CMS_ADMIN_PASSWORD="${adminPassword}"

CMS_INSTRUCTOR_EMAIL=ustoz@codequest.uz
CMS_INSTRUCTOR_PASSWORD="${instructorPassword}"

CMS_STUDENT_EMAIL=talaba@codequest.uz
CMS_STUDENT_PASSWORD="${studentPassword}"
`;

  fs.writeFileSync(ENV_LOCAL_PATH, envContent, 'utf-8');
  console.log(`\n  ✅ Yangi credentiallar .env.local fayliga yozildi`);
  console.log(`  📁 Fayl: ${ENV_LOCAL_PATH}`);
  console.log(`  🔒 .gitignore: .env* qoidasi bilan himoyalangan\n`);

  db.close();

  console.log('🔐 ========================================================');
  console.log('🔐 CREDENTIAL ROTATION MUVAFFAQIYATLI YAKUNLANDI');
  console.log('🔐 ========================================================');
  console.log('   ⚠️  Parollar faqat .env.local da saqlangan');
  console.log('   ⚠️  Hech qachon stdout/log ga chiqarilmagan');
  console.log('   ⚠️  Skriptlarni ishga tushirishda .env.local ni source qiling\n');
}

main().catch(err => {
  console.error('❌ Xatolik:', err.message);
  process.exit(1);
});
