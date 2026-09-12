// ============================================================
// CodeQuest — Core TypeScript Types
// ============================================================

// --- User & Auth ---
export type UserRole = "user" | "instructor" | "admin" | "superadmin";
export type ContentStatus = "draft" | "review" | "published" | "archived";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string | null;
  role: UserRole;
  level: number;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  userId: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
  goals: string[];
  weeklyHours: number;
  preferredLanguage: string;
}

export interface SessionPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
}

// --- Course Structure ---
export interface Course {
  id: string;
  instructorId?: string | null;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  level: "boshlangich" | "orta" | "professional";
  category: "kirish" | "frontend" | "backend" | "database" | "fullstack" | "career";
  thumbnail: string;
  estimatedHours: number;
  published: boolean;
  status?: ContentStatus;
  deletedAt?: string | null;
  order: number;
  technologies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  deletedAt?: string | null;
}

export interface Lesson {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  slug: string;
  description: string;
  objectives: string[];
  estimatedMinutes: number;
  order: number;
  published: boolean;
  status?: ContentStatus;
  version?: number;
  deletedAt?: string | null;
  content: LessonContent;
}

export interface LessonContent {
  title: string;
  learningObjective: string;
  realLifeAnalogy: string;
  theory: ContentBlock[];
  interactiveExample?: CodeExample;
  commonMistakes: CommonMistake[];
  quiz: QuizQuestion[];
  exercise?: Exercise;
  summary: string;
  nextLessonSlug?: string;
  nextLessonTitle?: string;
}

export interface ContentBlock {
  type: "text" | "code" | "note" | "warning" | "tip" | "heading";
  content: string;
  language?: string;
  lineExplanations?: Record<number, string>;
}

export interface CodeExample {
  title: string;
  description: string;
  language: string;
  code: string;
  expectedOutput?: string;
  lineExplanations?: Record<number, string>;
}

export interface CommonMistake {
  title: string;
  wrongCode: string;
  correctCode: string;
  explanation: string;
  language: string;
}

// --- Quiz ---
export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "code-output" | "true-false";
  options: string[];
  correctAnswer: number;
  explanation: string;
  codeSnippet?: string;
  language?: string;
}

export interface ProjectFiles {
  'index.html': string;
  'style.css': string;
  'script.js': string;
}

export interface UserProject {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  html: string;
  css: string;
  js: string;
  createdAt: string;
  updatedAt: string;
}

// --- Exercise ---
export interface Exercise {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  instructions: string[];
  starterCode: string;
  starterFiles?: ProjectFiles;
  isMultiFile?: boolean;
  language: "html" | "css" | "javascript" | "python" | "htmlcss" | "htmlcssjs";
  difficulty: "easy" | "medium" | "hard";
  testCases: TestCase[];
  hiddenTests: TestCase[];
  hints: string[];
  solutionExplanation: string;
  passingScore: number;
  expectedConcepts: string[];
  xpReward?: number;
}

export interface TestCase {
  id: string;
  description: string;
  input?: string;
  expectedOutput: string;
  type: "output" | "contains" | "regex" | "dom-check" | "html-check" | "css-check" | "js-check";
  targetFile?: 'index.html' | 'style.css' | 'script.js';
  hidden?: boolean;
}

// --- Submissions & Progress ---
export interface Submission {
  id: string;
  userId: string;
  exerciseId: string;
  code: string;
  score: number;
  passed: boolean;
  errors: string[];
  testResults: TestResult[];
  attempts: number;
  hintsUsed: number;
  timeSpent: number;
  pasteCount: number;
  keystrokeCount: number;
  createdAt: string;
}

