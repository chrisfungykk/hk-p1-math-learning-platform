import { describe, it, expect } from 'vitest';
import { generateWordProblemsQuestions } from './wordProblems';
import { generateComposingShapesQuestions } from './composingShapes';
import { generateCompareLengthQuestions } from './compareLength';
import { generateTellingTimeQuestions } from './tellingTime';
import { generateOrderingQuestions } from './ordering';
import { generateDataHandlingQuestions } from './dataHandling';
import { generateNumbers100Questions } from './numbers100';
import { generateTwoDigitAdditionQuestions } from './twoDigitAddition';
import { generateTwoDigitSubtractionQuestions } from './twoDigitSubtraction';
import { generateMeasurementQuestions } from './measurement';
import { generateSkipCountingQuestions } from './skipCounting';
import { generateDirectionsQuestions } from './directions';
import { generateFlatShapesQuestions } from './flatShapes';
import type { DifficultyLevel, Question } from '../../types';

const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard'];

function assertValidQuestions(questions: Question[], topicId: string, difficulty: DifficultyLevel, count: number) {
  expect(questions).toHaveLength(count);
  for (const q of questions) {
    expect(q.topicId).toBe(topicId);
    expect(q.difficulty).toBe(difficulty);
    expect(q.prompt).toBeTruthy();
    expect(q.options.length).toBeGreaterThanOrEqual(2);
    expect(q.correctAnswerIndex).toBeGreaterThanOrEqual(0);
    expect(q.correctAnswerIndex).toBeLessThan(q.options.length);
    expect(q.explanation).toBeTruthy();
    expect(q.id).toBeTruthy();
  }
}

describe('Semester 2 topic generators', () => {
  describe('wordProblems', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateWordProblemsQuestions(d, 5);
        assertValidQuestions(qs, 'word-problems', d, 5);
        for (const q of qs) {
          expect(q.graphicType).toBe('word-problem');
        }
      });
    }
  });

  describe('composingShapes', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateComposingShapesQuestions(d, 5);
        assertValidQuestions(qs, 'composing-shapes', d, 5);
        for (const q of qs) {
          expect(q.graphicType).toBe('shape-compose');
        }
      });
    }
  });

  describe('compareLength', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateCompareLengthQuestions(d, 5);
        assertValidQuestions(qs, 'compare-length-height', d, 5);
        for (const q of qs) {
          expect(q.graphicType).toBe('comparison');
        }
      });
    }
  });

  describe('tellingTime', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateTellingTimeQuestions(d, 5);
        assertValidQuestions(qs, 'telling-time', d, 5);
        for (const q of qs) {
          expect(q.graphicType).toBe('clock');
        }
      });
    }
  });

  describe('ordering', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateOrderingQuestions(d, 5);
        assertValidQuestions(qs, 'ordering-sequences', d, 5);
        for (const q of qs) {
          expect(q.graphicType).toBe('sequence');
        }
      });
    }
  });

  describe('dataHandling', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateDataHandlingQuestions(d, 5);
        assertValidQuestions(qs, 'data-handling', d, 5);
        for (const q of qs) {
          expect(q.graphicType).toBe('pictogram');
        }
      });
    }
  });

  describe('numbers100', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateNumbers100Questions(d, 5);
        assertValidQuestions(qs, 'numbers-100', d, 5);
      });
    }
  });

  describe('twoDigitAddition', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateTwoDigitAdditionQuestions(d, 5);
        assertValidQuestions(qs, 'two-digit-addition', d, 5);
      });
    }
  });

  describe('twoDigitSubtraction', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateTwoDigitSubtractionQuestions(d, 5);
        assertValidQuestions(qs, 'two-digit-subtraction', d, 5);
      });
    }
  });

  describe('measurement', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateMeasurementQuestions(d, 5);
        assertValidQuestions(qs, 'measurement', d, 5);
      });
    }
  });

  describe('skipCounting', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateSkipCountingQuestions(d, 5);
        assertValidQuestions(qs, 'skip-counting', d, 5);
      });
    }
  });

  describe('directions', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateDirectionsQuestions(d, 5);
        assertValidQuestions(qs, 'directions', d, 5);
      });
    }
  });

  describe('flatShapes', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateFlatShapesQuestions(d, 5);
        assertValidQuestions(qs, 'flat-shapes', d, 5);
      });
    }
  });
});
