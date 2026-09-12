/**
 * CodeQuest — Create Super Admin CLI Tool
 * Usage:
 *   npx tsx scripts/create-superadmin.mjs [email] [password] [name]
 * Example:
 *   npx tsx scripts/create-superadmin.mjs admin@codequest.uz AdminPass123! "Bosh Administrator"
 */

import { db, schema } from '../src/db/index.ts';
import { userRepo } from '../src/db/repo.ts';
import { hashPassword } from '../src/lib/auth.ts';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

async function main() {
  const email = (process.argv[2] || 'admin@codequest.uz').toLowerCase().trim();
  const password = process.argv[3];
  if (!password) {
    console.error('❌ Parolni argument sifatida ko\'ring: node scripts/create-superadmin.mjs [email] [password] [name]');
    process.exit(1);
  }
  const name = process.argv[4] || 'Bosh Administrator';

  console.log('🛡️ ========================================================');
  console.log('🛡️ CODEQUEST: SUPER ADMIN YARATISH CLI VOSITASI');
  console.log('🛡️ ========================================================');
  console.log(`👤 Email: ${email}`);
  console.log(`👤 Ism: ${name}`);

  const existingUser = userRepo.findByEmail(email);
  const now = new Date().toISOString();

  if (existingUser) {
    console.log(`ℹ️ "${email}" foydalanuvchisi allaqachon mavjud. Super Admin darajasiga ko‘tarilmoqda...`);
    const newHash = await hashPassword(password);
    db.update(schema.users)
      .set({
        role: 'superadmin',
        passwordHash: newHash,
        updatedAt: now,
      })
      .where(eq(schema.users.id, existingUser.id))
      .run();

    // Log audit
    db.insert(schema.auditLogs).values({
      id: crypto.randomUUID(),
      userId: existingUser.id,
      action: 'role_change',
      targetType: 'user',
      targetId: existingUser.id,
      details: JSON.stringify({ oldRole: existingUser.role, newRole: 'superadmin', method: 'cli' }),
      ipAddress: '127.0.0.1 (CLI)',
      createdAt: now,
    }).run();

    console.log(`✅ Foydalanuvchi "${email}" muvaffaqiyatli "superadmin" roliga ko‘tarildi!`);
  } else {
    console.log(`🆕 Yangi Super Admin yaratilmoqda...`);
    const passwordHash = await hashPassword(password);
    const userId = crypto.randomUUID();

    const newUser = userRepo.create({
      id: userId,
      name,
      email,
      passwordHash,
      role: 'superadmin',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=SuperAdmin`,
    });

    // Create profile
    db.insert(schema.profiles).values({
      userId: newUser.id,
      skillLevel: 'advanced',
      goals: JSON.stringify(['tizim_boshqaruvi', 'kurslar_yaratish']),
      weeklyHours: 40,
      preferredLanguage: 'uz',
    }).run();

    // Log audit
    db.insert(schema.auditLogs).values({
      id: crypto.randomUUID(),
      userId: newUser.id,
      action: 'create',
      targetType: 'user',
      targetId: newUser.id,
      details: JSON.stringify({ role: 'superadmin', method: 'cli' }),
      ipAddress: '127.0.0.1 (CLI)',
      createdAt: now,
    }).run();

    console.log(`🎉 Super Admin muvaffaqiyatli yaratildi!`);
    console.log(`   ID: ${newUser.id}`);
    console.log(`   Email: ${newUser.email}`);
    console.log(`   Rol: ${newUser.role}`);
  }

  console.log('\n🔒 Tizimga /login sahifasi orqali kirishingiz mumkin.');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Xatolik yuz berdi:', err);
  process.exit(1);
});
