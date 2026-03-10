import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

/**
 * 基本減法 (Subtraction within 10)
 * Easy: simple a-b, word problems
 * Medium: missing subtrahend, comparison "how many more"
 * Hard: multi-step, word problems with context
 */
export function generateSubtraction10Questions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push(randomInt(0, 1) === 0 ? generateSimple() : generateWordEasy());
        break;
      case 'medium':
        questions.push([generateMissing, generateHowManyMore, generateWordMedium][randomInt(0, 2)]());
        break;
      case 'hard':
        questions.push([generateMultiStep, generateWordHard, generateComparison][randomInt(0, 2)]());
        break;
    }
  }
  return questions;
}

function generateSimple(): Question {
  const a = randomInt(3, 10);
  const b = randomInt(1, a);
  const ans = a - b;
  return makeQ('easy', `${a} - ${b} = ?`, ans, `${a} - ${b} = ${ans}。從 ${a} 減去 ${b}，答案是 ${ans}。`);
}

function generateWordEasy(): Question {
  const items = ['蘋果', '糖果', '鉛筆', '波子', '貼紙'];
  const item = items[randomInt(0, items.length - 1)];
  const a = randomInt(4, 9);
  const b = randomInt(1, a - 1);
  const ans = a - b;
  return makeQ('easy', `小明有 ${a} 個${item}，吃了 ${b} 個。還剩幾個${item}？`, ans,
    `${a} - ${b} = ${ans}。還剩 ${ans} 個${item}。`);
}

function generateMissing(): Question {
  const a = randomInt(5, 10);
  const ans = randomInt(0, a - 1);
  const b = a - ans;
  return makeQ('medium', `${a} - __ = ${ans}，空格應填什麼數？`, b,
    `${a} - ${b} = ${ans}，所以空格應填 ${b}。`);
}

function generateHowManyMore(): Question {
  const a = randomInt(4, 10);
  const b = randomInt(1, a - 1);
  const ans = a - b;
  return makeQ('medium', `小明有 ${a} 顆糖，小華有 ${b} 顆糖。小明比小華多幾顆？`, ans,
    `${a} - ${b} = ${ans}。小明比小華多 ${ans} 顆糖。`);
}

function generateWordMedium(): Question {
  const a = randomInt(5, 10);
  const b = randomInt(2, a - 1);
  const ans = a - b;
  return makeQ('medium', `車上有 ${a} 個人，到站後下了 ${b} 個人。車上還有幾個人？`, ans,
    `${a} - ${b} = ${ans}。車上還有 ${ans} 個人。`);
}

function generateMultiStep(): Question {
  const a = randomInt(7, 10);
  const b = randomInt(1, 3);
  const c = randomInt(1, Math.min(3, a - b));
  const ans = a - b - c;
  return makeQ('hard', `小明有 ${a} 塊餅乾，早上吃了 ${b} 塊，下午又吃了 ${c} 塊。還剩幾塊？`, ans,
    `${a} - ${b} - ${c} = ${ans}。先算 ${a} - ${b} = ${a - b}，再減 ${c} 得 ${ans}。`);
}

function generateWordHard(): Question {
  const total = randomInt(6, 10);
  const boys = randomInt(2, total - 2);
  const girls = total - boys;
  return makeQ('hard', `課室裡有 ${total} 個學生，其中 ${boys} 個是男生。女生有幾個？`, girls,
    `${total} - ${boys} = ${girls}。女生有 ${girls} 個。`);
}

function generateComparison(): Question {
  const a = randomInt(5, 10);
  const fewer = randomInt(1, 4);
  const b = a - fewer;
  return makeQ('hard', `小明有 ${a} 顆糖，小華比小明少 ${fewer} 顆。小華有幾顆糖？`, b,
    `小華比小明少 ${fewer} 顆，所以小華有 ${a} - ${fewer} = ${b} 顆糖。`);
}

function makeQ(difficulty: DifficultyLevel, prompt: string, correct: number, explanation: string): Question {
  const distractors = new Set<number>();
  distractors.add(correct);
  if (correct + 1 <= 10) distractors.add(correct + 1);
  if (correct - 1 >= 0) distractors.add(correct - 1);
  if (correct + 2 <= 10) distractors.add(correct + 2);
  while (distractors.size < 4) distractors.add(randomInt(0, 10));
  const options = shuffleArray(Array.from(distractors).slice(0, 4).map(String));
  return {
    id: generateId(), topicId: 'subtraction-10', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct.toString()), explanation, graphicType: 'counting-objects',
  };
}
