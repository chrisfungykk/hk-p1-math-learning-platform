import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { shapeSvg } from '../../utils/illustrations';

interface Shape3DInfo {
  name: string;
  emoji: string;
  faces: number;
  edges: number;
  vertices: number;
  flatFaces: number;
  curvedFaces: number;
  canRoll: boolean;
  description: string;
}

// HK P1 1S1: 立體圖形 — 3D shapes only
const SHAPES_3D: Shape3DInfo[] = [
  { name: '正方體', emoji: '🧊', faces: 6, edges: 12, vertices: 8, flatFaces: 6, curvedFaces: 0, canRoll: false, description: '有6個正方形的面、8個頂點和12條邊' },
  { name: '長方體', emoji: '📦', faces: 6, edges: 12, vertices: 8, flatFaces: 6, curvedFaces: 0, canRoll: false, description: '有6個長方形的面、8個頂點和12條邊' },
  { name: '圓柱體', emoji: '🥫', faces: 3, edges: 2, vertices: 0, flatFaces: 2, curvedFaces: 1, canRoll: true, description: '有2個圓形的面和1個曲面，可以滾動' },
  { name: '球體', emoji: '⚽', faces: 1, edges: 0, vertices: 0, flatFaces: 0, curvedFaces: 1, canRoll: true, description: '整個都是圓的，可以向任何方向滾動' },
  { name: '圓錐體', emoji: '📐', faces: 2, edges: 1, vertices: 1, flatFaces: 1, curvedFaces: 1, canRoll: true, description: '有1個圓形的底和1個尖頂' },
  { name: '三角錐', emoji: '🔺', faces: 4, edges: 6, vertices: 4, flatFaces: 4, curvedFaces: 0, canRoll: false, description: '有4個三角形的面、4個頂點和6條邊' },
];

const ALL_3D_NAMES = SHAPES_3D.map(s => s.name);

/**
 * 立體圖形 (3D Shapes) — HK P1 1S1 standard
 * Focused on 3D shapes only: 正方體、長方體、圓柱體、球體、圓錐體、三角錐
 * Easy: identify and name 3D shapes
 * Medium: properties (faces, can roll), compare shapes
 * Hard: faces/edges/vertices, sorting by properties
 * Challenge: nets, stacking, logic puzzles
 */
export function generateShapesQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateIdentify3D, generateDescribe3D, generateWhich3D],
    medium: [generateCanRoll, generate3DFaceCount, generateCompare3D, generateTrueFalse3D],
    hard: [generateEdgesVertices, generateSortByFaces, generate3DWordProblem, generateMultiProperty3D],
    challenge: [generateNetFolding, generate3DStacking, generate3DFaceCountingAdvanced, generate3DLogicPuzzle],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

function make3DQuestion(difficulty: DifficultyLevel, prompt: string, correct: string, distractorPool: string[], explanation: string): Question {
  const distractors = new Set<string>();
  distractors.add(correct);
  for (const d of distractorPool) { if (distractors.size < 4) distractors.add(d); }
  for (const f of ALL_3D_NAMES) { if (distractors.size >= 4) break; if (f !== correct) distractors.add(f); }
  const options = shuffleArray(Array.from(distractors).slice(0, 4));
  return {
    id: generateId(), topicId: 'shapes', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct), explanation, graphicType: 'shape',
  };
}

// --- Easy ---
function generateIdentify3D(): Question {
  const target = SHAPES_3D[randomInt(0, SHAPES_3D.length - 1)];
  const q = make3DQuestion('easy', `以下哪一個是${target.name}？ ${target.emoji}`, target.name,
    ALL_3D_NAMES, `${target.name}${target.description}。`);
  q.illustration = shapeSvg(target.name);
  return q;
}

function generateDescribe3D(): Question {
  const target = SHAPES_3D[randomInt(0, SHAPES_3D.length - 1)];
  const q = make3DQuestion('easy', `${target.description}。這是什麼立體圖形？`, target.name,
    ALL_3D_NAMES, `${target.name}${target.description}。`);
  q.illustration = shapeSvg(target.name);
  return q;
}

