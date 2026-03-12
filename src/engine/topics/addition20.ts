import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

/**
 * 20以內加法 (Addition within 20) — HK P1 1N4 standard
 * Includes carrying (進位), column form (直式), 湊十法, and relationship with subtraction
 * Easy: simple a+b (sum ≤ 18), word problems
 * Medium: missing addend, crossing 10 with 湊十法, column form
 * Hard: carrying in column form, multi-step, comparison, mixed operations
 */
export function generateAddition20Questions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateSimple, generateWordEasy, generatePictureAdd],
    medium: [generateMissingAddend, generateCrossTen, generateColumnForm, generateWordMedium],
    hard: [generateCarrying, generateThreeNumbers, generateComparison, generateWordHard, generateRelationship],
    challenge: [generateDoubleEquation, generateChainFour, generateTrickyWordProblem, generateBalanceProblem, generateSplitAndAdd, generateCompareSum],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

function generateSimple(): Question {
  const a = randomInt(2, 9);
  const b = randomInt(2, Math.min(9, 18 - a));
  const ans = a + b;
  return makeQ('easy', `${a} + ${b} = ?`, ans, `${a} + ${b} = ${ans}`);
}

function generatePictureAdd(): Question {
  const items = ['🍎', '⭐', '🌸', '🐟', '✏️'];
  const emoji = items[randomInt(0, items.length - 1)];
  const a = randomInt(5, 10);
  const b = randomInt(3, Math.min(8, 18 - a));
  const ans = a + b;
  const prompt = `數一數，一共有幾個？\n${emoji.repeat(a)}  和  ${emoji.repeat(b)}`;
  return makeQ('easy', prompt, ans, `${a} + ${b} = ${ans}`);
}

function generateWordEasy(): Question {
  const scenarios = [
    () => { const a = randomInt(5, 10); const b = randomInt(3, Math.min(8, 18 - a)); return { prompt: `桌上有 ${a} 本書，再放 ${b} 本上去。桌上現在有幾本書？`, ans: a + b, exp: `${a} + ${b} = ${a + b}` }; },
    () => { const a = randomInt(4, 9); const b = randomInt(3, Math.min(9, 18 - a)); return { prompt: `籃子裡有 ${a} 個橙，再放入 ${b} 個。籃子裡現在有幾個橙？`, ans: a + b, exp: `${a} + ${b} = ${a + b}` }; },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)]();
  return makeQ('easy', s.prompt, s.ans, s.exp);
}

function generateMissingAddend(): Question {
  const ans = randomInt(10, 18);
  const a = randomInt(2, ans - 2);
  const b = ans - a;
  return makeQ('medium', `${a} + ☐ = ${ans}，☐ = ?`, b, `${a} + ${b} = ${ans}，所以 ☐ = ${b}`);
}

function generateCrossTen(): Question {
  const a = randomInt(6, 9);
  const b = randomInt(10 - a + 1, Math.min(9, 18 - a));
  const ans = a + b;
  const complement = 10 - a;
  return makeQ('medium', `用湊十法計算：${a} + ${b} = ?\n提示：${a} + ${complement} = 10`, ans,
    `湊十法：${a} + ${complement} = 10，10 + ${b - complement} = ${ans}`);
}

function generateColumnForm(): Question {
  const a = randomInt(5, 9);
  const b = randomInt(2, Math.min(9, 18 - a));
  const ans = a + b;
  const prompt = `用直式計算：\n  ${a}\n+ ${b}\n——\n  ?`;
  return makeQ('medium', prompt, ans, `直式計算：${a} + ${b} = ${ans}`);
}

function generateWordMedium(): Question {
  const a = randomInt(5, 12);
  const b = randomInt(3, Math.min(8, 18 - a));
  const ans = a + b;
  return makeQ('medium', `小明有 ${a} 張貼紙，生日時收到 ${b} 張。他現在一共有幾張貼紙？`, ans,
    `${a} + ${b} = ${ans}`);
}

function generateCarrying(): Question {
  // Two-digit + one-digit with carrying (進位)
  const a = randomInt(6, 9);
  const b = randomInt(10 - a + 1, Math.min(9, 18 - a));
  const ans = a + b;
  const prompt = `用直式計算（注意進位）：\n  ${a}\n+ ${b}\n——\n  ?`;
  return makeQ('hard', prompt, ans, `${a} + ${b} = ${ans}（個位滿十要進位）`);
}

function generateThreeNumbers(): Question {
  const a = randomInt(2, 7);
  const b = randomInt(2, 6);
  const c = randomInt(2, Math.min(6, 18 - a - b));
  const ans = a + b + c;
  return makeQ('hard', `${a} + ${b} + ${c} = ?`, ans,
    `先算 ${a} + ${b} = ${a + b}，再加 ${c} 得 ${ans}`);
}

function generateComparison(): Question {
  const a = randomInt(5, 12);
  const more = randomInt(3, Math.min(8, 18 - a));
  const b = a + more;
  return makeQ('hard', `小明有 ${a} 顆波子，小華比小明多 ${more} 顆。小華有幾顆波子？`, b,
    `${a} + ${more} = ${b}，小華有 ${b} 顆波子`);
}

function generateWordHard(): Question {
  const morning = randomInt(4, 9);
  const afternoon = randomInt(4, Math.min(9, 18 - morning));
  const ans = morning + afternoon;
  return makeQ('hard', `圖書館早上借出 ${morning} 本書，下午又借出 ${afternoon} 本書。今天一共借出幾本書？`, ans,
    `${morning} + ${afternoon} = ${ans}`);
}

