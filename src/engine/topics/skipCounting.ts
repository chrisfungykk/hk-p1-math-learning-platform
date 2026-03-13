import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { countDotsSvg } from '../../utils/illustrations';

function buildNumericOptions(correct: number): string[] {
  const correctStr = correct.toString();
  const seen = new Set<string>([correctStr]);
  const distractors: string[] = [];
  for (const offset of [-1, 1, -2, 2, -3, 3, -5, 5, -10, 10]) {
    const val = correct + offset;
    const s = val.toString();
    if (val >= 0 && !seen.has(s) && distractors.length < 3) {
      seen.add(s);
      distractors.push(s);
    }
  }
  let fb = correct + 4;
  while (distractors.length < 3) {
    const s = fb.toString();
    if (!seen.has(s)) { seen.add(s); distractors.push(s); }
    fb++;
  }
  return shuffleArray([correctStr, ...distractors]).slice(0, 4);
}

function buildMissingQ(seq: number[], step: number, diff: DifficultyLevel): Question {
  const hideIdx = randomInt(1, Math.min(3, seq.length - 2));
  const correct = seq[hideIdx];
  const display = seq.map((v, i) => (i === hideIdx ? '?' : v.toString()));
  const lbl = step === 2 ? '2、2' : step === 5 ? '5、5' : '10、10';
  const prompt = `${lbl}地數：${display.join('、')}，? 是什麼？`;
  const options = buildNumericOptions(correct);
  return {
    id: generateId(),
    topicId: 'skip-counting',
    difficulty: diff,
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct.toString()),
    explanation: `每次加 ${step}，所以 ? = ${correct}。`,
    illustration: countDotsSvg(Math.min(correct, 50), '#66BB6A'),
  };
}

function generateEasyCountBy2(): Question {
  const startIdx = randomInt(0, 3);
  const start = (startIdx + 1) * 2;
  const seq = [start, start + 2, start + 4, start + 6, start + 8].filter(v => v <= 20);
  if (seq.length < 4) return buildMissingQ([2, 4, 6, 8, 10], 2, 'easy');
  return buildMissingQ(seq.slice(0, 5), 2, 'easy');
}

function generateEasyFillBy2(): Question {
  const startIdx = randomInt(0, 3);
  const start = (startIdx + 1) * 2;
  const seq = [start, start + 2, start + 4];
  const next = start + 6;
  if (next > 20) {
    const options = buildNumericOptions(8);
    return {
      id: generateId(), topicId: 'skip-counting', difficulty: 'easy',
      prompt: '2、2地數：2、4、6，下一個數是什麼？',
      options, correctAnswerIndex: options.indexOf('8'),
      explanation: '每次加 2，6 + 2 = 8。',
      illustration: countDotsSvg(8, '#42A5F5'),
    };
  }
  const prompt = `2、2地數：${seq.join('、')}，下一個數是什麼？`;
  const options = buildNumericOptions(next);
  return {
    id: generateId(), topicId: 'skip-counting', difficulty: 'easy',
    prompt, options, correctAnswerIndex: options.indexOf(next.toString()),
    explanation: `每次加 2，${seq[2]} + 2 = ${next}。`,
    illustration: countDotsSvg(next, '#42A5F5'),
  };
}

function generateMediumCountBy5(): Question {
  const startMultiple = randomInt(1, 10);
  const start = startMultiple * 5;
  const seq = [start, start + 5, start + 10, start + 15, start + 20].filter(v => v <= 100);
  if (seq.length < 4) return buildMissingQ([5, 10, 15, 20, 25], 5, 'medium');
  return buildMissingQ(seq.slice(0, 5), 5, 'medium');
}

function generateMediumCountBy10(): Question {
  const startMultiple = randomInt(1, 5);
  const start = startMultiple * 10;
  const seq = [start, start + 10, start + 20, start + 30, start + 40].filter(v => v <= 100);
  if (seq.length < 4) return buildMissingQ([10, 20, 30, 40, 50], 10, 'medium');
  return buildMissingQ(seq.slice(0, 5), 10, 'medium');
}

