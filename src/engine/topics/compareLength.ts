import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

interface ComparisonItem {
  name: string;
  emoji: string;
}

const LENGTH_ITEMS: ComparisonItem[] = [
  { name: '鉛筆', emoji: '✏️' },
  { name: '尺子', emoji: '📏' },
  { name: '繩子', emoji: '🧵' },
  { name: '棍子', emoji: '🥢' },
  { name: '蛇', emoji: '🐍' },
];

const HEIGHT_ITEMS: ComparisonItem[] = [
  { name: '樹', emoji: '🌳' },
  { name: '房子', emoji: '🏠' },
  { name: '長頸鹿', emoji: '🦒' },
  { name: '小貓', emoji: '🐱' },
  { name: '小朋友', emoji: '🧒' },
];

/**
 * 比較長短和高矮 (Comparing Length and Height)
 * Easy: compare 2 items, simple "which is longer/taller"
 * Medium: word problems, "how many cm longer", ordering 3 items
 * Hard: multi-step comparison, ordering 4 items, inference problems
 */
export function generateCompareLengthQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push([generateSimpleCompare, generateWordProblemEasy][randomInt(0, 1)]());
        break;
      case 'medium':
        questions.push([generateOrderThree, generateWordProblemMedium, generateHowMuchMore][randomInt(0, 2)]());
        break;
      case 'hard':
        questions.push([generateOrderFour, generateInferenceProblem, generateMultiStepCompare][randomInt(0, 2)]());
        break;
    }
  }
  return questions;
}

function pickItems(isHeight: boolean, n: number) {
  const pool = isHeight ? HEIGHT_ITEMS : LENGTH_ITEMS;
  const selected = shuffleArray(pool).slice(0, n);
  return selected.map((item, idx) => ({ ...item, size: (idx + 1) * randomInt(2, 5) }));
}

function makeCompareQuestion(difficulty: DifficultyLevel, prompt: string, correct: string, pool: string[], explanation: string): Question {
  const distractors = new Set<string>();
  distractors.add(correct);
  for (const d of pool) { if (distractors.size < 4) distractors.add(d); }
  const fillers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  for (const f of fillers) { if (distractors.size >= 4) break; distractors.add(f); }
  const options = shuffleArray(Array.from(distractors).slice(0, 4));
  return {
    id: generateId(), topicId: 'compare-length-height', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct), explanation, graphicType: 'comparison',
  };
}

// --- Easy ---

function generateSimpleCompare(): Question {
  const isHeight = randomInt(0, 1) === 1;
  const items = pickItems(isHeight, 2);
  const sorted = [...items].sort((a, b) => a.size - b.size);
  const askBigger = randomInt(0, 1) === 0;
  const label = isHeight ? (askBigger ? '高' : '矮') : (askBigger ? '長' : '短');
  const correct = askBigger ? sorted[sorted.length - 1] : sorted[0];
  const prompt = `${items.map(s => `${s.emoji} ${s.name}`).join(' 和 ')}，哪一個比較${label}？`;
  return makeCompareQuestion('easy', prompt, correct.name,
    items.map(s => s.name),
    `${correct.emoji} ${correct.name}比較${label}。`);
}

function generateWordProblemEasy(): Question {
  const isHeight = randomInt(0, 1) === 1;
  const items = pickItems(isHeight, 2);
  const sorted = [...items].sort((a, b) => a.size - b.size);
  const label = isHeight ? '高' : '長';
  const prompt = isHeight
    ? `${items[0].emoji} ${items[0].name}和 ${items[1].emoji} ${items[1].name}站在一起，哪一個比較${label}？`
    : `${items[0].emoji} ${items[0].name}和 ${items[1].emoji} ${items[1].name}放在一起比較，哪一個比較${label}？`;
  const correct = sorted[sorted.length - 1];
  return makeCompareQuestion('easy', prompt, correct.name,
    items.map(s => s.name),
    `${correct.emoji} ${correct.name}比較${label}。`);
}

// --- Medium ---

function generateOrderThree(): Question {
  const isHeight = randomInt(0, 1) === 1;
  const items = pickItems(isHeight, 3);
  const isAscending = randomInt(0, 1) === 1;
  const label = isHeight ? '高' : '長';
  const direction = isAscending
    ? `最${isHeight ? '矮' : '短'}到最${label}`
    : `最${label}到最${isHeight ? '矮' : '短'}`;
  const sorted = [...items].sort((a, b) => isAscending ? a.size - b.size : b.size - a.size);
  const correctOrder = sorted.map(s => s.name).join(' → ');
  const prompt = `把 ${items.map(s => `${s.emoji} ${s.name}`).join('、')} 從${direction}排列。`;
  const distractors = new Set<string>();
  distractors.add(correctOrder);
  while (distractors.size < 4) distractors.add(shuffleArray(items).map(s => s.name).join(' → '));
  const options = shuffleArray(Array.from(distractors));
  return {
    id: generateId(), topicId: 'compare-length-height', difficulty: 'medium', prompt, options,
    correctAnswerIndex: options.indexOf(correctOrder),
    explanation: `正確的排列順序是：${correctOrder}。`, graphicType: 'comparison',
  };
}

