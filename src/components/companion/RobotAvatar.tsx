'use client';

import React from 'react';
import { Robot3DCanvas } from './Robot3DCanvas';

export type RobotMood = 'idle' | 'talking' | 'alert' | 'celebrate' | 'thinking';

interface RobotAvatarProps {
  mood?: RobotMood;
  isSpeaking?: boolean;
  isPointing?: boolean;
  pointingDirection?: 'left' | 'right';
  size?: number;
  className?: string;
  forceSvg?: boolean;
}

const emptySubscribe = () => () => {};

export function RobotAvatar({
  mood = 'idle',
  isSpeaking = false,
  isPointing = false,
  pointingDirection = 'left',
  size = 72,
  className = '',
  forceSvg = false,
}: RobotAvatarProps) {
  const isClient = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Use 3D canvas on client unless forceSvg is true
  if (isClient && !forceSvg) {
    return (
      <div className={`relative select-none flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <Robot3DCanvas
          mood={mood}
          isSpeaking={isSpeaking}
          isPointing={isPointing}
          pointingDirection={pointingDirection}
          size={size}
        />
      </div>
    );
  }

  const currentMood = isSpeaking ? 'talking' : mood;

  // Colors based on mood
  const antennaColor = 
    currentMood === 'alert' ? '#ef4444' : 
    currentMood === 'celebrate' ? '#f59e0b' : 
    currentMood === 'talking' ? '#3b82f6' : '#10b981';

  const glowColor = 
    currentMood === 'alert' ? 'rgba(239, 68, 68, 0.4)' : 
    currentMood === 'celebrate' ? 'rgba(245, 158, 11, 0.45)' : 
    currentMood === 'talking' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(16, 185, 129, 0.35)';

  return (
    <div 
      className={`relative select-none transition-transform duration-300 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient hover aura */}
      <div 
        className="absolute inset-0 rounded-full blur-lg transition-all duration-500 animate-pulse pointer-events-none"
        style={{ background: glowColor }}
      />

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-md"
      >
        <defs>
          <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          <linearGradient id="robotVisorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </linearGradient>

          <linearGradient id="robotEarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1e40af" />
          </linearGradient>

          <filter id="eyeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Floating Antenna */}
        <g className="animate-bounce" style={{ animationDuration: '2.5s' }}>
          {/* Antenna stem */}
          <line x1="50" y1="20" x2="50" y2="10" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          {/* Antenna glowing orb */}
          <circle cx="50" cy="8" r="5" fill={antennaColor} filter="url(#eyeGlow)" />
          <circle cx="50" cy="8" r="2.5" fill="#ffffff" />
        </g>

        {/* 2. Ear bolts */}
        <rect x="14" y="38" width="6" height="14" rx="3" fill="url(#robotEarGrad)" />
        <rect x="80" y="38" width="6" height="14" rx="3" fill="url(#robotEarGrad)" />

        {/* 3. Main Head Chassis */}
        <rect 
          x="18" 
          y="20" 
          width="64" 
          height="52" 
          rx="18" 
          fill="url(#robotBodyGrad)" 
          stroke="rgba(255, 255, 255, 0.4)" 
          strokeWidth="1.5" 
        />

        {/* 4. High-tech Visor Screen */}
        <rect 
          x="24" 
          y="26" 
          width="52" 
          height="40" 
          rx="12" 
          fill="url(#robotVisorGrad)" 
          stroke="rgba(96, 165, 250, 0.3)" 
          strokeWidth="1" 
        />

        {/* 5. Expressive Visor Eyes & Mouth depending on mood */}
        {currentMood === 'idle' && (
          <g>
            {/* Blinking friendly cyan pill eyes */}
            <rect x="33" y="38" width="10" height="12" rx="5" fill="#38bdf8" filter="url(#eyeGlow)" />
            <rect x="57" y="38" width="10" height="12" rx="5" fill="#38bdf8" filter="url(#eyeGlow)" />
            <circle cx="36" cy="41" r="2" fill="#ffffff" />
            <circle cx="60" cy="41" r="2" fill="#ffffff" />
            {/* Subtle smile */}
            <path d="M44 54 Q50 58 56 54" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {currentMood === 'talking' && (
          <g>
            {/* Wide awake talking eyes */}
            <rect x="33" y="36" width="10" height="13" rx="5" fill="#60a5fa" filter="url(#eyeGlow)" />
            <rect x="57" y="36" width="10" height="13" rx="5" fill="#60a5fa" filter="url(#eyeGlow)" />
            <circle cx="36" cy="39" r="2" fill="#ffffff" />
            <circle cx="60" cy="39" r="2" fill="#ffffff" />
            {/* Animated soundwave mouth */}
            <path d="M42 54 Q50 61 58 54" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="50" cy="55" r="2" fill="#38bdf8" />
          </g>
        )}

        {currentMood === 'alert' && (
          <g>
            {/* Surprised / Concerned Eyes (⊙_⊙) */}
            <circle cx="38" cy="42" r="7" fill="#ef4444" filter="url(#eyeGlow)" />
            <circle cx="62" cy="42" r="7" fill="#ef4444" filter="url(#eyeGlow)" />
            <circle cx="38" cy="42" r="3" fill="#ffffff" />
            <circle cx="62" cy="42" r="3" fill="#ffffff" />
            {/* O-shaped surprised mouth */}
            <circle cx="50" cy="55" r="3.5" stroke="#ef4444" strokeWidth="2" fill="none" />
          </g>
        )}

        {currentMood === 'celebrate' && (
          <g>
            {/* Happy squinting star eyes (^ ‿ ^) */}
            <path d="M32 44 Q38 35 44 44" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#eyeGlow)" />
            <path d="M56 44 Q62 35 68 44" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#eyeGlow)" />
            {/* Big happy smile */}
            <path d="M42 52 Q50 62 58 52" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Rosy cheeks */}
            <circle cx="30" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
            <circle cx="70" cy="50" r="3" fill="#f43f5e" opacity="0.6" />
          </g>
        )}

        {currentMood === 'thinking' && (
          <g>
            {/* Curious looking-up eyes */}
            <circle cx="38" cy="38" r="6" fill="#a855f7" filter="url(#eyeGlow)" />
            <circle cx="62" cy="38" r="6" fill="#a855f7" filter="url(#eyeGlow)" />
            <circle cx="40" cy="36" r="2.5" fill="#ffffff" />
            <circle cx="64" cy="36" r="2.5" fill="#ffffff" />
            {/* Thinking wavy mouth */}
            <path d="M43 54 Q47 51 51 54 T57 54" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {/* 6. Thruster / Floating Propulsion Ring */}
        <ellipse cx="50" cy="80" rx="16" ry="4" fill="rgba(59, 130, 246, 0.4)" />
        <path d="M40 72 Q50 82 60 72" stroke="url(#robotBodyGrad)" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="50" cy="84" rx="8" ry="3" fill={antennaColor} filter="url(#eyeGlow)" opacity="0.8" />
      </svg>
    </div>
  );
}
