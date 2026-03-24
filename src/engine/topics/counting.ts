import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { countDotsSvg } from '../../utils/illustrations';

const OBJECTS = ['🍎 蘋果', '🍌 香蕉', '⭐ 星星', '🌸 花', '🐟 魚', '🦋 蝴蝶', '🐤 小雞', '✏️ 鉛筆'];

/**
 * 數數 (Counting) — HK P1 1N1 + 1N3 standard
 * Numbers to 20 (1N1), then to 100 (1N3)
 * Includes tens/units place value (十位/個位), skip counting by 2/5/10
 * Easy: count objects 1-20, next number
 * Medium: count to 50, ordinal, tens and units, skip count by 2
 * Hard: count to 100, place value, skip count by 5/10, number patterns
 */
export function generateCountingQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [() => generateCountObjects('easy'), generateWhichNumber, generateNextPrev, generateChineseNumberWord, generateNumberSequenceWriting],
    medium: [generateOrdinal, generateTensUnits, generateSkipCount2, generateCompareCount],
    hard: [generatePlaceValue100, generateSkipCount510, generatePatternRecognition, generateBeforeAfter100],
    challenge: [generateGrowingPattern, generatePlaceValuePuzzle, generateOddEvenLogic, generateNumberBond, generateSumOfRange, generateDigitSum],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

function generateCountObjects(difficulty: DifficultyLevel): Question {
  const maxNum = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 40 : 60;
  const correctAnswer = randomInt(5, Math.min(maxNum, 20));
  const obj = OBJECTS[randomInt(0, OBJECTS.length - 1)];
  const emoji = obj.split(' ')[0];
  const name = obj.split(' ')[1];
  const prompt = `數一數，這裡有幾個${name}？\n${emoji.repeat(correctAnswer)}`;
  const q = makeQ(difficulty, 'counting', prompt, correctAnswer, 1, maxNum,
    `正確答案是 ${correctAnswer}。一共有 ${correctAnswer} 個${name}。`);
  q.illustration = countDotsSvg(correctAnswer);
  return q;
}

function generateWhichNumber(_difficulty?: DifficultyLevel): Question {
  const n = randomInt(3, 19);
  const prompt = `${n} 的下一個數是什麼？`;
  return makeQ('easy', 'counting', prompt, n + 1, 1, 20, `${n} 的下一個數是 ${n + 1}。`);
}

function generateNextPrev(): Question {
  const n = randomInt(3, 19);
  const isBefore = randomInt(0, 1) === 0;
  const ans = isBefore ? n - 1 : n + 1;
  const label = isBefore ? '前面' : '後面';
  return makeQ('easy', 'counting', `${n} 的${label}一個數是什麼？`, ans, 1, 20,
    `${n} 的${label}一個數是 ${ans}。`);
}

function generateOrdinal(): Question {
  const animals = ['🐶', '🐱', '🐰', '🐸', '🐻', '🐼', '🐵'];
  const count = randomInt(5, 7);
  const selected = shuffleArray(animals).slice(0, count);
  const pos = randomInt(1, count);
  const ordinals = ['', '第一', '第二', '第三', '第四', '第五', '第六', '第七'];
  const prompt = `排隊：${selected.join(' ')}。從左邊數起，${ordinals[pos]}個是什麼？`;
  const correct = selected[pos - 1];
  const options = shuffleArray(selected.slice(0, 4));
  if (!options.includes(correct)) options[0] = correct;
  const shuffled = shuffleArray(options);
  return {
    id: generateId(), topicId: 'counting', difficulty: 'medium', prompt,
    options: shuffled, correctAnswerIndex: shuffled.indexOf(correct),
    explanation: `從左邊數起，${ordinals[pos]}個是 ${correct}。`, graphicType: 'counting-objects',
  };
}

function generateTensUnits(): Question {
  const tens = randomInt(2, 6);
  const units = randomInt(0, 9);
  const num = tens * 10 + units;
  const askTens = randomInt(0, 1) === 0;
  if (askTens) {
    return makeQ('medium', 'counting', `${num} 的十位數字是什麼？`, tens, 0, 9,
      `${num} 的十位數字是 ${tens}。`);
  }
  return makeQ('medium', 'counting', `${num} 的個位數字是什麼？`, units, 0, 9,
    `${num} 的個位數字是 ${units}。`);
}

function generateSkipCount2(): Question {
  const start = randomInt(1, 3) * 2;
  const seq = Array.from({ length: 4 }, (_, i) => start + i * 2);
  const ans = start + 4 * 2;
  return makeQ('medium', 'counting', `按規律數數：${seq.join(', ')}, ?。下一個數是什麼？`, ans, 0, 30,
    `這是每次加 2 的數列，下一個數是 ${ans}。`);
}

