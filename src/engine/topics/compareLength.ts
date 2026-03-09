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

type ComparisonType = 'longer' | 'shorter' | 'taller' | 'shorter-height';

/**
 * 比較長短和高矮 (Comparing Length and Height)
 * Easy: compare 2 items
 * Medium: compare 3 items
 * Hard: ordering 3-4 items
 */
export function generateCompareLengthQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    if (difficulty === 'hard') {
      questions.push(generateOrderingQuestion());
    } else {
      questions.push(generateComparisonQuestion(difficulty));
    }
  }

  return questions;
}

function generateComparisonQuestion(difficulty: DifficultyLevel): Question {
  const isHeight = randomInt(0, 1) === 1;
  const items = isHeight ? HEIGHT_ITEMS : LENGTH_ITEMS;
  const itemCount = difficulty === 'easy' ? 2 : 3;

  const selected = shuffleArray(items).slice(0, itemCount);
  // Assign random sizes for comparison
  const sizes = selected.map((item, idx) => ({
    ...item,
    size: (idx + 1) * randomInt(2, 5),
  }));

  const compType: ComparisonType = isHeight
    ? (randomInt(0, 1) === 0 ? 'taller' : 'shorter-height')
    : (randomInt(0, 1) === 0 ? 'longer' : 'shorter');

  const sorted = [...sizes].sort((a, b) => a.size - b.size);
  const correctItem = (compType === 'longer' || compType === 'taller')
    ? sorted[sorted.length - 1]
    : sorted[0];

  const label = compType === 'longer' ? '長' : compType === 'shorter' ? '短'
    : compType === 'taller' ? '高' : '矮';

  const itemList = sizes.map(s => `${s.emoji} ${s.name}`).join('、');
  const prompt = `${itemList}，哪一個比較${label}？`;

  const options = shuffleArray(sizes.map(s => s.name));
  const correctAnswerIndex = options.indexOf(correctItem.name);

  return {
    id: generateId(),
    topicId: 'compare-length-height',
    difficulty,
    prompt,
    options,
    correctAnswerIndex,
    explanation: `${correctItem.emoji} ${correctItem.name}比較${label}。`,
    graphicType: 'comparison',
  };
}

function generateOrderingQuestion(): Question {
  const isHeight = randomInt(0, 1) === 1;
  const items = isHeight ? HEIGHT_ITEMS : LENGTH_ITEMS;
  const itemCount = randomInt(3, 4);

  const selected = shuffleArray(items).slice(0, itemCount);
  const sizes = selected.map((item, idx) => ({
    ...item,
    size: (idx + 1) * randomInt(2, 5),
  }));

  const isAscending = randomInt(0, 1) === 1;
  const label = isHeight ? '高' : '長';
  const direction = isAscending ? `最${label === '高' ? '矮' : '短'}到最${label}` : `最${label}到最${label === '高' ? '矮' : '短'}`;

  const sorted = [...sizes].sort((a, b) => isAscending ? a.size - b.size : b.size - a.size);
  const correctOrder = sorted.map(s => s.name).join(' → ');

  const itemList = sizes.map(s => `${s.emoji} ${s.name}`).join('、');
  const prompt = `把${itemList}從${direction}排列。`;

  // Generate option permutations
  const correctOption = correctOrder;
  const distractors = new Set<string>();
  distractors.add(correctOption);

  while (distractors.size < 4) {
    const shuffled = shuffleArray(sizes).map(s => s.name).join(' → ');
    distractors.add(shuffled);
  }

  const options = shuffleArray(Array.from(distractors));
  const correctAnswerIndex = options.indexOf(correctOption);

  return {
    id: generateId(),
    topicId: 'compare-length-height',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex,
    explanation: `正確的排列順序是：${correctOrder}。`,
    graphicType: 'comparison',
  };
}
