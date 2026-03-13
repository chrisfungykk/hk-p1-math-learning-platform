import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { countDotsSvg } from '../../utils/illustrations';

/**
 * 單數和雙數 (Odd and Even Numbers) — HK P1 Crescent syllabus
 * easy: Is N (1–20) odd or even?
 * medium: Pick all odd/even from a set of numbers
 * hard: Odd/even arithmetic rules (odd+odd=?, even+odd=?)
 * challenge: Count even/odd numbers in a range
 */
export function generateOddEvenQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateIsOddOrEven, generateGroupParity],
    medium: [generatePickAllOddOrEven, generateWhichIsOddOrEven],
    hard: [generateParityArithmeticRule, generateParityOfSum],
    challenge: [generateCountParityInRange, generateParityReasoning],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

/** easy: Ask whether a number (1–20) is odd or even */
function generateIsOddOrEven(): Question {
  const n = randomInt(1, 20);
  const isEven = n % 2 === 0;
  const correct = isEven ? '雙數' : '單數';
  const prompt = `${n} 是單數還是雙數？`;
  const options = ['單數', '雙數', '不是單數也不是雙數', '兩者都是'];
  const shuffled = shuffleArray(options);
  return {
    id: generateId(),
    topicId: 'odd-even',
    difficulty: 'easy',
    prompt,
    options: shuffled,
    correctAnswerIndex: shuffled.indexOf(correct),
    explanation: `${n} ${isEven ? '可以' : '不能'}被 2 整除，所以是${correct}。`,
    illustration: countDotsSvg(n),
  };
}

/** easy: Show dots grouped in pairs, ask if the number is odd or even */
function generateGroupParity(): Question {
  const n = randomInt(1, 20);
  const isEven = n % 2 === 0;
  const correct = isEven ? '雙數' : '單數';
  const pairs = Math.floor(n / 2);
  const leftover = n % 2;
  const pairDesc = leftover === 0
    ? `${n} 個圓點可以全部配成 ${pairs} 對`
    : `${n} 個圓點配成 ${pairs} 對後，還剩 1 個`;
  const prompt = `看圖，${n} 個圓點兩個兩個一組，${n} 是單數還是雙數？`;
  const options = ['單數', '雙數', '不能分組', '不知道'];
  const shuffled = shuffleArray(options);
  return {
    id: generateId(),
    topicId: 'odd-even',
    difficulty: 'easy',
    prompt,
    options: shuffled,
    correctAnswerIndex: shuffled.indexOf(correct),
    explanation: `${pairDesc}，所以 ${n} 是${correct}。`,
    illustration: countDotsSvg(n),
  };
}

/** medium: Show a set of 5 numbers, ask to pick all odd or all even */
function generatePickAllOddOrEven(): Question {
  const askOdd = randomInt(0, 1) === 0;
  const label = askOdd ? '單數' : '雙數';
  // Generate 5 distinct numbers in 1–20
  const pool = shuffleArray(Array.from({ length: 20 }, (_, i) => i + 1)).slice(0, 5);
  pool.sort((a, b) => a - b);

  const matching = pool.filter(n => askOdd ? n % 2 === 1 : n % 2 === 0);
  const correctStr = matching.join(', ');

  // Build 3 deterministic distractors
  const nonMatching = pool.filter(n => askOdd ? n % 2 === 0 : n % 2 === 1);
  const distractor1 = nonMatching.join(', ') || pool.slice(0, 2).join(', ');
  const distractor2 = pool.join(', ');
  // Mix one correct + one wrong
  const mixed = matching.length > 0 && nonMatching.length > 0
    ? [...matching.slice(0, 1), ...nonMatching.slice(0, 1)].sort((a, b) => a - b).join(', ')
    : pool.slice(0, 3).join(', ');

  const allOptions = [correctStr, distractor1, distractor2, mixed];
  // Deduplicate: replace duplicates with fallback
  const unique = deduplicateOptions(allOptions, correctStr);
  const shuffled = shuffleArray(unique);

  return {
    id: generateId(),
    topicId: 'odd-even',
    difficulty: 'medium',
    prompt: `以下數字中，哪些是${label}？\n${pool.join(', ')}`,
    options: shuffled,
    correctAnswerIndex: shuffled.indexOf(correctStr),
    explanation: `${label}是可以${askOdd ? '不能' : ''}被 2 整除的數。答案是 ${correctStr}。`,
  };
}

