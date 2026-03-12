// Feature: hk-p1-math-learning-platform, Property 7: Score record localStorage round trip
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fc from 'fast-check';
import type { ScoreRecord, TopicScoreBreakdown } from '../../types';

const ALL_TOPIC_IDS = [
  'counting', 'addition-10', 'subtraction-10', 'shapes', 'compare-length-height', 'ordering-sequences',
  'addition-20', 'subtraction-20', 'telling-time', 'coins-notes', 'composing-shapes', 'data-handling',
];

function createLocalStorageMock() {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
    _store: store,
  };
}

/**
 * Arbitrary for TopicScoreBreakdown
 */
const topicBreakdownArb = fc.record({
  topicId: fc.constantFrom(...ALL_TOPIC_IDS),
  total: fc.integer({ min: 1, max: 10 }),
}).chain(({ topicId, total }) =>
  fc.integer({ min: 0, max: total }).map((correct) => ({
    topicId,
    correct,
    total,
  } satisfies TopicScoreBreakdown))
);

/**
 * Arbitrary for ScoreRecord (Property 7)
 * Generates valid ScoreRecord objects with constrained fields.
 */
const scoreRecordArb: fc.Arbitrary<ScoreRecord> = fc.record({
  id: fc.uuid(),
  semester: fc.constantFrom('sem1' as const, 'sem2' as const),
  difficulty: fc.constantFrom('easy' as const, 'medium' as const, 'hard' as const, 'challenge' as const),
  totalQuestions: fc.integer({ min: 1, max: 30 }),
  date: fc.integer({ min: new Date('2020-01-01').getTime(), max: new Date('2030-12-31').getTime() }).map(ts => new Date(ts).toISOString()),
  isExamPrep: fc.boolean(),
}).chain(({ id, semester, difficulty, totalQuestions, date, isExamPrep }) => {
  const scoreArb = fc.integer({ min: 0, max: totalQuestions });
  const topicIdArb = isExamPrep
    ? fc.constant(null as string | null)
    : fc.constantFrom(...ALL_TOPIC_IDS).map(t => t as string | null);
  const breakdownArb = isExamPrep
    ? fc.array(topicBreakdownArb, { minLength: 1, maxLength: 6 }).map(arr => arr as TopicScoreBreakdown[] | undefined)
    : fc.constant(undefined as TopicScoreBreakdown[] | undefined);

  return fc.tuple(scoreArb, topicIdArb, breakdownArb).map(
    ([score, topicId, topicBreakdown]): ScoreRecord => ({
      id,
      topicId,
      semester,
      difficulty,
      score,
      totalQuestions,
      date,
      isExamPrep,
      topicBreakdown,
    })
  );
});

describe('Property 7: Score record localStorage round trip', () => {
  let mockStorage: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    mockStorage = createLocalStorageMock();
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    });
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // **Validates: Requirements 4.4**
  it('saving a ScoreRecord and loading all records should return a list containing the original record', async () => {
    await fc.assert(
      fc.asyncProperty(scoreRecordArb, async (record) => {
        // Reset storage and module cache for each iteration
        mockStorage.clear();
        vi.resetModules();

        const { saveScoreRecord, loadScoreRecords } = await import('../../services/storage');

        saveScoreRecord(record);
        const loaded = loadScoreRecords();

        expect(loaded).toHaveLength(1);
        expect(loaded).toContainEqual(record);
      }),
      { numRuns: 100 },
    );
  });
});
