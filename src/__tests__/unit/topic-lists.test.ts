import { describe, it, expect } from 'vitest';
import { TOPIC_REGISTRY } from '../../data/topicRegistry';
import { SEMESTERS } from '../../constants';

const EXPECTED_SEM1_TOPICS = [
  'counting',
  'addition-10',
  'subtraction-10',
  'shapes',
  'compare-length-height',
  'ordering-sequences',
];

const EXPECTED_SEM2_TOPICS = [
  'addition-20',
  'subtraction-20',
  'telling-time',
  'coins-notes',
  'composing-shapes',
  'data-handling',
];

describe('Verify exact topic lists for 上學期 and 下學期', () => {
  it('TOPIC_REGISTRY sem1 topics match expected list', () => {
    const sem1Topics = Object.values(TOPIC_REGISTRY)
      .filter((t) => t.semester === 'sem1')
      .map((t) => t.id);

    expect(sem1Topics).toEqual(EXPECTED_SEM1_TOPICS);
  });

  it('TOPIC_REGISTRY sem2 topics match expected list', () => {
    const sem2Topics = Object.values(TOPIC_REGISTRY)
      .filter((t) => t.semester === 'sem2')
      .map((t) => t.id);

    expect(sem2Topics).toEqual(EXPECTED_SEM2_TOPICS);
  });

  it('SEMESTERS constant sem1 topics match expected list', () => {
    const sem1 = SEMESTERS.find((s) => s.id === 'sem1');
    expect(sem1).toBeDefined();
    expect(sem1!.topics).toEqual(EXPECTED_SEM1_TOPICS);
  });

  it('SEMESTERS constant sem2 topics match expected list', () => {
    const sem2 = SEMESTERS.find((s) => s.id === 'sem2');
    expect(sem2).toBeDefined();
    expect(sem2!.topics).toEqual(EXPECTED_SEM2_TOPICS);
  });

  it('TOPIC_REGISTRY and SEMESTERS are consistent', () => {
    for (const semester of SEMESTERS) {
      const registryTopics = Object.values(TOPIC_REGISTRY)
        .filter((t) => t.semester === semester.id)
        .map((t) => t.id);

      expect(registryTopics).toEqual(semester.topics);
    }
  });

  it('TOPIC_REGISTRY has exactly 12 topics', () => {
    expect(Object.keys(TOPIC_REGISTRY)).toHaveLength(12);
  });
});