export interface TestResult {
  testCaseId: string;
  passed: boolean;
  actual: string;
  expected: string;
  description: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  status: "not-started" | "in-progress" | "completed";
  quizScore: number | null;
  exerciseScore: number | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CourseProgress {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  totalLessons: number;
  completedLessons: number;
  percentage: number;
  currentLessonSlug: string | null;
  currentLessonTitle: string | null;
}

// --- Gamification ---
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "learning" | "coding" | "streak" | "project" | "social";
  requirement: string;
  xpReward: number;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  exercise: Exercise;
  date: string;
  xpReward: number;
}

export interface UserStats {
  totalXP: number;
  level: number;
  levelTitle: string;
  streak: number;
  totalLessons: number;
  completedLessons: number;
  totalExercises: number;
  completedExercises: number;
  averageQuizScore: number;
  averageExerciseScore: number;
  totalCodingTime: number;
  weeklyProgress: WeeklyDataPoint[];
  strongTopics: string[];
  weakTopics: string[];
  achievements: (Achievement & { unlockedAt: string })[];
}

export interface WeeklyDataPoint {
  day: string;
  xp: number;
  lessons: number;
  minutes: number;
}

// --- Code Execution ---
export interface CodeRunRequest {
  code: string;
  language: "html" | "css" | "javascript" | "python" | "htmlcss" | "htmlcssjs";
  testCases?: TestCase[];
  timeout?: number;
}

export interface CodeRunResult {
  success: boolean;
  output: string;
  errors: CodeError[];
  executionTime: number;
  testResults?: TestResult[];
}

export interface CodeError {
  type: "syntax" | "runtime" | "logic" | "type" | "timeout" | "unknown";
  message: string;
  line?: number;
  column?: number;
  originalMessage: string;
}

// --- Error Explanation ---
export interface ErrorExplanation {
  errorType: string;
  line?: number;
  cause: string;
  explanation: string;
  whatToChange: string;
  hint: string;
  similarExample?: string;
  reflectionQuestion: string;
}

// --- Hint System ---
export interface HintLevel {
  level: 1 | 2 | 3;
  type: "conceptual" | "specific" | "strong";
  content: string;
}

// --- Mentor ---
export interface MentorMessage {
  id: string;
  role: "user" | "mentor";
  content: string;
  mode?: MentorMode;
  timestamp: string;
}

export type MentorMode =
  | "explain"
  | "hint"
  | "error"
  | "question"
  | "review"
  | "simplify"
  | "real-world"
  | "test";

// --- API Response ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// --- Onboarding ---
export interface OnboardingData {
  skillLevel: "beginner" | "intermediate" | "advanced";
  goals: string[];
  weeklyHours: number;
  interests: string[];
}

// --- Notes ---
export interface Note {
  id: string;
  userId: string;
  lessonId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// --- Learning Path ---
export interface LearningPathNode {
  id: string;
  title: string;
  description: string;
  courseSlug: string;
  status: "available" | "in-progress" | "completed" | "locked";
  level: string;
  order: number;
  prerequisiteIds: string[];
  completionPercentage: number;
}

// --- CMS & Versioning ---
export interface ContentVersion {
  id: string;
  contentType: 'course' | 'lesson' | 'exercise';
  contentId: string;
  version: number;
  data: string; // JSON snapshot
  authorId: string;
  authorName?: string;
  changeSummary?: string | null;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userRole?: UserRole;
  action: 'create' | 'update' | 'delete' | 'publish' | 'archive' | 'review' | 'rollback' | 'role_change';
  targetType: 'course' | 'module' | 'lesson' | 'exercise' | 'user';
  targetId: string;
  targetTitle?: string;
  details: string; // JSON
  ipAddress?: string | null;
  createdAt: string;
}

export interface CMSStats {
  totalUsers: number;
  activeUsers7d: number;
  totalCourses: number;
  totalLessons: number;
  totalExercises: number;
  totalSubmissions: number;
  avgQuizScore: number;
  frequentErrors: Array<{ concept: string; errorCount: number }>;
  recentActivity: Array<{
    id: string;
    action: string;
    targetType: string;
    userName: string;
    createdAt: string;
    details?: string;
  }>;
}