function generateWordProblemMedium(): Question {
  const names = ['小明', '小華', '小美'];
  const heights = [randomInt(100, 110), randomInt(111, 120), randomInt(121, 130)];
  const shuffledIdx = shuffleArray([0, 1, 2]);
  const pairs = shuffledIdx.map((idx, i) => ({ name: names[i], height: heights[idx] }));
  const tallest = [...pairs].sort((a, b) => b.height - a.height)[0];
  const prompt = `${pairs.map(p => `${p.name}高 ${p.height} 厘米`).join('，')}。誰最高？`;
  return makeCompareQuestion('medium', prompt, tallest.name,
    pairs.map(p => p.name),
    `${tallest.name}高 ${tallest.height} 厘米，是最高的。`);
}

function generateHowMuchMore(): Question {
  const isHeight = randomInt(0, 1) === 1;
  const label = isHeight ? '高' : '長';
  const unit = '厘米';
  const a = randomInt(10, 20);
  const b = randomInt(1, 9);
  const total = a + b;
  const itemA = isHeight ? HEIGHT_ITEMS[randomInt(0, 2)] : LENGTH_ITEMS[randomInt(0, 2)];
  const itemB = isHeight ? HEIGHT_ITEMS[randomInt(3, 4)] : LENGTH_ITEMS[randomInt(3, 4)];
  const prompt = `${itemA.emoji} ${itemA.name}${label} ${total} ${unit}，${itemB.emoji} ${itemB.name}${label} ${a} ${unit}。${itemA.name}比${itemB.name}${label}多少${unit}？`;
  const correct = `${b}`;
  return makeCompareQuestion('medium', prompt, correct,
    [`${b}`, `${b + 1}`, `${b - 1}`, `${total}`],
    `${total} - ${a} = ${b}，${itemA.name}比${itemB.name}${label} ${b} ${unit}。`);
}

// --- Hard ---

function generateOrderFour(): Question {
  const isHeight = randomInt(0, 1) === 1;
  const items = pickItems(isHeight, 4);
  const isAscending = randomInt(0, 1) === 1;
  const label = isHeight ? '高' : '長';
  const direction = isAscending
    ? `最${isHeight ? '矮' : '短'}到最${label}`
    : `最${label}到最${isHeight ? '矮' : '短'}`;
  const sorted = [...items].sort((a, b) => isAscending ? a.size - b.size : b.size - a.size);
  const correctOrder = sorted.map(s => s.name).join(' → ');
  const prompt = `把 ${items.map(s => `${s.emoji} ${s.name}`).join('、')} 從${direction}排列。`;
  const distractors = new Set<string>();
  distractors.add(correctOrder);
  while (distractors.size < 4) distractors.add(shuffleArray(items).map(s => s.name).join(' → '));
  const options = shuffleArray(Array.from(distractors));
  return {
    id: generateId(), topicId: 'compare-length-height', difficulty: 'hard', prompt, options,
    correctAnswerIndex: options.indexOf(correctOrder),
    explanation: `正確的排列順序是：${correctOrder}。`, graphicType: 'comparison',
  };
}

function generateInferenceProblem(): Question {
  const names = ['小明', '小華', '小美'];
  const shuffled = shuffleArray(names);
  const tallest = shuffled[0];
  const middle = shuffled[1];
  const shortest = shuffled[2];
  const prompt = `${tallest}比${middle}高，${middle}比${shortest}高。誰最矮？`;
  return makeCompareQuestion('hard', prompt, shortest,
    names,
    `${tallest}最高，${middle}第二，${shortest}最矮。`);
}

function generateMultiStepCompare(): Question {
  const a = randomInt(10, 15);
  const diff1 = randomInt(2, 5);
  const diff2 = randomInt(2, 5);
  const b = a + diff1;
  const c = b + diff2;
  const totalDiff = c - a;
  const prompt = `繩子甲長 ${a} 厘米，繩子乙比繩子甲長 ${diff1} 厘米，繩子丙比繩子乙長 ${diff2} 厘米。繩子丙比繩子甲長多少厘米？`;
  const correct = `${totalDiff}`;
  return makeCompareQuestion('hard', prompt, correct,
    [`${totalDiff}`, `${diff1}`, `${diff2}`, `${totalDiff + 1}`],
    `繩子乙 = ${a} + ${diff1} = ${b} 厘米，繩子丙 = ${b} + ${diff2} = ${c} 厘米。${c} - ${a} = ${totalDiff} 厘米。`);
}
