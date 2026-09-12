import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = process.env.DATABASE_URL || path.join(DB_DIR, 'codequest.db');

// Reuse existing connection in dev hot-reloading
declare global {
  var _sqlite: Database.Database | undefined;
}

let sqlite: Database.Database;

if (process.env.NODE_ENV === 'production') {
  sqlite = new Database(DB_PATH);
} else {
  if (!global._sqlite) {
    global._sqlite = new Database(DB_PATH);
  }
  sqlite = global._sqlite;
}

sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

// Initialize tables automatically
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 0,
    last_active_date TEXT,
    onboarding_completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    skill_level TEXT NOT NULL DEFAULT 'beginner',
    goals TEXT NOT NULL DEFAULT '[]',
    weekly_hours INTEGER NOT NULL DEFAULT 5,
    preferred_language TEXT NOT NULL DEFAULT 'uz'
  );

  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    short_description TEXT NOT NULL,
    level TEXT NOT NULL DEFAULT 'boshlangich',
    category TEXT NOT NULL DEFAULT 'kirish',
    thumbnail TEXT NOT NULL,
    estimated_hours INTEGER NOT NULL DEFAULT 10,
    published INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL DEFAULT 1,
    technologies TEXT NOT NULL DEFAULT '[]',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    objectives TEXT NOT NULL DEFAULT '[]',
    estimated_minutes INTEGER NOT NULL DEFAULT 20,
    "order" INTEGER NOT NULL DEFAULT 1,
    published INTEGER NOT NULL DEFAULT 1,
    content TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS exercises (
    id TEXT PRIMARY KEY,
    lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT NOT NULL DEFAULT '[]',
    starter_code TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'javascript',
    difficulty TEXT NOT NULL DEFAULT 'easy',
    test_cases TEXT NOT NULL DEFAULT '[]',
    hidden_tests TEXT NOT NULL DEFAULT '[]',
    hints TEXT NOT NULL DEFAULT '[]',
    solution_explanation TEXT NOT NULL,
    passing_score INTEGER NOT NULL DEFAULT 80,
    expected_concepts TEXT NOT NULL DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id TEXT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    passed INTEGER NOT NULL DEFAULT 0,
    errors TEXT NOT NULL DEFAULT '[]',
    test_results TEXT NOT NULL DEFAULT '[]',
    attempts INTEGER NOT NULL DEFAULT 1,
    hints_used INTEGER NOT NULL DEFAULT 0,
    time_spent INTEGER NOT NULL DEFAULT 0,
    paste_count INTEGER NOT NULL DEFAULT 0,
    keystroke_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS lesson_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'not-started',
    quiz_score INTEGER,
    exercise_score INTEGER,
    completed_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'learning',
    requirement TEXT NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 50
  );

  CREATE TABLE IF NOT EXISTS user_achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_projects (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    html TEXT NOT NULL,
    css TEXT NOT NULL,
    js TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS content_versions (
    id TEXT PRIMARY KEY,
    content_type TEXT NOT NULL,
    content_id TEXT NOT NULL,
    version INTEGER NOT NULL,
    data TEXT NOT NULL,
    author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    change_summary TEXT,
    created_at TEXT NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS content_version_unq ON content_versions (content_type, content_id, version);

  CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    details TEXT NOT NULL DEFAULT '{}',
    ip_address TEXT,
    created_at TEXT NOT NULL
  );
`);

// Safe migrations for existing database columns
const migrations = [
  `ALTER TABLE exercises ADD COLUMN starter_files TEXT;`,
  `ALTER TABLE exercises ADD COLUMN xp_reward INTEGER DEFAULT 50;`,
  `ALTER TABLE courses ADD COLUMN instructor_id TEXT;`,
  `ALTER TABLE courses ADD COLUMN status TEXT DEFAULT 'published';`,
  `ALTER TABLE courses ADD COLUMN deleted_at TEXT;`,
  `ALTER TABLE modules ADD COLUMN deleted_at TEXT;`,
  `ALTER TABLE lessons ADD COLUMN status TEXT DEFAULT 'published';`,
  `ALTER TABLE lessons ADD COLUMN version INTEGER DEFAULT 1;`,
  `ALTER TABLE lessons ADD COLUMN deleted_at TEXT;`,
];

for (const mig of migrations) {
  try {
    sqlite.exec(mig);
  } catch {
    // Column already exists or already migrated, ignore
  }
}

export const db = drizzle(sqlite, { schema });

// Auto-seed check on initialization
try {
  const courseCount = sqlite.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number };
  if (courseCount.count === 0) {
    // Dynamic import to avoid circular dependency
    import('./seed').then(m => m.runSeed()).catch(err => console.error('Seed error:', err));
  }
} catch (e) {
  console.warn('Initial seed check error:', e);
}

export { schema, sqlite };
