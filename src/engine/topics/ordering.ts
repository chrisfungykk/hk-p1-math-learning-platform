import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

/**
 * 排列和序列 (Ordering and Sequences)
 * Easy: sequences with step 1 (1,2,3,?)
 * Medium: step 2
 * Hard: step 3 or decreasing sequences
 */
export function generateOrderingQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const questionType = randomInt(0, 1);
    if (questionType === 0) {
      questions.push(generateNextNumberQuestion(difficulty));
    } else {
      questions.push(generateMissingNumberQuestion(difficulty));
    }
  }

  return questions;
}

function getStepAndStart(difficulty: DifficultyLevel): { step: number; start: number; isDecreasing: boolean } {
  switch (difficulty) {
    case 'easy':
      return { step: 1, start: randomInt(1, 10), isDecreasing: false };
    case 'medium':
      return { step: 2, start: randomInt(1, 10), isDecreasing: false };
    case 'hard': {
      const isDecreasing = randomInt(0, 1) === 1;
      const step = randomInt(2, 3);
      const start = isDecreasing ? randomInt(15, 20) : randomInt(1, 5);
      return { step, start, isDecreasing };
    }
  }
}

function generateNextNumberQuestion(difficulty: DifficultyLevel): Question {
  const { step, start, isDecreasing } = getStepAndStart(difficulty);
  const seqLength = randomInt(3, 4);

  const sequence: number[] = [];
  for (let i = 0; i < seqLength; i++) {
    sequence.push(isDecreasing ? start - i * step : start + i * step);
  }

  const correctAnswer = isDecreasing ? start - seqLength * step : start + seqLength * step;
  const seqStr = sequence.join(', ');
  const prompt = `下一個數字是什麼？ ${seqStr}, ?`;

  const options = generateDistractors(correctAnswer, step);
  const shuffled = shuffleArray(options);
  const correctAnswerIndex = shuffled.indexOf(correctAnswer.toString());

  const direction = isDecreasing ? '減少' : '增加';

  return {
    id: generateId(),
    topicId: 'ordering-sequences',
    difficulty,
    prompt,
    options: shuffled,
    correctAnswerIndex,
    explanation: `這個數列每次${direction} ${step}，所以下一個數字是 ${correctAnswer}。`,
    graphicType: 'sequence',
  };
}

function generateMissingNumberQuestion(difficulty: DifficultyLevel): Question {
  const { step, start, isDecreasing } = getStepAndStart(difficulty);
  const seqLength = randomInt(4, 5);

  const sequence: number[] = [];
  for (let i = 0; i < seqLength; i++) {
    sequence.push(isDecreasing ? start - i * step : start + i * step);
  }

  // Pick a position to blank out (not first or last)
  const blankPos = randomInt(1, seqLength - 2);
  const correctAnswer = sequence[blankPos];

  const displaySeq = sequence.map((n, idx) => idx === blankPos ? '?' : n.toString());
  const prompt = `找出缺少的數字：${displaySeq.join(', ')}`;

  const options = generateDistractors(correctAnswer, step);
  const shuffled = shuffleArray(options);
  const correctAnswerIndex = shuffled.indexOf(correctAnswer.toString());

  const direction = isDecreasing ? '減少' : '增加';

  return {
    id: generateId(),
    topicId: 'ordering-sequences',
    difficulty,
    prompt,
    options: shuffled,
    correctAnswerIndex,
    explanation: `這個數列每次${direction} ${step}，缺少的數字是 ${correctAnswer}。`,
    graphicType: 'sequence',
  };
}

function generateDistractors(correct: number, step: number): string[] {
  const distractors = new Set<number>();
  distractors.add(correct);

  // Add nearby values that are common mistakes
  distractors.add(correct + step);
  distractors.add(correct - step);
  distractors.add(correct + 1);

  // If we still need more, add random nearby values
  while (distractors.size < 4) {
    distractors.add(correct + randomInt(-5, 5));
  }

  return Array.from(distractors).slice(0, 4).map(String);
}