function generateHardIdentifyRule(): Question {
  const steps = [2, 5, 10];
  const step = steps[randomInt(0, steps.length - 1)];
  const maxStart = step === 2 ? 10 : step === 5 ? 25 : 30;
  const start = randomInt(1, Math.floor(maxStart / step)) * step;
  const seq = [start, start + step, start + step * 2, start + step * 3];
  const prompt = `${seq.join('、')} — 這個數列每次加幾？`;
  const correct = step;
  const allSteps = [2, 5, 10, 3];
  const distractors = allSteps.filter(s => s !== correct).slice(0, 3);
  const options = shuffleArray([correct.toString(), ...distractors.map(d => d.toString())]).slice(0, 4);
  return {
    id: generateId(), topicId: 'skip-counting', difficulty: 'hard',
    prompt, options, correctAnswerIndex: options.indexOf(correct.toString()),
    explanation: `${seq[1]} − ${seq[0]} = ${step}，所以每次加 ${step}。`,
  };
}

function generateHardMixedSequence(): Question {
  const steps = [2, 5, 10];
  const step = steps[randomInt(0, steps.length - 1)];
  const maxStart = step === 2 ? 10 : step === 5 ? 20 : 20;
  const start = randomInt(1, Math.floor(maxStart / step)) * step;
  const seq = [start, start + step, start + step * 2, start + step * 3, start + step * 4].filter(v => v <= 100);
  if (seq.length < 4) return buildMissingQ([step, step * 2, step * 3, step * 4, step * 5], step, 'hard');
  return buildMissingQ(seq.slice(0, 5), step, 'hard');
}

function generateChallengeReverse(): Question {
  const steps = [2, 5, 10];
  const step = steps[randomInt(0, steps.length - 1)];
  const posCount = randomInt(3, 5);
  const minLast = (posCount + 1) * step;
  const maxLast = Math.min(100, 20 * step);
  const lastValue = randomInt(Math.ceil(minLast / step), Math.floor(maxLast / step)) * step;
  const firstValue = lastValue - (posCount - 1) * step;
  const ord = posCount === 3 ? '第3' : posCount === 4 ? '第4' : '第5';
  const prompt = `一個數列每次加 ${step}，${ord}個數是 ${lastValue}，第1個數是？`;
  const options = buildNumericOptions(firstValue);
  return {
    id: generateId(), topicId: 'skip-counting', difficulty: 'challenge',
    prompt, options, correctAnswerIndex: options.indexOf(firstValue.toString()),
    explanation: `${ord}個數是 ${lastValue}，往回減 ${posCount - 1} 次 ${step}：${lastValue} − ${(posCount - 1) * step} = ${firstValue}。`,
  };
}

function generateChallengePatternExtend(): Question {
  const steps = [2, 5, 10];
  const step = steps[randomInt(0, steps.length - 1)];
  const start = randomInt(1, 5) * step;
  const shown = [start, start + step, start + step * 2, start + step * 3];
  const targetPos = randomInt(5, 7);
  const answer = start + (targetPos - 1) * step;
  if (answer > 200) {
    const s = step;
    const fb = [s, s + step, s + step * 2, s + step * 3];
    const fbAns = s + 4 * step;
    const prompt = `數列：${fb.join('、')}、…，第5個數是什麼？`;
    const options = buildNumericOptions(fbAns);
    return {
      id: generateId(), topicId: 'skip-counting', difficulty: 'challenge',
      prompt, options, correctAnswerIndex: options.indexOf(fbAns.toString()),
      explanation: `每次加 ${step}，第5個數 = ${fb[3]} + ${step} = ${fbAns}。`,
    };
  }
  const prompt = `數列：${shown.join('、')}、…，第${targetPos}個數是什麼？`;
  const options = buildNumericOptions(answer);
  return {
    id: generateId(), topicId: 'skip-counting', difficulty: 'challenge',
    prompt, options, correctAnswerIndex: options.indexOf(answer.toString()),
    explanation: `每次加 ${step}，第${targetPos}個數 = ${start} + ${targetPos - 1} × ${step} = ${answer}。`,
  };
}

export function generateSkipCountingQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateEasyCountBy2, generateEasyFillBy2],
    medium: [generateMediumCountBy5, generateMediumCountBy10],
    hard: [generateHardIdentifyRule, generateHardMixedSequence],
    challenge: [generateChallengeReverse, generateChallengePatternExtend],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}
