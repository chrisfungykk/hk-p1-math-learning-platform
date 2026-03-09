import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

/**
 * 20以內減法 (Subtraction within 20)
 * Easy: a in 5-12, b in 1..a (result ≥ 0)
 * Medium: a in 8-16, b in 1..a
 * Hard: a in 10-20, b in 1..a
 */
export function generateSubtraction20Questions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const { a, b } = generateOperands(difficulty);
    const correctAnswer = a - b;
    const prompt = `${a} - ${b} = ?`;

    const options = generateDistractors(correctAnswer, 0, 20);
    const shuffled = shuffleArray(options);
    const correctAnswerIndex = shuffled.indexOf(correctAnswer.toString());

    questions.push({
      id: generateId(),
      topicId: 'subtraction-20',
      difficulty,
      prompt,
      options: shuffled,
      correctAnswerIndex,
      explanation: `${a} - ${b} = ${correctAnswer}。從 ${a} 減去 ${b}，答案是 ${correctAnswer}。`,
      graphicType: 'counting-objects',
    });
  }

  return questions;
}

function generateOperands(difficulty: DifficultyLevel): { a: number; b: number } {
  let a: number, b: number;

  switch (difficulty) {
    case 'easy':
      a = randomInt(5, 12);
      b = randomInt(1, a);
      break;
    case 'medium':
      a = randomInt(8, 16);
      b = randomInt(1, a);
      break;
    case 'hard':
      a = randomInt(10, 20);
      b = randomInt(1, a);
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
