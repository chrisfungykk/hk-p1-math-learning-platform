import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

interface ShapeComposition {
  parts: string[];
  result: string;
  description: string;
}

const BASIC_COMPOSITIONS: ShapeComposition[] = [
  { parts: ['三角形', '三角形'], result: '正方形', description: '兩個三角形可以拼成一個正方形' },
  { parts: ['三角形', '三角形'], result: '長方形', description: '兩個三角形可以拼成一個長方形' },
  { parts: ['正方形', '正方形'], result: '長方形', description: '兩個正方形可以拼成一個長方形' },
  { parts: ['三角形', '三角形'], result: '菱形', description: '兩個三角形可以拼成一個菱形' },
];

const SHAPE_PARTS: Record<string, { part: string; count: number }> = {
  '正方形': { part: '三角形', count: 2 },
  '長方形': { part: '正方形', count: 2 },
  '六邊形': { part: '三角形', count: 6 },
};

const ALL_SHAPES = ['三角形', '正方形', '長方形', '圓形', '菱形', '六邊形'];

/**
 * 圖形拼砌 (Composing Shapes)
 * Easy: combine 2 shapes, simple "what does it make"
 * Medium: identify parts, "how many triangles to make...", word problems
 * Hard: decomposition, cutting problems, spatial reasoning, multi-step
 */
export function generateComposingShapesQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push([generateCombineQuestion, generateSimpleDecompose][randomInt(0, 1)]());
        break;
      case 'medium':
        questions.push([generateIdentifyPartsQuestion, generateHowManyToMake, generateWordProblemMedium][randomInt(0, 2)]());
        break;
      case 'hard':
        questions.push([generateCuttingProblem, generateMultiStepCompose, generateSpatialReasoning][randomInt(0, 2)]());
        break;
      case 'challenge':
        questions.push([generateTangramPuzzle, generateDecompositionCount, generateShapeCombinationLogic, generateMultiCutPuzzle][randomInt(0, 3)]());
        break;
    }
  }
  return questions;
}

function makeComposeQuestion(difficulty: DifficultyLevel, prompt: string, correct: string, pool: string[], explanation: string): Question {
  const distractors = new Set<string>();
  distractors.add(correct);
  for (const d of pool) { if (distractors.size < 4) distractors.add(d); }
  const fillers = ['三角形', '正方形', '長方形', '圓形', '菱形', '六邊形', '1個', '2個', '3個', '4個'];
  for (const f of fillers) { if (distractors.size >= 4) break; distractors.add(f); }
  const options = shuffleArray(Array.from(distractors).slice(0, 4));
  return {
    id: generateId(), topicId: 'composing-shapes', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct), explanation, graphicType: 'shape-compose',
  };
}

// --- Easy ---

function generateCombineQuestion(): Question {
  const comp = BASIC_COMPOSITIONS[randomInt(0, BASIC_COMPOSITIONS.length - 1)];
  const prompt = `兩個${comp.parts[0]}可以拼成什麼形狀？`;
  return makeComposeQuestion('easy', prompt, comp.result, ALL_SHAPES, `${comp.description}。`);
}

