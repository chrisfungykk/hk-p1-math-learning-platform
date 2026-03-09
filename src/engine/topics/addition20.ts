import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

/**
 * 20以內加法 (Addition within 20)
 * Easy: a+b where sum ≤ 12
 * Medium: a+b where sum ≤ 16
 * Hard: a+b where sum ≤ 20
 */
export function generateAddition20Questions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const { a, b } = generateOperands(difficulty);
    const correctAnswer = a + b;
    const prompt = `${a} + ${b} = ?`;

    const options = generateDistractors(correctAnswer, 0, 20);
    const shuffled = shuffleArray(options);
    const correctAnswerIndex = shuffled.indexOf(correctAnswer.toString());

    questions.push({
      id: generateId(),
      topicId: 'addition-20',
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
      a = randomInt(1, 8);
      b = randomInt(1, Math.min(8, 12 - a));
      break;
    case 'medium':
      a = randomInt(2, 12);
      b = randomInt(1, Math.min(12, 16 - a));
      break;
    case 'hard':
      a = randomInt(2, 15);
      b = randomInt(1, Math.min(15, 20 - a));
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
