import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { tenFrameSvg } from '../../utils/illustrations';

/**
 * 基本加法 (Addition within 10) — HK P1 1N2 standard
 * Easy: a+b within 10, simple word problems
 * Medium: missing addend (a + ? = c), three-number addition, 湊十法
 * Hard: column form (直式), multi-step word problems, comparison, relationship between +/-
 */
export function generateAddition10Questions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateSimple, generateWordProblemEasy, generatePictureCount, generateAdditionWithZero],
    medium: [generateMissingAddend, generateThreeNumbers, generateWordProblemMedium, generateMakeTen],
    hard: [generateColumnForm, generateComparisonProblem, generateMultiStep, generateRelationship],
    challenge: [generateMagicTriangle, generateChainAddition, generateReverseWordProblem, generateTrickyMissing, generateDoubleUnknown, generateConsecutiveSum],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

function generateSimple(): Question {
  const a = randomInt(2, 9);
  const b = randomInt(1, 10 - a);
  const ans = a + b;
  return makeQuestion('easy', `${a} + ${b} = ?`, ans, 0, 10,
    `${a} + ${b} = ${ans}`);
}

function generatePictureCount(): Question {
  const items = ['🍎', '⭐', '🌸', '🐟', '✏️'];
  const emoji = items[randomInt(0, items.length - 1)];
  const a = randomInt(2, 6);
  const b = randomInt(2, 10 - a);
  const ans = a + b;
  const prompt = `數一數，一共有幾個？\n${emoji.repeat(a)}  和  ${emoji.repeat(b)}`;
  const q = makeQuestion('easy', prompt, ans, 0, 10, `${a} + ${b} = ${ans}`);
  q.illustration = tenFrameSvg(a, 10);
  return q;
}

function generateWordProblemEasy(): Question {
  const scenarios = [
    () => { const a = randomInt(2, 6); const b = randomInt(2, 10 - a); return { prompt: `小明有 ${a} 個蘋果，媽媽再給他 ${b} 個。小明現在一共有幾個蘋果？`, ans: a + b, exp: `${a} + ${b} = ${a + b}` }; },
    () => { const a = randomInt(2, 5); const b = randomInt(2, 10 - a); return { prompt: `樹上有 ${a} 隻小鳥，又飛來了 ${b} 隻。現在樹上一共有幾隻小鳥？`, ans: a + b, exp: `${a} + ${b} = ${a + b}` }; },
    () => { const a = randomInt(3, 6); const b = randomInt(2, 10 - a); return { prompt: `盒子裡有 ${a} 顆糖果，再放入 ${b} 顆。盒子裡現在一共有幾顆糖果？`, ans: a + b, exp: `${a} + ${b} = ${a + b}` }; },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)]();
  return makeQuestion('easy', s.prompt, s.ans, 0, 10, s.exp);
}

function generateMissingAddend(): Question {
  const ans = randomInt(6, 10);
  const a = randomInt(1, ans - 1);
  const b = ans - a;
  const prompt = `${a} + ☐ = ${ans}，☐ = ?`;
  return makeQuestion('medium', prompt, b, 0, 10, `${a} + ${b} = ${ans}，所以 ☐ = ${b}`);
}

function generateMakeTen(): Question {
  const a = randomInt(1, 9);
  const b = 10 - a;
  const prompt = `湊十法：${a} + ☐ = 10，☐ = ?`;
  const q = makeQuestion('medium', prompt, b, 0, 10, `${a} + ${b} = 10，所以 ☐ = ${b}`);
  q.illustration = tenFrameSvg(a);
  return q;
}

function generateThreeNumbers(): Question {
  const a = randomInt(2, 4);
  const b = randomInt(2, 4);
  const c = randomInt(1, Math.min(4, 10 - a - b));
  const ans = a + b + c;
  return makeQuestion('medium', `${a} + ${b} + ${c} = ?`, ans, 0, 10,
    `先算 ${a} + ${b} = ${a + b}，再加 ${c} 得 ${ans}`);
}

function generateWordProblemMedium(): Question {
  const scenarios = [
    () => { const a = randomInt(2, 5); const b = randomInt(2, 10 - a); return { prompt: `花園裡有 ${a} 朵紅花和 ${b} 朵黃花。花園裡一共有幾朵花？`, ans: a + b, exp: `${a} + ${b} = ${a + b}` }; },
    () => { const a = randomInt(3, 6); const b = randomInt(2, 10 - a); return { prompt: `停車場有 ${a} 輛車，又駛入了 ${b} 輛。停車場現在一共有幾輛車？`, ans: a + b, exp: `${a} + ${b} = ${a + b}` }; },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)]();
  return makeQuestion('medium', s.prompt, s.ans, 0, 10, s.exp);
}

function generateColumnForm(): Question {
  const a = randomInt(2, 7);
  const b = randomInt(1, 10 - a);
  const ans = a + b;
  const prompt = `用直式計算：\n  ${a}\n+ ${b}\n——\n  ?`;
  return makeQuestion('hard', prompt, ans, 0, 10, `直式計算：${a} + ${b} = ${ans}`);
}

function generateComparisonProblem(): Question {
  const a = randomInt(2, 6);
  const more = randomInt(1, 10 - a);
  const b = a + more;
  const prompt = `小明有 ${a} 顆糖，小華比小明多 ${more} 顆。小華有幾顆糖？`;
  return makeQuestion('hard', prompt, b, 0, 10, `${a} + ${more} = ${b}，小華有 ${b} 顆糖`);
}

