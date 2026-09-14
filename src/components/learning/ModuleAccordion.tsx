'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Circle, Clock, PlayCircle } from 'lucide-react';
import type { Module, Lesson, LessonProgress } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface ModuleAccordionProps {
  modules: Module[];
  lessons: Lesson[];
  progressList?: LessonProgress[];
  courseSlug: string;
  activeLessonSlug?: string;
}

export function ModuleAccordion({
  modules,
  lessons,
  progressList = [],
  courseSlug,
  activeLessonSlug,
}: ModuleAccordionProps) {
  const progressMap = new Map(progressList.map((p) => [p.lessonId, p]));

  return (
    <Accordion type="multiple" defaultValue={modules.map((m) => m.id)} className="w-full space-y-3">
      {modules.map((module) => {
        const moduleLessons = lessons.filter((l) => l.moduleId === module.id);
        const completedCount = moduleLessons.filter(
          (l) => progressMap.get(l.id)?.status === 'completed'
        ).length;

        return (
          <AccordionItem
            key={module.id}
            value={module.id}
            className="rounded-xl border border-border/80 bg-card px-4 overflow-hidden"
          >
            <AccordionTrigger className="hover:no-underline py-3.5">
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm text-foreground">{module.title}</span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  {completedCount} / {moduleLessons.length} dars yakunlangan
                </span>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-1 pb-3 space-y-1.5">
              {moduleLessons.map((lesson) => {
                const prog = progressMap.get(lesson.id);
                const isCompleted = prog?.status === 'completed';
                const isActive = lesson.slug === activeLessonSlug;

                return (
                  <Link
                    key={lesson.id}
                    href={`/courses/${courseSlug}/lessons/${lesson.slug}?autostart=1`}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs transition-all ${
                      isActive
                        ? 'bg-primary/15 text-primary font-bold border border-primary/30'
                        : isCompleted
                        ? 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                        : 'text-foreground hover:bg-muted/70'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isActive ? (
                        <PlayCircle className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                      )}
                      <span className="line-clamp-1">{lesson.title}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 ml-2">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.estimatedMinutes} daq</span>
                    </div>
                  </Link>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
