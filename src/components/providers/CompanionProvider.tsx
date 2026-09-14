'use client';

import React, { createContext, useContext, useState } from 'react';

export interface LessonCompanionData {
  lessonTitle: string;
  lessonObjective?: string;
  lessonAnalogy?: string;
  theory?: Array<{ type?: string; content: string }>;
  interactiveExample?: {
    title: string;
    code: string;
    expectedOutput?: string;
    lineExplanations?: Record<string, string>;
  };
  commonMistakes?: Array<{
    title: string;
    wrongCode: string;
    correctCode: string;
    explanation: string;
  }>;
  exercise?: {
    title: string;
    description: string;
    instructions: string[];
    starterCode?: string;
    expectedConcepts?: string[];
  };
  lastError?: {
    type?: string;
    message: string;
    line?: number;
    originalMessage?: string;
  } | null;
  userCode?: string;
  isPassed?: boolean;
  hints?: string[];
  hintsUsedCount?: number;
  onHighlightLine?: (line: number) => void;
  autostart?: boolean;
  autoStartOnMount?: boolean;
}

interface CompanionContextType {
  lessonData: LessonCompanionData | null;
  setLessonData: (data: LessonCompanionData | null) => void;
  isGlobalCompanionActive: boolean;
  setIsGlobalCompanionActive: (val: boolean) => void;
}

const CompanionContext = createContext<CompanionContextType>({
  lessonData: null,
  setLessonData: () => {},
  isGlobalCompanionActive: true,
  setIsGlobalCompanionActive: () => {},
});

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const [lessonData, setLessonData] = useState<LessonCompanionData | null>(null);
  const [isGlobalCompanionActive, setIsGlobalCompanionActive] = useState(true);

  return (
    <CompanionContext.Provider
      value={{
        lessonData,
        setLessonData,
        isGlobalCompanionActive,
        setIsGlobalCompanionActive,
      }}
    >
      {children}
    </CompanionContext.Provider>
  );
}

export function useCompanion() {
  return useContext(CompanionContext);
}
