import { describe, it, expect } from 'vitest';
import { TOPIC_REGISTRY } from '../../data/topicRegistry';
import { SEMESTERS } from '../../constants';

const EXPECTED_ALL_TOPICS = [
  'counting',
  'addition-10',
  'subtraction-10',
  'addition-20',
  'subtraction-20',
  'ordering-sequences',
  'shapes',
  'composing-shapes',
  'compare-length-height',
  'telling-time',
  'coins-notes',
  'data-handling',
];

describe('Verify topic lists for 聖公會青衣主恩小學 P1 curriculum', () => {
  it('TOPIC_REGISTRY all topics are sem1', () => {
    const allTopics = Object.values(TOPIC_REGISTRY).map((t) => t.id);
    expect(allTopics.sort()).toEqual([...EXPECTED_ALL_TOPICS].sort());
    for (const t of Object.values(TOPIC_REGISTRY)) {
      expect(t.semester).toBe('sem1');
    }
  });

  it('SEMESTERS constant has only sem1 with all topics', () => {
    expect(SEMESTERS).toHaveLength(1);
    expect(SEMESTERS[0].id).toBe('sem1');
    expect(SEMESTERS[0].topics).toEqual(EXPECTED_ALL_TOPICS);
  });

  it('TOPIC_REGISTRY and SEMESTERS are consistent', () => {
    for (const semester of SEMESTERS) {
      const registryTopics = Object.values(TOPIC_REGISTRY)
        .filter((t) => t.semester === semester.id)
        .map((t) => t.id);
      expect(registryTopics.sort()).toEqual([...semester.topics].sort());
    }
  });

  it('TOPIC_REGISTRY has exactly 12 topics', () => {
    expect(Object.keys(TOPIC_REGISTRY)).toHaveLength(12);
  });
});
