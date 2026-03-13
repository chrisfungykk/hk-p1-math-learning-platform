import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { numberBondSvg } from '../../utils/illustrations';

/**
 * 數的組合 (Number Composition / Number Bonds) — HK P1 Crescent syllabus
 * easy: Number bonds within 10 — "5 可以分成 2 和 ?"
 * medium: Bonds within 18 + missing-part — "? + 7 = 13"
 * hard: Multiple decompositions — "10 可以分成哪兩個數？"
 * challenge: Composition + arithmetic — multi-step reasoning
 */
export function generateNumberCompositionQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateBondWithin10, generateBondWithin10Variant],
    medium: [generateBondWithin18, generateMissingPart],
    hard: [generateMultipleDecompositions, generateMultipleDecompositionsVariant],
    challenge: [generateCompositionPlusArithmetic, generateCompositionPlusArithmeticVariant],
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
  for (const offset of [-1, 1, -2, 2, -3, 3]) {
    const val = correct + offset;
    const s = val.toString();
    if (val >= 0 && !seen.has(s) && distractors.length < 3) {
      seen.add(s);
      distractors.push(s);
    }
  }
  // Fallback for edge cases (e.g. correct = 0)
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

/** easy: "N 可以分成 A 和 ?" — number bonds within 10 */
function generateBondWithin10(): Question {
  const total = randomInt(3, 10);
  const partA = randomInt(1, total - 1);
  const partB = total - partA;
  const prompt = `${total} 可以分成 ${partA} 和 ?`;
  const options = buildNumericOptions(partB);
  return {
    id: generateId(),
    topicId: 'number-composition',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(partB.toString()),
    explanation: `${total} 可以分成 ${partA} 和 ${partB}，因為 ${partA} + ${partB} = ${total}。`,
    illustration: numberBondSvg(total, partA),
  };
}

/** easy variant: "A 和 ? 合起來是 N" */
function generateBondWithin10Variant(): Question {
  const total = randomInt(3, 10);
  const partA = randomInt(1, total - 1);
  const partB = total - partA;
  const prompt = `${partA} 和 ? 合起來是 ${total}`;
  const options = buildNumericOptions(partB);
  return {
    id: generateId(),
    topicId: 'number-composition',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(partB.toString()),
    explanation: `${partA} + ${partB} = ${total}，所以答案是 ${partB}。`,
    illustration: numberBondSvg(total, partA),
  };
}

/** medium: "? + B = Total" — bonds within 18, missing first part */
function generateBondWithin18(): Question {
  const total = randomInt(11, 18);
  const partB = randomInt(2, total - 2);
  const partA = total - partB;
  const prompt = `? + ${partB} = ${total}`;
  const options = buildNumericOptions(partA);
  return {
    id: generateId(),
    topicId: 'number-composition',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(partA.toString()),
    explanation: `${total} − ${partB} = ${partA}，所以 ? = ${partA}。`,
    illustration: numberBondSvg(total, partB),
  };
}

/** medium variant: "Total = A + ?" — bonds within 18, missing second part */
function generateMissingPart(): Question {
  const total = randomInt(11, 18);
  const partA = randomInt(2, total - 2);
  const partB = total - partA;
  const prompt = `${total} = ${partA} + ?`;
  const options = buildNumericOptions(partB);
  return {
    id: generateId(),
    topicId: 'number-composition',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(partB.toString()),
    explanation: `${total} − ${partA} = ${partB}，所以 ? = ${partB}。`,
    illustration: numberBondSvg(total, partA),
  };
}

