import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

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
    }
  }
  return questions;
}

function getStepAndStart(difficulty: DifficultyLevel): { step: number; start: number; isDecreasing: boolean } {
  switch (difficulty) {
    case 'easy':
      return { step: 1, start: randomInt(1, 10), isDecreasing: false };
    case 'medium': {
      const isDecreasing = randomInt(0, 2) === 0;
      return { step: 2, start: isDecreasing ? randomInt(14, 20) : randomInt(1, 8), isDecreasing };
    }
    case 'hard': {
      const isDecreasing = randomInt(0, 1) === 1;
      const step = randomInt(3, 5);
      const start = isDecreasing ? randomInt(20, 30) : randomInt(1, 5);
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
  while (nums.size < 4) nums.add(randomInt(1, 15));
  const arr = Array.from(nums);
  const sorted = [...arr].sort((a, b) => a - b);
  const correct = sorted.join(', ');
  const prompt = `把下面的數字從小到大排列：\n${arr.join('、')}`;
  const distractors = new Set<string>();
  distractors.add(correct);
  distractors.add([...sorted].reverse().join(', '));
  while (distractors.size < 4) distractors.add(shuffleArray(arr).join(', '));
  const options = shuffleArray(Array.from(distractors));
  return {
    id: generateId(), topicId: 'ordering-sequences', difficulty: 'easy', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `從小到大排列：${correct}。`, graphicType: 'sequence',
  };
}

function generateCompareOrder(): Question {
  const a = randomInt(5, 15);
  const b = randomInt(5, 15);
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
