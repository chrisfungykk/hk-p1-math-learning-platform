// Feature: hk-p1-math-learning-platform, Property 2: Answer evaluation correctness
// Feature: hk-p1-math-learning-platform, Property 3: Score summary invariant
// Feature: hk-p1-math-learning-platform, Property 4: Score record completeness
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { evaluateAnswer, computeScoreSummary, createScoreRecord } from '../../utils/scoring';
import type { Question, DifficultyLevel } from '../../types';

/**
 * Arbitrary generator for a valid Question object.
 * Produces random options (2-6 items) and a correctAnswerIndex within bounds.
 */
function arbitraryQuestion(): fc.Arbitrary<Question> {
  return fc
    .integer({ min: 2, max: 6 })
    .chain((optionsLength) =>
      fc.record({
        id: fc.uuid(),
        topicId: fc.constantFrom('counting', 'addition-10', 'subtraction-10', 'shapes'),
        difficulty: fc.constantFrom<DifficultyLevel>('easy', 'medium', 'hard', 'challenge'),
        prompt: fc.string({ minLength: 1 }),
        options: fc.array(fc.string({ minLength: 1 }), {
          minLength: optionsLength,
          maxLength: optionsLength,
        }),
        correctAnswerIndex: fc.integer({ min: 0, max: optionsLength - 1 }),
        explanation: fc.string({ minLength: 1 }),
      })
    );
}

describe('Property 2: Answer evaluation correctness', () => {
  // **Validates: Requirements 3.3**
  it('evaluateAnswer returns true iff submittedIndex equals correctAnswerIndex', () => {
    fc.assert(
      fc.property(
        arbitraryQuestion().chain((question) =>
          fc.record({
            question: fc.constant(question),
            submittedIndex: fc.integer({ min: 0, max: question.options.length - 1 }),
          })
        ),
        ({ question, submittedIndex }) => {
          const result = evaluateAnswer(question, submittedIndex);
          const expected = submittedIndex === question.correctAnswerIndex;
          expect(result).toBe(expected);
        }
      ),
      { numRuns: 100 },
    );
  });
});

describe('Property 3: Score summary invariant', () => {
  // **Validates: Requirements 3.5**
  it('correct + incorrect === total, and correct equals count of matching answers', () => {
    fc.assert(
      fc.property(
        fc.array(
          arbitraryQuestion().chain((question) =>
            fc.record({
              question: fc.constant(question),
              submittedIndex: fc.integer({ min: 0, max: question.options.length - 1 }),
            })
          ),
          { minLength: 1, maxLength: 30 }
        ),
        (answers) => {
          const summary = computeScoreSummary(answers);

          // correct + incorrect must equal total
          expect(summary.correct + summary.incorrect).toBe(summary.total);

          // total must equal the number of answers
          expect(summary.total).toBe(answers.length);

          // correct must equal the count of answers where submittedIndex matches correctAnswerIndex
          const expectedCorrect = answers.filter(
            (a) => a.submittedIndex === a.question.correctAnswerIndex
          ).length;
          expect(summary.correct).toBe(expectedCorrect);
        }
      ),
      { numRuns: 100 },
    );
  });
});


describe('Property 4: Score record completeness', () => {
  // **Validates: Requirements 4.1, 6.5**
  it('createScoreRecord produces a valid ScoreRecord with all required fields', () => {
    fc.assert(
      fc.property(
        fc.record({
          topicId: fc.oneof(
            fc.constantFrom('counting', 'addition-10', 'subtraction-10', 'shapes'),
            fc.constant(null as string | null)
          ),
          semester: fc.constantFrom<'sem1' | 'sem2'>('sem1', 'sem2'),
          difficulty: fc.constantFrom<DifficultyLevel>('easy', 'medium', 'hard', 'challenge'),
          totalQuestions: fc.integer({ min: 1, max: 30 }),
          isExamPrep: fc.boolean(),
        }).chain((base) =>
          fc.record({
            topicId: fc.constant(base.topicId),
            semester: fc.constant(base.semester),
            difficulty: fc.constant(base.difficulty),
            score: fc.integer({ min: 0, max: base.totalQuestions }),
            totalQuestions: fc.constant(base.totalQuestions),
            isExamPrep: fc.constant(base.isExamPrep),
          })
        ),
        (params) => {
          const record = createScoreRecord(params);

          // id must be a non-empty string
          expect(typeof record.id).toBe('string');
          expect(record.id.length).toBeGreaterThan(0);

          // semester must be valid
          expect(['sem1', 'sem2']).toContain(record.semester);

          // difficulty must be valid
          expect(['easy', 'medium', 'hard', 'challenge']).toContain(record.difficulty);

          // score must be between 0 and totalQuestions inclusive
          expect(record.score).toBeGreaterThanOrEqual(0);
          expect(record.score).toBeLessThanOrEqual(record.totalQuestions);

          // date must be a valid ISO 8601 string
          const parsedDate = new Date(record.date);
          expect(parsedDate.toISOString()).toBe(record.date);

          // isExamPrep must match input
          expect(record.isExamPrep).toBe(params.isExamPrep);
        }
      ),
      { numRuns: 100 },
    );
  });
});