/** hard: "N 可以分成哪兩個數？" — pick the correct decomposition */
function generateMultipleDecompositions(): Question {
  const total = randomInt(6, 15);
  const partA = randomInt(1, total - 1);
  const partB = total - partA;
  const correct = `${partA} 和 ${partB}`;
  // Build 3 wrong decompositions deterministically
  const distractors: string[] = [];
  const seen = new Set<string>([correct]);
  const offsets = [
    [partA + 1, partB + 1],
    [partA - 1, partB + 2],
    [partA + 2, partB - 1],
    [partA + 1, partB - 2],
  ];
  for (const [a, b] of offsets) {
    if (a > 0 && b > 0 && distractors.length < 3) {
      const s = `${a} 和 ${b}`;
      if (!seen.has(s)) {
        seen.add(s);
        distractors.push(s);
      }
    }
  }
  // Fallback distractors
  let fb = 1;
  while (distractors.length < 3) {
    const s = `${fb} 和 ${total + fb}`;
    if (!seen.has(s)) {
      seen.add(s);
      distractors.push(s);
    }
    fb++;
  }
  const options = shuffleArray([correct, ...distractors]).slice(0, 4);
  return {
    id: generateId(),
    topicId: 'number-composition',
    difficulty: 'hard',
    prompt: `${total} 可以分成哪兩個數？`,
    options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${partA} + ${partB} = ${total}，所以 ${total} 可以分成 ${partA} 和 ${partB}。`,
    illustration: numberBondSvg(total, partA),
  };
}

/** hard variant: "以下哪個不是 N 的組合？" — pick the wrong decomposition */
function generateMultipleDecompositionsVariant(): Question {
  const total = randomInt(6, 15);
  // Build 3 correct decompositions
  const correctDecomps: string[] = [];
  const usedPairs = new Set<string>();
  for (let a = 1; a < total && correctDecomps.length < 3; a++) {
    const b = total - a;
    const key = `${Math.min(a, b)},${Math.max(a, b)}`;
    if (!usedPairs.has(key)) {
      usedPairs.add(key);
      correctDecomps.push(`${a} 和 ${b}`);
    }
  }
  // Build 1 wrong decomposition — ensure it does NOT sum to total
  const wrongA = randomInt(1, total - 1);
  const offset = randomInt(1, 3);
  // Adding offset to the complement guarantees the pair sums to total + offset, not total
  const wrongB = (total - wrongA) + offset;
  const wrong = `${wrongA} 和 ${wrongB}`;
  const options = shuffleArray([...correctDecomps.slice(0, 3), wrong]).slice(0, 4);
  return {
    id: generateId(),
    topicId: 'number-composition',
    difficulty: 'hard',
    prompt: `以下哪個不是 ${total} 的組合？`,
    options,
    correctAnswerIndex: options.indexOf(wrong),
    explanation: `${wrongA} + ${wrongB} = ${wrongA + wrongB}，不等於 ${total}，所以「${wrong}」不是 ${total} 的組合。`,
    illustration: numberBondSvg(total, correctDecomps.length > 0 ? parseInt(correctDecomps[0]) : 1),
  };
}

/** challenge: "N 可以分成 A 和 ?，再加 B 等於多少?" — composition + arithmetic */
function generateCompositionPlusArithmetic(): Question {
  const total = randomInt(5, 10);
  const partA = randomInt(1, total - 1);
  const partB = total - partA;
  const addend = randomInt(2, 6);
  const answer = partB + addend;
  const prompt = `${total} 可以分成 ${partA} 和 ?，再加 ${addend} 等於多少?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'number-composition',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${total} 分成 ${partA} 和 ${partB}，${partB} + ${addend} = ${answer}。`,
    illustration: numberBondSvg(total, partA),
  };
}

/** challenge variant: "A + B = N，N 可以分成 C 和 ?，? 是多少?" — arithmetic then decomposition */
function generateCompositionPlusArithmeticVariant(): Question {
  const a = randomInt(3, 9);
  const b = randomInt(2, 8);
  const total = a + b;
  const partC = randomInt(1, total - 1);
  const answer = total - partC;
  const prompt = `${a} + ${b} = ?，? 可以分成 ${partC} 和幾?`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(),
    topicId: 'number-composition',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `${a} + ${b} = ${total}，${total} 分成 ${partC} 和 ${answer}。`,
    illustration: numberBondSvg(total, partC),
  };
}
