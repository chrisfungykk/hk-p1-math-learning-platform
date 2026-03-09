import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

const OBJECTS = ['🍎 蘋果', '🍌 香蕉', '⭐ 星星', '🌸 花', '🐟 魚', '🦋 蝴蝶', '🐤 小雞', '✏️ 鉛筆'];

/**
 * 數數 (Counting 1-20)
 * Easy: count objects 1-10
 * Medium: count objects 1-15
 * Hard: count objects 1-20
 */
export function generateCountingQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const maxNum = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;

  for (let i = 0; i < count; i++) {
    const correctAnswer = randomInt(1, maxNum);
    const objectName = OBJECTS[randomInt(0, OBJECTS.length - 1)];
    const objectEmoji = objectName.split(' ')[0];

    const prompt = `數一數，這裡有幾個${objectName.split(' ')[1]}？\n${objectEmoji.repeat(correctAnswer)}`;

    const options = generateDistractors(correctAnswer, 1, maxNum);
    const shuffled = shuffleArray(options);
    const correctAnswerIndex = shuffled.indexOf(correctAnswer.toString());

    questions.push({
      id: generateId(),
      topicId: 'counting',
      difficulty,
      prompt,
      options: shuffled,
      correctAnswerIndex,
      explanation: `正確答案是 ${correctAnswer}。數一數：${objectEmoji.repeat(correctAnswer)}，一共有 ${correctAnswer} 個。`,
      graphicType: 'counting-objects',
    });
  }

  return questions;
}

function generateDistractors(correct: number, min: number, max: number): string[] {
  const distractors = new Set<number>();
  distractors.add(correct);

  while (distractors.size < 4) {
    let d = correct + randomInt(-3, 3);
    if (d < min) d = min;
    if (d > max) d = max;
    if (d !== correct || distractors.size < 2) {
      distractors.add(d);
    }
    // Fallback: add a random number in range if we're stuck
    if (distractors.size < 4) {
      distractors.add(randomInt(min, max));
    }
  }

  return Array.from(distractors).map(String);
}
