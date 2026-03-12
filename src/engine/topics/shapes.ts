import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

interface ShapeInfo {
  name: string;
  emoji: string;
  sides: number;
  corners: number;
  description: string;
  is3D?: boolean;
}

const BASIC_2D: ShapeInfo[] = [
  { name: '圓形', emoji: '⚪', sides: 0, corners: 0, description: '沒有角，沒有直的邊，是圓圓的' },
  { name: '三角形', emoji: '🔺', sides: 3, corners: 3, description: '有3條邊和3個角' },
  { name: '正方形', emoji: '🟧', sides: 4, corners: 4, description: '有4條一樣長的邊和4個直角' },
  { name: '長方形', emoji: '🟦', sides: 4, corners: 4, description: '有4條邊和4個直角，對邊一樣長' },
];

const ADVANCED_2D: ShapeInfo[] = [
  { name: '菱形', emoji: '🔷', sides: 4, corners: 4, description: '有4條一樣長的邊，但角不是直角' },
  { name: '五邊形', emoji: '⬠', sides: 5, corners: 5, description: '有5條邊和5個角' },
  { name: '六邊形', emoji: '⬡', sides: 6, corners: 6, description: '有6條邊和6個角' },
];

// HK P1 1S1: 3D shapes
const SHAPES_3D: ShapeInfo[] = [
  { name: '正方體', emoji: '🧊', sides: 6, corners: 8, description: '有6個正方形的面、8個頂點和12條邊', is3D: true },
  { name: '長方體', emoji: '📦', sides: 6, corners: 8, description: '有6個長方形的面、8個頂點和12條邊', is3D: true },
  { name: '圓柱體', emoji: '🥫', sides: 0, corners: 0, description: '有2個圓形的面和1個曲面，可以滾動', is3D: true },
  { name: '球體', emoji: '⚽', sides: 0, corners: 0, description: '整個都是圓的，可以向任何方向滾動', is3D: true },
  { name: '圓錐體', emoji: '🔺', sides: 0, corners: 1, description: '有1個圓形的底和1個尖頂', is3D: true },
];

/**
 * 認識形狀 (Recognizing Shapes) — HK P1 1S1 + 1S2 standard
 * 2D: triangles, quadrilaterals (正方形/長方形/菱形), pentagons, hexagons, circles
 * 3D: cubes, cuboids, cylinders, spheres, cones
 * Easy: identify basic 2D shapes, count sides/corners
 * Medium: properties, 3D shape recognition, compare shapes
 * Hard: 2D+3D mixed, sorting, multi-property, word problems
 */
export function generateShapesQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateIdentifyQuestion, generateCountSidesEasy, generateWhichShapeEasy],
    medium: [generatePropertyQuestion, generate3DRecognition, generateCompareShapes, generateTrueFalseStyle],
    hard: [generateSortByProperty, generate3DProperties, generateWordProblem, generateMultiPropertyQuestion],
    challenge: [generateSymmetryPuzzle, generateNetFolding, generate3DFaceCounting, generateShapeLogicPuzzle],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

function getAvailableShapes(difficulty: DifficultyLevel): ShapeInfo[] {
  switch (difficulty) {
    case 'easy': return BASIC_2D;
    case 'medium': return [...BASIC_2D, ...ADVANCED_2D];
    case 'hard': return [...BASIC_2D, ...ADVANCED_2D];
    case 'challenge': return [...BASIC_2D, ...ADVANCED_2D];
  }
}

function makeShapeQuestion(difficulty: DifficultyLevel, prompt: string, correct: string, distractorPool: string[], explanation: string): Question {
  const distractors = new Set<string>();
  distractors.add(correct);
  for (const d of distractorPool) { if (distractors.size < 4) distractors.add(d); }
  const fillers = ['圓形', '正方形', '三角形', '長方形', '菱形', '五邊形', '六邊形', '正方體', '圓柱體', '球體'];
  for (const f of fillers) { if (distractors.size >= 4) break; distractors.add(f); }
  const options = shuffleArray(Array.from(distractors).slice(0, 4));
  return {
    id: generateId(), topicId: 'shapes', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct), explanation, graphicType: 'shape',
  };
}

