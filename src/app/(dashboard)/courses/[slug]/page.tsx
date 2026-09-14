'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CourseThumbnail } from '@/components/learning/CourseThumbnail';
import { 
  Clock, 
  BookOpen, 
  Play, 
  ChevronRight, 
  ArrowLeft 
} from 'lucide-react';
import type { Course, Module, Lesson, CourseProgress, LessonProgress } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ModuleAccordion } from '@/components/learning/ModuleAccordion';
import { Skeleton } from '@/components/ui/skeleton';

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<CourseProgress | undefined>(undefined);
  const [lessonProgressList, setLessonProgressList] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourseData() {
      try {
        const res = await fetch(`/api/courses/${slug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setCourse(json.data.course);
            setModules(json.data.modules);
            setLessons(json.data.lessons);
            setProgress(json.data.progress);
            setLessonProgressList(json.data.lessonProgressList);
          }
        }
      } catch (err) {
        console.error('Course detail error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourseData();
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold">Kurs topilmadi</h2>
        <Link href="/courses">
          <Button variant="outline">Kurslarga qaytish</Button>
        </Link>
      </div>
    );
  }

  const nextLessonSlug = progress?.currentLessonSlug || lessons[0]?.slug;

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Barcha kurslar</span>
        </Link>
      </div>

      {/* Course Header Banner */}
      <div className="relative rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xl">
        <div className="relative h-60 sm:h-72 w-full bg-muted">
          <CourseThumbnail
            thumbnail={course.thumbnail}
            title={course.title}
            slug={course.slug}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent pointer-events-none" />
        </div>

        <div className="relative -mt-24 p-6 sm:p-8 space-y-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success" className="text-xs font-semibold">
                {course.level === 'boshlangich' ? 'Boshlang‘ich' : course.level}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {course.estimatedHours} soat
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                {lessons.length} ta dars
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{course.title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border/60">
            {progress && (
              <div className="w-full sm:w-72 space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Kursdagi o‘zlashtirish</span>
                  <span className="text-primary">{progress.percentage}%</span>
                </div>
                <Progress value={progress.percentage} className="h-2" />
              </div>
            )}

            {nextLessonSlug && (
              <Link href={`/courses/${course.slug}/lessons/${nextLessonSlug}?autostart=1`} className="w-full sm:w-auto">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto font-bold gap-2 shadow-lg shadow-blue-500/20">
                  <Play className="w-4 h-4 fill-white" />
                  <span>
                    {progress && progress.percentage > 0 ? 'Darsni davom ettirish' : 'Kursni boshlash'}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Course Curriculum Modules & Lessons */}
      <div className="space-y-4 max-w-4xl">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight">Kurs Mundarijasi</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Barcha modullar va darslar ketma-ketligi
          </p>
        </div>

        <ModuleAccordion
          modules={modules}
          lessons={lessons}
          progressList={lessonProgressList}
          courseSlug={course.slug}
        />
      </div>
    </div>
  );
}