function generateWhich3D(): Question {
  const rollable = SHAPES_3D.filter(s => s.canRoll);
  const nonRollable = SHAPES_3D.filter(s => !s.canRoll);
  const askRoll = randomInt(0, 1) === 0;
  if (askRoll) {
    const target = rollable[randomInt(0, rollable.length - 1)];
    return make3DQuestion('easy', `以下哪個立體圖形可以滾動？`, target.name,
      ALL_3D_NAMES, `${target.name}${target.description}，可以滾動。`);
  }
  const target = nonRollable[randomInt(0, nonRollable.length - 1)];
  return make3DQuestion('easy', `以下哪個立體圖形不能滾動？`, target.name,
    ALL_3D_NAMES, `${target.name}的面都是平的，不能滾動。`);
}

// --- Medium ---
function generateCanRoll(): Question {
  const target = SHAPES_3D[randomInt(0, SHAPES_3D.length - 1)];
  const correct = target.canRoll ? '可以' : '不可以';
  const options = shuffleArray(['可以', '不可以', '只能向前滾', '只能向左滾']);
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'medium',
    prompt: `${target.name}可以滾動嗎？`,
    options, correctAnswerIndex: options.indexOf(correct),
    explanation: target.canRoll ? `${target.name}有曲面，可以滾動。` : `${target.name}的面都是平的，不能滾動。`,
    graphicType: 'shape',
  };
}

function generate3DFaceCount(): Question {
  const withFlat = SHAPES_3D.filter(s => s.flatFaces > 0);
  const target = withFlat[randomInt(0, withFlat.length - 1)];
  const correct = `${target.flatFaces}個`;
  const options = shuffleArray([`${target.flatFaces}個`, `${target.flatFaces + 1}個`, `${Math.max(0, target.flatFaces - 1)}個`, `${target.flatFaces + 2}個`]);
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'medium',
    prompt: `${target.name}有幾個平面？`,
    options, correctAnswerIndex: options.indexOf(correct),
    explanation: `${target.name}有 ${target.flatFaces} 個平面。${target.description}。`,
    graphicType: 'shape',
  };
}

function generateCompare3D(): Question {
  const a = SHAPES_3D[randomInt(0, SHAPES_3D.length - 1)];
  let b = SHAPES_3D[randomInt(0, SHAPES_3D.length - 1)];
  while (b.name === a.name) b = SHAPES_3D[randomInt(0, SHAPES_3D.length - 1)];
  const more = a.flatFaces >= b.flatFaces ? a : b;
  return make3DQuestion('medium',
    `${a.name}和${b.name}，哪個的平面比較多？`, more.name,
    ALL_3D_NAMES,
    `${a.name}有 ${a.flatFaces} 個平面，${b.name}有 ${b.flatFaces} 個平面。${more.name}的平面比較多。`);
}

function generateTrueFalse3D(): Question {
  const scenarios = [
    { prompt: '以下哪個立體圖形可以向任何方向滾動？', correct: '球體', exp: '球體整個都是圓的，可以向任何方向滾動。' },
    { prompt: '以下哪個立體圖形有尖頂？', correct: '圓錐體', exp: '圓錐體有1個尖頂。' },
    { prompt: '以下哪個立體圖形的面全部都是正方形？', correct: '正方體', exp: '正方體有6個正方形的面。' },
    { prompt: '以下哪個立體圖形沒有平面？', correct: '球體', exp: '球體沒有平面，整個都是曲面。' },
    { prompt: '以下哪個立體圖形有4個三角形的面？', correct: '三角錐', exp: '三角錐有4個三角形的面。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  return make3DQuestion('medium', s.prompt, s.correct, ALL_3D_NAMES, s.exp);
}

// --- Hard ---
function generateEdgesVertices(): Question {
  const withEdges = SHAPES_3D.filter(s => s.edges > 0);
  const target = withEdges[randomInt(0, withEdges.length - 1)];
  const askEdges = randomInt(0, 1) === 0;
  const val = askEdges ? target.edges : target.vertices;
  const label = askEdges ? '條邊' : '個頂點';
  const correct = `${val}${label.charAt(0) === '條' ? '條' : '個'}`;
  const options = shuffleArray([`${val}${label.charAt(0) === '條' ? '條' : '個'}`, `${val + 2}${label.charAt(0) === '條' ? '條' : '個'}`, `${Math.max(0, val - 2)}${label.charAt(0) === '條' ? '條' : '個'}`, `${val + 4}${label.charAt(0) === '條' ? '條' : '個'}`]);
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'hard',
    prompt: `${target.name}有幾${label}？`,
    options, correctAnswerIndex: options.indexOf(correct),
    explanation: `${target.name}有 ${val} ${label}。${target.description}。`,
    graphicType: 'shape',
  };
}

function generateSortByFaces(): Question {
  const selected = shuffleArray([...SHAPES_3D]).slice(0, 3);
  const sorted = [...selected].sort((a, b) => a.flatFaces - b.flatFaces);
  const correctOrder = sorted.map(s => s.name).join(' → ');
  const distractors = new Set<string>();
  distractors.add(correctOrder);
  distractors.add([...selected].reverse().map(s => s.name).join(' → '));
  distractors.add(shuffleArray([...selected]).map(s => s.name).join(' → '));
  distractors.add(shuffleArray([...selected]).map(s => s.name).join(' → '));
  const options = shuffleArray(Array.from(distractors).slice(0, 4));
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'hard',
    prompt: `把 ${selected.map(s => s.name).join('、')} 按平面數目從少到多排列。`,
    options, correctAnswerIndex: options.indexOf(correctOrder),
    explanation: `正確順序是 ${correctOrder}（平面數：${sorted.map(s => s.flatFaces).join('、')}）。`,
    graphicType: 'shape',
  };
}

