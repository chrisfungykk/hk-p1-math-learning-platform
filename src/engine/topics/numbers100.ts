import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { countDotsSvg } from '../../utils/illustrations';

/**
 * 100以內的數 (Numbers to 100) — HK P1 Crescent syllabus
 * easy: Read/write two-digit numbers, tens and units
 * medium: Place value + ordering 3 numbers
 * hard: Compare with >, <, = and gap sequences
 * challenge: Place value reasoning + patterns
 */
export function generateNumbers100Questions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateTensDigit, generateWriteNumber],
    medium: [generatePlaceValue, generateOrderThreeNumbers],
    hard: [generateCompareNumbers, generateGapSequence],
    challenge: [generatePlaceValueReasoning, generatePatternToHundred],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

/** Chinese number words for tens */
const TENS_WORDS = ['', '十', '二十', '三十', '四十', '五十', '六十', '七十', '八十', '九十'];
const UNITS_WORDS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

/** Convert a number (10–99) to Chinese words */
function toChineseNumber(n: number): string {
  if (n === 10) return '十';
  const tens = Math.floor(n / 10);
  const units = n % 10;
  if (tens === 1 && units === 0) return '十';
  if (tens === 1) return `十${UNITS_WORDS[units]}`;
  if (units === 0) return TENS_WORDS[tens];
  return `${TENS_WORDS[tens]}${UNITS_WORDS[units]}`;
}

/**
 * Build 4 unique numeric options from a correct answer using deterministic offsets.
 */
function buildNumericOptions(correct: number): string[] {
  const correctStr = correct.toString();
  const seen = new Set<string>([correctStr]);
  const distractors: string[] = [];
  for (const offset of [-1, 1, -2, 2, -3, 3, -5, 5]) {
    const val = correct + offset;
    const s = val.toString();
    if (val >= 0 && !seen.has(s) && distractors.length < 3) {
      seen.add(s);
      distractors.push(s);
    }
  }
  let fallback = correct + 4;
  while (distractors.length < 3) {
    const s = fallback.toString();
    if (!seen.has(s)) {
      seen.add(s);
      distractors.push(s);
    }
    fallback++;
  }
  return shuffleArray([correctStr, ...distractors]).slice(0, 4);
}

/** easy: "N 的十位是什麼？" */
function generateTensDigit(): Question {
  const num = randomInt(11, 99);
  const tens = Math.floor(num / 10);
  const units = num % 10;
  const prompt = `${num} 的十位是什麼？`;
  const options = buildNumericOptions(tens);
  return {
    id: generateId(),
    topicId: 'numbers-100',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(tens.toString()),
    explanation: `${num} 有 ${tens} 個十和 ${units} 個一，所以十位是 ${tens}。`,
    illustration: countDotsSvg(num),
  };
}

/** easy variant: "寫出數字：四十五" → answer: 45 */
function generateWriteNumber(): Question {
  const num = randomInt(11, 99);
  const chinese = toChineseNumber(num);
  const prompt = `寫出數字：${chinese}`;
  const options = buildNumericOptions(num);
  return {
    id: generateId(),
    topicId: 'numbers-100',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(num.toString()),
    explanation: `${chinese} 就是 ${num}。`,
    illustration: countDotsSvg(num),
  };
}

/** medium: "N 中的 D 代表什麼？" — place value meaning */
function generatePlaceValue(): Question {
  const num = randomInt(21, 99);
  const tens = Math.floor(num / 10);
  const units = num % 10;
  // Ask about tens digit
  const askTens = units === 0 ? true : randomInt(0, 1) === 0;
  let prompt: string;
  let correct: number;
  let explanation: string;
  if (askTens) {
    prompt = `${num} 中的 ${tens} 代表什麼？`;
    correct = tens * 10;
    explanation = `${num} 的十位是 ${tens}，代表 ${tens} 個十，即 ${correct}。`;
  } else {
    prompt = `${num} 中的 ${units} 代表什麼？`;
    correct = units;
    explanation = `${num} 的個位是 ${units}，代表 ${units} 個一，即 ${correct}。`;
  }
  const options = buildNumericOptions(correct);
  return {
    id: generateId(),
    topicId: 'numbers-100',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct.toString()),
    explanation,
  };
}

