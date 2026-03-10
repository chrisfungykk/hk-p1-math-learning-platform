import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

interface ShapeInfo {
  name: string;
  emoji: string;
  sides: number;
  corners: number;
  description: string;
}

const ALL_SHAPES: ShapeInfo[] = [
  { name: '圓形', emoji: '⚪', sides: 0, corners: 0, description: '沒有角，沒有直的邊，是圓圓的' },
  { name: '正方形', emoji: '🟧', sides: 4, corners: 4, description: '有4條一樣長的邊和4個直角' },
  { name: '三角形', emoji: '🔺', sides: 3, corners: 3, description: '有3條邊和3個角' },
  { name: '長方形', emoji: '🟦', sides: 4, corners: 4, description: '有4條邊和4個直角，對邊一樣長' },
];

const EXTRA_SHAPES: ShapeInfo[] = [
  { name: '菱形', emoji: '🔷', sides: 4, corners: 4, description: '有4條一樣長的邊，但角不是直角' },
  { name: '五邊形', emoji: '⬠', sides: 5, corners: 5, description: '有5條邊和5個角' },
];

/**
 * 認識形狀 (Recognizing Shapes)
 * Easy: identify shapes, count sides/corners
 * Medium: property-based questions, "which shape has...", true/false style
 * Hard: sorting by properties, multi-shape comparison, word problems
 */
export function generateShapesQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push([generateIdentifyQuestion, generateCountSidesEasy, generateWhichShapeEasy][randomInt(0, 2)]());
        break;
      case 'medium':
        questions.push([generatePropertyQuestion, generateTrueFalseStyle, generateCompareShapes][randomInt(0, 2)]());
        break;
      case 'hard':
        questions.push([generateSortByProperty, generateWordProblem, generateMultiPropertyQuestion][randomInt(0, 2)]());
        break;
    }
  }
  return questions;
}

function getAvailableShapes(difficulty: DifficultyLevel): ShapeInfo[] {
  switch (difficulty) {
    case 'easy': return ALL_SHAPES.slice(0, 3);
    case 'medium': return ALL_SHAPES;
    case 'hard': return [...ALL_SHAPES, ...EXTRA_SHAPES];
  }
}

function makeShapeQuestion(difficulty: DifficultyLevel, prompt: string, correct: string, distractorPool: string[], explanation: string): Question {
  const distractors = new Set<string>();
  distractors.add(correct);
  for (const d of distractorPool) { if (distractors.size < 4) distractors.add(d); }
  // If pool doesn't have 4 unique values, pad with generic fillers
  const fillers = ['圓形', '正方形', '三角形', '長方形', '菱形', '五邊形'];
  for (const f of fillers) { if (distractors.size >= 4) break; distractors.add(f); }
  const options = shuffleArray(Array.from(distractors).slice(0, 4));
  return {
    id: generateId(), topicId: 'shapes', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct), explanation, graphicType: 'shape',
  };
}

// --- Easy generators ---

function generateIdentifyQuestion(): Question {
  const shapes = getAvailableShapes('easy');
  const target = shapes[randomInt(0, shapes.length - 1)];
  const prompt = `以下哪一個是${target.name}？`;
  return makeShapeQuestion('easy', prompt, target.name,
    shapes.map(s => s.name),
    `${target.name}${target.description}。`);
}

function generateCountSidesEasy(): Question {
  const shapes = getAvailableShapes('easy');
  const target = shapes[randomInt(0, shapes.length - 1)];
  const prompt = `${target.name}有幾條邊？`;
  const correct = target.sides === 0 ? '0' : `${target.sides}`;
  return makeShapeQuestion('easy', prompt, correct,
    ['0', '3', '4', '5', '6'],
    `${target.name}有 ${correct} 條邊。${target.description}。`);
}

function generateWhichShapeEasy(): Question {
  const target = ALL_SHAPES[randomInt(1, 2)]; // 正方形 or 三角形 (have sides)
  const prompt = `哪一個形狀有 ${target.sides} 條邊？`;
  return makeShapeQuestion('easy', prompt, target.name,
    ALL_SHAPES.slice(0, 3).map(s => s.name),
    `${target.name}有 ${target.sides} 條邊。`);
}

// --- Medium generators ---

function generatePropertyQuestion(): Question {
  const shapes = getAvailableShapes('medium');
  const target = shapes[randomInt(0, shapes.length - 1)];
  const askCorners = randomInt(0, 1) === 0;
  const prompt = askCorners
    ? `${target.name}有幾個角？`
    : `${target.name}有幾條邊？`;
  const val = askCorners ? target.corners : target.sides;
  const correct = `${val}`;
  return makeShapeQuestion('medium', prompt, correct,
    ['0', '3', '4', '5', '6'],
    `${target.name}有 ${val} ${askCorners ? '個角' : '條邊'}。${target.description}。`);
}

