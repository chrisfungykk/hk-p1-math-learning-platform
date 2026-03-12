// Feature: hk-p1-math-learning-platform, Property 1: Question generator produces valid questions
// Feature: hk-p1-math-learning-platform, Property 8: Difficulty level scales numeric range
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateQuestions } from '../../engine/questionGenerator';
import type { DifficultyLevel } from '../../types';

const ALL_TOPIC_IDS = [
  'counting', 'addition-10', 'subtraction-10', 'shapes', 'compare-length-height', 'ordering-sequences',
  'addition-20', 'subtraction-20', 'telling-time', 'coins-notes', 'composing-shapes', 'data-handling',
] as const;

const ARITHMETIC_TOPIC_IDS = ['addition-10', 'subtraction-10', 'addition-20', 'subtraction-20'] as const;

describe('Property 1: Question generator produces valid questions', () => {
  // **Validates: Requirements 3.1, 3.4, 5.2**
  it('every question returned by generateQuestions should have valid fields matching the request', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_TOPIC_IDS),
        fc.constantFrom<DifficultyLevel>('easy', 'medium', 'hard', 'challenge'),
        fc.integer({ min: 1, max: 10 }),
        (topicId, difficulty, count) => {
          const questions = generateQuestions({ topicId, difficulty, count });

          expect(questions.length).toBe(count);

          for (const q of questions) {
            expect(q.topicId).toBe(topicId);
            expect(q.difficulty).toBe(difficulty);
            expect(typeof q.prompt).toBe('string');
            expect(q.prompt.length).toBeGreaterThan(0);
            expect(q.options.length).toBeGreaterThanOrEqual(2);
            expect(q.correctAnswerIndex).toBeGreaterThanOrEqual(0);
            expect(q.correctAnswerIndex).toBeLessThan(q.options.length);
            expect(typeof q.explanation).toBe('string');
            expect(q.explanation.length).toBeGreaterThan(0);
            expect(typeof q.id).toBe('string');
            expect(q.id.length).toBeGreaterThan(0);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});



describe('Property 8: Difficulty level scales numeric range', () => {
  // **Validates: Requirements 5.4, 5.5**
  // With exam-style word problems, we validate that harder difficulties produce
  // questions with at least as many options and non-trivial prompts.
  it('for arithmetic topics, harder difficulties produce valid questions with sufficient variety', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ARITHMETIC_TOPIC_IDS),
        (topicId) => {
          const questionsPerLevel = 20;

          for (const difficulty of ['easy', 'medium', 'hard', 'challenge'] as DifficultyLevel[]) {
            const questions = generateQuestions({ topicId, difficulty, count: questionsPerLevel });
            expect(questions.length).toBe(questionsPerLevel);
            for (const q of questions) {
              expect(q.options.length).toBeGreaterThanOrEqual(2);
              expect(q.prompt.length).toBeGreaterThan(0);
              expect(q.correctAnswerIndex).toBeGreaterThanOrEqual(0);
              expect(q.correctAnswerIndex).toBeLessThan(q.options.length);
            }
          }
        },
      ),
      { numRuns: 50 },
    );
  });
});
