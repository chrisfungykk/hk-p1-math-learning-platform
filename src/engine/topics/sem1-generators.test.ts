import { describe, it, expect } from 'vitest';
import { generateQuestions } from '../questionGenerator';
import { generateOddEvenQuestions } from './oddEven';
import { generateOrdinalNumbersQuestions } from './ordinalNumbers';
import { generateNumberCompositionQuestions } from './numberComposition';
import { generatePositionsQuestions } from './positions';
import type { DifficultyLevel, Question } from '../../types';

const SEM1_TOPICS = ['counting', 'addition-10', 'subtraction-10', 'addition-20', 'subtraction-20', 'shapes', 'coins-notes'];
const DIFFICULTIES: DifficultyLevel[] = ['easy', 'medium', 'hard'];

/** Asserts structural validity of generated questions */
function assertValidQuestions(qs: Question[], topicId: string, difficulty: DifficultyLevel, expectedCount: number) {
  expect(qs).toHaveLength(expectedCount);
  for (const q of qs) {
    expect(q.id).toBeTruthy();
    expect(q.topicId).toBe(topicId);
    expect(q.difficulty).toBe(difficulty);
    expect(q.prompt).toBeTruthy();
    expect(q.options).toHaveLength(4);
    expect(q.correctAnswerIndex).toBeGreaterThanOrEqual(0);
    expect(q.correctAnswerIndex).toBeLessThan(q.options.length);
    expect(q.explanation).toBeTruthy();
  }
}

describe('Semester 1 topic generators sanity check', () => {
  for (const topicId of SEM1_TOPICS) {
    for (const difficulty of DIFFICULTIES) {
      it(`${topicId} [${difficulty}] generates valid questions`, () => {
        const qs = generateQuestions({ topicId, difficulty, count: 5 });
        expect(qs).toHaveLength(5);

        for (const q of qs) {
          expect(q.id).toBeTruthy();
          expect(q.topicId).toBe(topicId);
          expect(q.difficulty).toBe(difficulty);
          expect(q.prompt).toBeTruthy();
          expect(q.options.length).toBeGreaterThanOrEqual(2);
          expect(q.correctAnswerIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctAnswerIndex).toBeLessThan(q.options.length);
          expect(q.explanation).toBeTruthy();
          expect(q.graphicType).toBeTruthy();
        }
      });
    }
  }
});

/* ── New sem1 topics (not yet in TOPIC_REGISTRY — call generators directly) ── */

const NEW_SEM1_GENERATORS: { topicId: string; generate: (d: DifficultyLevel, n: number) => Question[] }[] = [
  { topicId: 'odd-even', generate: generateOddEvenQuestions },
  { topicId: 'ordinal-numbers', generate: generateOrdinalNumbersQuestions },
  { topicId: 'number-composition', generate: generateNumberCompositionQuestions },
  { topicId: 'positions', generate: generatePositionsQuestions },
];

describe('New sem1 topic generators', () => {
  for (const { topicId, generate } of NEW_SEM1_GENERATORS) {
    describe(topicId, () => {
      for (const difficulty of DIFFICULTIES) {
        it(`[${difficulty}] generates structurally valid questions`, () => {
          const qs = generate(difficulty, 5);
          assertValidQuestions(qs, topicId, difficulty, 5);
        });
      }
    });
  }
});