function generateSimpleDecompose(): Question {
  const scenarios = [
    { prompt: '一個正方形可以分成幾個三角形？', correct: '2個', explanation: '一個正方形沿對角線可以分成2個三角形。' },
    { prompt: '一個長方形可以分成幾個正方形？', correct: '2個', explanation: '一個長方形可以分成2個正方形。' },
    { prompt: '一個圓形可以分成幾個半圓？', correct: '2個', explanation: '一個圓形從中間分開，可以得到2個半圓。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  return makeComposeQuestion('easy', s.prompt, s.correct,
    ['1個', '2個', '3個', '4個'], s.explanation);
}

// --- Medium ---

function generateIdentifyPartsQuestion(): Question {
  const shapeNames = Object.keys(SHAPE_PARTS);
  const shapeName = shapeNames[randomInt(0, shapeNames.length - 1)];
  const info = SHAPE_PARTS[shapeName];
  const prompt = `一個${shapeName}可以分成幾個${info.part}？`;
  const correct = `${info.count}個`;
  return makeComposeQuestion('medium', prompt, correct,
    ['1個', '2個', '3個', '4個', '6個'],
    `一個${shapeName}可以分成 ${info.count} 個${info.part}。`);
}

function generateHowManyToMake(): Question {
  const scenarios = [
    { prompt: '要用幾個三角形才能拼成一個正方形？', correct: '2個', explanation: '需要2個三角形拼成一個正方形。' },
    { prompt: '要用幾個正方形才能拼成一個長方形？', correct: '2個', explanation: '需要2個正方形拼成一個長方形。' },
    { prompt: '要用幾個三角形才能拼成一個六邊形？', correct: '6個', explanation: '需要6個三角形拼成一個六邊形。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  return makeComposeQuestion('medium', s.prompt, s.correct,
    ['1個', '2個', '3個', '4個', '6個'], s.explanation);
}

function generateWordProblemMedium(): Question {
  const n = randomInt(2, 3);
  const trianglesPerSquare = 2;
  const total = n * trianglesPerSquare;
  const prompt = `小明要拼 ${n} 個正方形，每個正方形需要 2 個三角形。他一共需要幾個三角形？`;
  const correct = `${total}個`;
  return makeComposeQuestion('medium', prompt, correct,
    [`${total}個`, `${total + 1}個`, `${total - 1}個`, `${n}個`],
    `每個正方形需要 2 個三角形，${n} 個正方形需要 2 × ${n} = ${total} 個三角形。`);
}

// --- Hard ---

function generateCuttingProblem(): Question {
  const scenarios = [
    {
      prompt: '一個長方形剪一刀，最多可以變成幾個部分？',
      correct: '2個',
      explanation: '剪一刀最多把一個形狀分成2個部分。',
    },
    {
      prompt: '一個正方形沿對角線剪一刀，可以得到什麼形狀？',
      correct: '兩個三角形',
      explanation: '正方形沿對角線剪開，可以得到兩個三角形。',
    },
    {
      prompt: '一個長方形沿中間橫切一刀，可以得到什麼？',
      correct: '兩個長方形',
      explanation: '長方形沿中間橫切，可以得到兩個較小的長方形。',
    },
    {
      prompt: '一個正方形剪兩刀（橫一刀、直一刀），最多可以變成幾個部分？',
      correct: '4個',
      explanation: '橫一刀分成2個，再直一刀每個再分成2個，共4個部分。',
    },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  return makeComposeQuestion('hard', s.prompt, s.correct,
    ['1個', '2個', '3個', '4個', '兩個三角形', '兩個長方形', '兩個正方形'],
    s.explanation);
}

function generateMultiStepCompose(): Question {
  const squares = randomInt(2, 4);
  const trianglesPerSquare = 2;
  const extraTriangles = randomInt(1, 3);
  const total = squares * trianglesPerSquare + extraTriangles;
  const prompt = `小美用三角形拼圖案。她拼了 ${squares} 個正方形（每個用 2 個三角形），還剩下 ${extraTriangles} 個三角形。她一共有幾個三角形？`;
  const correct = `${total}個`;
  return makeComposeQuestion('hard', prompt, correct,
    [`${total}個`, `${total + 1}個`, `${total - 1}個`, `${squares * trianglesPerSquare}個`],
    `${squares} 個正方形用了 ${squares} × 2 = ${squares * trianglesPerSquare} 個三角形，加上剩下的 ${extraTriangles} 個，一共 ${total} 個。`);
}

function generateSpatialReasoning(): Question {
  const scenarios = [
    {
      prompt: '用3個三角形可以拼成什麼形狀？',
      correct: '梯形',
      explanation: '3個三角形可以拼成一個梯形。',
    },
    {
      prompt: '把一個大三角形分成4個小三角形，需要剪幾刀？',
      correct: '3刀',
      pool: ['1刀', '2刀', '3刀', '4刀'],
      explanation: '需要3刀才能把一個大三角形分成4個小三角形。',
    },
    {
      prompt: '兩個相同的長方形可以拼成什麼形狀？',
      correct: '正方形',
      explanation: '兩個相同的長方形可以拼成一個正方形。',
    },
    {
      prompt: '一個六邊形可以分成幾個三角形？',
      correct: '6個',
      pool: ['3個', '4個', '5個', '6個'],
      explanation: '一個六邊形可以分成6個三角形。',
    },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const pool = s.pool ?? ALL_SHAPES;
  return makeComposeQuestion('hard', s.prompt, s.correct, pool, s.explanation);
}

// --- Challenge (HKIMO-style) ---

function generateTangramPuzzle(): Question {
  const scenarios = [
    { prompt: '七巧板（tangram）一共有幾塊？', correct: '7塊', pool: ['5塊', '6塊', '7塊', '8塊'], explanation: '七巧板一共有7塊：5個三角形、1個正方形、1個平行四邊形。' },
    { prompt: '七巧板中有幾個三角形？', correct: '5個', pool: ['3個', '4個', '5個', '6個'], explanation: '七巧板中有5個三角形（2大、1中、2小）。' },
    { prompt: '用2個大三角形可以拼成什麼形狀？', correct: '正方形', pool: ['正方形', '圓形', '六邊形', '五邊形'], explanation: '2個大三角形可以拼成一個正方形。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  return makeComposeQuestion('challenge', s.prompt, s.correct, s.pool, s.explanation);
}

function generateDecompositionCount(): Question {
  const scenarios = [
    { prompt: '一個正方形最少剪幾刀可以分成4個三角形？', correct: '2刀', pool: ['1刀', '2刀', '3刀', '4刀'], explanation: '沿兩條對角線各剪一刀，共2刀，可以分成4個三角形。' },
    { prompt: '一個長方形剪2刀（都是直線），最多可以分成幾個部分？', correct: '4個', pool: ['3個', '4個', '5個', '6個'], explanation: '2刀如果交叉剪，最多可以分成4個部分。' },
    { prompt: '把一個三角形剪一刀，可以得到一個三角形和一個什麼形狀？', correct: '四邊形', pool: ['三角形', '四邊形', '圓形', '五邊形'], explanation: '三角形剪一刀可以得到一個三角形和一個四邊形。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  return makeComposeQuestion('challenge', s.prompt, s.correct, s.pool, s.explanation);
}

function generateShapeCombinationLogic(): Question {
  const n = randomInt(3, 5);
  const trianglesPerSquare = 2;
  const trianglesPerHex = 6;
  const scenarios = [
    () => {
      const total = n * trianglesPerSquare;
      return {
        prompt: `小明有 ${total} 個三角形。他最多可以拼成幾個正方形？`,
        correct: `${n}個`,
        pool: [`${n - 1}個`, `${n}個`, `${n + 1}個`, `${total}個`],
        explanation: `每個正方形需要 2 個三角形。${total} ÷ 2 = ${n} 個正方形。`,
      };
    },
    () => {
      const tri = randomInt(8, 12);
      const squares = Math.floor(tri / trianglesPerSquare);
      return {
        prompt: `小華有 ${tri} 個三角形。她拼了盡量多的正方形後，還剩幾個三角形？`,
        correct: `${tri % trianglesPerSquare}個`,
        pool: ['0個', '1個', '2個', '3個'],
        explanation: `${tri} ÷ 2 = ${squares} 餘 ${tri % trianglesPerSquare}。還剩 ${tri % trianglesPerSquare} 個三角形。`,
      };
    },
    () => {
      return {
        prompt: `拼一個六邊形需要 6 個三角形。拼 2 個六邊形需要幾個三角形？`,
        correct: `${2 * trianglesPerHex}個`,
        pool: [`${trianglesPerHex}個`, `${2 * trianglesPerHex}個`, `${2 * trianglesPerHex + 2}個`, `${3 * trianglesPerHex}個`],
        explanation: `2 × 6 = ${2 * trianglesPerHex} 個三角形。`,
      };
    },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)]();
  return makeComposeQuestion('challenge', s.prompt, s.correct, s.pool, s.explanation);
}

function generateMultiCutPuzzle(): Question {
  const scenarios = [
    { prompt: '一張紙對摺一次再剪一刀，打開後最多有幾個部分？', correct: '3個', pool: ['2個', '3個', '4個', '5個'], explanation: '對摺一次再剪一刀，打開後最多可以得到3個部分。' },
    { prompt: '一個正方形剪去一個角，剩下的形狀有幾條邊？', correct: '5條', pool: ['3條', '4條', '5條', '6條'], explanation: '正方形剪去一個角後，變成五邊形，有5條邊。' },
    { prompt: '一個長方形剪去一個角，剩下的形狀有幾個角？', correct: '5個', pool: ['3個', '4個', '5個', '6個'], explanation: '長方形剪去一個角後，變成五邊形，有5個角。' },
    { prompt: '把一個圓形對摺兩次，再剪掉尖角，打開後是什麼形狀？', correct: '正方形', pool: ['三角形', '正方形', '圓形', '菱形'], explanation: '圓形對摺兩次剪掉尖角，打開後是正方形（中間有正方形的洞）。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  return makeComposeQuestion('challenge', s.prompt, s.correct, s.pool, s.explanation);
}
