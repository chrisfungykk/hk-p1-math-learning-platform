import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { verticalMathSvg } from '../../utils/illustrations';

/**
 * 兩位數加法 (Two-Digit Addition) — HK P1 Crescent syllabus
 * easy: 2-digit + 1-digit, no carry (units sum ≤ 9)
 * medium: 2-digit + 2-digit, no carry (units sum ≤ 9 AND tens sum ≤ 9)
 * hard: 2-digit + 2-digit, with carry (units sum > 9)
 * challenge: Multi-step addition or missing addend
 */
export function generateTwoDigitAdditionQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateEasyNoCarry, generateEasyNoCarryAlt],
    medium: [generateMediumNoCarry, generateMediumNoCarryAlt],
    hard: [generateHardWithCarry, generateHardWithCarryAlt],
    challenge: [generateChallengeMissingAddend, generateChallengeMultiStep],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

/**
 * Build 4 unique numeric options from a correct answer using deterministic offsets.
 */
function buildNumericOptions(correct: number): string[] {
  const correctStr = correct.toString();
  const seen = new Set<string>([correctStr]);
  const distractors: string[] = [];
  for (const offset of [-1, 1, -2, 2, -10, 10, -3, 3, -5, 5]) {
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


// ─── EASY: 2-digit + 1-digit, no carry (units sum ≤ 9) ───

/** easy: "計算：A + B = ?" where A is 2-digit, B is 1-digit, no carry */
function generateEasyNoCarry(): Question {
  // a: 2-digit number (11–89), b: 1-digit (1–9), ensure units sum ≤ 9
  const aUnits = randomInt(0, 8);
  const aTens = randomInt(1, 8);
  const a = aTens * 10 + aUnits;
  const maxB = Math.min(9, 9 - aUnits);
  const b = randomInt(1, maxB);
  const answer = a + b;
  const prompt = `計算：${a} + ${b} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-addition',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} + ${b} = ${answer}，個位 ${aUnits} + ${b} = ${aUnits + b}，不需進位。`,
    illustration: verticalMathSvg(a, b, '+'),
  };
}

/** easy variant: "A + B = ?" phrased differently */
function generateEasyNoCarryAlt(): Question {
  const aUnits = randomInt(0, 8);
  const aTens = randomInt(1, 8);
  const a = aTens * 10 + aUnits;
  const maxB = Math.min(9, 9 - aUnits);
  const b = randomInt(1, maxB);
  const answer = a + b;
  const prompt = `${a} + ${b} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-addition',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} + ${b} = ${answer}，個位相加不超過 9，不需進位。`,
    illustration: verticalMathSvg(a, b, '+'),
  };
}

// ─── MEDIUM: 2-digit + 2-digit, no carry (units sum ≤ 9 AND tens sum ≤ 9) ───

/** medium: "計算：A + B = ?" where both are 2-digit, no carry */
function generateMediumNoCarry(): Question {
  // Ensure units sum ≤ 9 AND tens sum ≤ 9
  const aTens = randomInt(1, 8);
  const aUnits = randomInt(0, 8);
  const maxBTens = Math.min(9 - aTens, 8);
  const bTens = randomInt(1, maxBTens);
  const maxBUnits = Math.min(9 - aUnits, 9);
  const bUnits = randomInt(0, maxBUnits);
  const a = aTens * 10 + aUnits;
  const b = bTens * 10 + bUnits;
  const answer = a + b;
  const prompt = `計算：${a} + ${b} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-addition',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} + ${b} = ${answer}，個位 ${aUnits} + ${bUnits} = ${aUnits + bUnits}，十位 ${aTens} + ${bTens} = ${aTens + bTens}，不需進位。`,
    illustration: verticalMathSvg(a, b, '+'),
  };
}

/** medium variant: different prompt style */
function generateMediumNoCarryAlt(): Question {
  const aTens = randomInt(1, 8);
  const aUnits = randomInt(0, 8);
  const maxBTens = Math.min(9 - aTens, 8);
  const bTens = randomInt(1, maxBTens);
  const maxBUnits = Math.min(9 - aUnits, 9);
  const bUnits = randomInt(0, maxBUnits);
  const a = aTens * 10 + aUnits;
  const b = bTens * 10 + bUnits;
  const answer = a + b;
  const prompt = `${a} + ${b} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-addition',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} + ${b} = ${answer}，十位和個位分別相加，不需進位。`,
    illustration: verticalMathSvg(a, b, '+'),
  };
}


// ─── HARD: 2-digit + 2-digit, WITH carry (units sum > 9) ───

/** hard: "計算：A + B = ?" where both are 2-digit, with carry */
function generateHardWithCarry(): Question {
  // Ensure units sum > 9 (carry required) and total ≤ 99
  // aTens max 7 so that aTens + bTens(≥1) + carry(1) ≤ 9
  const aTens = randomInt(1, 7);
  const aUnits = randomInt(2, 9);
  const minBUnits = Math.max(1, 10 - aUnits);
  const bUnits = randomInt(minBUnits, 9);
  // Ensure tens sum + carry ≤ 9 so result stays ≤ 99
  const carry = 1;
  const maxBTens = 9 - aTens - carry;
  const bTens = maxBTens >= 1 ? randomInt(1, maxBTens) : 1;
  const a = aTens * 10 + aUnits;
  const b = bTens * 10 + bUnits;
  const answer = a + b;
  const prompt = `計算：${a} + ${b} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-addition',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} + ${b} = ${answer}，個位 ${aUnits} + ${bUnits} = ${aUnits + bUnits}，需要進位。`,
  };
}

/** hard variant: different prompt style */
function generateHardWithCarryAlt(): Question {
  const aTens = randomInt(1, 7);
  const aUnits = randomInt(2, 9);
  const minBUnits = Math.max(1, 10 - aUnits);
  const bUnits = randomInt(minBUnits, 9);
  const carry = 1;
  const maxBTens = 9 - aTens - carry;
  const bTens = maxBTens >= 1 ? randomInt(1, maxBTens) : 1;
  const a = aTens * 10 + aUnits;
  const b = bTens * 10 + bUnits;
  const answer = a + b;
  const prompt = `${a} + ${b} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-addition',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} + ${b} = ${answer}，個位相加超過 10，需要向十位進 1。`,
  };
}

// ─── CHALLENGE: Multi-step or missing addend ───

/** challenge: "☐ + B = C, ☐ = ?" — missing addend */
function generateChallengeMissingAddend(): Question {
  const a = randomInt(11, 50);
  const b = randomInt(11, 40);
  const sum = a + b;
  const prompt = `☐ + ${b} = ${sum}，☐ = ?`;
  const options = buildNumericOptions(a);
  return {
    id: generateId(),
    topicId: 'two-digit-addition',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(a.toString()),
    explanation: `☐ + ${b} = ${sum}，所以 ☐ = ${sum} − ${b} = ${a}。`,
  };
}

/** challenge variant: "A + B + C = ?" — multi-step addition */
function generateChallengeMultiStep(): Question {
  const a = randomInt(11, 40);
  const b = randomInt(10, 30);
  const c = randomInt(1, 9);
  const answer = a + b + c;
  const prompt = `計算：${a} + ${b} + ${c} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-addition',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} + ${b} = ${a + b}，${a + b} + ${c} = ${answer}。`,
  };
}
