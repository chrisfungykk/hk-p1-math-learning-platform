import type { Question, DifficultyLevel, ScoreRecord, TopicScoreBreakdown } from '../types';
import { generateId } from '../engine/questionGenerator';

/**
 * Evaluates whether a submitted answer is correct.
 * Returns true if submittedIndex matches the question's correctAnswerIndex.
 */
export function evaluateAnswer(question: Question, submittedIndex: number): boolean {
  return submittedIndex === question.correctAnswerIndex;
}

/**
 * Computes a score summary from a list of question-answer pairs.
 * Returns correct count, incorrect count, and total.
 */
export function computeScoreSummary(
  answers: { question: Question; submittedIndex: number }[]
): { correct: number; incorrect: number; total: number } {
  const total = answers.length;
  const correct = answers.filter(
    (a) => a.submittedIndex === a.question.correctAnswerIndex
  ).length;
  const incorrect = total - correct;
  return { correct, incorrect, total };
}

/**
 * Creates a complete ScoreRecord from attempt data.
 * Generates a UUID for id and sets date to the current ISO string.
 */
export function createScoreRecord(params: {
  topicId: string | null;
  semester: 'sem1' | 'sem2';
  difficulty: DifficultyLevel;
  score: number;
  totalQuestions: number;
  isExamPrep: boolean;
  topicBreakdown?: TopicScoreBreakdown[];
}): ScoreRecord {
  return {
    id: generateId(),
    topicId: params.topicId,
    semester: params.semester,
    difficulty: params.difficulty,
    score: params.score,
    totalQuestions: params.totalQuestions,
    date: new Date().toISOString(),
    isExamPrep: params.isExamPrep,
    topicBreakdown: params.topicBreakdown,
  };
}
