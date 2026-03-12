import { describe, it, expect } from 'vitest';
import { TOPIC_REGISTRY } from '../../data/topicRegistry';
import { SEMESTERS } from '../../constants';

const SEM1_TOPICS = [
  'counting',
  'addition-10',
  'subtraction-10',
  'addition-20',
  'subtraction-20',
  'ordering-sequences',
];

const SEM2_TOPICS = [
  'shapes',
  'composing-shapes',
  'compare-length-height',
  'telling-time',
  'coins-notes',
  'data-handling',
];

const ALL_TOPICS = [...SEM1_TOPICS, ...SEM2_TOPICS];

describe('Verify topic lists for 聖公會青衣主恩小學 P1 curriculum', () => {
  it('TOPIC_REGISTRY has correct semester assignments', () => {
    const allTopics = Object.values(TOPIC_REGISTRY).map((t) => t.id);
    expect(allTopics.sort()).toEqual([...ALL_TOPICS].sort());
    for (const t of Object.values(TOPIC_REGISTRY)) {
      if (SEM1_TOPICS.includes(t.id)) {
        expect(t.semester).toBe('sem1');
      } else {
        expect(t.semester).toBe('sem2');
      }
    }
  });

  it('SEMESTERS constant has sem1 and sem2 with correct topics', () => {
    expect(SEMESTERS).toHaveLength(2);
    expect(SEMESTERS[0].id).toBe('sem1');
    expect(SEMESTERS[0].topics).toEqual(SEM1_TOPICS);
    expect(SEMESTERS[1].id).toBe('sem2');
    expect(SEMESTERS[1].topics).toEqual(SEM2_TOPICS);
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
