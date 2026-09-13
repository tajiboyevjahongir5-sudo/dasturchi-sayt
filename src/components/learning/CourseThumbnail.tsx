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
  if (text.includes('intermediate') || text.includes('o‘rta') || text.includes('orta')) {
    return '/images/courses/js-intermediate.svg';
  }
  if (text.includes('html')) {
    return '/images/courses/html.svg';
  }
  if (text.includes('css')) {
    return '/images/courses/css.svg';
  }
  if (text.includes('javascript') || text.includes('js')) {
    return '/images/courses/js.svg';
  }
  return '/images/courses/intro.svg';
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
  const isUrl =
    typeof thumbnail === 'string' &&
    (thumbnail.startsWith('/') ||
      thumbnail.startsWith('http://') ||
      thumbnail.startsWith('https://'));

  const [hasError, setHasError] = useState(false);
  const [prevThumbnail, setPrevThumbnail] = useState(thumbnail);

  if (prevThumbnail !== thumbnail) {
    setPrevThumbnail(thumbnail);
    setHasError(false);
  }

  // If thumbnail is an emoji (e.g. 🚀, ⚡, 📘)
  const isEmoji = !isUrl && thumbnail && thumbnail.trim().length <= 4;
  const srcToUse = hasError || !isUrl ? fallbackSvg : thumbnail;

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
