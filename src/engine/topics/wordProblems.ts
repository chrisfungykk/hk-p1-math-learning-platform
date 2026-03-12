import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { countDotsSvg } from '../../utils/illustrations';

/**
 * 加減應用題 (Addition & Subtraction Word Problems) — HK P1 standard
 * Mixed addition and subtraction in real-world contexts
 * Easy: single-step add or subtract word problems within 20
 * Medium: two-step problems, comparison, "how many more/fewer"
 * Hard: multi-step, mixed operations, reverse problems
 * Challenge: complex multi-step, logic puzzles
 */
export function generateWordProblemsQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateShoppingEasy, generateSharingEasy, generateGroupEasy],
    medium: [generateTwoStepAdd, generateComparisonMedium, generateGiveAndReceive, generatePartWhole],
    hard: [generateThreeStep, generateMixedOps, generateReverseProblem, generateComparisonChain],
    challenge: [generateLogicPuzzle, generateDistribution, generateMultiPerson, generateBalanceProblem, generateAgeRiddle, generateSharedTotal],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

function makeQ(difficulty: DifficultyLevel, prompt: string, correct: number, min: number, max: number, explanation: string): Question {
  const distractors = new Set<number>();
  distractors.add(correct);
  if (correct + 1 <= max) distractors.add(correct + 1);
  if (correct - 1 >= min) distractors.add(correct - 1);
  if (correct + 2 <= max) distractors.add(correct + 2);
  else if (correct - 2 >= min) distractors.add(correct - 2);
  const fillers = [1, 2, 3, 5, 7, 8, 10, 12, 15, 18, 20];
  for (const f of fillers) { if (distractors.size >= 4) break; if (f !== correct && f >= min && f <= max) distractors.add(f); }
  while (distractors.size < 4) distractors.add(randomInt(min, max));
  const options = shuffleArray(Array.from(distractors).slice(0, 4).map(String));
  return {
    id: generateId(), topicId: 'word-problems', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct.toString()), explanation, graphicType: 'word-problem',
  };
}

// --- Easy: single-step within 20 ---

function generateShoppingEasy(): Question {
  const items = ['蘋果', '香蕉', '橙', '糖果', '餅乾'];
  const item = items[randomInt(0, items.length - 1)];
  const a = randomInt(3, 10);
  const b = randomInt(2, Math.min(8, 18 - a));
  const ans = a + b;
  const q = makeQ('easy', `媽媽買了 ${a} 個${item}，爸爸又買了 ${b} 個。一共買了幾個${item}？`, ans, 0, 20,
    `${a} + ${b} = ${ans}，一共買了 ${ans} 個${item}。`);
  q.illustration = countDotsSvg(a, '#66BB6A');
  return q;
}

function generateSharingEasy(): Question {
  const a = randomInt(8, 18);
  const b = randomInt(2, a - 2);
  const ans = a - b;
  return makeQ('easy', `小明有 ${a} 顆糖果，給了弟弟 ${b} 顆。小明還剩幾顆糖果？`, ans, 0, 20,
    `${a} - ${b} = ${ans}，小明還剩 ${ans} 顆糖果。`);
}

function generateGroupEasy(): Question {
  const boys = randomInt(3, 10);
  const girls = randomInt(3, Math.min(10, 18 - boys));
  const ans = boys + girls;
  const q = makeQ('easy', `課室裡有 ${boys} 個男生和 ${girls} 個女生。課室裡一共有幾個學生？`, ans, 0, 20,
    `${boys} + ${girls} = ${ans}，一共有 ${ans} 個學生。`);
  q.illustration = countDotsSvg(boys, '#42A5F5');
  return q;
}

// --- Medium: two-step, comparison ---

function generateTwoStepAdd(): Question {
  const a = randomInt(3, 8);
  const b = randomInt(2, 6);
  const c = randomInt(2, Math.min(5, 20 - a - b));
  const ans = a + b + c;
  return makeQ('medium',
    `小明早上撿了 ${a} 片樹葉，中午撿了 ${b} 片，下午又撿了 ${c} 片。他一共撿了幾片樹葉？`,
    ans, 0, 20, `${a} + ${b} + ${c} = ${ans}`);
}

function generateComparisonMedium(): Question {
  const a = randomInt(5, 12);
  const b = randomInt(3, Math.min(10, a - 1));
  const diff = a - b;
  return makeQ('medium',
    `小明有 ${a} 顆波子，小華有 ${b} 顆波子。小明比小華多幾顆波子？`,
    diff, 0, 20, `${a} - ${b} = ${diff}，小明比小華多 ${diff} 顆波子。`);
}

function generateGiveAndReceive(): Question {
  const start = randomInt(8, 15);
  const gave = randomInt(2, 5);
  const received = randomInt(1, 4);
  const ans = start - gave + received;
  return makeQ('medium',
    `小明有 ${start} 張貼紙，給了小華 ${gave} 張，後來小美又給了小明 ${received} 張。小明現在有幾張貼紙？`,
    ans, 0, 20, `${start} - ${gave} + ${received} = ${ans}`);
}

function generatePartWhole(): Question {
  const total = randomInt(10, 18);
  const part = randomInt(3, total - 3);
  const ans = total - part;
  return makeQ('medium',
    `花園裡一共有 ${total} 朵花，其中 ${part} 朵是紅色的，其餘是黃色的。黃色的花有幾朵？`,
    ans, 0, 20, `${total} - ${part} = ${ans}，黃色的花有 ${ans} 朵。`);
}

