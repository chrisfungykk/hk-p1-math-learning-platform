import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { rulerSvg } from '../../utils/illustrations';

/**
 * 量度 (Measurement) — HK P1 Crescent syllabus
 * easy: Compare two objects by length/height/weight
 * medium: Non-standard units (paper clips) + ruler reading in cm
 * hard: Estimate/calculate measurements + compare capacity
 * challenge: Measurement + arithmetic (multi-step)
 */
export function generateMeasurementQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateEasyCompareLength, generateEasyCompareWeight],
    medium: [generateMediumNonStandardUnits, generateMediumRulerReading],
    hard: [generateHardCalculate, generateHardCompareCapacity],
    challenge: [generateChallengeCombinedLength, generateChallengeMultiStep],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

/**
 * Build 4 unique numeric options (with unit suffix) from a correct answer using deterministic offsets.
 */
function buildNumericOptions(correct: number, unit: string = ''): string[] {
  const suffix = unit ? unit : '';
  const correctStr = `${correct}${suffix}`;
  const seen = new Set<string>([correctStr]);
  const distractors: string[] = [];
  for (const offset of [-1, 1, -2, 2, -3, 3, -5, 5, -10, 10]) {
    const val = correct + offset;
    const s = `${val}${suffix}`;
    if (val >= 0 && !seen.has(s) && distractors.length < 3) {
      seen.add(s);
      distractors.push(s);
    }
  }
  let fallback = correct + 4;
  while (distractors.length < 3) {
    const s = `${fallback}${suffix}`;
    if (!seen.has(s)) {
      seen.add(s);
      distractors.push(s);
    }
    fallback++;
  }
  return shuffleArray([correctStr, ...distractors]).slice(0, 4);
}


// ─── EASY: Compare two objects by length/height/weight ───

const OBJECT_PAIRS: { a: string; b: string; attribute: string }[] = [
  { a: '鉛筆', b: '橡皮', attribute: '長' },
  { a: '尺子', b: '蠟筆', attribute: '長' },
  { a: '繩子', b: '絲帶', attribute: '長' },
  { a: '哥哥', b: '弟弟', attribute: '高' },
  { a: '爸爸', b: '妹妹', attribute: '高' },
  { a: '長頸鹿', b: '小狗', attribute: '高' },
  { a: '西瓜', b: '蘋果', attribute: '重' },
  { a: '書包', b: '鉛筆盒', attribute: '重' },
];

/** easy: Compare two objects by length — "鉛筆長12cm，橡皮長5cm，哪個比較長？" */
function generateEasyCompareLength(): Question {
  const pair = OBJECT_PAIRS[randomInt(0, OBJECT_PAIRS.length - 1)];
  const valA = randomInt(5, 20);
  const valB = randomInt(1, valA - 1); // A is always longer/taller/heavier
  const swap = randomInt(0, 1) === 1;
  const objA = swap ? pair.b : pair.a;
  const objB = swap ? pair.a : pair.b;
  const lenA = swap ? valB : valA;
  const lenB = swap ? valA : valB;
  const actualBigger = lenA > lenB ? objA : objB;

  const unitLabel = pair.attribute === '重' ? 'kg' : 'cm';
  const prompt = `${objA}${pair.attribute}${lenA}${unitLabel}，${objB}${pair.attribute}${lenB}${unitLabel}，哪個比較${pair.attribute}？`;
  const options = shuffleArray([objA, objB, '一樣', '不能比較']);
  const correctAnswer = actualBigger;

  return {
    id: generateId(),
    topicId: 'measurement',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correctAnswer),
    explanation: `${actualBigger}比較${pair.attribute}，因為 ${Math.max(lenA, lenB)}${unitLabel} > ${Math.min(lenA, lenB)}${unitLabel}。`,
    illustration: pair.attribute !== '重' ? rulerSvg(Math.max(lenA, lenB), actualBigger) : undefined,
  };
}

/** easy: Compare two objects by weight */
function generateEasyCompareWeight(): Question {
  const heavyItems = [
    { name: '西瓜', weight: randomInt(3, 8) },
    { name: '書包', weight: randomInt(2, 5) },
    { name: '字典', weight: randomInt(1, 3) },
  ];
  const lightItems = [
    { name: '蘋果', weight: 1 },
    { name: '鉛筆', weight: 1 },
    { name: '橡皮', weight: 1 },
  ];
  const heavy = heavyItems[randomInt(0, heavyItems.length - 1)];
  const light = lightItems[randomInt(0, lightItems.length - 1)];
  // Ensure they are different enough
  const swap = randomInt(0, 1) === 1;
  const first = swap ? light : heavy;
  const second = swap ? heavy : light;
  const heavier = heavy.name;

  const prompt = `${first.name}重${first.weight}kg，${second.name}重${second.weight}kg，哪個比較重？`;
  const options = shuffleArray([first.name, second.name, '一樣重', '不能比較']);

  return {
    id: generateId(),
    topicId: 'measurement',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(heavier),
    explanation: `${heavier}比較重，因為 ${heavy.weight}kg > ${light.weight}kg。`,
  };
}


// ─── MEDIUM: Non-standard units + ruler reading ───

const NON_STANDARD_UNITS = ['萬字夾', '積木', '橡皮'];

