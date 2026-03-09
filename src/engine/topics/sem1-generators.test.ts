import { describe, it, expect } from 'vitest';
import { generateQuestions } from '../questionGenerator';
import type { DifficultyLevel } from '../../types';

const SEM1_TOPICS = ['counting', 'addition-10', 'subtraction-10', 'shapes', 'compare-length-height', 'ordering-sequences'];
const DIFFICULTIES: DifficultyLevel[] = ['easy', 'medium', 'hard'];

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