/** medium: Which of these numbers is odd/even? (single number pick) */
function generateWhichIsOddOrEven(): Question {
  const askOdd = randomInt(0, 1) === 0;
  const label = askOdd ? '單數' : '雙數';

  // Generate 4 numbers: 1 correct parity, 3 opposite parity
  const correctNum = askOdd ? randomInt(1, 10) * 2 - 1 : randomInt(1, 10) * 2;
  const wrongNums: number[] = [];
  const startWrong = askOdd ? 2 : 1;
  for (let i = 0; i < 3; i++) {
    wrongNums.push(startWrong + i * 2);
  }

  const correct = `${correctNum}`;
  const options = shuffleArray([correct, ...wrongNums.map(String)]);

  return {
    id: generateId(),
    topicId: 'odd-even',
    difficulty: 'medium',
    prompt: `以下哪個是${label}？`,
    options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${correctNum} 是${label}，因為它${askOdd ? '不能' : '可以'}被 2 整除。`,
  };
}

/** hard: Odd/even arithmetic rules */
function generateParityArithmeticRule(): Question {
  const rules: { prompt: string; correct: string; explanation: string }[] = [
    { prompt: '單數 + 單數 = ？', correct: '雙數', explanation: '單數 + 單數 = 雙數（例如 3 + 5 = 8）。' },
    { prompt: '雙數 + 雙數 = ？', correct: '雙數', explanation: '雙數 + 雙數 = 雙數（例如 4 + 6 = 10）。' },
    { prompt: '單數 + 雙數 = ？', correct: '單數', explanation: '單數 + 雙數 = 單數（例如 3 + 4 = 7）。' },
    { prompt: '雙數 + 單數 = ？', correct: '單數', explanation: '雙數 + 單數 = 單數（例如 6 + 3 = 9）。' },
    { prompt: '單數 − 單數 = ？', correct: '雙數', explanation: '單數 − 單數 = 雙數（例如 7 − 3 = 4）。' },
    { prompt: '雙數 − 雙數 = ？', correct: '雙數', explanation: '雙數 − 雙數 = 雙數（例如 8 − 4 = 4）。' },
  ];
  const rule = rules[randomInt(0, rules.length - 1)];
  const options = ['單數', '雙數', '不一定', '零'];
  const shuffled = shuffleArray(options);
  return {
    id: generateId(),
    topicId: 'odd-even',
    difficulty: 'hard',
    prompt: rule.prompt,
    options: shuffled,
    correctAnswerIndex: shuffled.indexOf(rule.correct),
    explanation: rule.explanation,
  };
}

/** hard: Given two specific numbers, determine if their sum is odd or even */
function generateParityOfSum(): Question {
  const a = randomInt(1, 20);
  const b = randomInt(1, 20);
  const sum = a + b;
  const isEven = sum % 2 === 0;
  const correct = isEven ? '雙數' : '單數';
  const prompt = `${a} + ${b} 的結果是單數還是雙數？`;
  const options = ['單數', '雙數', '不一定', '零'];
  const shuffled = shuffleArray(options);
  return {
    id: generateId(),
    topicId: 'odd-even',
    difficulty: 'hard',
    prompt,
    options: shuffled,
    correctAnswerIndex: shuffled.indexOf(correct),
    explanation: `${a} + ${b} = ${sum}，${sum} 是${correct}。`,
  };
}

/** challenge: Count even or odd numbers in a range */
function generateCountParityInRange(): Question {
  const start = randomInt(1, 10);
  const end = start + randomInt(5, 15);
  const askEven = randomInt(0, 1) === 0;
  const label = askEven ? '雙數' : '單數';

  let correctCount = 0;
  for (let i = start; i <= end; i++) {
    if (askEven ? i % 2 === 0 : i % 2 === 1) correctCount++;
  }

  const prompt = `從 ${start} 到 ${end}，一共有幾個${label}？`;
  const correct = correctCount.toString();

  // Deterministic distractors: ±1, ±2
  const d1 = Math.max(0, correctCount - 1).toString();
  const d2 = (correctCount + 1).toString();
  const d3 = (correctCount + 2).toString();
  const allOptions = deduplicateOptions([correct, d1, d2, d3], correct);
  const shuffled = shuffleArray(allOptions);

  return {
    id: generateId(),
    topicId: 'odd-even',
    difficulty: 'challenge',
    prompt,
    options: shuffled,
    correctAnswerIndex: shuffled.indexOf(correct),
    explanation: `從 ${start} 到 ${end} 的${label}有 ${correctCount} 個。`,
  };
}

/** challenge: Parity reasoning with multiple operations */
function generateParityReasoning(): Question {
  const scenarios: { prompt: string; correct: string; explanation: string }[] = [
    {
      prompt: '小明有 7 顆糖果，媽媽再給他 5 顆。他現在有單數還是雙數顆糖果？',
      correct: '雙數',
      explanation: '7 + 5 = 12，12 是雙數。',
    },
    {
      prompt: '一排有 13 個座位，坐了 6 個人，空了幾個座位？空位數是單數還是雙數？',
      correct: '單數',
      explanation: '13 − 6 = 7，7 是單數。',
    },
    {
      prompt: '把 1 到 10 的所有數字加起來，結果是單數還是雙數？',
      correct: '單數',
      explanation: '1+2+3+4+5+6+7+8+9+10 = 55，55 是單數。',
    },
    {
      prompt: '連續 3 個單數相加，結果是單數還是雙數？',
      correct: '單數',
      explanation: '單數+單數=雙數，雙數+單數=單數。例如 1+3+5=9，是單數。',
    },
    {
      prompt: '一個雙數加上 3，結果是單數還是雙數？',
      correct: '單數',
      explanation: '雙數 + 單數 = 單數。例如 4 + 3 = 7，是單數。',
    },
    {
      prompt: '兩個連續的數相加，結果是單數還是雙數？',
      correct: '單數',
      explanation: '連續兩個數一定是一個單數一個雙數，相加結果是單數。例如 5+6=11。',
    },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = ['單數', '雙數', '不一定', '零'];
  const shuffled = shuffleArray(options);
  return {
    id: generateId(),
    topicId: 'odd-even',
    difficulty: 'challenge',
    prompt: s.prompt,
    options: shuffled,
    correctAnswerIndex: shuffled.indexOf(s.correct),
    explanation: s.explanation,
  };
}

/**
 * Ensure 4 unique option strings. Replace duplicates with deterministic fallbacks.
 */
function deduplicateOptions(options: string[], correct: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  const fallbacks = ['0', '1', '2', '3', '4', '5', '10', '15', '20'];
  let fallbackIdx = 0;

  for (const opt of options) {
    if (!seen.has(opt)) {
      seen.add(opt);
      result.push(opt);
    } else {
      // Find a fallback not already used
      while (fallbackIdx < fallbacks.length && (seen.has(fallbacks[fallbackIdx]) || fallbacks[fallbackIdx] === correct)) {
        fallbackIdx++;
      }
      if (fallbackIdx < fallbacks.length) {
        seen.add(fallbacks[fallbackIdx]);
        result.push(fallbacks[fallbackIdx]);
        fallbackIdx++;
      }
    }
  }

  // Pad to 4 if needed
  while (result.length < 4) {
    while (fallbackIdx < fallbacks.length && seen.has(fallbacks[fallbackIdx])) {
      fallbackIdx++;
    }
    if (fallbackIdx < fallbacks.length) {
      seen.add(fallbacks[fallbackIdx]);
      result.push(fallbacks[fallbackIdx]);
      fallbackIdx++;
    } else {
      result.push(`${result.length + 10}`);
    }
  }

  return result.slice(0, 4);
}