// --- Easy ---
function generateIdentifyQuestion(): Question {
  const shapes = BASIC_2D;
  const target = shapes[randomInt(0, shapes.length - 1)];
  return makeShapeQuestion('easy', `以下哪一個是${target.name}？`, target.name,
    shapes.map(s => s.name), `${target.name}${target.description}。`);
}

function generateCountSidesEasy(): Question {
  const shapes = BASIC_2D;
  const target = shapes[randomInt(0, shapes.length - 1)];
  const correct = `${target.sides}`;
  return makeShapeQuestion('easy', `${target.name}有幾條邊？`, correct,
    ['0', '3', '4', '5', '6'], `${target.name}有 ${correct} 條邊。${target.description}。`);
}

function generateWhichShapeEasy(): Question {
  const target = BASIC_2D[randomInt(1, 2)]; // 三角形 or 正方形
  return makeShapeQuestion('easy', `哪一個形狀有 ${target.sides} 條邊？`, target.name,
    BASIC_2D.map(s => s.name), `${target.name}有 ${target.sides} 條邊。`);
}

// --- Medium ---
function generatePropertyQuestion(): Question {
  const shapes = getAvailableShapes('medium');
  const target = shapes[randomInt(0, shapes.length - 1)];
  const askCorners = randomInt(0, 1) === 0;
  const val = askCorners ? target.corners : target.sides;
  const correct = `${val}`;
  return makeShapeQuestion('medium',
    `${target.name}有幾${askCorners ? '個角' : '條邊'}？`, correct,
    ['0', '3', '4', '5', '6'],
    `${target.name}有 ${val} ${askCorners ? '個角' : '條邊'}。${target.description}。`);
}

function generate3DRecognition(): Question {
  const target = SHAPES_3D[randomInt(0, SHAPES_3D.length - 1)];
  return makeShapeQuestion('medium', `以下哪一個是${target.name}？ ${target.emoji}`, target.name,
    SHAPES_3D.map(s => s.name), `${target.name}${target.description}。`);
}

function generateTrueFalseStyle(): Question {
  const scenarios = [
    { prompt: '以下哪個形狀沒有角？', correct: '圓形', explanation: '圓形沒有角，其他形狀都有角。' },
    { prompt: '以下哪個形狀的邊都一樣長？', correct: '正方形', explanation: '正方形有4條一樣長的邊。' },
    { prompt: '以下哪個形狀有3個角？', correct: '三角形', explanation: '三角形有3個角。' },
    { prompt: '以下哪個形狀有6條邊？', correct: '六邊形', explanation: '六邊形有6條邊和6個角。' },
    { prompt: '以下哪個立體可以滾動？', correct: '圓柱體', explanation: '圓柱體有曲面，可以滾動。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  return makeShapeQuestion('medium', s.prompt, s.correct,
    [...BASIC_2D, ...ADVANCED_2D, ...SHAPES_3D].map(sh => sh.name), s.explanation);
}

function generateCompareShapes(): Question {
  const a = [...BASIC_2D, ...ADVANCED_2D].filter(s => s.sides > 0)[randomInt(0, 4)];
  const pool = [...BASIC_2D, ...ADVANCED_2D].filter(s => s.sides > 0 && s.name !== a.name);
  const b = pool[randomInt(0, pool.length - 1)];
  const total = a.sides + b.sides;
  return makeShapeQuestion('medium',
    `一個${a.name}和一個${b.name}，它們的邊加起來一共有幾條？`, `${total}`,
    [`${total}`, `${total + 1}`, `${total - 1}`, `${total + 2}`],
    `${a.name}有 ${a.sides} 條邊，${b.name}有 ${b.sides} 條邊，${a.sides} + ${b.sides} = ${total}。`);
}

// --- Hard ---
function generateSortByProperty(): Question {
  const shapes = [...BASIC_2D, ...ADVANCED_2D].filter(s => s.sides > 0);
  const selected = shuffleArray(shapes).slice(0, 3);
  const sorted = [...selected].sort((a, b) => a.sides - b.sides);
  const correctOrder = sorted.map(s => s.name).join(' → ');
  const distractors = new Set<string>();
  distractors.add(correctOrder);
  while (distractors.size < 4) distractors.add(shuffleArray(selected).map(s => s.name).join(' → '));
  const options = shuffleArray(Array.from(distractors));
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'hard',
    prompt: `把 ${selected.map(s => s.name).join('、')} 按邊的數目從少到多排列。`,
    options, correctAnswerIndex: options.indexOf(correctOrder),
    explanation: `正確順序是 ${correctOrder}（邊數：${sorted.map(s => s.sides).join('、')}）。`,
    graphicType: 'shape',
  };
}