/** medium variant: Order 3 numbers from small to large */
function generateOrderThreeNumbers(): Question {
  const a = randomInt(10, 40);
  const b = randomInt(41, 70);
  const c = randomInt(71, 99);
  const sorted = [a, b, c];
  const correct = `${sorted[0]}、${sorted[1]}、${sorted[2]}`;
  const prompt = `將 ${b}、${a}、${c} 從小到大排列`;
  // Build deterministic wrong orderings
  const wrongOrders = [
    `${sorted[2]}、${sorted[1]}、${sorted[0]}`,
    `${sorted[0]}、${sorted[2]}、${sorted[1]}`,
    `${sorted[1]}、${sorted[0]}、${sorted[2]}`,
  ];
  const options = shuffleArray([correct, ...wrongOrders]).slice(0, 4);
  return {
    id: generateId(),
    topicId: 'numbers-100',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `從小到大排列：${correct}。`,
  };
}

/** hard: "比較：A ○ B" — fill in >, <, or = */
function generateCompareNumbers(): Question {
  const a = randomInt(10, 99);
  // Ensure b is different from a for meaningful comparison
  const offset = randomInt(1, 20);
  const bigger = randomInt(0, 1) === 0;
  const b = bigger ? a + offset : Math.max(10, a - offset);
  let correct: string;
  if (a > b) correct = '>';
  else if (a < b) correct = '<';
  else correct = '=';
  const prompt = `比較：${a} ○ ${b}，○ 應填什麼？`;
  const options = shuffleArray(['>', '<', '=', '≠']).slice(0, 4);
  return {
    id: generateId(),
    topicId: 'numbers-100',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${a} ${correct} ${b}，因為 ${a > b ? `${a} 比 ${b} 大` : a < b ? `${a} 比 ${b} 小` : `兩個數相等`}。`,
  };
}

/** hard variant: Fill gap in arithmetic sequence — e.g. 42, 44, ?, 48 → 46 */
function generateGapSequence(): Question {
  const step = randomInt(1, 5) * 2; // even steps: 2, 4, 6, 8, 10
  const start = randomInt(10, 80 - step * 4);
  // Build 4-element sequence, hide one
  const seq = [start, start + step, start + step * 2, start + step * 3];
  const hideIdx = randomInt(1, 2); // hide middle element
  const correct = seq[hideIdx];
  const display = seq.map((v, i) => (i === hideIdx ? '?' : v.toString()));
  const prompt = `找出 ? 的數字：${display.join('、')}`;
  const options = buildNumericOptions(correct);
  return {
    id: generateId(),
    topicId: 'numbers-100',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct.toString()),
    explanation: `這個數列每次加 ${step}，所以 ? = ${correct}。`,
  };
}

/** challenge: Place value reasoning — "一個兩位數，十位比個位大N，個位是D，這個數是？" */
function generatePlaceValueReasoning(): Question {
  const units = randomInt(0, 6);
  const diff = randomInt(1, 9 - units);
  const tens = units + diff;
  const num = tens * 10 + units;
  const prompt = `一個兩位數，十位比個位大 ${diff}，個位是 ${units}，這個數是？`;
  const options = buildNumericOptions(num);
  return {
    id: generateId(),
    topicId: 'numbers-100',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(num.toString()),
    explanation: `個位是 ${units}，十位比個位大 ${diff}，即十位是 ${tens}，所以這個數是 ${num}。`,
  };
}

/** challenge variant: Number pattern reasoning — "按規律填數" */
function generatePatternToHundred(): Question {
  // Patterns: +3, +5, +7, etc. or alternating
  const stepOptions = [3, 5, 7, 9, 11];
  const step = stepOptions[randomInt(0, stepOptions.length - 1)];
  const start = randomInt(10, 60);
  const seq = [start, start + step, start + step * 2, start + step * 3, start + step * 4];
  // Only use sequence if all values <= 100
  const safeSeq = seq.filter(v => v <= 100);
  if (safeSeq.length < 4) {
    // Fallback: use smaller start
    const s = randomInt(5, 20);
    const fallbackSeq = [s, s + step, s + step * 2, s + step * 3, s + step * 4];
    return buildPatternQuestion(fallbackSeq, step);
  }
  return buildPatternQuestion(safeSeq.slice(0, 5), step);
}

function buildPatternQuestion(seq: number[], step: number): Question {
  const hideIdx = seq.length - 1; // hide last
  const correct = seq[hideIdx];
  const display = seq.map((v, i) => (i === hideIdx ? '?' : v.toString()));
  const prompt = `按規律填數：${display.join('、')}`;
  const options = buildNumericOptions(correct);
  return {
    id: generateId(),
    topicId: 'numbers-100',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct.toString()),
    explanation: `這個數列每次加 ${step}，所以 ? = ${correct}。`,
  };
}
