import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

/**
 * 20以內加法 (Addition within 20)
 * Easy: simple a+b (sum ≤ 15), word problems
 * Medium: missing addend, three-number, crossing 10
 * Hard: multi-step word problems, comparison, mixed operations hint
 */
export function generateAddition20Questions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push(randomInt(0, 1) === 0 ? generateSimple() : generateWordEasy());
        break;
      case 'medium':
        questions.push([generateMissingAddend, generateCrossTen, generateWordMedium][randomInt(0, 2)]());
        break;
      case 'hard':
        questions.push([generateThreeNumbers, generateComparison, generateWordHard][randomInt(0, 2)]());
        break;
    }
  }
  return questions;
}

function generateSimple(): Question {
  const a = randomInt(2, 9);
  const b = randomInt(2, Math.min(9, 15 - a));
  const ans = a + b;
  return makeQ('easy', `${a} + ${b} = ?`, ans, `${a} + ${b} = ${ans}。`);
}

function generateWordEasy(): Question {
  const items = ['本書', '朵花', '隻小鳥', '塊積木', '顆波子'];
  const item = items[randomInt(0, items.length - 1)];
  const a = randomInt(3, 8);
  const b = randomInt(2, Math.min(7, 15 - a));
  const ans = a + b;
  return makeQ('easy', `桌上有 ${a} ${item}，再放 ${b} ${item}上去。桌上現在有幾${item}？`, ans,
    `${a} + ${b} = ${ans}。桌上現在有 ${ans} ${item}。`);
}

function generateMissingAddend(): Question {
  const ans = randomInt(10, 18);
  const a = randomInt(2, ans - 2);
  const b = ans - a;
  return makeQ('medium', `${a} + __ = ${ans}，空格應填什麼數？`, b,
    `${a} + ${b} = ${ans}，所以空格應填 ${b}。`);
}

function generateCrossTen(): Question {
  // Specifically generate problems that cross 10 (e.g. 8+5=13)
  const a = randomInt(6, 9);
  const b = randomInt(10 - a + 1, Math.min(9, 20 - a));
  const ans = a + b;
  return makeQ('medium', `${a} + ${b} = ?（提示：先湊十）`, ans,
    `${a} + ${b} = ${ans}。先把 ${a} 湊成 10，需要 ${10 - a}，所以 ${a} + ${10 - a} = 10，再加 ${b - (10 - a)} = ${ans}。`);
}

function generateWordMedium(): Question {
  const a = randomInt(5, 12);
  const b = randomInt(3, Math.min(8, 20 - a));
  const ans = a + b;
  return makeQ('medium', `小明有 ${a} 張貼紙，生日時收到 ${b} 張。他現在一共有幾張貼紙？`, ans,
    `${a} + ${b} = ${ans}。他現在一共有 ${ans} 張貼紙。`);
}

function generateThreeNumbers(): Question {
  const a = randomInt(2, 7);
  const b = randomInt(2, 6);
  const c = randomInt(2, Math.min(6, 20 - a - b));
  const ans = a + b + c;
  return makeQ('hard', `${a} + ${b} + ${c} = ?`, ans,
    `${a} + ${b} + ${c} = ${ans}。先算 ${a} + ${b} = ${a + b}，再加 ${c} 得 ${ans}。`);
}

function generateComparison(): Question {
  const a = randomInt(5, 12);
  const more = randomInt(3, Math.min(8, 20 - a));
  const b = a + more;
  return makeQ('hard', `小明有 ${a} 顆波子，小華比小明多 ${more} 顆。小華有幾顆波子？`, b,
    `小華比小明多 ${more} 顆，所以小華有 ${a} + ${more} = ${b} 顆波子。`);
}

function generateWordHard(): Question {
  const morning = randomInt(3, 8);
  const afternoon = randomInt(3, Math.min(8, 20 - morning));
  const ans = morning + afternoon;
  return makeQ('hard', `圖書館早上借出 ${morning} 本書，下午又借出 ${afternoon} 本書。今天一共借出幾本書？`, ans,
    `${morning} + ${afternoon} = ${ans}。今天一共借出 ${ans} 本書。`);
}

function makeQ(difficulty: DifficultyLevel, prompt: string, correct: number, explanation: string): Question {
  const distractors = new Set<number>();
  distractors.add(correct);
  distractors.add(correct + 1);
  if (correct - 1 >= 0) distractors.add(correct - 1);
  if (correct + 2 <= 20) distractors.add(correct + 2);
  else if (correct - 2 >= 0) distractors.add(correct - 2);
  while (distractors.size < 4) distractors.add(randomInt(0, 20));
  const options = shuffleArray(Array.from(distractors).slice(0, 4).map(String));
  return {
    id: generateId(), topicId: 'addition-20', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct.toString()), explanation, graphicType: 'counting-objects',
  };
}
