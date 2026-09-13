'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import type { Course, CourseProgress } from '@/types';
import { CourseThumbnail } from './CourseThumbnail';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress;
}

export function CourseCard({ course, progress }: CourseCardProps) {
  const percentage = progress?.percentage || 0;

  const levelBadge = {
    boshlangich: { label: 'Boshlang‘ich', variant: 'success' as const },
    orta: { label: 'O‘rta', variant: 'warning' as const },
    professional: { label: 'Professional', variant: 'purple' as const },
  }[course.level] || { label: course.level, variant: 'default' as const };

  return (
    <Card className="overflow-hidden flex flex-col justify-between hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group">
      <div>
        {/* Thumbnail with overlay gradient */}
        <div className="relative h-44 w-full overflow-hidden bg-muted">
          <CourseThumbnail
            thumbnail={course.thumbnail}
            title={course.title}
            slug={course.slug}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/25 to-transparent pointer-events-none" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <Badge variant={levelBadge.variant} className="backdrop-blur-md font-semibold text-[11px] shadow-sm">
              {levelBadge.label}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{course.estimatedHours} soat</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{progress?.totalLessons || 'Amaliy'} dars</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {course.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {course.shortDescription || course.description}
            </p>
          </div>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {course.technologies.slice(0, 3).map((tech, i) => (
              <span
                key={i}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted/60 border border-border/40 font-medium text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {course.technologies.length > 3 && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-muted/60 border border-border/40 text-muted-foreground">
                +{course.technologies.length - 3}
              </span>
            )}
          </div>
        </CardContent>
      </div>

      {/* Progress & CTA footer */}
      <div className="p-5 pt-0 border-t border-border/40 mt-2 space-y-3">
        {progress && (
          <div className="space-y-1.5 pt-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-muted-foreground">O‘zlashtirish</span>
              <span className="text-primary font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        )}

        <Link href={`/courses/${course.slug}`} className="block w-full">
          <Button
            variant={percentage > 0 ? 'default' : 'gradient'}
            className="w-full text-xs font-semibold gap-1.5 justify-between"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {percentage === 100 ? 'Qayta ko‘rish' : percentage > 0 ? 'Davom ettirish' : 'Kursni boshlash'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
