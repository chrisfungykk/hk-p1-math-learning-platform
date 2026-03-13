import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { shapeSvg } from '../../utils/illustrations';

/** 2D shape info for 平面圖形 topic */
interface FlatShapeInfo {
  name: string;
  sides: number;
  corners: number;
  description: string;
  hasSymmetry: boolean;
  symmetryLines: number;
}

const BASIC_SHAPES: FlatShapeInfo[] = [
  { name: '圓形', sides: 0, corners: 0, description: '沒有直的邊，沒有角，是圓圓的', hasSymmetry: true, symmetryLines: -1 },
  { name: '三角形', sides: 3, corners: 3, description: '有3條邊和3個角', hasSymmetry: true, symmetryLines: 3 },
  { name: '正方形', sides: 4, corners: 4, description: '有4條一樣長的邊和4個直角', hasSymmetry: true, symmetryLines: 4 },
  { name: '長方形', sides: 4, corners: 4, description: '有4條邊和4個直角，對邊一樣長', hasSymmetry: true, symmetryLines: 2 },
];

/** Build 4 options with the correct answer and deterministic distractors */
function buildShapeNameOptions(correct: string): string[] {
  const pool = BASIC_SHAPES.map(s => s.name);
  const seen = new Set<string>([correct]);
  const distractors: string[] = [];
  for (const name of shuffleArray(pool)) {
    if (!seen.has(name) && distractors.length < 3) {
      seen.add(name);
      distractors.push(name);
    }
  }
  return shuffleArray([correct, ...distractors]).slice(0, 4);
}

/** Build numeric options deterministically */
function buildNumericOptions(correct: number): string[] {
  const correctStr = correct.toString();
  const seen = new Set<string>([correctStr]);
  const distractors: string[] = [];
  for (const offset of [1, -1, 2, -2, 3]) {
    const val = correct + offset;
    if (val >= 0 && !seen.has(val.toString()) && distractors.length < 3) {
      seen.add(val.toString());
      distractors.push(val.toString());
    }
  }
  // Deterministic fillers if needed
  const fillers = [0, 1, 2, 3, 4, 5, 6];
  for (const f of fillers) {
    if (distractors.length >= 3) break;
    if (!seen.has(f.toString())) {
      seen.add(f.toString());
      distractors.push(f.toString());
    }
  }
  return shuffleArray([correctStr, ...distractors]).slice(0, 4);
}

// ─── EASY: Identify 2D shapes ───

/** easy: "以下哪一個是X？" with illustration */
function generateEasyIdentifyShape(): Question {
  const target = BASIC_SHAPES[randomInt(0, BASIC_SHAPES.length - 1)];
  const options = buildShapeNameOptions(target.name);
  return {
    id: generateId(),
    topicId: 'flat-shapes',
    difficulty: 'easy',
    prompt: `以下哪一個是${target.name}？`,
    options,
    correctAnswerIndex: options.indexOf(target.name),
    explanation: `${target.name}${target.description}。`,
    illustration: shapeSvg(target.name),
  };
}

/** easy variant: "這個形狀叫什麼名字？" */
function generateEasyNameShape(): Question {
  const target = BASIC_SHAPES[randomInt(0, BASIC_SHAPES.length - 1)];
  const options = buildShapeNameOptions(target.name);
  return {
    id: generateId(),
    topicId: 'flat-shapes',
    difficulty: 'easy',
    prompt: `看看這個形狀，它叫什麼名字？`,
    options,
    correctAnswerIndex: options.indexOf(target.name),
    explanation: `這個形狀是${target.name}，${target.description}。`,
    illustration: shapeSvg(target.name),
  };
}

// ─── MEDIUM: Count sides/corners of 2D shapes ───