// --- Hard: multi-step, mixed ops, reverse ---

function generateThreeStep(): Question {
  const a = randomInt(5, 10);
  const b = randomInt(2, 5);
  const c = randomInt(1, 4);
  const d = randomInt(1, Math.min(3, a + b - c));
  const ans = a + b - c - d;
  return makeQ('hard',
    `書架上有 ${a} 本書，老師放了 ${b} 本上去，同學借走了 ${c} 本，後來又借走了 ${d} 本。書架上現在有幾本書？`,
    ans, 0, 20, `${a} + ${b} - ${c} - ${d} = ${ans}`);
}

function generateMixedOps(): Question {
  const onBus = randomInt(8, 15);
  const getOff = randomInt(2, 5);
  const getOn = randomInt(1, 4);
  const ans = onBus - getOff + getOn;
  return makeQ('hard',
    `巴士上有 ${onBus} 個人，到站後下了 ${getOff} 個人，又上了 ${getOn} 個人。巴士上現在有幾個人？`,
    ans, 0, 20, `${onBus} - ${getOff} + ${getOn} = ${ans}`);
}

function generateReverseProblem(): Question {
  const left = randomInt(3, 10);
  const gave = randomInt(3, 8);
  const original = left + gave;
  return makeQ('hard',
    `小明給了朋友 ${gave} 顆糖果後，自己還剩 ${left} 顆。小明原來有幾顆糖果？`,
    original, 0, 20, `還剩 ${left} 顆 + 給了 ${gave} 顆 = 原來 ${original} 顆`);
}

function generateComparisonChain(): Question {
  const ming = randomInt(5, 10);
  const moreThanMing = randomInt(2, 5);
  const hua = ming + moreThanMing;
  const total = ming + hua;
  return makeQ('hard',
    `小華比小明多 ${moreThanMing} 顆糖。小明有 ${ming} 顆糖。兩人一共有幾顆糖？`,
    total, 0, 30, `小華有 ${ming} + ${moreThanMing} = ${hua} 顆。兩人共 ${ming} + ${hua} = ${total} 顆。`);
}

// --- Challenge: logic, distribution, multi-person ---

function generateLogicPuzzle(): Question {
  const total = randomInt(10, 18);
  const a = randomInt(3, total - 3);
  const b = total - a;
  const diff = Math.abs(a - b);
  const prompt = `兩個盒子一共有 ${total} 顆糖。第一個盒子有 ${a} 顆。兩個盒子相差幾顆糖？`;
  return makeQ('challenge', prompt, diff, 0, 20,
    `第二個盒子有 ${total} - ${a} = ${b} 顆。相差 |${a} - ${b}| = ${diff} 顆。`);
}

function generateDistribution(): Question {
  const perPerson = randomInt(2, 5);
  const people = randomInt(2, 4);
  const total = perPerson * people;
  return makeQ('challenge',
    `${people} 個小朋友平均分 ${total} 顆糖果，每人分到幾顆？`,
    perPerson, 0, 20, `${total} ÷ ${people} = ${perPerson}（用加法驗證：${perPerson} + ${perPerson} ${people > 2 ? '+ ' + perPerson : ''} ${people > 3 ? '+ ' + perPerson : ''} = ${total}）`);
}

function generateMultiPerson(): Question {
  const ming = randomInt(3, 8);
  const hua = randomInt(3, 8);
  const mei = randomInt(3, 8);
  const total = ming + hua + mei;
  return makeQ('challenge',
    `小明有 ${ming} 顆波子，小華有 ${hua} 顆，小美有 ${mei} 顆。三人一共有幾顆波子？最多的比最少的多幾顆？\n（回答三人一共有幾顆）`,
    total, 0, 30, `${ming} + ${hua} + ${mei} = ${total}。最多 ${Math.max(ming, hua, mei)} - 最少 ${Math.min(ming, hua, mei)} = ${Math.max(ming, hua, mei) - Math.min(ming, hua, mei)}。`);
}

function generateBalanceProblem(): Question {
  const a = randomInt(3, 9);
  const b = randomInt(3, 9);
  const sum = a + b;
  const c = randomInt(1, sum - 1);
  const ans = sum - c;
  return makeQ('challenge',
    `如果 ${a} + ${b} = ${c} + ☐，那麼 ☐ = ?`,
    ans, 0, 20, `${a} + ${b} = ${sum}，所以 ${c} + ☐ = ${sum}，☐ = ${ans}`);
}

function generateAgeRiddle(): Question {
  const ming = randomInt(6, 8);
  const diff = randomInt(2, 4);
  const hua = ming + diff;
  const total = ming + hua;
  return makeQ('challenge',
    `小明今年 ${ming} 歲，小華比小明大 ${diff} 歲。兩人年齡加起來一共幾歲？`,
    total, 0, 20, `小華 = ${ming} + ${diff} = ${hua} 歲。兩人共 ${ming} + ${hua} = ${total} 歲。`);
}

function generateSharedTotal(): Question {
  const total = randomInt(12, 20);
  const gave = randomInt(2, 5);
  const mingAfter = randomInt(3, total - gave - 2);
  const mingBefore = mingAfter + gave;
  return makeQ('challenge',
    `小明和小華一共有 ${total} 顆糖。小明給了小華 ${gave} 顆後，小明剩 ${mingAfter} 顆。小明原來有幾顆糖？`,
    mingBefore, 0, 25, `小明給了 ${gave} 顆後剩 ${mingAfter} 顆，所以原來有 ${mingAfter} + ${gave} = ${mingBefore} 顆。`);
}
