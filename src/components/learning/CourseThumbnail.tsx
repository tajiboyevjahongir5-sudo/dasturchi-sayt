'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface CourseThumbnailProps {
  thumbnail: string;
  title: string;
  slug?: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
}

export function getCourseFallbackSvg(slug?: string, title?: string): string {
  const text = `${slug || ''} ${title || ''}`.toLowerCase();
  if (text.includes('terminal') || text.includes('cli') || text.includes('bash')) {
    return '/images/courses/terminal.jpg';
  }
  if (text.includes('git') || text.includes('github')) {
    return '/images/courses/git.jpg';
  }
  if (text.includes('backend') || text.includes('server') || text.includes('node') || text.includes('express')) {
    return '/images/courses/backend.jpg';
  }
  if (text.includes('database') || text.includes('sql') || text.includes('baza')) {
    return '/images/courses/database.jpg';
  }
  if (text.includes('react')) {
    return '/images/courses/react.jpg';
  }
  if (text.includes('security') || text.includes('xavfsizlik') || text.includes('himoya') || text.includes('kiber')) {
    return '/images/courses/security.jpg';
  }
  if (text.includes('prompt') || text.includes('ai') || text.includes('intellekt')) {
    return '/images/courses/prompt.jpg';
  }
  if (text.includes('intermediate') || text.includes('o‘rta') || text.includes('orta')) {
    return '/images/courses/js.jpg';
  }
  if (text.includes('html')) {
    return '/images/courses/html.jpg';
  }
  if (text.includes('css')) {
    return '/images/courses/css.jpg';
  }
  if (text.includes('javascript') || text.includes('js')) {
    return '/images/courses/js.jpg';
  }
  return '/images/courses/intro.jpg';
}

export function CourseThumbnail({
  thumbnail,
  title,
  slug,
  className = 'object-cover',
  fill = true,
  priority = false,
}: CourseThumbnailProps) {
  const fallbackSvg = getCourseFallbackSvg(slug, title);
  
  // Normalize legacy .svg course thumbnails to new high-definition 3D banners (.jpg)
  const mappedThumbnail = typeof thumbnail === 'string'
    ? thumbnail.replace(/\.svg$/, '.jpg')
    : thumbnail;

  const isUrl =
    typeof mappedThumbnail === 'string' &&
    (mappedThumbnail.startsWith('/') ||
      mappedThumbnail.startsWith('http://') ||
      mappedThumbnail.startsWith('https://'));

  const [hasError, setHasError] = useState(false);
  const [prevThumbnail, setPrevThumbnail] = useState(mappedThumbnail);

  if (prevThumbnail !== mappedThumbnail) {
    setPrevThumbnail(mappedThumbnail);
    setHasError(false);
  }

  // If thumbnail is an emoji (e.g. 🚀, ⚡, 📘)
  const isEmoji = !isUrl && mappedThumbnail && mappedThumbnail.trim().length <= 4;
  const srcToUse = hasError || !isUrl ? fallbackSvg : mappedThumbnail;

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      <Image
        key={thumbnail}
        src={srcToUse}
        alt={title}
        fill={fill}
        priority={priority}
        className={className}
        unoptimized={hasError || srcToUse.startsWith('/')}
        onError={() => setHasError(true)}
      />

      {/* If it's an emoji badge, overlay glowing center badge */}
      {isEmoji && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center text-3xl animate-pulse">
            {thumbnail}
          </div>
        </div>
      )}
    </div>
  );
}
