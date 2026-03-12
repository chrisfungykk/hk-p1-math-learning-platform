import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

interface ComparisonItem { name: string; emoji: string; }

const LENGTH_ITEMS: ComparisonItem[] = [
  { name: '鉛筆', emoji: '✏️' }, { name: '尺子', emoji: '📏' },
  { name: '繩子', emoji: '🧵' }, { name: '棍子', emoji: '🥢' }, { name: '蛇', emoji: '🐍' },
];
const HEIGHT_ITEMS: ComparisonItem[] = [
  { name: '樹', emoji: '🌳' }, { name: '房子', emoji: '🏠' },
  { name: '長頸鹿', emoji: '🦒' }, { name: '小貓', emoji: '🐱' }, { name: '小朋友', emoji: '🧒' },
];

/**
 * 比較長短和高矮 (Comparing Length and Height) — HK P1 1M1 + 1M3 standard
 * Uses centimeters (厘米/cm) for measurement
 * Easy: compare 2 items, simple "which is longer/taller"
 * Medium: cm measurements, ordering 3 items, "how many cm longer"
 * Hard: multi-step, ordering 4 items, inference, cm calculations
 */
export function generateCompareLengthQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateSimpleCompare, generateWordProblemEasy, generateCmCompare],
    medium: [generateOrderThree, generateHowMuchMore, generateWordProblemMedium],
    hard: [generateOrderFour, generateInferenceProblem, generateMultiStepCompare, generateCmCalculation],
    challenge: [generateTransitiveChain, generateIndirectMeasure, generateTrickyCompare, generateReverseMeasure, generateCombinedLength, generateWhoIsTallest],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
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
  const fillers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '15'];
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
  return makeCompareQuestion('easy',
    `${items.map(s => `${s.emoji} ${s.name}`).join(' 和 ')}，哪一個比較${label}？`,
    correct.name, items.map(s => s.name), `${correct.emoji} ${correct.name}比較${label}。`);
}

function generateWordProblemEasy(): Question {
  const isHeight = randomInt(0, 1) === 1;
  const items = pickItems(isHeight, 2);
  const sorted = [...items].sort((a, b) => a.size - b.size);
  const label = isHeight ? '高' : '長';
  const correct = sorted[sorted.length - 1];
  return makeCompareQuestion('easy',
    `${items[0].emoji} ${items[0].name}和 ${items[1].emoji} ${items[1].name}，哪一個比較${label}？`,
    correct.name, items.map(s => s.name), `${correct.emoji} ${correct.name}比較${label}。`);
}

