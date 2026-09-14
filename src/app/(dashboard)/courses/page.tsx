'use client';

import React, { useEffect, useState } from 'react';
import { Search, Sparkles, Filter } from 'lucide-react';
import type { Course, CourseProgress } from '@/types';
import { CourseCard } from '@/components/learning/CourseCard';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface CourseWithProgress extends Course {
  progress?: CourseProgress;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setCourses(json.data);
          }
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const filterTabs = [
    { id: 'all', label: 'Barchasi' },
    { id: 'kirish', label: 'Dasturlashga Kirish & Git' },
    { id: 'frontend', label: 'Frontend & React' },
    { id: 'backend', label: 'Backend & Serverlar' },
    { id: 'database', label: 'Ma’lumotlar Bazasi' },
    { id: 'security', label: 'Kiberxavfsizlik' },
    { id: 'ai', label: 'Sun’iy Intellekt & Prompt' },
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && c.category === selectedFilter;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Amaliy kurslar katalogi</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight">Dasturlash Kurslari</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Har bir kurs nazariya, kod muharriri va avtomatik tekshiriladigan amaliy mashqlar bilan jihozlangan.
        </p>
      </div>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="w-full sm:w-72">
          <Input
            type="text"
            placeholder="Kurslarni qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} progress={course.progress} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border border-dashed border-border rounded-2xl space-y-3">
          <Filter className="w-8 h-8 text-muted-foreground mx-auto" />
          <h3 className="font-bold text-base">Kurslar topilmadi</h3>
          <p className="text-xs text-muted-foreground">Qidiruv so‘zini yoki filtrni o‘zgartirib ko‘ring.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedFilter('all');
            }}
            className="text-xs font-semibold gap-1.5 mt-2"
          >
            <span>Filtrlarni tozalash</span>
          </Button>
        </div>
      )}
    </div>
  );
}
