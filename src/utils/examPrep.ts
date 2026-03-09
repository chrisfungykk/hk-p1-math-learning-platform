import type { DifficultyLevel, Question, TopicScoreBreakdown } from '../types';
import { SEMESTERS } from '../constants';
import { TOPIC_REGISTRY } from '../data/topicRegistry';
import { shuffleArray, randomInt } from '../engine/questionGenerator';

/**
 * Generates a mixed-topic exam preparation question set for a semester.
 *
 * - totalCount defaults to a random number between 15 and 30
 * - Distributes questions across all topics in the semester (roughly equal, at least 2 per topic)
 * - Shuffles the final question array
 * - Always returns between 15 and 30 questions
 */
export function generateExamQuestions(
  semesterId: 'sem1' | 'sem2',
  difficulty: DifficultyLevel,
  totalCount?: number
): Question[] {
  const count = totalCount ?? randomInt(15, 30);
  // Clamp to [15, 30]
  const clampedCount = Math.max(15, Math.min(30, count));

  const semester = SEMESTERS.find((s) => s.id === semesterId);
  if (!semester) {
    throw new Error(`Invalid semesterId: "${semesterId}"`);
  }

  const topicIds = semester.topics;
  const topicCount = topicIds.length;

  // Distribute questions: at least 2 per topic, then spread remainder
  const basePerTopic = Math.max(2, Math.floor(clampedCount / topicCount));
  let remaining = clampedCount - basePerTopic * topicCount;

  const allQuestions: Question[] = [];

  for (const topicId of topicIds) {
    const topicDef = TOPIC_REGISTRY[topicId];
    if (!topicDef) continue;

    let questionsForTopic = basePerTopic;
    if (remaining > 0) {
      questionsForTopic += 1;
      remaining -= 1;
    }

    const generated = topicDef.generateQuestions(difficulty, questionsForTopic);
    allQuestions.push(...generated);
  }

  return shuffleArray(allQuestions);
}

/**
 * Computes per-topic score breakdown from a list of exam answers.
 *
 * Groups answers by question.topicId, counts correct and total for each topic.
 */
export function computeTopicBreakdown(
  answers: { question: Question; submittedIndex: number }[]
): TopicScoreBreakdown[] {
  const map = new Map<string, { correct: number; total: number }>();

  for (const { question, submittedIndex } of answers) {
    const entry = map.get(question.topicId) ?? { correct: 0, total: 0 };
    entry.total += 1;
    if (submittedIndex === question.correctAnswerIndex) {
      entry.correct += 1;
    }
    map.set(question.topicId, entry);
  }

  const result: TopicScoreBreakdown[] = [];
  for (const [topicId, { correct, total }] of map) {
    result.push({ topicId, correct, total });
  }

  return result;
}