function generateMultiStep(): Question {
  const a = randomInt(2, 4);
  const b = randomInt(2, 3);
  const c = randomInt(1, Math.min(3, 10 - a - b));
  const ans = a + b + c;
  const prompt = `小明早上撿了 ${a} 片樹葉，中午撿了 ${b} 片，下午又撿了 ${c} 片。他一共撿了幾片樹葉？`;
  return makeQuestion('hard', prompt, ans, 0, 10, `${a} + ${b} + ${c} = ${ans}`);
}

function generateRelationship(): Question {
  const a = randomInt(2, 7);
  const b = randomInt(1, 10 - a);
  const ans = a + b;
  const prompt = `如果 ${ans} - ${a} = ${b}，那麼 ${a} + ${b} = ?`;
  return makeQuestion('hard', prompt, ans, 0, 10,
    `加法和減法是相反的運算。${a} + ${b} = ${ans}`);
}

function generateMagicTriangle(): Question {
  // Three numbers on triangle sides that sum to same total
  const a = randomInt(2, 4);
  const b = randomInt(2, 4);
  const c = randomInt(1, Math.min(3, 10 - a - b));
  const total = a + b + c;
  const prompt = `三角形的三個角分別是 ${a}、${b} 和 ☐。三個數加起來等於 ${total}。☐ = ?`;
  return makeQuestion('challenge', prompt, c, 0, 10, `${a} + ${b} + ☐ = ${total}，所以 ☐ = ${total} - ${a} - ${b} = ${c}`);
}

function generateChainAddition(): Question {
  const a = randomInt(2, 3);
  const b = randomInt(2, 3);
  const c = randomInt(1, Math.min(2, 10 - a - b));
  const d = randomInt(1, Math.min(2, 10 - a - b - c));
  const ans = a + b + c + d;
  const prompt = `${a} + ${b} + ${c} + ${d} = ?`;
  return makeQuestion('challenge', prompt, ans, 0, 10, `${a} + ${b} + ${c} + ${d} = ${ans}`);
}

function generateReverseWordProblem(): Question {
  const total = randomInt(7, 10);
  const a = randomInt(2, total - 2);
  const b = total - a;
  const prompt = `小明和小華一共有 ${total} 顆糖。小明有 ${a} 顆。小華有幾顆？如果小華再給小明 1 顆，小明會有幾顆？`;
  const ans = a + 1;
  return makeQuestion('challenge', prompt, ans, 0, 10,
    `小華有 ${b} 顆。小華給小明 1 顆後，小明有 ${a} + 1 = ${ans} 顆`);
}

function generateTrickyMissing(): Question {
  const a = randomInt(1, 4);
  const b = randomInt(1, 4);
  const c = randomInt(1, Math.min(4, 10 - a - b));
  const sum = a + b;
  const prompt = `如果 ☐ + ${b} = ${sum}，而且 ${sum} + ${c} = ${sum + c}，那麼 ☐ + ${b} + ${c} = ?`;
  const ans = sum + c;
  return makeQuestion('challenge', prompt, ans, 0, 10, `☐ = ${a}，所以 ${a} + ${b} + ${c} = ${ans}`);
}

function generateDoubleUnknown(): Question {
  const total = randomInt(4, 10);
  const a = randomInt(1, total - 1);
  const b = total - a;
  const prompt = `☐ + △ = ${total}，☐ = ${a}。△ = ?`;
  return makeQuestion('challenge', prompt, b, 0, 10, `${a} + △ = ${total}，△ = ${total} - ${a} = ${b}`);
}

function generateConsecutiveSum(): Question {
  const start = randomInt(2, 4);
  const ans = start + (start + 1) + (start + 2);
  const prompt = `三個連續的數字是 ${start}、${start + 1}、${start + 2}。它們加起來等於多少？`;
  return makeQuestion('challenge', prompt, ans, 0, 10,
    `${start} + ${start + 1} + ${start + 2} = ${ans}`);
}

function generateAdditionWithZero(): Question {
  const n = randomInt(0, 10);
  const zeroFirst = randomInt(0, 1) === 0;
  const a = zeroFirst ? 0 : n;
  const b = zeroFirst ? n : 0;
  const prompt = `${a} + ${b} = ?`;
  return makeQuestion('easy', prompt, n, 0, 10,
    `${a} + ${b} = ${n}。任何數加 0 都等於它自己。`);
}

function makeQuestion(difficulty: DifficultyLevel, prompt: string, correct: number, min: number, max: number, explanation: string): Question {
  const distractors = new Set<number>();
  distractors.add(correct);
  distractors.add(correct + 1 <= max ? correct + 1 : correct - 1);
  if (correct - 1 >= min) distractors.add(correct - 1);
  distractors.add(correct + 2 <= max ? correct + 2 : correct - 2 >= min ? correct - 2 : randomInt(min, max));
  const fillers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  for (const f of fillers) { if (distractors.size >= 4) break; if (f !== correct) distractors.add(f); }
  const options = shuffleArray(Array.from(distractors).slice(0, 4).map(String));
  return {
    id: generateId(), topicId: 'addition-10', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct.toString()), explanation, graphicType: 'counting-objects',
  };
}