/** medium: Measure with non-standard units — "一支鉛筆用萬字夾量是6個萬字夾長，每個萬字夾1cm，鉛筆長幾cm？" */
function generateMediumNonStandardUnits(): Question {
  const unitName = NON_STANDARD_UNITS[randomInt(0, NON_STANDARD_UNITS.length - 1)];
  const unitCount = randomInt(3, 12);
  const unitLength = randomInt(1, 3);
  const totalLength = unitCount * unitLength;
  const objects = ['鉛筆', '蠟筆', '繩子', '絲帶', '筷子'];
  const obj = objects[randomInt(0, objects.length - 1)];

  const prompt = `一支${obj}用${unitName}量是${unitCount}個${unitName}長，每個${unitName}${unitLength}cm，${obj}長幾cm？`;
  const options = buildNumericOptions(totalLength, 'cm');

  return {
    id: generateId(),
    topicId: 'measurement',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(`${totalLength}cm`),
    explanation: `${unitCount} × ${unitLength}cm = ${totalLength}cm，所以${obj}長${totalLength}cm。`,
  };
}

/** medium: Read ruler — "看尺，鉛筆長幾cm？" */
function generateMediumRulerReading(): Question {
  const length = randomInt(3, 15);
  const objects = ['鉛筆', '蠟筆', '繩子', '絲帶', '橡皮'];
  const obj = objects[randomInt(0, objects.length - 1)];

  const prompt = `看尺，${obj}長幾cm？`;
  const options = buildNumericOptions(length, 'cm');

  return {
    id: generateId(),
    topicId: 'measurement',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(`${length}cm`),
    explanation: `從尺上讀出${obj}長${length}cm。`,
    illustration: rulerSvg(length, obj),
  };
}


// ─── HARD: Estimate/calculate measurements + compare capacity ───

/** hard: Calculate remaining length after cutting — "A繩長15cm，剪去8cm，還剩幾cm？" */
function generateHardCalculate(): Question {
  const total = randomInt(12, 25);
  const cut = randomInt(3, total - 2);
  const remaining = total - cut;
  const objects = ['繩子', '絲帶', '紙條', '鐵線'];
  const obj = objects[randomInt(0, objects.length - 1)];

  const prompt = `一條${obj}長${total}cm，剪去${cut}cm，還剩幾cm？`;
  const options = buildNumericOptions(remaining, 'cm');

  return {
    id: generateId(),
    topicId: 'measurement',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(`${remaining}cm`),
    explanation: `${total}cm − ${cut}cm = ${remaining}cm，所以還剩${remaining}cm。`,
    illustration: rulerSvg(total, obj),
  };
}

/** hard: Compare capacity of containers */
function generateHardCompareCapacity(): Question {
  const capacityA = randomInt(3, 10);
  const capacityB = capacityA + randomInt(1, 5);
  const containers = [
    { a: '杯子', b: '水壺' },
    { a: '碗', b: '鍋' },
    { a: '小瓶', b: '大瓶' },
  ];
  const pair = containers[randomInt(0, containers.length - 1)];
  const swap = randomInt(0, 1) === 1;
  const firstName = swap ? pair.b : pair.a;
  const secondName = swap ? pair.a : pair.b;
  const firstCap = swap ? capacityB : capacityA;
  const secondCap = swap ? capacityA : capacityB;
  const bigger = firstCap > secondCap ? firstName : secondName;
  const diff = Math.abs(firstCap - secondCap);

  const prompt = `${firstName}可裝${firstCap}杯水，${secondName}可裝${secondCap}杯水，哪個容量比較大？大多少杯？`;
  const correctStr = `${bigger}，大${diff}杯`;
  const otherName = bigger === firstName ? secondName : firstName;
  const options = shuffleArray([
    correctStr,
    `${otherName}，大${diff}杯`,
    `${bigger}，大${diff + 1}杯`,
    `一樣大`,
  ]);

  return {
    id: generateId(),
    topicId: 'measurement',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correctStr),
    explanation: `${bigger}容量比較大，${Math.max(firstCap, secondCap)} − ${Math.min(firstCap, secondCap)} = ${diff}，大${diff}杯。`,
  };
}


// ─── CHALLENGE: Measurement + arithmetic ───

/** challenge: Combined length — "A繩長12cm，B繩長8cm，兩條繩共長多少cm？" */
function generateChallengeCombinedLength(): Question {
  const lenA = randomInt(8, 20);
  const lenB = randomInt(5, 15);
  const total = lenA + lenB;
  const objects = ['繩子', '絲帶', '紙條', '鐵線'];
  const obj = objects[randomInt(0, objects.length - 1)];

  const prompt = `A${obj}長${lenA}cm，B${obj}長${lenB}cm，兩條${obj}共長多少cm？`;
  const options = buildNumericOptions(total, 'cm');

  return {
    id: generateId(),
    topicId: 'measurement',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(`${total}cm`),
    explanation: `${lenA}cm + ${lenB}cm = ${total}cm，兩條${obj}共長${total}cm。`,
  };
}

/** challenge: Multi-step measurement — "一條繩長Acm，剪去Bcm後再接上Ccm，現在長幾cm？" */
function generateChallengeMultiStep(): Question {
  const original = randomInt(15, 25);
  const cut = randomInt(3, original - 5);
  const added = randomInt(2, 10);
  const answer = original - cut + added;
  const objects = ['繩子', '絲帶', '紙條'];
  const obj = objects[randomInt(0, objects.length - 1)];

  const prompt = `一條${obj}長${original}cm，剪去${cut}cm後再接上${added}cm，現在長幾cm？`;
  const options = buildNumericOptions(answer, 'cm');

  return {
    id: generateId(),
    topicId: 'measurement',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(`${answer}cm`),
    explanation: `${original}cm − ${cut}cm = ${original - cut}cm，${original - cut}cm + ${added}cm = ${answer}cm。`,
  };
}