function generateCmCompare(): Question {
  const a = randomInt(5, 15);
  const b = randomInt(5, 15);
  while (b === a) return generateCmCompare();
  const prompt = `鉛筆甲長 ${a} 厘米，鉛筆乙長 ${b} 厘米。哪支鉛筆比較長？`;
  const correct = a > b ? '鉛筆甲' : '鉛筆乙';
  const options = shuffleArray(['鉛筆甲', '鉛筆乙', '一樣長', '不能比較']);
  return {
    id: generateId(), topicId: 'compare-length-height', difficulty: 'easy', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${a} 厘米 ${a > b ? '>' : '<'} ${b} 厘米，所以${correct}比較長。`,
    graphicType: 'comparison',
  };
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
  const distractors = new Set<string>();
  distractors.add(correctOrder);
  while (distractors.size < 4) distractors.add(shuffleArray(items).map(s => s.name).join(' → '));
  const options = shuffleArray(Array.from(distractors));
  return {
    id: generateId(), topicId: 'compare-length-height', difficulty: 'medium',
    prompt: `把 ${items.map(s => `${s.emoji} ${s.name}`).join('、')} 從${direction}排列。`,
    options, correctAnswerIndex: options.indexOf(correctOrder),
    explanation: `正確的排列順序是：${correctOrder}。`, graphicType: 'comparison',
  };
}

function generateHowMuchMore(): Question {
  const a = randomInt(10, 20);
  const b = randomInt(5, a - 2);
  const diff = a - b;
  const prompt = `繩子甲長 ${a} 厘米，繩子乙長 ${b} 厘米。繩子甲比繩子乙長多少厘米？`;
  return makeCompareQuestion('medium', prompt, `${diff}`,
    [`${diff}`, `${diff + 1}`, `${diff - 1}`, `${a}`],
    `${a} - ${b} = ${diff}，繩子甲比繩子乙長 ${diff} 厘米。`);
}

function generateWordProblemMedium(): Question {
  const names = ['小明', '小華', '小美'];
  const heights = [randomInt(100, 110), randomInt(111, 120), randomInt(121, 130)];
  const shuffledIdx = shuffleArray([0, 1, 2]);
  const pairs = shuffledIdx.map((idx, i) => ({ name: names[i], height: heights[idx] }));
  const tallest = [...pairs].sort((a, b) => b.height - a.height)[0];
  return makeCompareQuestion('medium',
    `${pairs.map(p => `${p.name}高 ${p.height} 厘米`).join('，')}。誰最高？`,
    tallest.name, pairs.map(p => p.name),
    `${tallest.name}高 ${tallest.height} 厘米，是最高的。`);
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
  const distractors = new Set<string>();
  distractors.add(correctOrder);
  while (distractors.size < 4) distractors.add(shuffleArray(items).map(s => s.name).join(' → '));
  const options = shuffleArray(Array.from(distractors));
  return {
    id: generateId(), topicId: 'compare-length-height', difficulty: 'hard',
    prompt: `把 ${items.map(s => `${s.emoji} ${s.name}`).join('、')} 從${direction}排列。`,
    options, correctAnswerIndex: options.indexOf(correctOrder),
    explanation: `正確的排列順序是：${correctOrder}。`, graphicType: 'comparison',
  };
}

function generateInferenceProblem(): Question {
  const names = ['小明', '小華', '小美'];
  const shuffled = shuffleArray(names);
  const tallest = shuffled[0]; const middle = shuffled[1]; const shortest = shuffled[2];
  return makeCompareQuestion('hard',
    `${tallest}比${middle}高，${middle}比${shortest}高。誰最矮？`,
    shortest, names, `${tallest}最高，${middle}第二，${shortest}最矮。`);
}

function generateMultiStepCompare(): Question {
  const a = randomInt(10, 15);
  const diff1 = randomInt(2, 5);
  const diff2 = randomInt(2, 5);
  const b = a + diff1;
  const c = b + diff2;
  const totalDiff = c - a;
  return makeCompareQuestion('hard',
    `繩子甲長 ${a} 厘米，繩子乙比繩子甲長 ${diff1} 厘米，繩子丙比繩子乙長 ${diff2} 厘米。繩子丙比繩子甲長多少厘米？`,
    `${totalDiff}`, [`${totalDiff}`, `${diff1}`, `${diff2}`, `${totalDiff + 1}`],
    `繩子乙 = ${a} + ${diff1} = ${b} 厘米，繩子丙 = ${b} + ${diff2} = ${c} 厘米。${c} - ${a} = ${totalDiff} 厘米。`);
}

function generateCmCalculation(): Question {
  const a = randomInt(8, 18);
  const b = randomInt(5, 15);
  const total = a + b;
  const prompt = `一條繩子長 ${a} 厘米，另一條長 ${b} 厘米。兩條繩子接起來一共長多少厘米？`;
  return makeCompareQuestion('hard', prompt, `${total}`,
    [`${total}`, `${total + 1}`, `${total - 1}`, `${Math.abs(a - b)}`],
    `${a} + ${b} = ${total} 厘米。`);
}

// --- Challenge (HKIMO-style) ---

function generateTransitiveChain(): Question {
  const names = shuffleArray(['小明', '小華', '小美', '小強']);
  const a = names[0]; const b = names[1]; const c = names[2]; const d = names[3];
  // a < b < c < d
  const prompt = `${b}比${a}高，${c}比${b}高，${d}比${c}高。誰最矮？`;
  return makeCompareQuestion('challenge', prompt, a, names, `${a}最矮，因為其他人都比${a}高。`);
}

function generateIndirectMeasure(): Question {
  const aLen = randomInt(8, 12);
  const diff1 = randomInt(2, 4);
  const diff2 = randomInt(2, 4);
  const bLen = aLen + diff1;
  const cLen = bLen - diff2;
  const prompt = `繩子甲長 ${aLen} 厘米。繩子乙比繩子甲長 ${diff1} 厘米。繩子丙比繩子乙短 ${diff2} 厘米。繩子丙長多少厘米？`;
  const correct = `${cLen}`;
  return makeCompareQuestion('challenge', prompt, correct,
    [`${cLen}`, `${cLen + 1}`, `${cLen - 1}`, `${bLen}`],
    `繩子乙 = ${aLen} + ${diff1} = ${bLen} 厘米。繩子丙 = ${bLen} - ${diff2} = ${cLen} 厘米。`);
}

function generateTrickyCompare(): Question {
  const names = shuffleArray(['小明', '小華', '小美']);
  const a = names[0]; const b = names[1]; const c = names[2];
  const hA = randomInt(100, 110);
  const hB = hA + randomInt(3, 8);
  const hC = hB + randomInt(3, 8);
  const diff = hC - hA;
  const prompt = `${a}高 ${hA} 厘米，${b}高 ${hB} 厘米，${c}高 ${hC} 厘米。最高和最矮相差多少厘米？`;
  const correct = `${diff}`;
  return makeCompareQuestion('challenge', prompt, correct,
    [`${diff}`, `${diff + 1}`, `${diff - 1}`, `${hC - hB}`],
    `最高是${c}（${hC} 厘米），最矮是${a}（${hA} 厘米）。${hC} - ${hA} = ${diff} 厘米。`);
}

function generateReverseMeasure(): Question {
  const total = randomInt(15, 25);
  const a = randomInt(5, total - 5);
  const b = total - a;
  const prompt = `兩條繩子接起來一共長 ${total} 厘米。其中一條長 ${a} 厘米。另一條比這條長還是短？長或短多少厘米？`;
  const diff = Math.abs(a - b);
  const correct = b > a ? `長 ${diff} 厘米` : b < a ? `短 ${diff} 厘米` : '一樣長';
  const pool = [`長 ${diff} 厘米`, `短 ${diff} 厘米`, '一樣長', `長 ${diff + 1} 厘米`];
  return makeCompareQuestion('challenge', prompt, correct, pool,
    `另一條 = ${total} - ${a} = ${b} 厘米。${b > a ? `${b} > ${a}，長 ${diff} 厘米` : b < a ? `${b} < ${a}，短 ${diff} 厘米` : '兩條一樣長'}。`);
}

function generateCombinedLength(): Question {
  const a = randomInt(5, 12);
  const b = randomInt(5, 12);
  const c = randomInt(3, 8);
  const total = a + b + c;
  const prompt = `三條繩子分別長 ${a} 厘米、${b} 厘米和 ${c} 厘米。接起來一共長多少厘米？`;
  return makeCompareQuestion('challenge', prompt, `${total}`,
    [`${total}`, `${total + 1}`, `${total - 1}`, `${a + b}`],
    `${a} + ${b} + ${c} = ${total} 厘米。`);
}

function generateWhoIsTallest(): Question {
  const names = shuffleArray(['小明', '小華', '小美', '小強']);
  const heights = [randomInt(100, 105), randomInt(106, 112), randomInt(113, 118), randomInt(119, 125)];
  const shuffledH = shuffleArray([0, 1, 2, 3]);
  const people = names.map((n, i) => ({ name: n, height: heights[shuffledH[i]] }));
  const sorted = [...people].sort((a, b) => b.height - a.height);
  const prompt = `${people.map(p => `${p.name}高 ${p.height} 厘米`).join('，')}。\n從最高到最矮排列，第二高的是誰？`;
  const correct = sorted[1].name;
  return makeCompareQuestion('challenge', prompt, correct, people.map(p => p.name),
    `排列：${sorted.map(p => `${p.name}(${p.height})`).join(' > ')}。第二高是${correct}。`);
}
