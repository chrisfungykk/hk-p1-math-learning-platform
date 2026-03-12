import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

/**
 * 20以內減法 (Subtraction within 20) — HK P1 1N4 standard
 * Includes 破十法, column form (直式), no borrowing at this level
 * Easy: simple a-b, word problems
 * Medium: missing number, crossing 10 with 破十法, column form
 * Hard: multi-step, comparison, relationship with addition
 */
export function generateSubtraction20Questions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateSimple, generateWordEasy],
    medium: [generateMissing, generateCrossTen, generateColumnForm, generateHowManyMore],
    hard: [generateMultiStep, generateWordHard, generateComparison, generateRelationship],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

function generateSimple(): Question {
  const a = randomInt(6, 18);
  const b = randomInt(2, a - 1);
  const ans = a - b;
  return makeQ('easy', `${a} - ${b} = ?`, ans, `${a} - ${b} = ${ans}`);
}

function generateWordEasy(): Question {
  const scenarios = [
    () => { const a = randomInt(8, 16); const b = randomInt(2, a - 2); return { prompt: `小明有 ${a} 顆糖，給了弟弟 ${b} 顆。小明還剩幾顆糖？`, ans: a - b, exp: `${a} - ${b} = ${a - b}` }; },
    () => { const a = randomInt(10, 18); const b = randomInt(3, a - 2); return { prompt: `書架上有 ${a} 本書，借走了 ${b} 本。書架上還剩幾本書？`, ans: a - b, exp: `${a} - ${b} = ${a - b}` }; },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)]();
  return makeQ('easy', s.prompt, s.ans, s.exp);
}

function generateMissing(): Question {
  const a = randomInt(10, 18);
  const ans = randomInt(1, a - 2);
  const b = a - ans;
  return makeQ('medium', `${a} - ☐ = ${ans}，☐ = ?`, b, `${a} - ${b} = ${ans}，所以 ☐ = ${b}`);
}

function generateCrossTen(): Question {
  const a = randomInt(11, 18);
  const b = randomInt(a - 9, a - 1);
  const ans = a - b;
  if (a > 10 && ans < 10) {
    const toTen = a - 10;
    return makeQ('medium', `用破十法計算：${a} - ${b} = ?\n提示：先減到 10`, ans,
      `破十法：${a} - ${toTen} = 10，10 - ${b - toTen} = ${ans}`);
  }
  return makeQ('medium', `${a} - ${b} = ?`, ans, `${a} - ${b} = ${ans}`);
}

function generateColumnForm(): Question {
  const a = randomInt(11, 18);
  const b = randomInt(2, Math.min(a - 1, 9));
  const ans = a - b;
  const prompt = `用直式計算：\n  ${a}\n-  ${b}\n——\n  ?`;
  return makeQ('medium', prompt, ans, `直式計算：${a} - ${b} = ${ans}`);
}

function generateHowManyMore(): Question {
  const a = randomInt(10, 18);
  const b = randomInt(2, a - 2);
  const ans = a - b;
  return makeQ('medium', `小明有 ${a} 顆波子，小華有 ${b} 顆。小明比小華多幾顆？`, ans,
    `${a} - ${b} = ${ans}`);
}

function generateMultiStep(): Question {
  const a = randomInt(14, 18);
  const b = randomInt(2, 5);
  const c = randomInt(2, Math.min(5, a - b - 1));
  const ans = a - b - c;
  return makeQ('hard', `小明有 ${a} 顆糖，給了小華 ${b} 顆，又給了小美 ${c} 顆。小明還剩幾顆糖？`, ans,
    `${a} - ${b} - ${c} = ${ans}`);
}

function generateWordHard(): Question {
  const total = randomInt(12, 18);
  const red = randomInt(4, total - 4);
  const blue = total - red;
  return makeQ('hard', `盒子裡有 ${total} 顆波子，其中 ${red} 顆是紅色的，其餘是藍色的。藍色波子有幾顆？`, blue,
    `${total} - ${red} = ${blue}`);
}

function generateComparison(): Question {
  const a = randomInt(10, 18);
  const fewer = randomInt(3, 7);
  const b = a - fewer;
  return makeQ('hard', `哥哥有 ${a} 張貼紙，弟弟比哥哥少 ${fewer} 張。弟弟有幾張貼紙？`, b,
    `${a} - ${fewer} = ${b}`);
}

function generateRelationship(): Question {
  const a = randomInt(3, 9);
  const b = randomInt(3, Math.min(9, 18 - a));
  const sum = a + b;
  return makeQ('hard', `如果 ${a} + ${b} = ${sum}，那麼 ${sum} - ${a} = ?`, b,
    `加法和減法是相反的運算。${sum} - ${a} = ${b}`);
}

function makeQ(difficulty: DifficultyLevel, prompt: string, correct: number, explanation: string): Question {
  const distractors = new Set<number>();
  distractors.add(correct);
  if (correct + 1 <= 20) distractors.add(correct + 1);
  if (correct - 1 >= 0) distractors.add(correct - 1);
  if (correct + 2 <= 20) distractors.add(correct + 2);
  else if (correct - 2 >= 0) distractors.add(correct - 2);
  const fillers = [0, 2, 5, 8, 10, 12, 15, 18];
  for (const f of fillers) { if (distractors.size >= 4) break; if (f !== correct) distractors.add(f); }
  const options = shuffleArray(Array.from(distractors).slice(0, 4).map(String));
  return {
    id: generateId(), topicId: 'subtraction-20', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct.toString()), explanation, graphicType: 'counting-objects',
  };
}
