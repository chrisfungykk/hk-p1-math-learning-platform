import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

/**
 * 20以內減法 (Subtraction within 20)
 * Easy: simple a-b, word problems
 * Medium: missing number, crossing 10, "how many more"
 * Hard: multi-step, comparison word problems
 */
export function generateSubtraction20Questions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push(randomInt(0, 1) === 0 ? generateSimple() : generateWordEasy());
        break;
      case 'medium':
        questions.push([generateMissing, generateCrossTen, generateHowManyMore][randomInt(0, 2)]());
        break;
      case 'hard':
        questions.push([generateMultiStep, generateWordHard, generateComparison][randomInt(0, 2)]());
        break;
    }
  }
  return questions;
}

function generateSimple(): Question {
  const a = randomInt(6, 15);
  const b = randomInt(2, a - 1);
  const ans = a - b;
  return makeQ('easy', `${a} - ${b} = ?`, ans, `${a} - ${b} = ${ans}。`);
}

function generateWordEasy(): Question {
  const items = ['顆糖', '個蘋果', '張貼紙', '塊積木'];
  const item = items[randomInt(0, items.length - 1)];
  const a = randomInt(8, 16);
  const b = randomInt(2, a - 2);
  const ans = a - b;
  return makeQ('easy', `小明有 ${a} ${item}，給了弟弟 ${b} ${item}。小明還剩幾${item}？`, ans,
    `${a} - ${b} = ${ans}。小明還剩 ${ans} ${item}。`);
}

function generateMissing(): Question {
  const a = randomInt(10, 18);
  const ans = randomInt(1, a - 2);
  const b = a - ans;
  return makeQ('medium', `${a} - __ = ${ans}，空格應填什麼數？`, b,
    `${a} - ${b} = ${ans}，所以空格應填 ${b}。`);
}

function generateCrossTen(): Question {
  // e.g. 15 - 8 = 7 (crossing 10)
  const a = randomInt(11, 18);
  const b = randomInt(a - 9, a - 1);
  // ensure it crosses 10
  const ans = a - b;
  if (a > 10 && ans < 10) {
    return makeQ('medium', `${a} - ${b} = ?（提示：先減到十）`, ans,
      `${a} - ${b} = ${ans}。先算 ${a} - ${a - 10} = 10，再減 ${b - (a - 10)} = ${ans}。`);
  }
  return makeQ('medium', `${a} - ${b} = ?`, ans, `${a} - ${b} = ${ans}。`);
}

function generateHowManyMore(): Question {
  const a = randomInt(10, 18);
  const b = randomInt(2, a - 2);
  const ans = a - b;
  return makeQ('medium', `小明有 ${a} 顆波子，小華有 ${b} 顆。小明比小華多幾顆？`, ans,
    `${a} - ${b} = ${ans}。小明比小華多 ${ans} 顆波子。`);
}

function generateMultiStep(): Question {
  const a = randomInt(14, 20);
  const b = randomInt(2, 5);
  const c = randomInt(2, Math.min(5, a - b - 1));
  const ans = a - b - c;
  return makeQ('hard', `小明有 ${a} 顆糖，給了小華 ${b} 顆，又給了小美 ${c} 顆。小明還剩幾顆糖？`, ans,
    `${a} - ${b} - ${c} = ${ans}。先算 ${a} - ${b} = ${a - b}，再減 ${c} 得 ${ans}。`);
}

function generateWordHard(): Question {
  const total = randomInt(12, 20);
  const red = randomInt(4, total - 4);
  const blue = total - red;
  return makeQ('hard', `盒子裡有 ${total} 顆波子，其中 ${red} 顆是紅色的，其餘是藍色的。藍色波子有幾顆？`, blue,
    `${total} - ${red} = ${blue}。藍色波子有 ${blue} 顆。`);
}

function generateComparison(): Question {
  const a = randomInt(10, 18);
  const fewer = randomInt(3, 7);
  const b = a - fewer;
  return makeQ('hard', `哥哥有 ${a} 張貼紙，弟弟比哥哥少 ${fewer} 張。弟弟有幾張貼紙？`, b,
    `弟弟比哥哥少 ${fewer} 張，所以弟弟有 ${a} - ${fewer} = ${b} 張貼紙。`);
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
    id: generateId(), topicId: 'subtraction-20', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct.toString()), explanation, graphicType: 'counting-objects',
  };
}
