import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

/**
 * 基本加法 (Addition within 10)
 * Easy: a+b where a,b in 1-3 (sum ≤ 6)
 * Medium: a,b in 1-5 (sum ≤ 10)
 * Hard: a,b in 1-9 (sum ≤ 10)
 */
export function generateAddition10Questions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const { a, b } = generateOperands(difficulty);
    const correctAnswer = a + b;
    const prompt = `${a} + ${b} = ?`;

    const options = generateDistractors(correctAnswer, 0, 10);
    const shuffled = shuffleArray(options);
    const correctAnswerIndex = shuffled.indexOf(correctAnswer.toString());

    questions.push({
      id: generateId(),
      topicId: 'addition-10',
      difficulty,
      prompt,
      options: shuffled,
      correctAnswerIndex,
      explanation: `${a} + ${b} = ${correctAnswer}。將 ${a} 和 ${b} 加在一起，答案是 ${correctAnswer}。`,
      graphicType: 'counting-objects',
    });
  }

  return questions;
}

function generateOperands(difficulty: DifficultyLevel): { a: number; b: number } {
  let a: number, b: number;

  switch (difficulty) {
    case 'easy':
      a = randomInt(1, 3);
      b = randomInt(1, 3);
      break;
    case 'medium':
      a = randomInt(1, 5);
      b = randomInt(1, Math.min(5, 10 - a));
      break;
    case 'hard':
      a = randomInt(1, 9);
      b = randomInt(1, Math.min(9, 10 - a));
      break;
  }

  return { a, b };
}

function generateDistractors(correct: number, min: number, max: number): string[] {
  const distractors = new Set<number>();
  distractors.add(correct);

  while (distractors.size < 4) {
    let d = correct + randomInt(-3, 3);
    if (d < min) d = min;
    if (d > max) d = max;
    distractors.add(d);
    if (distractors.size < 4) {
      distractors.add(randomInt(min, max));
    }
  }

  return Array.from(distractors).map(String);
}
