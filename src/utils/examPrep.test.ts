import { describe, it, expect } from 'vitest';
import { generateExamQuestions, computeTopicBreakdown } from './examPrep';
import type { Question } from '../types';

describe('generateExamQuestions', () => {
  it('returns between 15 and 30 questions when no totalCount specified', () => {
    const questions = generateExamQuestions('sem1', 'easy');
    expect(questions.length).toBeGreaterThanOrEqual(15);
    expect(questions.length).toBeLessThanOrEqual(30);
  });

  it('returns exactly totalCount questions when specified within bounds', () => {
    const questions = generateExamQuestions('sem1', 'medium', 28);
    expect(questions.length).toBe(28);
  });

  it('clamps totalCount to minimum (at least 2 per topic)', () => {
    const questions = generateExamQuestions('sem1', 'easy', 5);
    // With 12 topics × 2 minimum each = 24 minimum
    expect(questions.length).toBe(24);
  });

  it('clamps totalCount to 30 maximum', () => {
    const questions = generateExamQuestions('sem1', 'hard', 50);
    expect(questions.length).toBe(30);
  });

  it('includes questions from multiple topics in the semester', () => {
    const questions = generateExamQuestions('sem1', 'easy', 18);
    const topicIds = new Set(questions.map((q) => q.topicId));
    expect(topicIds.size).toBeGreaterThanOrEqual(2);
  });

  it('assigns at least 2 questions per topic', () => {
    const questions = generateExamQuestions('sem1', 'medium', 18);
    const counts = new Map<string, number>();
    for (const q of questions) {
      counts.set(q.topicId, (counts.get(q.topicId) ?? 0) + 1);
    }
    for (const count of counts.values()) {
      expect(count).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('computeTopicBreakdown', () => {
  const makeQuestion = (topicId: string, correctIndex: number): Question => ({
    id: '1',
    topicId,
    difficulty: 'easy',
    prompt: 'test',
    options: ['A', 'B', 'C'],
    correctAnswerIndex: correctIndex,
    explanation: 'test',
  });

  it('groups answers by topicId and counts correct/total', () => {
    const answers = [
      { question: makeQuestion('counting', 0), submittedIndex: 0 },
      { question: makeQuestion('counting', 1), submittedIndex: 2 },
      { question: makeQuestion('shapes', 2), submittedIndex: 2 },
    ];

    const breakdown = computeTopicBreakdown(answers);
    expect(breakdown).toHaveLength(2);

    const counting = breakdown.find((b) => b.topicId === 'counting');
    expect(counting).toEqual({ topicId: 'counting', correct: 1, total: 2 });

    const shapes = breakdown.find((b) => b.topicId === 'shapes');
    expect(shapes).toEqual({ topicId: 'shapes', correct: 1, total: 1 });
  });

  it('returns empty array for empty answers', () => {
    expect(computeTopicBreakdown([])).toEqual([]);
  });
});