/** medium: "X有幾條邊？" */
function generateMediumCountSides(): Question {
  const shapes = BASIC_SHAPES.filter(s => s.sides > 0);
  const target = shapes[randomInt(0, shapes.length - 1)];
  const options = buildNumericOptions(target.sides);
  return {
    id: generateId(),
    topicId: 'flat-shapes',
    difficulty: 'medium',
    prompt: `${target.name}有幾條邊？`,
    options,
    correctAnswerIndex: options.indexOf(target.sides.toString()),
    explanation: `${target.name}有 ${target.sides} 條邊。${target.description}。`,
    illustration: shapeSvg(target.name),
  };
}

/** medium variant: "X有幾個角？" */
function generateMediumCountCorners(): Question {
  const target = BASIC_SHAPES[randomInt(0, BASIC_SHAPES.length - 1)];
  const options = buildNumericOptions(target.corners);
  return {
    id: generateId(),
    topicId: 'flat-shapes',
    difficulty: 'medium',
    prompt: `${target.name}有幾個角？`,
    options,
    correctAnswerIndex: options.indexOf(target.corners.toString()),
    explanation: `${target.name}有 ${target.corners} 個角。${target.description}。`,
    illustration: shapeSvg(target.name),
  };
}

/** medium variant: "哪個形狀有N條邊？" */
function generateMediumWhichShapeHasSides(): Question {
  const shapes = BASIC_SHAPES.filter(s => s.sides > 0);
  const target = shapes[randomInt(0, shapes.length - 1)];
  const options = buildShapeNameOptions(target.name);
  return {
    id: generateId(),
    topicId: 'flat-shapes',
    difficulty: 'medium',
    prompt: `以下哪個平面圖形有 ${target.sides} 條邊？`,
    options,
    correctAnswerIndex: options.indexOf(target.name),
    explanation: `${target.name}有 ${target.sides} 條邊。`,
    illustration: shapeSvg(target.name),
  };
}

// ─── HARD: Compare properties, composite figures ───

/** hard: Compare total sides of two shapes */
function generateHardCompareSides(): Question {
  const shapes = BASIC_SHAPES.filter(s => s.sides > 0);
  const a = shapes[randomInt(0, shapes.length - 1)];
  let bIdx = randomInt(0, shapes.length - 1);
  if (shapes[bIdx].name === a.name) {
    bIdx = (bIdx + 1) % shapes.length;
  }
  const b = shapes[bIdx];
  const total = a.sides + b.sides;
  const options = buildNumericOptions(total);
  return {
    id: generateId(),
    topicId: 'flat-shapes',
    difficulty: 'hard',
    prompt: `一個${a.name}和一個${b.name}，它們的邊加起來一共有幾條？`,
    options,
    correctAnswerIndex: options.indexOf(total.toString()),
    explanation: `${a.name}有 ${a.sides} 條邊，${b.name}有 ${b.sides} 條邊，${a.sides} + ${b.sides} = ${total}。`,
  };
}

