import { describe, it, expect } from 'vitest';
import { generateWordProblemsQuestions } from './wordProblems';
import { generateComposingShapesQuestions } from './composingShapes';
import { generateCompareLengthQuestions } from './compareLength';
import { generateTellingTimeQuestions } from './tellingTime';
import { generateOrderingQuestions } from './ordering';
import { generateDataHandlingQuestions } from './dataHandling';
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
});
