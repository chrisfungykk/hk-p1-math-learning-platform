// Feature: hk-p1-math-learning-platform, Property 9: Exam preparation covers multiple topics
// Feature: hk-p1-math-learning-platform, Property 10: Exam preparation question count bounds
// Feature: hk-p1-math-learning-platform, Property 11: Exam preparation per-topic breakdown invariant
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generateExamQuestions, computeTopicBreakdown } from '../../utils/examPrep';
import { computeScoreSummary } from '../../utils/scoring';
import type { DifficultyLevel } from '../../types';

describe('Property 9: Exam preparation covers multiple topics', () => {
  // **Validates: Requirements 6.1**
  it('for any semester, exam questions must include questions from at least two distinct topics', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<'sem1' | 'sem2'>('sem1', 'sem2'),
        fc.constantFrom<DifficultyLevel>('easy', 'medium', 'hard', 'challenge'),
        (semester, difficulty) => {
          const questions = generateExamQuestions(semester, difficulty);
          const uniqueTopics = new Set(questions.map((q) => q.topicId));
          expect(uniqueTopics.size).toBeGreaterThanOrEqual(2);
        },
      ),
      { numRuns: 100 },
    );
  });
});

describe('Property 10: Exam preparation question count bounds', () => {
  // **Validates: Requirements 6.3**
  it('the number of generated questions must be at least 15 and at most 30', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<'sem1' | 'sem2'>('sem1', 'sem2'),
        fc.constantFrom<DifficultyLevel>('easy', 'medium', 'hard', 'challenge'),
        fc.integer({ min: 1, max: 50 }),
        (semester, difficulty, totalCount) => {
          const questions = generateExamQuestions(semester, difficulty, totalCount);
          expect(questions.length).toBeGreaterThanOrEqual(15);
          expect(questions.length).toBeLessThanOrEqual(30);
        },
      ),
      { numRuns: 100 },
    );
  });
});

describe('Property 11: Exam preparation per-topic breakdown invariant', () => {
  // **Validates: Requirements 6.4**
  it('sum of breakdown correct === summary correct, and sum of breakdown total === summary total', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<'sem1' | 'sem2'>('sem1', 'sem2'),
        fc.constantFrom<DifficultyLevel>('easy', 'medium', 'hard', 'challenge'),
        (semester, difficulty) => {
          const questions = generateExamQuestions(semester, difficulty);

          // Generate random answers for each question
          const answers = questions.map((question) => ({
            question,
            submittedIndex: Math.floor(Math.random() * question.options.length),
          }));

          const breakdown = computeTopicBreakdown(answers);
          const summary = computeScoreSummary(answers);

          const breakdownCorrectSum = breakdown.reduce((sum, entry) => sum + entry.correct, 0);
          const breakdownTotalSum = breakdown.reduce((sum, entry) => sum + entry.total, 0);

          expect(breakdownCorrectSum).toBe(summary.correct);
          expect(breakdownTotalSum).toBe(summary.total);
        },
      ),
      { numRuns: 100 },
    );
  });
});
