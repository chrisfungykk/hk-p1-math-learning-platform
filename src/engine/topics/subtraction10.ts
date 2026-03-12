import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { tenFrameSvg } from '../../utils/illustrations';

/**
 * 基本減法 (Subtraction within 10) — HK P1 1N2 standard
 * Easy: simple a-b, word problems
 * Medium: missing subtrahend, "how many more", 破十法
 * Hard: column form (直式), multi-step, relationship between +/-, comparison
 */
export function generateSubtraction10Questions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateSimple, generateWordEasy, generatePictureSubtract],
    medium: [generateMissing, generateHowManyMore, generateWordMedium, generateFromTen],
    hard: [generateColumnForm, generateMultiStep, generateRelationship, generateComparison],
    challenge: [generateChainSubtract, generateTrickyComparison, generateReverseProblem, generateBalanceEquation, generateSubtractUnknown, generateWordProblemChallenge],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

function generateSimple(): Question {
  const a = randomInt(4, 10);
  const b = randomInt(1, a);
  const ans = a - b;
  return makeQ('easy', `${a} - ${b} = ?`, ans, `${a} - ${b} = ${ans}`);
}

function generatePictureSubtract(): Question {
  const items = ['🍎', '⭐', '🌸', '🐟'];
  const emoji = items[randomInt(0, items.length - 1)];
  const a = randomInt(5, 10);
  const b = randomInt(1, a - 1);
  const ans = a - b;
  const prompt = `有 ${emoji.repeat(a)}，拿走 ${b} 個，還剩幾個？`;
  const q = makeQ('easy', prompt, ans, `${a} - ${b} = ${ans}`);
  q.illustration = tenFrameSvg(a);
  return q;
}

function generateWordEasy(): Question {
  const scenarios = [
    () => { const a = randomInt(5, 10); const b = randomInt(1, a - 1); return { prompt: `小明有 ${a} 個蘋果，吃了 ${b} 個。還剩幾個蘋果？`, ans: a - b, exp: `${a} - ${b} = ${a - b}` }; },
    () => { const a = randomInt(6, 10); const b = randomInt(1, a - 1); return { prompt: `池塘裡有 ${a} 條魚，游走了 ${b} 條。還剩幾條魚？`, ans: a - b, exp: `${a} - ${b} = ${a - b}` }; },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)]();
  return makeQ('easy', s.prompt, s.ans, s.exp);
}

function generateMissing(): Question {
  const a = randomInt(6, 10);
  const ans = randomInt(0, a - 1);
  const b = a - ans;
  return makeQ('medium', `${a} - ☐ = ${ans}，☐ = ?`, b, `${a} - ${b} = ${ans}，所以 ☐ = ${b}`);
}

function generateFromTen(): Question {
  const b = randomInt(1, 9);
  const ans = 10 - b;
  const q = makeQ('medium', `10 - ${b} = ?`, ans, `10 - ${b} = ${ans}`);
  q.illustration = tenFrameSvg(10);
  return q;
}

function generateHowManyMore(): Question {
  const a = randomInt(5, 10);
  const b = randomInt(1, a - 1);
  const ans = a - b;
  return makeQ('medium', `小明有 ${a} 顆糖，小華有 ${b} 顆糖。小明比小華多幾顆？`, ans,
    `${a} - ${b} = ${ans}，小明比小華多 ${ans} 顆糖`);
}

function generateWordMedium(): Question {
  const a = randomInt(5, 10);
  const b = randomInt(2, a - 1);
  const ans = a - b;
  return makeQ('medium', `車上有 ${a} 個人，到站後下了 ${b} 個人。車上還有幾個人？`, ans,
    `${a} - ${b} = ${ans}`);
}

function generateColumnForm(): Question {
  const a = randomInt(5, 10);
  const b = randomInt(1, a);
  const ans = a - b;
  const prompt = `用直式計算：\n  ${a}\n- ${b}\n——\n  ?`;
  return makeQ('hard', prompt, ans, `直式計算：${a} - ${b} = ${ans}`);
}

function generateMultiStep(): Question {
  const a = randomInt(8, 10);
  const b = randomInt(2, 3);
  const c = randomInt(1, Math.min(3, a - b));
  const ans = a - b - c;
  return makeQ('hard', `小明有 ${a} 塊餅乾，早上吃了 ${b} 塊，下午又吃了 ${c} 塊。還剩幾塊？`, ans,
    `${a} - ${b} - ${c} = ${ans}`);
}

