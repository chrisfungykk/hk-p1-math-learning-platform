import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

const OBJECTS = ['🍎 蘋果', '🍌 香蕉', '⭐ 星星', '🌸 花', '🐟 魚', '🦋 蝴蝶', '🐤 小雞', '✏️ 鉛筆'];

/**
 * 數數 (Counting 1-20)
 * Easy: count objects 1-10, "how many"
 * Medium: count 1-15, ordinal numbers, "which is more/less"
 * Hard: count 1-20, skip counting, number before/after
 */
export function generateCountingQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push(randomInt(0, 1) === 0 ? generateCountObjects('easy') : generateWhichNumber('easy'));
        break;
      case 'medium':
        questions.push([() => generateCountObjects('medium'), generateOrdinal, generateCompareCount][randomInt(0, 2)]());
        break;
      case 'hard':
        questions.push([() => generateCountObjects('hard'), generateBeforeAfter, generateSkipCount][randomInt(0, 2)]());
        break;
    }
  }
  return questions;
}

function generateCountObjects(difficulty: DifficultyLevel): Question {
  const maxNum = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
  const correctAnswer = randomInt(1, maxNum);
  const obj = OBJECTS[randomInt(0, OBJECTS.length - 1)];
  const emoji = obj.split(' ')[0];
  const name = obj.split(' ')[1];
  const prompt = `數一數，這裡有幾個${name}？\n${emoji.repeat(correctAnswer)}`;
  return makeQ(difficulty, 'counting', prompt, correctAnswer, 1, maxNum,
    `正確答案是 ${correctAnswer}。數一數：一共有 ${correctAnswer} 個${name}。`);
}

function generateWhichNumber(difficulty: DifficultyLevel): Question {
  const n = randomInt(2, difficulty === 'easy' ? 9 : 14);
  const prompt = `${n} 和 ${n + 1} 之間沒有其他整數。${n} 的下一個數是什麼？`;
  return makeQ(difficulty, 'counting', prompt, n + 1, 1, 20,
    `${n} 的下一個數是 ${n + 1}。`);
}

function generateOrdinal(): Question {
  const animals = ['🐶', '🐱', '🐰', '🐸', '🐻', '🐼', '🐵'];
  const count = randomInt(4, 6);
  const selected = shuffleArray(animals).slice(0, count);
  const pos = randomInt(1, count);
  const ordinals = ['', '第一', '第二', '第三', '第四', '第五', '第六'];
  const prompt = `排隊：${selected.join(' ')}。從左邊數起，${ordinals[pos]}個是什麼？`;
  const correct = selected[pos - 1];
  const options = shuffleArray(selected.slice(0, 4));
  if (!options.includes(correct)) options[0] = correct;
  const shuffled = shuffleArray(options);
  return {
    id: generateId(), topicId: 'counting', difficulty: 'medium', prompt,
    options: shuffled, correctAnswerIndex: shuffled.indexOf(correct),
    explanation: `從左邊數起，${ordinals[pos]}個是 ${correct}。`,
    graphicType: 'counting-objects',
  };
}

function generateCompareCount(): Question {
  const a = randomInt(5, 12);
  const b = randomInt(5, 12);
  const objA = OBJECTS[randomInt(0, 3)];
  const objB = OBJECTS[randomInt(4, OBJECTS.length - 1)];
  const emojiA = objA.split(' ')[0];
  const emojiB = objB.split(' ')[0];
  const nameA = objA.split(' ')[1];
  const nameB = objB.split(' ')[1];
  const prompt = `${emojiA.repeat(a)} (${nameA})\n${emojiB.repeat(b)} (${nameB})\n哪一種比較多？`;
  const correct = a >= b ? nameA : nameB;
  const options = shuffleArray([nameA, nameB, '一樣多', '不能比較']);
  return {
    id: generateId(), topicId: 'counting', difficulty: 'medium', prompt,
    options, correctAnswerIndex: options.indexOf(a === b ? '一樣多' : correct),
    explanation: `${nameA}有 ${a} 個，${nameB}有 ${b} 個。${a === b ? '一樣多' : (a > b ? nameA : nameB) + '比較多'}。`,
    graphicType: 'counting-objects',
  };
}

function generateBeforeAfter(): Question {
  const n = randomInt(2, 19);
  const isBefore = randomInt(0, 1) === 0;
  const ans = isBefore ? n - 1 : n + 1;
  const label = isBefore ? '前面' : '後面';
  const prompt = `${n} 的${label}一個數是什麼？`;
  return makeQ('hard', 'counting', prompt, ans, 1, 20,
    `${n} 的${label}一個數是 ${ans}。`);
}

function generateSkipCount(): Question {
  const step = randomInt(0, 1) === 0 ? 2 : 5;
  const start = step === 2 ? randomInt(0, 2) * 2 : 0;
  const seq = Array.from({ length: 4 }, (_, i) => start + i * step);
  const ans = start + 4 * step;
  const prompt = `按規律數數：${seq.join(', ')}, ?。下一個數是什麼？`;
  return makeQ('hard', 'counting', prompt, ans, 0, 30,
    `這是每次加 ${step} 的數列，下一個數是 ${ans}。`);
}

function makeQ(difficulty: DifficultyLevel, topicId: string, prompt: string, correct: number, min: number, max: number, explanation: string): Question {
  const distractors = new Set<number>();
  distractors.add(correct);
  if (correct + 1 <= max) distractors.add(correct + 1);
  if (correct - 1 >= min) distractors.add(correct - 1);
  if (correct + 2 <= max) distractors.add(correct + 2);
  while (distractors.size < 4) distractors.add(randomInt(min, max));
  const options = shuffleArray(Array.from(distractors).slice(0, 4).map(String));
  return {
    id: generateId(), topicId, difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct.toString()), explanation, graphicType: 'counting-objects',
  };
}
