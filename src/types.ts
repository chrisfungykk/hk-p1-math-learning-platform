import type React from 'react';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'challenge';

export interface Question {
  id: string;
  topicId: string;
  difficulty: DifficultyLevel;
  prompt: string;           // The question text (繁體中文)
  options: string[];         // Multiple choice options
  correctAnswerIndex: number;
  explanation: string;       // Brief explanation shown on incorrect answer
  graphicType?: string;      // Optional graphic hint (e.g., 'counting-objects', 'shape')
}

export interface QuestionGeneratorConfig {
  topicId: string;
  difficulty: DifficultyLevel;
  count: number;
}

export interface ScoreRecord {
  id: string;                // UUID
  topicId: string | null;    // null for exam prep attempts
  semester: 'sem1' | 'sem2';
  difficulty: DifficultyLevel;
  score: number;             // Number of correct answers
  totalQuestions: number;     // Total questions in the attempt
  date: string;              // ISO 8601 date string
  isExamPrep: boolean;       // true if this is an Exam Preparation attempt
  topicBreakdown?: TopicScoreBreakdown[]; // Only for exam prep
}

export interface TopicScoreBreakdown {
  topicId: string;
  correct: number;
  total: number;
}

export interface TopicDefinition {
  id: string;
  name: string;              // Traditional Chinese name
  semester: 'sem1' | 'sem2';
  animationComposition: React.FC; // Remotion composition
  fallbackImage: string;     // Static fallback image path
  generateQuestions: (difficulty: DifficultyLevel, count: number) => Question[];
}

export interface SemesterDefinition {
  id: 'sem1' | 'sem2';
  name: string;              // '上學期' or '下學期'
  topics: string[];          // Array of topic IDs
}

export interface AppStorageData {
  scoreRecords: ScoreRecord[];
  lastDifficulty?: DifficultyLevel; // Remember last selected difficulty
}
