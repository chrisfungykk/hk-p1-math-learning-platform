import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { ordinalRowSvg } from '../../utils/illustrations';

const EMOJI_POOL = ['🍎', '🍊', '🍋', '🍇', '🍓', '🌸', '⭐', '🐱', '🐶', '🐰'];

/**
 * 序數 (Ordinal Numbers) — HK P1 Crescent syllabus
 * easy: "第N個是什麼?" from left (row of 5)
 * medium: From left AND right (row of 6–7)
 * hard: Range counting "從第A到第B共幾個?"
 * challenge: Two-directional reasoning
 */
export function generateOrdinalNumbersQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateFromLeft, generateFromLeftVariant],
    medium: [generateFromRight, generateFromLeftOrRight],
    hard: [generateRangeCounting, generateRangeCountingVariant],
    challenge: [generateTwoDirectional, generateTwoDirectionalVariant],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

/** Pick N distinct emojis from the pool */
function pickEmojis(n: number): string[] {
  return shuffleArray(EMOJI_POOL).slice(0, n);
}

/**
 * Build 4 unique options from a correct answer and the items array.
 * Uses deterministic fallback to avoid while-loops.
 */
function buildOptions(correct: string, items: string[]): string[] {
  const seen = new Set<string>([correct]);
  const distractors: string[] = [];
  // First try items that aren't the correct answer
  for (const item of items) {
    if (!seen.has(item) && distractors.length < 3) {
      seen.add(item);
      distractors.push(item);
    }
  }
  // Fallback with extra emojis if needed
  const fallbacks = ['🔵', '🟢', '🔴', '🟡', '🟣'];
  let fi = 0;
  while (distractors.length < 3 && fi < fallbacks.length) {
    if (!seen.has(fallbacks[fi])) {
      seen.add(fallbacks[fi]);
      distractors.push(fallbacks[fi]);
    }
    fi++;
  }
  const options = shuffleArray([correct, ...distractors]);
  return options.slice(0, 4);
}

/**
 * Build 4 unique numeric options
 */
