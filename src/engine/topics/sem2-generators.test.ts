import { describe, it, expect } from 'vitest';
import { generateAddition20Questions } from './addition20';
import { generateSubtraction20Questions } from './subtraction20';
import { generateTellingTimeQuestions } from './tellingTime';
import { generateCoinsNotesQuestions } from './coinsNotes';
import { generateComposingShapesQuestions } from './composingShapes';
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
  describe('addition20', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateAddition20Questions(d, 5);
        assertValidQuestions(qs, 'addition-20', d, 5);
        for (const q of qs) {
          // Verify the answer is correct
          const match = q.prompt.match(/^(\d+) \+ (\d+) = \?$/);
          expect(match).toBeTruthy();
          const sum = Number(match![1]) + Number(match![2]);
          expect(q.options[q.correctAnswerIndex]).toBe(sum.toString());
        }
      });
    }

    it('easy sums are ≤ 12', () => {
      const qs = generateAddition20Questions('easy', 20);
      for (const q of qs) {
        const match = q.prompt.match(/^(\d+) \+ (\d+) = \?$/);
        expect(Number(match![1]) + Number(match![2])).toBeLessThanOrEqual(12);
      }
    });

    it('hard sums are ≤ 20', () => {
      const qs = generateAddition20Questions('hard', 20);
      for (const q of qs) {
        const match = q.prompt.match(/^(\d+) \+ (\d+) = \?$/);
        expect(Number(match![1]) + Number(match![2])).toBeLessThanOrEqual(20);
      }
    });
  });

  describe('subtraction20', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateSubtraction20Questions(d, 5);
        assertValidQuestions(qs, 'subtraction-20', d, 5);
        for (const q of qs) {
          const match = q.prompt.match(/^(\d+) - (\d+) = \?$/);
          expect(match).toBeTruthy();
          const diff = Number(match![1]) - Number(match![2]);
          expect(diff).toBeGreaterThanOrEqual(0);
          expect(q.options[q.correctAnswerIndex]).toBe(diff.toString());
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

  describe('coinsNotes', () => {
    for (const d of difficulties) {
      it(`generates valid ${d} questions`, () => {
        const qs = generateCoinsNotesQuestions(d, 5);
        assertValidQuestions(qs, 'coins-notes', d, 5);
        for (const q of qs) {
          expect(q.graphicType).toBe('money');
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