function generateRelationship(): Question {
  const a = randomInt(2, 7);
  const b = randomInt(1, 10 - a);
  const sum = a + b;
  return makeQ('hard', `如果 ${a} + ${b} = ${sum}，那麼 ${sum} - ${a} = ?`, b,
    `加法和減法是相反的運算。${sum} - ${a} = ${b}`);
}

function generateComparison(): Question {
  const a = randomInt(5, 10);
  const fewer = randomInt(1, 4);
  const b = a - fewer;
  return makeQ('hard', `哥哥有 ${a} 顆糖，弟弟比哥哥少 ${fewer} 顆。弟弟有幾顆糖？`, b,
    `${a} - ${fewer} = ${b}，弟弟有 ${b} 顆糖`);
}

function generateChainSubtract(): Question {
  const a = randomInt(9, 10);
  const b = randomInt(1, 3);
  const c = randomInt(1, Math.min(2, a - b - 1));
  const d = randomInt(1, Math.min(2, a - b - c));
  const ans = a - b - c - d;
  return makeQ('challenge', `${a} - ${b} - ${c} - ${d} = ?`, ans, `${a} - ${b} - ${c} - ${d} = ${ans}`);
}

function generateTrickyComparison(): Question {
  const ming = randomInt(4, 8);
  const hua = randomInt(4, 8);
  const diff = Math.abs(ming - hua);
  const who = ming > hua ? '小明' : ming < hua ? '小華' : '一樣多';
  const prompt = `小明有 ${ming} 顆糖，小華有 ${hua} 顆糖。誰的糖比較多？多幾顆？`;
  return makeQ('challenge', prompt, diff,
    ming === hua ? '一樣多，相差 0 顆' : `${who}多 ${diff} 顆`);
}

function generateReverseProblem(): Question {
  const ans = randomInt(4, 9);
  const taken = randomInt(2, 4);
  const original = ans + taken;
  const prompt = `小明吃了 ${taken} 個蘋果後，還剩 ${ans} 個。他原來有幾個蘋果？`;
  return makeQ('challenge', prompt, original, `還剩 ${ans} 個，吃了 ${taken} 個，原來有 ${ans} + ${taken} = ${original} 個`);
}

function generateBalanceEquation(): Question {
  const a = randomInt(2, 5);
  const b = randomInt(2, 5);
  const sum = a + b;
  const c = randomInt(1, sum - 1);
  const ans = sum - c;
  const prompt = `${a} + ${b} = ${c} + ☐，☐ = ?`;
  return makeQ('challenge', prompt, ans, `${a} + ${b} = ${sum}，所以 ${c} + ☐ = ${sum}，☐ = ${ans}`);
}

function generateSubtractUnknown(): Question {
  const a = randomInt(6, 10);
  const b = randomInt(1, 3);
  const c = randomInt(1, Math.min(3, a - b));
  const ans = a - b - c;
  const prompt = `☐ = ${a} - ${b} - ${c}，☐ = ?`;
  return makeQ('challenge', prompt, ans, `${a} - ${b} = ${a - b}，${a - b} - ${c} = ${ans}`);
}

function generateWordProblemChallenge(): Question {
  const total = randomInt(8, 10);
  const gave1 = randomInt(1, 3);
  const gave2 = randomInt(1, Math.min(3, total - gave1 - 1));
  const left = total - gave1 - gave2;
  const prompt = `小明有 ${total} 顆糖。他給了小華 ${gave1} 顆，又給了小美 ${gave2} 顆。他還剩幾顆？如果小美把糖還給小明，小明會有幾顆？`;
  const ans = left + gave2;
  return makeQ('challenge', prompt, ans,
    `小明剩 ${left} 顆。小美還回 ${gave2} 顆後，小明有 ${left} + ${gave2} = ${ans} 顆`);
}

function makeQ(difficulty: DifficultyLevel, prompt: string, correct: number, explanation: string): Question {
  const distractors = new Set<number>();
  distractors.add(correct);
  if (correct + 1 <= 10) distractors.add(correct + 1);
  if (correct - 1 >= 0) distractors.add(correct - 1);
  if (correct + 2 <= 10) distractors.add(correct + 2);
  const fillers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  for (const f of fillers) { if (distractors.size >= 4) break; if (f !== correct) distractors.add(f); }
  const options = shuffleArray(Array.from(distractors).slice(0, 4).map(String));
  return {
    id: generateId(), topicId: 'subtraction-10', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct.toString()), explanation, graphicType: 'counting-objects',
  };
}
