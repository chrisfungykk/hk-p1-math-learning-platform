import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { countDotsSvg } from '../../utils/illustrations';

/**
 * 排列和序列 (Ordering and Sequences)
 * Easy: step 1 sequences, arrange numbers small→big
 * Medium: step 2, missing number, decreasing
 * Hard: step 3-5, pattern recognition, mixed increasing/decreasing
 */
export function generateOrderingQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push(randomInt(0, 1) === 0 ? generateNextNumber('easy') : generateArrangeNumbers());
        break;
      case 'medium':
        questions.push([() => generateNextNumber('medium'), () => generateMissingNumber('medium'), generateCompareOrder][randomInt(0, 2)]());
        break;
      case 'hard':
        questions.push([() => generateNextNumber('hard'), () => generateMissingNumber('hard'), generatePatternRecognition][randomInt(0, 2)]());
        break;
      case 'challenge':
        questions.push([generateGrowingPattern, generateAlternatingSequence, generateDoubleRule, generateReverseSequence][randomInt(0, 3)]());
        break;
    }
  }
  return questions;
}

function getStepAndStart(difficulty: DifficultyLevel): { step: number; start: number; isDecreasing: boolean } {
  switch (difficulty) {
    case 'easy':
      return { step: 1, start: randomInt(3, 12), isDecreasing: false };
    case 'medium': {
      const isDecreasing = randomInt(0, 2) === 0;
      return { step: 2, start: isDecreasing ? randomInt(16, 24) : randomInt(2, 10), isDecreasing };
    }
    case 'hard': {
      const isDecreasing = randomInt(0, 1) === 1;
      const step = randomInt(4, 6);
      const start = isDecreasing ? randomInt(25, 40) : randomInt(2, 8);
      return { step, start, isDecreasing };
    }
    case 'challenge': {
      const isDecreasing = randomInt(0, 1) === 1;
      const step = randomInt(7, 12);
      const start = isDecreasing ? randomInt(60, 100) : randomInt(3, 15);
      return { step, start, isDecreasing };
    }
  }
}

function generateNextNumber(difficulty: DifficultyLevel): Question {
  const { step, start, isDecreasing } = getStepAndStart(difficulty);
  const seqLength = randomInt(3, 4);
  const sequence: number[] = [];
  for (let i = 0; i < seqLength; i++) {
    sequence.push(isDecreasing ? start - i * step : start + i * step);
  }
  const correctAnswer = isDecreasing ? start - seqLength * step : start + seqLength * step;
  const prompt = `找出規律，下一個數字是什麼？\n${sequence.join(', ')}, ?`;
  const direction = isDecreasing ? '減少' : '增加';
  return makeQ(difficulty, prompt, correctAnswer, step,
    `這個數列每次${direction} ${step}，所以下一個數字是 ${correctAnswer}。`);
}

function generateMissingNumber(difficulty: DifficultyLevel): Question {
  const { step, start, isDecreasing } = getStepAndStart(difficulty);
  const seqLength = randomInt(4, 5);
  const sequence: number[] = [];
  for (let i = 0; i < seqLength; i++) {
    sequence.push(isDecreasing ? start - i * step : start + i * step);
  }
  const blankPos = randomInt(1, seqLength - 2);
  const correctAnswer = sequence[blankPos];
  const displaySeq = sequence.map((n, idx) => idx === blankPos ? '___' : n.toString());
  const prompt = `找出缺少的數字：\n${displaySeq.join(', ')}`;
  const direction = isDecreasing ? '減少' : '增加';
  return makeQ(difficulty, prompt, correctAnswer, step,
    `這個數列每次${direction} ${step}，缺少的數字是 ${correctAnswer}。`);
}

function generateArrangeNumbers(): Question {
  const nums = new Set<number>();
  while (nums.size < 4) nums.add(randomInt(2, 20));
  const arr = Array.from(nums);
  const sorted = [...arr].sort((a, b) => a - b);
  const correct = sorted.join(', ');
  const prompt = `把下面的數字從小到大排列：\n${arr.join('、')}`;
  const distractors = new Set<string>();
  distractors.add(correct);
  distractors.add([...sorted].reverse().join(', '));
  while (distractors.size < 4) distractors.add(shuffleArray(arr).join(', '));
  const options = shuffleArray(Array.from(distractors));
  const q: Question = {
    id: generateId(), topicId: 'ordering-sequences', difficulty: 'easy', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `從小到大排列：${correct}。`, graphicType: 'sequence',
  };
  q.illustration = countDotsSvg(arr[0], '#66BB6A');
  return q;
}

function generateCompareOrder(): Question {
  const a = randomInt(8, 20);
  const b = randomInt(8, 20);
  while (b === a) return generateCompareOrder();
  const prompt = `${a} 和 ${b}，哪個比較大？`;
  const correct = Math.max(a, b).toString();
  const options = shuffleArray([a.toString(), b.toString(), (a + b).toString(), Math.abs(a - b).toString()]);
  if (!options.includes(correct)) options[0] = correct;
  const shuffled = shuffleArray(options);
  return {
    id: generateId(), topicId: 'ordering-sequences', difficulty: 'medium', prompt, options: shuffled,
    correctAnswerIndex: shuffled.indexOf(correct),
    explanation: `${Math.max(a, b)} 比 ${Math.min(a, b)} 大。`, graphicType: 'sequence',
  };
}