function generate3DWordProblem(): Question {
  const scenarios = [
    () => {
      const n = randomInt(2, 3);
      const totalFaces = 6 * n;
      const correct = `${totalFaces}個`;
      return { prompt: `小明有 ${n} 個正方體。這些正方體一共有幾個面？`, correct, pool: [`${totalFaces}個`, `${totalFaces + 2}個`, `${totalFaces - 2}個`, `6個`], exp: `每個正方體有 6 個面，${n} 個就有 6 × ${n} = ${totalFaces} 個面。` };
    },
    () => {
      const n = randomInt(2, 3);
      const totalVertices = 8 * n;
      const correct = `${totalVertices}個`;
      return { prompt: `${n} 個長方體一共有幾個頂點？`, correct, pool: [`${totalVertices}個`, `${totalVertices + 4}個`, `${totalVertices - 4}個`, `8個`], exp: `每個長方體有 8 個頂點，${n} 個就有 8 × ${n} = ${totalVertices} 個頂點。` };
    },
    () => {
      const n = randomInt(2, 4);
      const totalEdges = 12 * n;
      const correct = `${totalEdges}條`;
      return { prompt: `${n} 個正方體一共有幾條邊？`, correct, pool: [`${totalEdges}條`, `${totalEdges + 4}條`, `${totalEdges - 4}條`, `12條`], exp: `每個正方體有 12 條邊，${n} 個就有 12 × ${n} = ${totalEdges} 條邊。` };
    },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)]();
  const options = shuffleArray(s.pool);
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'hard', prompt: s.prompt,
    options, correctAnswerIndex: options.indexOf(s.correct),
    explanation: s.exp, graphicType: 'shape',
  };
}

