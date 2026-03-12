import type { SemesterDefinition, DifficultyLevel } from './types';

export const SEMESTERS: SemesterDefinition[] = [
  {
    id: 'sem1',
    name: '上學期',
    topics: [
      'counting',
      'addition-10',
      'subtraction-10',
      'addition-20',
      'subtraction-20',
      'ordering-sequences',
    ],
  },
  {
    id: 'sem2',
    name: '下學期',
    topics: [
      'shapes',
      'composing-shapes',
      'compare-length-height',
      'telling-time',
      'coins-notes',
      'data-handling',
    ],
  },
];

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy: '容易',
  medium: '中等',
  hard: '困難',
  challenge: '挑戰',
};

export const STORAGE_KEY = 'hk-p1-math-platform';
