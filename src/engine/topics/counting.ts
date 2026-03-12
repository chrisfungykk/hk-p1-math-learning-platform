import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

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
    easy: [() => generateCountObjects('easy'), generateWhichNumber, generateNextPrev],
    medium: [generateOrdinal, generateTensUnits, generateSkipCount2, generateCompareCount],
    hard: [generatePlaceValue100, generateSkipCount510, generatePatternRecognition, generateBeforeAfter100],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

function generateCountObjects(difficulty: DifficultyLevel): Question {
  const maxNum = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 30 : 50;
  const correctAnswer = randomInt(3, Math.min(maxNum, 20));
  const obj = OBJECTS[randomInt(0, OBJECTS.length - 1)];
  const emoji = obj.split(' ')[0];
  const name = obj.split(' ')[1];
  const prompt = `數一數，這裡有幾個${name}？\n${emoji.repeat(correctAnswer)}`;
  return makeQ(difficulty, 'counting', prompt, correctAnswer, 1, maxNum,
    `正確答案是 ${correctAnswer}。一共有 ${correctAnswer} 個${name}。`);
}

function generateWhichNumber(_difficulty?: DifficultyLevel): Question {
  const n = randomInt(2, 18);
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
  const tens = randomInt(1, 4);
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
  const start = randomInt(0, 1) * 2;
  const seq = Array.from({ length: 4 }, (_, i) => start + i * 2);
  const ans = start + 4 * 2;
  return makeQ('medium', 'counting', `按規律數數：${seq.join(', ')}, ?。下一個數是什麼？`, ans, 0, 30,
    `這是每次加 2 的數列，下一個數是 ${ans}。`);
}

function generateCompareCount(): Question {
  const a = randomInt(10, 30);
  const b = randomInt(10, 30);
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
