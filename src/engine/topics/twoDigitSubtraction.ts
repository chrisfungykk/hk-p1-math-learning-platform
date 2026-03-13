import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { verticalMathSvg } from '../../utils/illustrations';

/**
 * 兩位數減法 (Two-Digit Subtraction) — HK P1 Crescent syllabus
 * easy: 2-digit − 1-digit, no borrow (units of minuend ≥ subtrahend)
 * medium: 2-digit − 2-digit, no borrow (aUnits ≥ bUnits AND aTens ≥ bTens)
 * hard: 2-digit − 2-digit, with borrow (aUnits < bUnits)
 * challenge: Multi-step subtraction or missing value
 */
export function generateTwoDigitSubtractionQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateEasyNoBorrow, generateEasyNoBorrowAlt],
    medium: [generateMediumNoBorrow, generateMediumNoBorrowAlt],
    hard: [generateHardWithBorrow, generateHardWithBorrowAlt],
    challenge: [generateChallengeMissingValue, generateChallengeMultiStep],
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


// ─── EASY: 2-digit − 1-digit, no borrow (units of minuend ≥ subtrahend) ───

/** easy: "計算：A − B = ?" where A is 2-digit, B is 1-digit, no borrow */
function generateEasyNoBorrow(): Question {
  // a: 2-digit (11–99), b: 1-digit (1–9), ensure a%10 ≥ b
  const aUnits = randomInt(1, 9);
  const aTens = randomInt(1, 9);
  const a = aTens * 10 + aUnits;
  const b = randomInt(1, aUnits); // b ≤ aUnits guarantees no borrow
  const answer = a - b;
  const prompt = `計算：${a} − ${b} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-subtraction',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} − ${b} = ${answer}，個位 ${aUnits} − ${b} = ${aUnits - b}，不需退位。`,
    illustration: verticalMathSvg(a, b, '-'),
  };
}

/** easy variant: different prompt style */
function generateEasyNoBorrowAlt(): Question {
  const aUnits = randomInt(1, 9);
  const aTens = randomInt(1, 9);
  const a = aTens * 10 + aUnits;
  const b = randomInt(1, aUnits);
  const answer = a - b;
  const prompt = `${a} − ${b} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-subtraction',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} − ${b} = ${answer}，個位相減不需退位。`,
    illustration: verticalMathSvg(a, b, '-'),
  };
}

// ─── MEDIUM: 2-digit − 2-digit, no borrow (aUnits ≥ bUnits AND aTens ≥ bTens) ───

/** medium: "計算：A − B = ?" where both are 2-digit, no borrow */
function generateMediumNoBorrow(): Question {
  // Ensure aUnits ≥ bUnits AND aTens > bTens (so result > 0)
  const aTens = randomInt(2, 9);
  const aUnits = randomInt(0, 9);
  const bTens = randomInt(1, aTens - 1);
  const maxBUnits = Math.min(aUnits, 9);
  const bUnits = randomInt(0, maxBUnits);
  const a = aTens * 10 + aUnits;
  const b = bTens * 10 + bUnits;
  const answer = a - b;
  const prompt = `計算：${a} − ${b} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-subtraction',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} − ${b} = ${answer}，個位 ${aUnits} − ${bUnits} = ${aUnits - bUnits}，十位 ${aTens} − ${bTens} = ${aTens - bTens}，不需退位。`,
    illustration: verticalMathSvg(a, b, '-'),
  };
}

/** medium variant: different prompt style */
function generateMediumNoBorrowAlt(): Question {
  const aTens = randomInt(2, 9);
  const aUnits = randomInt(0, 9);
  const bTens = randomInt(1, aTens - 1);
  const maxBUnits = Math.min(aUnits, 9);
  const bUnits = randomInt(0, maxBUnits);
  const a = aTens * 10 + aUnits;
  const b = bTens * 10 + bUnits;
  const answer = a - b;
  const prompt = `${a} − ${b} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-subtraction',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} − ${b} = ${answer}，十位和個位分別相減，不需退位。`,
    illustration: verticalMathSvg(a, b, '-'),
  };
}


// ─── HARD: 2-digit − 2-digit, WITH borrow (aUnits < bUnits) ───

/** hard: "計算：A − B = ?" where both are 2-digit, with borrow */
function generateHardWithBorrow(): Question {
  // Ensure aUnits < bUnits (borrow required) and result > 0
  // aTens must be ≥ bTens + 1 (since we borrow 1 from tens) OR aTens ≥ bTens when borrow still leaves tens ≥ 0
  const aUnits = randomInt(0, 7);
  const bUnits = randomInt(aUnits + 1, 9); // bUnits > aUnits guarantees borrow
  // aTens must be > bTens so that after borrowing (aTens - 1 - bTens ≥ 0)
  const bTens = randomInt(1, 7);
  const aTens = randomInt(bTens + 1, 9); // aTens > bTens ensures result > 0 after borrow
  const a = aTens * 10 + aUnits;
  const b = bTens * 10 + bUnits;
  const answer = a - b;
  const prompt = `計算：${a} − ${b} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-subtraction',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} − ${b} = ${answer}，個位 ${aUnits} − ${bUnits} 不夠減，需要向十位退位。`,
  };
}

/** hard variant: different prompt style */
function generateHardWithBorrowAlt(): Question {
  const aUnits = randomInt(0, 7);
  const bUnits = randomInt(aUnits + 1, 9);
  const bTens = randomInt(1, 7);
  const aTens = randomInt(bTens + 1, 9);
  const a = aTens * 10 + aUnits;
  const b = bTens * 10 + bUnits;
  const answer = a - b;
  const prompt = `${a} − ${b} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-subtraction',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} − ${b} = ${answer}，個位不夠減，從十位退 1 再計算。`,
  };
}

// ─── CHALLENGE: Multi-step or missing value ───

/** challenge: "A − ☐ = C, ☐ = ?" — missing subtrahend */
function generateChallengeMissingValue(): Question {
  const a = randomInt(30, 90);
  const b = randomInt(11, Math.min(a - 1, 50));
  const result = a - b;
  const prompt = `${a} − ☐ = ${result}，☐ = ?`;
  const options = buildNumericOptions(b);
  return {
    id: generateId(),
    topicId: 'two-digit-subtraction',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(b.toString()),
    explanation: `${a} − ☐ = ${result}，所以 ☐ = ${a} − ${result} = ${b}。`,
  };
}

/** challenge variant: "A − B − C = ?" — multi-step subtraction */
function generateChallengeMultiStep(): Question {
  const a = randomInt(50, 90);
  const b = randomInt(10, 30);
  const c = randomInt(1, 9);
  const answer = a - b - c;
  const prompt = `計算：${a} − ${b} − ${c} = ?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'two-digit-subtraction',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} − ${b} = ${a - b}，${a - b} − ${c} = ${answer}。`,
  };
}