function generateRelationship(): Question {
  const a = randomInt(3, 9);
  const b = randomInt(3, Math.min(9, 18 - a));
  const sum = a + b;
  return makeQ('hard', `如果 ${sum} - ${b} = ${a}，那麼 ${a} + ${b} = ?`, sum,
    `加法和減法是相反的運算。${a} + ${b} = ${sum}`);
}

function generateDoubleEquation(): Question {
  const a = randomInt(3, 8);
  const b = randomInt(3, Math.min(8, 18 - a));
  const sum = a + b;
  const c = randomInt(1, sum - 1);
  const ans = sum - c;
  const prompt = `如果 ${a} + ${b} = ${c} + ☐，那麼 ☐ = ?`;
  return makeQ('challenge', prompt, ans, `${a} + ${b} = ${sum}，所以 ${c} + ☐ = ${sum}，☐ = ${ans}`);
}

function generateChainFour(): Question {
  const a = randomInt(2, 5);
  const b = randomInt(2, 4);
  const c = randomInt(1, 3);
  const d = randomInt(1, Math.min(3, 18 - a - b - c));
  const ans = a + b + c + d;
  return makeQ('challenge', `${a} + ${b} + ${c} + ${d} = ?`, ans, `${a} + ${b} + ${c} + ${d} = ${ans}`);
}

function generateTrickyWordProblem(): Question {
  const gave = randomInt(3, 7);
  const left = randomInt(3, Math.min(8, 18 - gave));
  const original = gave + left;
  const prompt = `小明給了弟弟 ${gave} 顆糖後，自己還剩 ${left} 顆。小明原來有幾顆糖？`;
  return makeQ('challenge', prompt, original, `給了 ${gave} 顆，剩 ${left} 顆，原來有 ${gave} + ${left} = ${original} 顆`);
}

function generateBalanceProblem(): Question {
  const a = randomInt(5, 9);
  const b = randomInt(5, Math.min(9, 18 - a));
  const sum = a + b;
  const prompt = `☐ + ☐ = ${sum}，兩個 ☐ 是同一個數。☐ = ?`;
  if (sum % 2 === 0) {
    const ans = sum / 2;
    return makeQ('challenge', prompt, ans, `☐ + ☐ = ${sum}，所以 ☐ = ${sum} ÷ 2 = ${ans}`);
  }
  // If odd, use a different question
  const x = randomInt(3, 8);
  const y = randomInt(3, Math.min(8, 18 - x));
  const s = x + y;
  const prompt2 = `${x} + ☐ = ☐ + ${x}，☐ 可以是任何數。如果 ☐ = ${y}，那麼 ${x} + ${y} = ?`;
  return makeQ('challenge', prompt2, s, `${x} + ${y} = ${s}`);
}

function generateSplitAndAdd(): Question {
  const num = randomInt(11, 18);
  const tens = Math.floor(num / 10);
  const units = num % 10;
  const b = randomInt(1, Math.min(9, 20 - num));
  const ans = num + b;
  const prompt = `用拆數法計算 ${num} + ${b} = ?\n提示：${num} = ${tens * 10} + ${units}`;
  return makeQ('challenge', prompt, ans,
    `${num} + ${b} = ${tens * 10} + ${units} + ${b} = ${tens * 10} + ${units + b} = ${ans}`);
}

function generateCompareSum(): Question {
  const a1 = randomInt(3, 9);
  const b1 = randomInt(3, Math.min(9, 18 - a1));
  const a2 = randomInt(3, 9);
  const b2 = randomInt(3, Math.min(9, 18 - a2));
  const sum1 = a1 + b1;
  const sum2 = a2 + b2;
  const diff = Math.abs(sum1 - sum2);
  const prompt = `${a1} + ${b1} 和 ${a2} + ${b2}，哪個答案比較大？大多少？`;
  const correct = `${diff}`;
  const bigger = sum1 >= sum2 ? `${a1}+${b1}` : `${a2}+${b2}`;
  const pool = [`${diff}`, `${diff + 1}`, `${diff + 2}`, `${Math.max(0, diff - 1)}`];
  const options = shuffleArray(pool);
  return {
    id: generateId(), topicId: 'addition-20', difficulty: 'challenge', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${a1}+${b1}=${sum1}，${a2}+${b2}=${sum2}。${bigger}較大，相差 ${diff}。`,
    graphicType: 'counting-objects',
  };
}

function makeQ(difficulty: DifficultyLevel, prompt: string, correct: number, explanation: string): Question {
  const distractors = new Set<number>();
  distractors.add(correct);
  if (correct + 1 <= 20) distractors.add(correct + 1);
  if (correct - 1 >= 0) distractors.add(correct - 1);
  if (correct + 2 <= 20) distractors.add(correct + 2);
  else if (correct - 2 >= 0) distractors.add(correct - 2);
  const fillers = [2, 5, 8, 10, 12, 15, 18];
  for (const f of fillers) { if (distractors.size >= 4) break; if (f !== correct) distractors.add(f); }
  const options = shuffleArray(Array.from(distractors).slice(0, 4).map(String));
  return {
    id: generateId(), topicId: 'addition-20', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct.toString()), explanation, graphicType: 'counting-objects',
  };
}