/** hard: "以下哪個形狀沒有角？" / property-based identification */
function generateHardPropertyIdentify(): Question {
  const scenarios = [
    { prompt: '以下哪個平面圖形沒有角？', correct: '圓形', explanation: '圓形沒有角，其他平面圖形都有角。' },
    { prompt: '以下哪個平面圖形的邊都一樣長？', correct: '正方形', explanation: '正方形有4條一樣長的邊。' },
    { prompt: '正方形和長方形有什麼相同的地方？', correct: '都有4個角', explanation: '正方形和長方形都有4個角和4條邊。' },
    { prompt: '以下哪個平面圖形的角最少？', correct: '三角形', explanation: '三角形有3個角，是有角的平面圖形中最少的。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const pool = s.correct === '都有4個角'
    ? ['都有4個角', '邊都一樣長', '都是圓的', '都有3條邊']
    : BASIC_SHAPES.map(sh => sh.name);
  const options = shuffleArray(pool).slice(0, 4);
  if (!options.includes(s.correct)) {
    options[0] = s.correct;
  }
  const finalOptions = shuffleArray(options);
  return {
    id: generateId(),
    topicId: 'flat-shapes',
    difficulty: 'hard',
    prompt: s.prompt,
    options: finalOptions,
    correctAnswerIndex: finalOptions.indexOf(s.correct),
    explanation: s.explanation,
  };
}

/** hard: Composite figure — "用N個X拼成圖案，一共有幾條邊？" */
function generateHardCompositeFigure(): Question {
  const shapes = BASIC_SHAPES.filter(s => s.sides > 0);
  const target = shapes[randomInt(0, shapes.length - 1)];
  const numShapes = randomInt(2, 3);
  const totalSides = target.sides * numShapes;
  const options = buildNumericOptions(totalSides);
  return {
    id: generateId(),
    topicId: 'flat-shapes',
    difficulty: 'hard',
    prompt: `小明用了 ${numShapes} 個${target.name}拼圖案，這些${target.name}一共有幾條邊？`,
    options,
    correctAnswerIndex: options.indexOf(totalSides.toString()),
    explanation: `每個${target.name}有 ${target.sides} 條邊，${numShapes} 個就有 ${target.sides} × ${numShapes} = ${totalSides} 條邊。`,
    illustration: shapeSvg(target.name),
  };
}

// ─── CHALLENGE: Symmetry, transformation ───

/** challenge: Symmetry lines */
function generateChallengeSymmetryLines(): Question {
  const scenarios = [
    { prompt: '正方形有幾條對稱線？', correct: '4條', pool: ['1條', '2條', '3條', '4條'], explanation: '正方形有4條對稱線（橫、直、兩條對角線）。' },
    { prompt: '長方形有幾條對稱線？', correct: '2條', pool: ['1條', '2條', '3條', '4條'], explanation: '長方形有2條對稱線（橫的和直的各一條）。' },
    { prompt: '以下哪個形狀有最多對稱線？', correct: '圓形', pool: ['圓形', '三角形', '正方形', '長方形'], explanation: '圓形有無數條對稱線，任何直徑都是對稱線。' },
    { prompt: '等邊三角形有幾條對稱線？', correct: '3條', pool: ['1條', '2條', '3條', '4條'], explanation: '等邊三角形有3條對稱線。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = shuffleArray(s.pool);
  return {
    id: generateId(),
    topicId: 'flat-shapes',
    difficulty: 'challenge',
    prompt: s.prompt,
    options,
    correctAnswerIndex: options.indexOf(s.correct),
    explanation: s.explanation,
  };
}

/** challenge: Shape transformation / logic reasoning */
function generateChallengeTransformation(): Question {
  const scenarios = [
    {
      prompt: '小明說：「我想的形狀有4條邊，對邊一樣長，但邊不是全部一樣長。」他想的是什麼形狀？',
      correct: '長方形',
      explanation: '長方形有4條邊，對邊一樣長，但不是全部邊都一樣長。',
    },
    {
      prompt: '把一個正方形沿對角線剪開，可以得到什麼形狀？',
      correct: '三角形',
      explanation: '正方形沿對角線剪開，可以得到2個三角形。',
    },
    {
      prompt: '把2個相同的三角形拼在一起，可以拼成什麼形狀？',
      correct: '長方形',
      explanation: '2個相同的直角三角形可以拼成一個長方形。',
    },
    {
      prompt: '一個形狀沒有邊也沒有角，它是什麼形狀？',
      correct: '圓形',
      explanation: '圓形沒有直的邊，也沒有角。',
    },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = buildShapeNameOptions(s.correct);
  return {
    id: generateId(),
    topicId: 'flat-shapes',
    difficulty: 'challenge',
    prompt: s.prompt,
    options,
    correctAnswerIndex: options.indexOf(s.correct),
    explanation: s.explanation,
  };
}

// ─── Export ───

export function generateFlatShapesQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateEasyIdentifyShape, generateEasyNameShape],
    medium: [generateMediumCountSides, generateMediumCountCorners, generateMediumWhichShapeHasSides],
    hard: [generateHardCompareSides, generateHardPropertyIdentify, generateHardCompositeFigure],
    challenge: [generateChallengeSymmetryLines, generateChallengeTransformation],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}