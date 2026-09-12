import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  avatarUrl: text('avatar_url'),
  role: text('role').notNull().default('user'),
  level: integer('level').notNull().default(1),
  xp: integer('xp').notNull().default(0),
  streak: integer('streak').notNull().default(0),
  lastActiveDate: text('last_active_date'),
  onboardingCompleted: integer('onboarding_completed').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const profiles = sqliteTable('profiles', {
  userId: text('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  skillLevel: text('skill_level').notNull().default('beginner'),
  goals: text('goals').notNull().default('[]'),
  weeklyHours: integer('weekly_hours').notNull().default(5),
  preferredLanguage: text('preferred_language').notNull().default('uz'),
});

export const courses = sqliteTable('courses', {
  id: text('id').primaryKey(),
  instructorId: text('instructor_id').references(() => users.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  shortDescription: text('short_description').notNull(),
  level: text('level').notNull().default('boshlangich'),
  category: text('category').notNull().default('kirish'),
  thumbnail: text('thumbnail').notNull(),
  estimatedHours: integer('estimated_hours').notNull().default(10),
  published: integer('published').notNull().default(1),
  status: text('status').notNull().default('published'),
  deletedAt: text('deleted_at'),
  order: integer('order').notNull().default(1),
  technologies: text('technologies').notNull().default('[]'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const modules = sqliteTable('modules', {
  id: text('id').primaryKey(),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  order: integer('order').notNull().default(1),
  deletedAt: text('deleted_at'),
});

export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey(),
  moduleId: text('module_id').notNull().references(() => modules.id, { onDelete: 'cascade' }),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  objectives: text('objectives').notNull().default('[]'),
  estimatedMinutes: integer('estimated_minutes').notNull().default(20),
  order: integer('order').notNull().default(1),
  published: integer('published').notNull().default(1),
  status: text('status').notNull().default('published'),
  version: integer('version').notNull().default(1),
  deletedAt: text('deleted_at'),
  content: text('content').notNull(), // JSON string of LessonContent
});

export const exercises = sqliteTable('exercises', {
  id: text('id').primaryKey(),
  lessonId: text('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  instructions: text('instructions').notNull().default('[]'), // JSON array of string
  starterCode: text('starter_code').notNull(),
  starterFiles: text('starter_files'), // JSON { "index.html": "...", "style.css": "...", "script.js": "..." }
  language: text('language').notNull().default('javascript'),
  difficulty: text('difficulty').notNull().default('easy'),
  testCases: text('test_cases').notNull().default('[]'), // JSON array of TestCase
  hiddenTests: text('hidden_tests').notNull().default('[]'), // JSON array of TestCase
  hints: text('hints').notNull().default('[]'), // JSON array of string
  solutionExplanation: text('solution_explanation').notNull(),
  passingScore: integer('passing_score').notNull().default(80),
  expectedConcepts: text('expected_concepts').notNull().default('[]'),
  xpReward: integer('xp_reward').notNull().default(50),
});

export const submissions = sqliteTable('submissions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  exerciseId: text('exercise_id').notNull().references(() => exercises.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  score: integer('score').notNull().default(0),
  passed: integer('passed').notNull().default(0),
  errors: text('errors').notNull().default('[]'),
  testResults: text('test_results').notNull().default('[]'),
  attempts: integer('attempts').notNull().default(1),
  hintsUsed: integer('hints_used').notNull().default(0),
  timeSpent: integer('time_spent').notNull().default(0),
  pasteCount: integer('paste_count').notNull().default(0),
  keystrokeCount: integer('keystroke_count').notNull().default(0),
  createdAt: text('created_at').notNull(),
});

export const lessonProgress = sqliteTable('lesson_progress', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  lessonId: text('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  courseId: text('course_id').notNull().references(() => courses.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('not-started'), // not-started, in-progress, completed
  quizScore: integer('quiz_score'),
  exerciseScore: integer('exercise_score'),
  completedAt: text('completed_at'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const achievements = sqliteTable('achievements', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  category: text('category').notNull().default('learning'),
  requirement: text('requirement').notNull(),
  xpReward: integer('xp_reward').notNull().default(50),
});

export const userAchievements = sqliteTable('user_achievements', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementId: text('achievement_id').notNull().references(() => achievements.id, { onDelete: 'cascade' }),
  unlockedAt: text('unlocked_at').notNull(),
});

export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  lessonId: text('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const userProjects = sqliteTable('user_projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').default(''),
  html: text('html').notNull().default('<h1>Salom, Dunyo!</h1>\n<p>CodeQuest Multi-file Workspace</p>'),
  css: text('css').notNull().default('body {\n  font-family: sans-serif;\n  padding: 24px;\n  color: #1e293b;\n}\nh1 {\n  color: #2563eb;\n}'),
  js: text('js').notNull().default('console.log("Multi-file Web loyihasi ishga tushdi! 🚀");'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const contentVersions = sqliteTable(
  'content_versions',
  {
    id: text('id').primaryKey(),
    contentType: text('content_type').notNull(), // 'course' | 'lesson' | 'exercise'
    contentId: text('content_id').notNull(),
    version: integer('version').notNull(),
    data: text('data').notNull(), // JSON snapshot
    authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    changeSummary: text('change_summary'),
    createdAt: text('created_at').notNull(),
  },
  (table) => ({
    unq: uniqueIndex('content_version_unq').on(table.contentType, table.contentId, table.version),
  })
);

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  action: text('action').notNull(), // 'create' | 'update' | 'delete' | 'publish' | 'archive' | 'review' | 'rollback' | 'role_change'
  targetType: text('target_type').notNull(), // 'course' | 'module' | 'lesson' | 'exercise' | 'user'
  targetId: text('target_id').notNull(),
  details: text('details').notNull().default('{}'),
  ipAddress: text('ip_address'),
  createdAt: text('created_at').notNull(),
});
