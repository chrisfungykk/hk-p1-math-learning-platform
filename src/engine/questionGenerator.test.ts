import { describe, it, expect } from 'vitest';
import { generateQuestions, generateId, randomInt, shuffleArray } from './questionGenerator';

describe('generateQuestions', () => {
  it('throws an error for an invalid topicId', () => {
    expect(() =>
      generateQuestions({ topicId: 'nonexistent', difficulty: 'easy', count: 5 })
    ).toThrow('Invalid topicId: "nonexistent" is not found in the topic registry.');
  });

  it('returns an empty array when count is 0', () => {
    const result = generateQuestions({ topicId: 'counting', difficulty: 'easy', count: 0 });
    expect(result).toEqual([]);
  });

  it('returns an empty array when count is negative', () => {
    const result = generateQuestions({ topicId: 'counting', difficulty: 'easy', count: -3 });
    expect(result).toEqual([]);
  });

  it('delegates to the topic generator for a valid topicId', () => {
    // The placeholder generators return [], so we just verify no error is thrown
    const result = generateQuestions({ topicId: 'addition-10', difficulty: 'medium', count: 5 });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('generateId', () => {
  it('returns a string in UUID v4 format', () => {
    const id = generateId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('returns unique values on successive calls', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateId()));
    expect(ids.size).toBe(50);
  });
});

describe('randomInt', () => {
  it('returns a value within [min, max] inclusive', () => {
    for (let i = 0; i < 100; i++) {
      const val = randomInt(3, 7);
      expect(val).toBeGreaterThanOrEqual(3);
      expect(val).toBeLessThanOrEqual(7);
    }
  });

  it('returns min when min equals max', () => {
    expect(randomInt(5, 5)).toBe(5);
  });

  it('returns an integer', () => {
    for (let i = 0; i < 50; i++) {
      const val = randomInt(0, 100);
      expect(Number.isInteger(val)).toBe(true);
    }
  });
});

describe('shuffleArray', () => {
  it('returns an array with the same elements', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    expect(shuffled).toHaveLength(original.length);
    expect(shuffled.sort()).toEqual(original.sort());
  });

  it('does not mutate the original array', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = [...original];
    shuffleArray(original);
    expect(original).toEqual(copy);
  });

  it('returns an empty array for empty input', () => {
    expect(shuffleArray([])).toEqual([]);
  });

  it('returns a single-element array unchanged', () => {
    expect(shuffleArray([42])).toEqual([42]);
  });
});
