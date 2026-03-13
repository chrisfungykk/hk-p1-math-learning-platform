import type { SemesterDefinition, DifficultyLevel } from './types';

export const SEMESTERS: SemesterDefinition[] = [
  {
    id: 'sem1',
    name: '上學期',
    topics: [
      'counting',
      'odd-even',
      'ordinal-numbers',
      'number-composition',
      'addition-10',
      'subtraction-10',
      'addition-20',
      'subtraction-20',
      'positions',
      'shapes',
    ],
  },
  {
    id: 'sem2',
    name: '下學期',
    topics: [
      'numbers-100',
      'two-digit-addition',
      'two-digit-subtraction',
      'compare-length-height',
      'measurement',
      'flat-shapes',
      'telling-time',
      'ordering-sequences',
      'data-handling',
      'word-problems',
      'skip-counting',
      'composing-shapes',
      'directions',
      'coins-notes',
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