function generate3DProperties(): Question {
  const scenarios = [
    { prompt: '正方體有幾個面？', correct: '6個', pool: ['4個', '5個', '6個', '8個'], exp: '正方體有6個正方形的面。' },
    { prompt: '圓柱體有幾個平面？', correct: '2個', pool: ['1個', '2個', '3個', '0個'], exp: '圓柱體有2個圓形的平面（上面和下面）。' },
    { prompt: '以下哪個立體形狀不能滾動？', correct: '正方體', pool: ['正方體', '圓柱體', '球體', '圓錐體'], exp: '正方體的面都是平的，不能滾動。' },
    { prompt: '球體有幾個平面？', correct: '0個', pool: ['0個', '1個', '2個', '3個'], exp: '球體沒有平面，整個都是曲面。' },
    { prompt: '以下哪個立體有尖頂？', correct: '圓錐體', pool: ['正方體', '圓柱體', '圓錐體', '球體'], exp: '圓錐體有1個尖頂。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = shuffleArray(s.pool);
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'hard', prompt: s.prompt,
    options, correctAnswerIndex: options.indexOf(s.correct),
    explanation: s.exp, graphicType: 'shape',
  };
}

function generateWordProblem(): Question {
  const shapes = [...BASIC_2D, ...ADVANCED_2D].filter(s => s.sides > 0);
  const target = shapes[randomInt(0, shapes.length - 1)];
  const numShapes = randomInt(2, 3);
  const totalSides = target.sides * numShapes;
  const correct = `${totalSides}`;
  return makeShapeQuestion('hard',
    `小明用了 ${numShapes} 個${target.name}拼圖案。這些${target.name}一共有幾條邊？`, correct,
    [`${totalSides}`, `${totalSides + 1}`, `${totalSides - 1}`, `${target.sides}`],
    `每個${target.name}有 ${target.sides} 條邊，${numShapes} 個就有 ${target.sides} × ${numShapes} = ${totalSides} 條邊。`);
}

function generateMultiPropertyQuestion(): Question {
  const scenarios = [
    { prompt: '正方形和長方形有什麼相同的地方？', correct: '都有4個角', pool: ['都有4個角', '邊都一樣長', '都是圓的', '都有3條邊'], exp: '正方形和長方形都有4個角和4條邊。' },
    { prompt: '以下哪個形狀的邊最多？', correct: '六邊形', pool: ['六邊形', '五邊形', '正方形', '三角形'], exp: '六邊形有6條邊，比其他形狀都多。' },
    { prompt: '正方體和長方體有什麼相同的地方？', correct: '都有6個面', pool: ['都有6個面', '都有4個面', '都能滾動', '都有圓形的面'], exp: '正方體和長方體都有6個面。' },
    { prompt: '以下哪個不是平面圖形？', correct: '正方體', pool: ['正方體', '正方形', '三角形', '圓形'], exp: '正方體是立體圖形，不是平面圖形。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = shuffleArray(s.pool);
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'hard', prompt: s.prompt,
    options, correctAnswerIndex: options.indexOf(s.correct),
    explanation: s.exp, graphicType: 'shape',
  };
}

// --- Challenge (HKIMO-style) ---

function generateSymmetryPuzzle(): Question {
  const scenarios = [
    { prompt: '以下哪個形狀是對稱的？（左右兩邊一樣）', correct: '正方形', explanation: '正方形是對稱的，左右兩邊完全一樣。' },
    { prompt: '以下哪個形狀有最多對稱線？', correct: '圓形', explanation: '圓形有無數條對稱線，任何直徑都是對稱線。' },
    { prompt: '長方形有幾條對稱線？', correct: '2條', explanation: '長方形有2條對稱線（橫的和直的各一條）。' },
    { prompt: '正方形有幾條對稱線？', correct: '4條', explanation: '正方形有4條對稱線（橫、直、兩條對角線）。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const pool = s.correct.includes('條')
    ? ['1條', '2條', '3條', '4條']
    : [...BASIC_2D, ...ADVANCED_2D].map(sh => sh.name);
  return makeShapeQuestion('challenge', s.prompt, s.correct, pool, s.explanation);
}

function generateNetFolding(): Question {
  const scenarios = [
    { prompt: '把一個正方體展開，可以得到幾個正方形？', correct: '6個', pool: ['4個', '5個', '6個', '8個'], explanation: '正方體有6個面，展開後得到6個正方形。' },
    { prompt: '以下哪個展開圖可以摺成正方體？', correct: '十字形', pool: ['十字形', '一字形', '圓形', '三角形'], explanation: '十字形的展開圖可以摺成正方體。' },
    { prompt: '圓柱體展開後，側面是什麼形狀？', correct: '長方形', pool: ['正方形', '長方形', '圓形', '三角形'], explanation: '圓柱體的側面展開後是一個長方形。' },
    { prompt: '長方體展開後，最多有幾個不同大小的長方形？', correct: '3種', pool: ['1種', '2種', '3種', '6種'], explanation: '長方體有3對面，每對大小相同，所以最多有3種不同大小的長方形。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = shuffleArray(s.pool);
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'challenge', prompt: s.prompt,
    options, correctAnswerIndex: options.indexOf(s.correct),
    explanation: s.explanation, graphicType: 'shape',
  };
}

function generate3DFaceCounting(): Question {
  const scenarios = [
    { prompt: '把2個正方體疊在一起，從外面能看到幾個面？', correct: '10個', pool: ['8個', '10個', '12個', '6個'], explanation: '2個正方體共12個面，疊在一起有2個面被遮住，所以能看到 12 - 2 = 10 個面。' },
    { prompt: '一個正方體有幾條邊？', correct: '12條', pool: ['6條', '8條', '10條', '12條'], explanation: '正方體有12條邊。' },
    { prompt: '一個正方體有幾個頂點？', correct: '8個', pool: ['4個', '6個', '8個', '12個'], explanation: '正方體有8個頂點。' },
    { prompt: '圓錐體有幾個頂點？', correct: '1個', pool: ['0個', '1個', '2個', '3個'], explanation: '圓錐體只有1個尖頂。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = shuffleArray(s.pool);
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'challenge', prompt: s.prompt,
    options, correctAnswerIndex: options.indexOf(s.correct),
    explanation: s.explanation, graphicType: 'shape',
  };
}

function generateShapeLogicPuzzle(): Question {
  const scenarios = [
    { prompt: '小明說：「我想的形狀有4條邊，但不是長方形，邊都一樣長，角不是直角。」他想的是什麼形狀？', correct: '菱形', explanation: '菱形有4條一樣長的邊，但角不是直角，符合所有條件。' },
    { prompt: '一個形狀有3條邊和3個角，它是什麼形狀？', correct: '三角形', explanation: '有3條邊和3個角的形狀是三角形。' },
    { prompt: '小華說：「我想的立體可以滾動，有2個平面。」她想的是什麼？', correct: '圓柱體', explanation: '圓柱體可以滾動，有2個圓形的平面。' },
    { prompt: '一個形狀沒有邊也沒有角，但不是立體。它是什麼？', correct: '圓形', explanation: '圓形是平面圖形，沒有邊也沒有角。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  return makeShapeQuestion('challenge', s.prompt, s.correct,
    [...BASIC_2D, ...ADVANCED_2D, ...SHAPES_3D].map(sh => sh.name), s.explanation);
}
