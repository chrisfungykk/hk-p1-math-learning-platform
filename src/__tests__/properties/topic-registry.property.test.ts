// Feature: hk-p1-math-learning-platform, Property 12: Topic registry completeness
// Feature: hk-p1-math-learning-platform, Property 13: Curriculum labels are in Traditional Chinese
// Feature: curriculum-syllabus-alignment, Property 2: Registry-semester consistency
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { TOPIC_REGISTRY } from '../../data/topicRegistry';
import { SEMESTERS } from '../../constants';

const ALL_TOPIC_IDS = Object.keys(TOPIC_REGISTRY);

describe('Property 12: Topic registry completeness', () => {
  // **Validates: Requirements 2.2, 8.4**
  it('every topic must have a non-null animationComposition and a non-empty fallbackImage', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_TOPIC_IDS),
        (topicId) => {
          const topic = TOPIC_REGISTRY[topicId];

          expect(topic).toBeDefined();
          expect(topic.animationComposition).not.toBeNull();
          expect(topic.animationComposition).toBeDefined();
          expect(typeof topic.animationComposition).toBe('function');
          expect(typeof topic.fallbackImage).toBe('string');
          expect(topic.fallbackImage.length).toBeGreaterThan(0);
        },
      ),
      { numRuns: 100 },
    );
  });
});

describe('Property 13: Curriculum labels are in Traditional Chinese', () => {
  // **Validates: Requirements 7.4**
  it('every topic name must contain at least one CJK Unified Ideograph character (U+4E00–U+9FFF)', () => {
    const CJK_REGEX = /[\u4E00-\u9FFF]/;

    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_TOPIC_IDS),
        (topicId) => {
          const topic = TOPIC_REGISTRY[topicId];

          expect(topic).toBeDefined();
          expect(typeof topic.name).toBe('string');
          expect(topic.name.length).toBeGreaterThan(0);
          expect(CJK_REGEX.test(topic.name)).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });
});


/**
 * Property 2: Registry-semester consistency
 *
 * Every topic ID in SEMESTERS exists in TOPIC_REGISTRY with matching semester.
 * Total: 24 topics (10 sem1 + 14 sem2).
 *
 * **Validates: Requirements 14.1, 14.2, 14.3**
 */
describe('Property 2: Registry-semester consistency', () => {
  it('should have exactly 24 topics total (10 sem1 + 14 sem2)', () => {
    const sem1 = SEMESTERS.find((s) => s.id === 'sem1')!;
    const sem2 = SEMESTERS.find((s) => s.id === 'sem2')!;
    expect(sem1.topics).toHaveLength(10);
    expect(sem2.topics).toHaveLength(14);
    expect(Object.keys(TOPIC_REGISTRY)).toHaveLength(24);
  });

  it('every topic in SEMESTERS exists in TOPIC_REGISTRY with matching semester', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...SEMESTERS),
        (semester) => {
          for (const topicId of semester.topics) {
            const entry = TOPIC_REGISTRY[topicId];
            expect(entry).toBeDefined();
            expect(entry.semester).toBe(semester.id);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