function generatePatternRecognition(): Question {
  // Alternating or repeating patterns
  const patterns = [
    { seq: [1, 3, 5, 7], ans: 9, rule: '單數數列，每次加2' },
    { seq: [2, 4, 6, 8], ans: 10, rule: '雙數數列，每次加2' },
    { seq: [1, 4, 7, 10], ans: 13, rule: '每次加3' },
    { seq: [2, 5, 8, 11], ans: 14, rule: '每次加3' },
    { seq: [20, 15, 10, 5], ans: 0, rule: '每次減5' },
    { seq: [1, 2, 4, 7], ans: 11, rule: '差值每次加1（+1, +2, +3, +4）' },
  ];
  const p = patterns[randomInt(0, patterns.length - 1)];
  const prompt = `找出規律，下一個數字是什麼？\n${p.seq.join(', ')}, ?`;
  return makeQ('hard', prompt, p.ans, 1, `規律：${p.rule}，所以下一個數字是 ${p.ans}。`);
}

function makeQ(difficulty: DifficultyLevel, prompt: string, correct: number, step: number, explanation: string): Question {
  const distractors = new Set<number>();
  distractors.add(correct);
  distractors.add(correct + step);
  distractors.add(correct - step);
  distractors.add(correct + 1);
  while (distractors.size < 4) distractors.add(correct + randomInt(-5, 5));
  const options = shuffleArray(Array.from(distractors).slice(0, 4).map(String));
  return {
    id: generateId(), topicId: 'ordering-sequences', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct.toString()), explanation, graphicType: 'sequence',
  };
}

// --- Challenge (HKIMO-style) ---

function generateGrowingPattern(): Question {
  // Differences grow: +1, +2, +3, +4...
  const patterns = [
    { seq: [1, 2, 4, 7, 11], ans: 16, rule: '差值每次加1（+1, +2, +3, +4, +5）' },
    { seq: [2, 3, 5, 8, 12], ans: 17, rule: '差值每次加1（+1, +2, +3, +4, +5）' },
    { seq: [1, 3, 6, 10], ans: 15, rule: '差值每次加1（+2, +3, +4, +5）' },
    { seq: [3, 4, 6, 9, 13], ans: 18, rule: '差值每次加1（+1, +2, +3, +4, +5）' },
  ];
  const p = patterns[randomInt(0, patterns.length - 1)];
  const prompt = `找出規律，下一個數字是什麼？\n${p.seq.join(', ')}, ?`;
  return makeQ('challenge', prompt, p.ans, 1, `規律：${p.rule}，所以下一個數字是 ${p.ans}。`);
}

function generateAlternatingSequence(): Question {
  // Two interleaved sequences
  const a1 = randomInt(1, 3);
  const b1 = randomInt(10, 12);
  const stepA = randomInt(1, 2);
  const stepB = randomInt(1, 2);
  const seq = [a1, b1, a1 + stepA, b1 + stepB, a1 + 2 * stepA, b1 + 2 * stepB];
  const ans = a1 + 3 * stepA;
  const prompt = `找出規律，下一個數字是什麼？\n${seq.join(', ')}, ?`;
  return makeQ('challenge', prompt, ans, 1,
    `這是兩組交替的數列：${a1}, ${a1 + stepA}, ${a1 + 2 * stepA}...（每次+${stepA}）和 ${b1}, ${b1 + stepB}, ${b1 + 2 * stepB}...（每次+${stepB}）。下一個是 ${ans}。`);
}

function generateDoubleRule(): Question {
  // Doubling pattern
  const patterns = [
    { seq: [1, 2, 4, 8], ans: 16, rule: '每次乘以2' },
    { seq: [2, 4, 8, 16], ans: 32, rule: '每次乘以2' },
    { seq: [3, 6, 12, 24], ans: 48, rule: '每次乘以2' },
    { seq: [1, 3, 9, 27], ans: 81, rule: '每次乘以3' },
  ];
  const p = patterns[randomInt(0, patterns.length - 1)];
  const prompt = `找出規律，下一個數字是什麼？\n${p.seq.join(', ')}, ?`;
  return makeQ('challenge', prompt, p.ans, 1, `規律：${p.rule}，所以下一個數字是 ${p.ans}。`);
}

function generateReverseSequence(): Question {
  // Given last number and rule, find first
  const step = randomInt(2, 4);
  const length = randomInt(4, 5);
  const last = randomInt(15, 25);
  const first = last - (length - 1) * step;
  const seq: string[] = ['?'];
  for (let i = 1; i < length; i++) {
    seq.push(`${first + i * step}`);
  }
  const prompt = `這個數列每次增加 ${step}：\n${seq.join(', ')}\n第一個數字是什麼？`;
  return makeQ('challenge', prompt, first, 1,
    `最後一個數是 ${last}，每次加 ${step}，往回推 ${length - 1} 步：${last} - ${(length - 1) * step} = ${first}。`);
}