function generateTrueFalseStyle(): Question {
  const scenarios = [
    { prompt: '以下哪個形狀沒有角？', correct: '圓形', explanation: '圓形沒有角，其他形狀都有角。' },
    { prompt: '以下哪個形狀的邊都一樣長？', correct: '正方形', explanation: '正方形有4條一樣長的邊。' },
    { prompt: '以下哪個形狀有3個角？', correct: '三角形', explanation: '三角形有3個角。' },
    { prompt: '以下哪個形狀有4個角，而且對邊一樣長？', correct: '長方形', explanation: '長方形有4個角，對邊一樣長。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  return makeShapeQuestion('medium', s.prompt, s.correct,
    ALL_SHAPES.map(sh => sh.name), s.explanation);
}

function generateCompareShapes(): Question {
  const a = ALL_SHAPES[randomInt(1, 3)]; // shapes with sides
  const b = ALL_SHAPES.filter(s => s.name !== a.name && s.sides > 0)[randomInt(0, 1)];
  const total = a.sides + b.sides;
  const prompt = `一個${a.name}和一個${b.name}，它們的邊加起來一共有幾條？`;
  const correct = `${total}`;
  return makeShapeQuestion('medium', prompt, correct,
    [`${total}`, `${total + 1}`, `${total - 1}`, `${total + 2}`],
    `${a.name}有 ${a.sides} 條邊，${b.name}有 ${b.sides} 條邊，${a.sides} + ${b.sides} = ${total}。`);
}

// --- Hard generators ---

function generateSortByProperty(): Question {
  const shapes = getAvailableShapes('hard');
  const withSides = shapes.filter(s => s.sides > 0);
  const selected = shuffleArray(withSides).slice(0, 3);
  const sorted = [...selected].sort((a, b) => a.sides - b.sides);
  const correctOrder = sorted.map(s => s.name).join(' → ');
  const prompt = `把 ${selected.map(s => s.name).join('、')} 按邊的數目從少到多排列。`;
  const distractors = new Set<string>();
  distractors.add(correctOrder);
  while (distractors.size < 4) {
    distractors.add(shuffleArray(selected).map(s => s.name).join(' → '));
  }
  const options = shuffleArray(Array.from(distractors));
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'hard', prompt, options,
    correctAnswerIndex: options.indexOf(correctOrder),
    explanation: `正確順序是 ${correctOrder}（邊數：${sorted.map(s => s.sides).join('、')}）。`,
    graphicType: 'shape',
  };
}

function generateWordProblem(): Question {
  const shapes = getAvailableShapes('hard');
  const target = shapes.filter(s => s.sides > 0)[randomInt(0, 3)];
  const numShapes = randomInt(2, 3);
  const totalSides = target.sides * numShapes;
  const prompt = `小明用了 ${numShapes} 個${target.name}拼圖案。這些${target.name}一共有幾條邊？`;
  const correct = `${totalSides}`;
  return makeShapeQuestion('hard', prompt, correct,
    [`${totalSides}`, `${totalSides + 1}`, `${totalSides - 1}`, `${target.sides}`],
    `每個${target.name}有 ${target.sides} 條邊，${numShapes} 個就有 ${target.sides} × ${numShapes} = ${totalSides} 條邊。`);
}

function generateMultiPropertyQuestion(): Question {
  const scenarios = [
    {
      prompt: '以下哪個形狀的邊數和角數不一樣？',
      correct: '圓形',
      explanation: '圓形有 0 條邊和 0 個角，但其他形狀的邊數和角數都相同。圓形是唯一沒有邊也沒有角的形狀。',
    },
    {
      prompt: '正方形和長方形有什麼相同的地方？',
      correct: '都有4個角',
      pool: ['都有4個角', '邊都一樣長', '都是圓的', '都有3條邊'],
      explanation: '正方形和長方形都有4個角和4條邊。',
    },
    {
      prompt: '以下哪個形狀的邊最多？',
      correct: '五邊形',
      pool: ['五邊形', '正方形', '三角形', '長方形'],
      explanation: '五邊形有5條邊，比其他形狀都多。',
    },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const pool = s.pool ?? [...ALL_SHAPES, ...EXTRA_SHAPES].map(sh => sh.name);
  return makeShapeQuestion('hard', s.prompt, s.correct, pool, s.explanation);
}
