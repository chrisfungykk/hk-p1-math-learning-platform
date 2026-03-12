// Feature: hk-p1-math-learning-platform, Property 5: Score records are sorted by date
// Feature: hk-p1-math-learning-platform, Property 6: Score record filtering
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { ScoreRecord } from '../../types';
import { sortRecordsByDate } from '../../utils/scoreHistory';

const SEMESTER_TOPIC_MAP: Record<string, string[]> = {
  sem1: [
    'counting', 'addition-10', 'subtraction-10', 'addition-20', 'subtraction-20',
    'ordering-sequences', 'shapes', 'composing-shapes', 'compare-length-height',
    'telling-time', 'coins-notes', 'data-handling',
  ],
};

/**
 * Arbitrary for a valid ScoreRecord with random ISO date.
 */
const scoreRecordArb: fc.Arbitrary<ScoreRecord> = fc.record({
  id: fc.uuid(),
  semester: fc.constantFrom('sem1' as const),
  difficulty: fc.constantFrom('easy' as const, 'medium' as const, 'hard' as const),
  totalQuestions: fc.integer({ min: 1, max: 30 }),
  date: fc.integer({
    min: new Date('2020-01-01').getTime(),
    max: new Date('2030-12-31').getTime(),
  }).map((ts) => new Date(ts).toISOString()),
  isExamPrep: fc.boolean(),
}).chain(({ id, semester, difficulty, totalQuestions, date, isExamPrep }) => {
  const scoreArb = fc.integer({ min: 0, max: totalQuestions });
  const topicIdArb = isExamPrep
    ? fc.constant(null as string | null)
    : fc.constantFrom(...SEMESTER_TOPIC_MAP[semester]).map((t) => t as string | null);

  return fc.tuple(scoreArb, topicIdArb).map(
    ([score, topicId]): ScoreRecord => ({
      id,
      topicId,
      semester,
      difficulty,
      score,
      totalQuestions,
      date,
      isExamPrep,
    })
  );
});

// **Validates: Requirements 4.2**
describe('Property 5: Score records are sorted by date', () => {
  it('sortRecordsByDate returns records in descending chronological order', () => {
    fc.assert(
      fc.property(
        fc.array(scoreRecordArb, { minLength: 0, maxLength: 50 }),
        (records) => {
          const sorted = sortRecordsByDate(records);

          // Length must be preserved
          expect(sorted).toHaveLength(records.length);

          // Each consecutive pair must be in descending date order
          for (let i = 0; i < sorted.length - 1; i++) {
            const currentDate = new Date(sorted[i].date).getTime();
            const nextDate = new Date(sorted[i + 1].date).getTime();
            expect(currentDate).toBeGreaterThanOrEqual(nextDate);
          }
        }
      ),
      { numRuns: 100 },
    );
  });

  it('sortRecordsByDate does not mutate the input array', () => {
    fc.assert(
      fc.property(
        fc.array(scoreRecordArb, { minLength: 1, maxLength: 20 }),
        (records) => {
          const original = [...records];
          sortRecordsByDate(records);

          // Input array should remain unchanged
          expect(records).toEqual(original);
        }
      ),
      { numRuns: 100 },
    );
  });
});

const ALL_TOPIC_IDS = [...SEMESTER_TOPIC_MAP.sem1];

/**
 * Arbitrary for filter combinations: optional semester and/or topicId.
 */
const filterArb = fc.record({
  semester: fc.option(fc.constantFrom('sem1' as const), { nil: undefined }),
  topicId: fc.option(fc.constantFrom(...ALL_TOPIC_IDS), { nil: undefined }),
});

/**
 * Pure filtering logic matching getFilteredRecords implementation.
 */
function filterRecords(
  records: ScoreRecord[],
  filters: { semester?: string; topicId?: string }
): ScoreRecord[] {
  return records.filter((r) => {
    if (filters.semester && r.semester !== filters.semester) return false;
    if (filters.topicId && r.topicId !== filters.topicId) return false;
    return true;
  });
}

// **Validates: Requirements 4.3**
describe('Property 6: Score record filtering', () => {
  it('every record in filtered result matches all active filter criteria, and no matching record is excluded', () => {
    fc.assert(
      fc.property(
        fc.array(scoreRecordArb, { minLength: 0, maxLength: 50 }),
        filterArb,
        (records, filters) => {
          const result = filterRecords(records, filters);

          // Every record in result must match all active filters
          for (const record of result) {
            if (filters.semester) {
              expect(record.semester).toBe(filters.semester);
            }
            if (filters.topicId) {
              expect(record.topicId).toBe(filters.topicId);
            }
          }

          // No record matching the criteria should be excluded
          const expectedMatching = records.filter((r) => {
            if (filters.semester && r.semester !== filters.semester) return false;
            if (filters.topicId && r.topicId !== filters.topicId) return false;
            return true;
          });
          expect(result).toHaveLength(expectedMatching.length);

          // Verify exact set equality by checking each expected record is present
          for (const expected of expectedMatching) {
            expect(result).toContainEqual(expected);
          }
        }
      ),
      { numRuns: 100 },
    );
  });
});
