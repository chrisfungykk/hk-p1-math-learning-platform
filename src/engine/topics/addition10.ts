import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

/**
 * 基本加法 (Addition within 10)
 * Easy: simple a+b, word problems with objects
 * Medium: missing addend (a + ? = c), three-number addition
 * Hard: word problems with context, comparison, multi-step
 */
export function generateAddition10Questions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push(randomInt(0, 1) === 0 ? generateSimple() : generateWordProblemEasy());
        break;
      case 'medium':
        questions.push([generateMissingAddend, generateThreeNumbers, generateWordProblemMedium][randomInt(0, 2)]());
        break;
      case 'hard':
        questions.push([generateComparisonProblem, generateMultiStep, generateWordProblemHard][randomInt(0, 2)]());
        break;
    }
  }
  return questions;
}

function generateSimple(): Question {
  const a = randomInt(1, 5);
  const b = randomInt(1, 5);
  const ans = a + b;
  const prompt = `${a} + ${b} = ?`;
  return makeQuestion('easy', prompt, ans, 0, 10,
    `${a} + ${b} = ${ans}。將 ${a} 和 ${b} 加在一起，答案是 ${ans}。`);
}

function generateWordProblemEasy(): Question {
  const items = ['蘋果', '糖果', '鉛筆', '貼紙', '波子'];
  const item = items[randomInt(0, items.length - 1)];
  const a = randomInt(1, 4);
  const b = randomInt(1, Math.min(4, 10 - a));
  const ans = a + b;
  const prompt = `小明有 ${a} 個${item}，媽媽再給他 ${b} 個${item}。小明現在一共有幾個${item}？`;
  return makeQuestion('easy', prompt, ans, 0, 10,
    `${a} + ${b} = ${ans}。小明現在一共有 ${ans} 個${item}。`);
}

function generateMissingAddend(): Question {
  const ans = randomInt(4, 10);
  const a = randomInt(1, ans - 1);
  const b = ans - a;
  const prompt = `${a} + __ = ${ans}，空格應填什麼數？`;
  return makeQuestion('medium', prompt, b, 0, 10,
    `${a} + ${b} = ${ans}，所以空格應填 ${b}。`);
}

function generateThreeNumbers(): Question {
  const a = randomInt(1, 3);
  const b = randomInt(1, 3);
  const c = randomInt(1, Math.min(3, 10 - a - b));
  const ans = a + b + c;
  const prompt = `${a} + ${b} + ${c} = ?`;
  return makeQuestion('medium', prompt, ans, 0, 10,
    `${a} + ${b} + ${c} = ${ans}。先算 ${a} + ${b} = ${a + b}，再加 ${c} 得 ${ans}。`);
}

function generateWordProblemMedium(): Question {
  const items = ['本書', '朵花', '隻小鳥', '塊餅乾'];
  const item = items[randomInt(0, items.length - 1)];
  const a = randomInt(2, 5);
  const b = randomInt(2, Math.min(5, 10 - a));
  const ans = a + b;
  const prompt = `書架上有 ${a} ${item}，小美又放了 ${b} ${item}上去。書架上現在有幾${item}？`;
  return makeQuestion('medium', prompt, ans, 0, 10,
    `${a} + ${b} = ${ans}。書架上現在有 ${ans} ${item}。`);
}

function generateComparisonProblem(): Question {
  const a = randomInt(2, 5);
  const more = randomInt(1, Math.min(4, 10 - a));
  const b = a + more;
  const prompt = `小明有 ${a} 顆糖，小華比小明多 ${more} 顆。小華有幾顆糖？`;
  return makeQuestion('hard', prompt, b, 0, 10,
    `小華比小明多 ${more} 顆，所以小華有 ${a} + ${more} = ${b} 顆糖。`);
}

function generateMultiStep(): Question {
  const a = randomInt(1, 3);
  const b = randomInt(1, 3);
  const c = randomInt(1, Math.min(3, 10 - a - b));
  const ans = a + b + c;
  const prompt = `小明早上吃了 ${a} 塊餅乾，中午吃了 ${b} 塊，下午又吃了 ${c} 塊。他一共吃了幾塊餅乾？`;
  return makeQuestion('hard', prompt, ans, 0, 10,
    `${a} + ${b} + ${c} = ${ans}。他一共吃了 ${ans} 塊餅乾。`);
}

function generateWordProblemHard(): Question {
  const boys = randomInt(2, 5);
  const girls = randomInt(2, Math.min(5, 10 - boys));
  const ans = boys + girls;
  const prompt = `課室裡有 ${boys} 個男生和 ${girls} 個女生。課室裡一共有幾個學生？`;
  return makeQuestion('hard', prompt, ans, 0, 10,
    `${boys} + ${girls} = ${ans}。課室裡一共有 ${ans} 個學生。`);
}

function makeQuestion(difficulty: DifficultyLevel, prompt: string, correct: number, min: number, max: number, explanation: string): Question {
  const distractors = new Set<number>();
  distractors.add(correct);
  distractors.add(correct + 1);
  if (correct - 1 >= min) distractors.add(correct - 1);
  distractors.add(correct + 2 <= max ? correct + 2 : correct - 2 >= min ? correct - 2 : randomInt(min, max));
  while (distractors.size < 4) distractors.add(randomInt(min, max));
  const options = shuffleArray(Array.from(distractors).slice(0, 4).map(String));
  return {
    id: generateId(), topicId: 'addition-10', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct.toString()), explanation, graphicType: 'counting-objects',
  };
}
