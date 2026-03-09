import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

interface PictogramItem {
  name: string;
  emoji: string;
}

const ITEMS: PictogramItem[] = [
  { name: '蘋果', emoji: '🍎' },
  { name: '香蕉', emoji: '🍌' },
  { name: '橙', emoji: '🍊' },
  { name: '草莓', emoji: '🍓' },
  { name: '葡萄', emoji: '🍇' },
  { name: '西瓜', emoji: '🍉' },
  { name: '星星', emoji: '⭐' },
  { name: '花', emoji: '🌸' },
];

/**
 * 數據處理 (Simple Data Handling / Pictograms)
 * Easy: read simple pictogram (2-3 items)
 * Medium: compare quantities
 * Hard: find totals
 */
export function generateDataHandlingQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const data = generatePictogramData(difficulty);
    switch (difficulty) {
      case 'easy':
        questions.push(generateReadQuestion(data));
        break;
      case 'medium':
        questions.push(generateCompareQuestion(data));
        break;
      case 'hard':
        questions.push(generateTotalQuestion(data));
        break;
    }
  }

  return questions;
}

interface PictogramData {
  items: { item: PictogramItem; count: number }[];
}

function generatePictogramData(difficulty: DifficultyLevel): PictogramData {
  const numItems = difficulty === 'easy' ? randomInt(2, 3) : difficulty === 'medium' ? 3 : randomInt(3, 4);
  const selected = shuffleArray(ITEMS).slice(0, numItems);
  const maxCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 10;

  return {
    items: selected.map(item => ({
      item,
      count: randomInt(1, maxCount),
    })),
  };
}

function buildPictogramDisplay(data: PictogramData): string {
  return data.items
    .map(d => `${d.item.emoji}${d.item.name}：${d.item.emoji.repeat(d.count)}`)
    .join('\n');
}

function generateReadQuestion(data: PictogramData): Question {
  const targetIdx = randomInt(0, data.items.length - 1);
  const target = data.items[targetIdx];
  const correctAnswer = target.count;

  const display = buildPictogramDisplay(data);
  const prompt = `圖表中，${target.item.emoji}${target.item.name}有幾個？\n${display}`;

  const distractors = new Set<number>();
  distractors.add(correctAnswer);
  while (distractors.size < 4) {
    let d = correctAnswer + randomInt(-2, 3);
    if (d < 1) d = 1;
    distractors.add(d);
  }

  const options = shuffleArray(Array.from(distractors).map(String));
  const correctAnswerIndex = options.indexOf(correctAnswer.toString());

  return {
    id: generateId(),
    topicId: 'data-handling',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex,
    explanation: `數一數圖表中的${target.item.emoji}，${target.item.name}有 ${correctAnswer} 個。`,
    graphicType: 'pictogram',
  };
}

function generateCompareQuestion(data: PictogramData): Question {
  const sorted = [...data.items].sort((a, b) => b.count - a.count);
  const isMost = randomInt(0, 1) === 0;
  const target = isMost ? sorted[0] : sorted[sorted.length - 1];
  const label = isMost ? '最多' : '最少';

  const display = buildPictogramDisplay(data);
  const prompt = `哪種東西${label}？\n${display}`;

  const correctAnswer = target.item.name;

  const options = shuffleArray(data.items.map(d => d.item.name));
  const correctAnswerIndex = options.indexOf(correctAnswer);

  return {
    id: generateId(),
    topicId: 'data-handling',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex,
    explanation: `${target.item.emoji}${target.item.name}${label}，有 ${target.count} 個。`,
    graphicType: 'pictogram',
  };
}

function generateTotalQuestion(data: PictogramData): Question {
  const total = data.items.reduce((sum, d) => sum + d.count, 0);

  const display = buildPictogramDisplay(data);
  const prompt = `圖表中所有東西加起來一共有幾個？\n${display}`;

  const correctAnswer = total;

  const distractors = new Set<number>();
  distractors.add(correctAnswer);
  while (distractors.size < 4) {
    let d = correctAnswer + randomInt(-4, 4);
    if (d < 1) d = 1;
    distractors.add(d);
  }

  const options = shuffleArray(Array.from(distractors).map(String));
  const correctAnswerIndex = options.indexOf(correctAnswer.toString());

  return {
    id: generateId(),
    topicId: 'data-handling',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex,
    explanation: `把所有東西加起來：${data.items.map(d => `${d.item.name}(${d.count})`).join(' + ')} = ${total}。`,
    graphicType: 'pictogram',
  };
}