function buildNumericOptions(correct: number): string[] {
  const correctStr = correct.toString();
  const seen = new Set<string>([correctStr]);
  const distractors: string[] = [];
  // Deterministic offsets: -2, -1, +1, +2
  for (const offset of [-1, 1, -2, 2]) {
    const val = correct + offset;
    const s = val.toString();
    if (val > 0 && !seen.has(s) && distractors.length < 3) {
      seen.add(s);
      distractors.push(s);
    }
  }
  // Fallback
  let fallback = correct + 3;
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

/** easy: Row of 5 items, ask "從左邊數，第N個是什麼？" */
function generateFromLeft(): Question {
  const items = pickEmojis(5);
  const pos = randomInt(1, 5);
  const correct = items[pos - 1];
  const prompt = `從左邊數，第${pos}個是什麼？`;
  const options = buildOptions(correct, items);
  return {
    id: generateId(),
    topicId: 'ordinal-numbers',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `從左邊數起，第${pos}個是 ${correct}。`,
    illustration: ordinalRowSvg(items, pos - 1),
  };
}

/** easy variant: Ask which position a given item is at */
function generateFromLeftVariant(): Question {
  const items = pickEmojis(5);
  const pos = randomInt(1, 5);
  const target = items[pos - 1];
  const correct = `第${pos}個`;
  const prompt = `從左邊數，${target} 排在第幾個？`;
  const distractors = [1, 2, 3, 4, 5]
    .filter(p => p !== pos)
    .slice(0, 3)
    .map(p => `第${p}個`);
  const options = shuffleArray([correct, ...distractors]);
  return {
    id: generateId(),
    topicId: 'ordinal-numbers',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${target} 從左邊數起排在第${pos}個。`,
    illustration: ordinalRowSvg(items, pos - 1),
  };
}

/** medium: Row of 6–7 items, ask from the RIGHT */
function generateFromRight(): Question {
  const len = randomInt(6, 7);
  const items = pickEmojis(len);
  const posFromRight = randomInt(1, len);
  const actualIndex = len - posFromRight;
  const correct = items[actualIndex];
  const prompt = `從右邊數，第${posFromRight}個是什麼？`;
  const options = buildOptions(correct, items);
  return {
    id: generateId(),
    topicId: 'ordinal-numbers',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `從右邊數起，第${posFromRight}個是 ${correct}。`,
    illustration: ordinalRowSvg(items, actualIndex),
  };
}

/** medium variant: Randomly ask from left or right */
function generateFromLeftOrRight(): Question {
  const len = randomInt(6, 7);
  const items = pickEmojis(len);
  const fromRight = randomInt(0, 1) === 1;
  const pos = randomInt(1, len);
  const actualIndex = fromRight ? len - pos : pos - 1;
  const correct = items[actualIndex];
  const direction = fromRight ? '右邊' : '左邊';
  const prompt = `從${direction}數，第${pos}個是什麼？`;
  const options = buildOptions(correct, items);
  return {
    id: generateId(),
    topicId: 'ordinal-numbers',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `從${direction}數起，第${pos}個是 ${correct}。`,
    illustration: ordinalRowSvg(items, actualIndex),
  };
}

/** hard: "從左邊數第A個到第B個，共有幾個？" — answer is B-A+1 */
function generateRangeCounting(): Question {
  const len = randomInt(7, 8);
  const items = pickEmojis(len);
  const a = randomInt(1, len - 2);
  const b = randomInt(a + 1, Math.min(a + 4, len));
  const correct = b - a + 1;
  const prompt = `一排有${len}個物品，從左邊數第${a}個到第${b}個，共有幾個？`;
  const options = buildNumericOptions(correct);
  return {
    id: generateId(),
    topicId: 'ordinal-numbers',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct.toString()),
    explanation: `從第${a}個到第${b}個，共有 ${b} − ${a} + 1 = ${correct} 個。`,
    illustration: ordinalRowSvg(items),
  };
}

/** hard variant: Ask how many items are BEFORE or AFTER a position */
function generateRangeCountingVariant(): Question {
  const len = randomInt(7, 8);
  const items = pickEmojis(len);
  const askBefore = randomInt(0, 1) === 0;
  const pos = askBefore ? randomInt(2, len) : randomInt(1, len - 1);
  const correct = askBefore ? pos - 1 : len - pos;
  const direction = askBefore ? '前面' : '後面';
  const prompt = `一排有${len}個物品，從左邊數第${pos}個的${direction}有幾個？`;
  const options = buildNumericOptions(correct);
  return {
    id: generateId(),
    topicId: 'ordinal-numbers',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct.toString()),
    explanation: `第${pos}個的${direction}有 ${correct} 個物品。`,
    illustration: ordinalRowSvg(items, pos - 1),
  };
}

/** challenge: "小明從左邊數是第A，從右邊數是第B，一共有幾人？" — answer is A+B-1 */
function generateTwoDirectional(): Question {
  const fromLeft = randomInt(2, 6);
  const fromRight = randomInt(2, 6);
  const total = fromLeft + fromRight - 1;
  const names = ['小明', '小紅', '小華', '小美', '小強'];
  const name = names[randomInt(0, names.length - 1)];
  const prompt = `${name}排隊，從左邊數是第${fromLeft}個，從右邊數是第${fromRight}個，這排一共有幾人？`;
  const correct = total;
  const options = buildNumericOptions(correct);
  return {
    id: generateId(),
    topicId: 'ordinal-numbers',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct.toString()),
    explanation: `從左邊數第${fromLeft} + 從右邊數第${fromRight} − 1（${name}自己算了兩次）= ${total} 人。`,
  };
}

/** challenge variant: Given total and one direction, find the other */
function generateTwoDirectionalVariant(): Question {
  const fromLeft = randomInt(2, 6);
  const fromRight = randomInt(2, 6);
  const total = fromLeft + fromRight - 1;
  const names = ['小明', '小紅', '小華', '小美', '小強'];
  const name = names[randomInt(0, names.length - 1)];
  const askFromRight = randomInt(0, 1) === 0;
  let prompt: string;
  let correct: number;
  let explanation: string;
  if (askFromRight) {
    prompt = `一排有${total}人，${name}從左邊數是第${fromLeft}個，從右邊數是第幾個？`;
    correct = fromRight;
    explanation = `從右邊數是第 ${total} − ${fromLeft} + 1 = ${fromRight} 個。`;
  } else {
    prompt = `一排有${total}人，${name}從右邊數是第${fromRight}個，從左邊數是第幾個？`;
    correct = fromLeft;
    explanation = `從左邊數是第 ${total} − ${fromRight} + 1 = ${fromLeft} 個。`;
  }
  const options = buildNumericOptions(correct);
  return {
    id: generateId(),
    topicId: 'ordinal-numbers',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct.toString()),
    explanation,
  };
}