function generateMultiProperty3D(): Question {
  const scenarios = [
    { prompt: '正方體和長方體有什麼相同的地方？', correct: '都有6個面', pool: ['都有6個面', '都有4個面', '都能滾動', '都有圓形的面'], exp: '正方體和長方體都有6個面、8個頂點和12條邊。' },
    { prompt: '圓柱體和圓錐體有什麼相同的地方？', correct: '都有曲面', pool: ['都有曲面', '都有6個面', '都不能滾動', '都有8個頂點'], exp: '圓柱體和圓錐體都有曲面，都可以滾動。' },
    { prompt: '以下哪個立體圖形的頂點最多？', correct: '正方體', pool: ['正方體', '圓柱體', '球體', '圓錐體'], exp: '正方體有8個頂點，比其他選項都多。' },
    { prompt: '以下哪個立體圖形沒有頂點？', correct: '球體', pool: ['球體', '正方體', '三角錐', '圓錐體'], exp: '球體沒有頂點，整個都是圓的。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = shuffleArray(s.pool);
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'hard', prompt: s.prompt,
    options, correctAnswerIndex: options.indexOf(s.correct),
    explanation: s.exp, graphicType: 'shape',
  };
}

// --- Challenge ---
function generateNetFolding(): Question {
  const scenarios = [
    { prompt: '把一個正方體展開，可以得到幾個正方形？', correct: '6個', pool: ['4個', '5個', '6個', '8個'], exp: '正方體有6個面，展開後得到6個正方形。' },
    { prompt: '以下哪個展開圖可以摺成正方體？', correct: '十字形', pool: ['十字形', '一字形', '圓形', '三角形'], exp: '十字形的展開圖可以摺成正方體。' },
    { prompt: '圓柱體展開後，側面是什麼形狀？', correct: '長方形', pool: ['正方形', '長方形', '圓形', '三角形'], exp: '圓柱體的側面展開後是一個長方形。' },
    { prompt: '長方體展開後，最多有幾種不同大小的長方形？', correct: '3種', pool: ['1種', '2種', '3種', '6種'], exp: '長方體有3對面，每對大小相同，所以最多有3種不同大小的長方形。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = shuffleArray(s.pool);
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'challenge', prompt: s.prompt,
    options, correctAnswerIndex: options.indexOf(s.correct),
    explanation: s.exp, graphicType: 'shape',
  };
}

function generate3DStacking(): Question {
  const scenarios = [
    { prompt: '把2個正方體疊在一起，從外面能看到幾個面？', correct: '10個', pool: ['8個', '10個', '12個', '6個'], exp: '2個正方體共12個面，疊在一起有2個面被遮住，所以能看到 12 - 2 = 10 個面。' },
    { prompt: '把3個正方體排成一排，從外面能看到幾個面？', correct: '14個', pool: ['12個', '14個', '16個', '18個'], exp: '3個正方體共18個面，相鄰處有4個面被遮住，所以能看到 18 - 4 = 14 個面。' },
    { prompt: '一個正方體放在桌上，能看到幾個面？', correct: '5個', pool: ['4個', '5個', '6個', '3個'], exp: '正方體有6個面，放在桌上底面被遮住，能看到 6 - 1 = 5 個面。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = shuffleArray(s.pool);
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'challenge', prompt: s.prompt,
    options, correctAnswerIndex: options.indexOf(s.correct),
    explanation: s.exp, graphicType: 'shape',
  };
}

function generate3DFaceCountingAdvanced(): Question {
  const scenarios = [
    { prompt: '一個正方體有幾條邊？', correct: '12條', pool: ['6條', '8條', '10條', '12條'], exp: '正方體有12條邊。' },
    { prompt: '一個正方體有幾個頂點？', correct: '8個', pool: ['4個', '6個', '8個', '12個'], exp: '正方體有8個頂點。' },
    { prompt: '圓錐體有幾個頂點？', correct: '1個', pool: ['0個', '1個', '2個', '3個'], exp: '圓錐體只有1個尖頂。' },
    { prompt: '三角錐有幾條邊？', correct: '6條', pool: ['4條', '6條', '8條', '12條'], exp: '三角錐有6條邊。' },
    { prompt: '三角錐有幾個頂點？', correct: '4個', pool: ['3個', '4個', '5個', '6個'], exp: '三角錐有4個頂點。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = shuffleArray(s.pool);
  return {
    id: generateId(), topicId: 'shapes', difficulty: 'challenge', prompt: s.prompt,
    options, correctAnswerIndex: options.indexOf(s.correct),
    explanation: s.exp, graphicType: 'shape',
  };
}

function generate3DLogicPuzzle(): Question {
  const scenarios = [
    { prompt: '小華說：「我想的立體可以滾動，有2個平面。」她想的是什麼？', correct: '圓柱體', exp: '圓柱體可以滾動，有2個圓形的平面。' },
    { prompt: '小明說：「我想的立體有4個三角形的面。」他想的是什麼？', correct: '三角錐', exp: '三角錐有4個三角形的面。' },
    { prompt: '小美說：「我想的立體沒有平面，也沒有頂點。」她想的是什麼？', correct: '球體', exp: '球體沒有平面也沒有頂點，整個都是曲面。' },
    { prompt: '小強說：「我想的立體有1個尖頂和1個圓形的底。」他想的是什麼？', correct: '圓錐體', exp: '圓錐體有1個尖頂和1個圓形的底。' },
    { prompt: '小花說：「我想的立體有6個面，每個面都一樣大。」她想的是什麼？', correct: '正方體', exp: '正方體有6個一樣大的正方形面。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  return make3DQuestion('challenge', s.prompt, s.correct, ALL_3D_NAMES, s.exp);
}