function generateCompareCount(): Question {
  const a = randomInt(15, 40);
  const b = randomInt(15, 40);
  const prompt = `${a} 和 ${b}，哪個比較大？`;
  const correct = Math.max(a, b);
  const options = shuffleArray([a, b, a + b, Math.abs(a - b)].map(String));
  const correctStr = correct.toString();
  if (!options.includes(correctStr)) options[0] = correctStr;
  const shuffled = shuffleArray(options);
  return {
    id: generateId(), topicId: 'counting', difficulty: 'medium', prompt,
    options: shuffled, correctAnswerIndex: shuffled.indexOf(correctStr),
    explanation: `${Math.max(a, b)} 比 ${Math.min(a, b)} 大。`, graphicType: 'counting-objects',
  };
}

function generatePlaceValue100(): Question {
  const tens = randomInt(1, 9);
  const units = randomInt(0, 9);
  const num = tens * 10 + units;
  const scenarios = [
    { prompt: `${num} 裡面有幾個十和幾個一？`, correct: `${tens}個十${units}個一`, pool: [`${tens}個十${units}個一`, `${units}個十${tens}個一`, `${tens + 1}個十${units}個一`, `${tens}個十${units + 1}個一`] },
    { prompt: `${tens} 個十和 ${units} 個一組成什麼數？`, correct: `${num}`, pool: [`${num}`, `${tens + units}`, `${tens * units || 1}`, `${num + 10}`] },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = shuffleArray(s.pool);
  return {
    id: generateId(), topicId: 'counting', difficulty: 'hard', prompt: s.prompt,
    options, correctAnswerIndex: options.indexOf(s.correct),
    explanation: `${num} = ${tens} 個十 + ${units} 個一。`, graphicType: 'counting-objects',
  };
}

function generateSkipCount510(): Question {
  const step = randomInt(0, 1) === 0 ? 5 : 10;
  const start = step === 5 ? randomInt(0, 2) * 5 : 0;
  const seq = Array.from({ length: 4 }, (_, i) => start + i * step);
  const ans = start + 4 * step;
  return makeQ('hard', 'counting', `按規律數數：${seq.join(', ')}, ?。下一個數是什麼？`, ans, 0, 100,
    `這是每次加 ${step} 的數列，下一個數是 ${ans}。`);
}

function generatePatternRecognition(): Question {
  const patterns = [
    { seq: [1, 3, 5, 7], ans: 9, rule: '單數數列，每次加2' },
    { seq: [2, 4, 6, 8], ans: 10, rule: '雙數數列，每次加2' },
    { seq: [10, 20, 30, 40], ans: 50, rule: '每次加10' },
    { seq: [5, 10, 15, 20], ans: 25, rule: '每次加5' },
    { seq: [50, 40, 30, 20], ans: 10, rule: '每次減10' },
    { seq: [1, 2, 4, 7], ans: 11, rule: '差值每次加1（+1, +2, +3, +4）' },
  ];
  const p = patterns[randomInt(0, patterns.length - 1)];
  return makeQ('hard', 'counting', `找出規律，下一個數字是什麼？\n${p.seq.join(', ')}, ?`, p.ans, 0, 100,
    `規律：${p.rule}，所以下一個數字是 ${p.ans}。`);
}

function generateBeforeAfter100(): Question {
  const n = randomInt(10, 99);
  const isBefore = randomInt(0, 1) === 0;
  const ans = isBefore ? n - 1 : n + 1;
  const label = isBefore ? '前面' : '後面';
  return makeQ('hard', 'counting', `${n} 的${label}一個數是什麼？`, ans, 1, 100,
    `${n} 的${label}一個數是 ${ans}。`);
}

function generateGrowingPattern(): Question {
  const patterns = [
    { seq: [1, 2, 4, 7, 11], ans: 16, rule: '差值每次加1（+1,+2,+3,+4,+5）' },
    { seq: [1, 3, 6, 10], ans: 15, rule: '差值每次加1（+2,+3,+4,+5）' },
    { seq: [2, 4, 8, 14], ans: 22, rule: '差值每次加2（+2,+4,+6,+8）' },
    { seq: [100, 90, 81, 73], ans: 66, rule: '差值每次減1（-10,-9,-8,-7）' },
    { seq: [1, 1, 2, 3, 5], ans: 8, rule: '前兩個數相加得下一個數' },
  ];
  const p = patterns[randomInt(0, patterns.length - 1)];
  return makeQ('challenge', 'counting', `找出規律，下一個數字是什麼？\n${p.seq.join(', ')}, ?`, p.ans, 0, 100,
    `規律：${p.rule}，所以下一個數字是 ${p.ans}。`);
}

function generatePlaceValuePuzzle(): Question {
  const tens = randomInt(2, 8);
  const units = randomInt(1, 9);
  const num = tens * 10 + units;
  const reversed = units * 10 + tens;
  const prompt = `一個兩位數，十位是 ${tens}，個位是 ${units}。把十位和個位的數字對調後，新的數是什麼？`;
  return makeQ('challenge', 'counting', prompt, reversed, 10, 99,
    `原數是 ${num}，對調後十位是 ${units}，個位是 ${tens}，新數是 ${reversed}。`);
}

function generateOddEvenLogic(): Question {
  const scenarios = [
    { prompt: '從 1 到 10，一共有幾個單數（奇數）？', correct: 5, exp: '1, 3, 5, 7, 9 共 5 個單數。' },
    { prompt: '從 1 到 10，一共有幾個雙數（偶數）？', correct: 5, exp: '2, 4, 6, 8, 10 共 5 個雙數。' },
    { prompt: '從 1 到 20，一共有幾個 5 的倍數？', correct: 4, exp: '5, 10, 15, 20 共 4 個。' },
    { prompt: '10 到 20 之間（不包括 10 和 20），有幾個整數？', correct: 9, exp: '11, 12, 13, 14, 15, 16, 17, 18, 19 共 9 個。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  return makeQ('challenge', 'counting', s.prompt, s.correct, 0, 20, s.exp);
}

function generateNumberBond(): Question {
  const target = randomInt(20, 40);
  const a = randomInt(5, target - 5);
  const b = target - a;
  const prompt = `兩個數加起來等於 ${target}。其中一個數是 ${a}，另一個數是什麼？`;
  return makeQ('challenge', 'counting', prompt, b, 0, 100, `${a} + ☐ = ${target}，☐ = ${target} - ${a} = ${b}`);
}

function generateSumOfRange(): Question {
  const start = randomInt(2, 6);
  const end = start + randomInt(4, 6);
  let sum = 0;
  for (let i = start; i <= end; i++) sum += i;
  const prompt = `把 ${start} 到 ${end} 的所有數字加起來，答案是多少？\n${Array.from({ length: end - start + 1 }, (_, i) => start + i).join(' + ')} = ?`;
  return makeQ('challenge', 'counting', prompt, sum, 0, 100,
    `${Array.from({ length: end - start + 1 }, (_, i) => start + i).join(' + ')} = ${sum}`);
}

function generateDigitSum(): Question {
  const num = randomInt(30, 99);
  const tens = Math.floor(num / 10);
  const units = num % 10;
  const digitSum = tens + units;
  const prompt = `${num} 的十位數字和個位數字加起來等於多少？`;
  return makeQ('challenge', 'counting', prompt, digitSum, 0, 20,
    `${num} 的十位是 ${tens}，個位是 ${units}。${tens} + ${units} = ${digitSum}。`);
}

const CHINESE_NUMBERS = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];

function generateChineseNumberWord(): Question {
  const n = randomInt(1, 20);
  const chineseWord = CHINESE_NUMBERS[n];
  const prompt = `${chineseWord} 等於哪個數字？`;
  return makeQ('easy', 'counting', prompt, n, 1, 20,
    `${chineseWord} 等於 ${n}。`);
}

function generateNumberSequenceWriting(): Question {
  const missingPos = randomInt(1, 18);
  const before = missingPos - 1;
  const after = missingPos + 1;
  const prompt = `數字排列：${before > 0 ? before : ''}${before > 0 ? ', ' : ''}☐, ${after}。☐ 是什麼數字？`;
  return makeQ('easy', 'counting', prompt, missingPos, 1, 20,
    `${before > 0 ? before + ', ' : ''}${missingPos}, ${after}。☐ = ${missingPos}。`);
}


function makeQ(difficulty: DifficultyLevel, topicId: string, prompt: string, correct: number, min: number, max: number, explanation: string): Question {
  const distractors = new Set<number>();
  distractors.add(correct);
  if (correct + 1 <= max) distractors.add(correct + 1);
  if (correct - 1 >= min) distractors.add(correct - 1);
  if (correct + 2 <= max) distractors.add(correct + 2);
  const fillers = [1, 2, 5, 10, 15, 20, 25, 30, 50];
  for (const f of fillers) { if (distractors.size >= 4) break; if (f !== correct && f >= min && f <= max) distractors.add(f); }
  while (distractors.size < 4) distractors.add(randomInt(min, max));
  const options = shuffleArray(Array.from(distractors).slice(0, 4).map(String));
  return {
    id: generateId(), topicId, difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct.toString()), explanation, graphicType: 'counting-objects',
  };
}
