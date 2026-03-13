import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { compassSvg } from '../../utils/illustrations';

/** Cardinal directions in Chinese */
const CARDINALS = ['東', '南', '西', '北'] as const;

/** Map direction label to index in CARDINALS (clockwise: 東=0, 南=1, 西=2, 北=3) */
const DIR_INDEX: Record<string, number> = { '東': 0, '南': 1, '西': 2, '北': 3 };

/** Opposite direction lookup */
const OPPOSITE: Record<string, string> = { '東': '西', '西': '東', '南': '北', '北': '南' };

/** Turn result: given facing direction + turn direction → new facing */
function turnResult(facing: string, turn: '左' | '右'): string {
  const idx = DIR_INDEX[facing];
  // Clockwise order: 東→南→西→北
  // Turn right = clockwise (+1), Turn left = counter-clockwise (-1)
  const delta = turn === '右' ? 1 : -1;
  const newIdx = ((idx + delta) % 4 + 4) % 4;
  return CARDINALS[newIdx];
}

function buildDirectionOptions(correct: string): string[] {
  const seen = new Set<string>([correct]);
  const distractors: string[] = [];
  for (const d of shuffleArray([...CARDINALS])) {
    if (!seen.has(d) && distractors.length < 3) {
      seen.add(d);
      distractors.push(d);
    }
  }
  return shuffleArray([correct, ...distractors]).slice(0, 4);
}

function buildNumericOptions(correct: number): string[] {
  const correctStr = correct.toString();
  const seen = new Set<string>([correctStr]);
  const distractors: string[] = [];
  for (const offset of [-1, 1, -2, 2, -3, 3]) {
    const val = correct + offset;
    if (val >= 0 && !seen.has(val.toString()) && distractors.length < 3) {
      seen.add(val.toString());
      distractors.push(val.toString());
    }
  }
  let fb = correct + 4;
  while (distractors.length < 3) {
    if (!seen.has(fb.toString())) {
      seen.add(fb.toString());
      distractors.push(fb.toString());
    }
    fb++;
  }
  return shuffleArray([correctStr, ...distractors]).slice(0, 4);
}

// ─── EASY: Identify 東南西北 on a compass ───

/** easy: "指南針上，哪個方向在上面？" → 北 */
function generateEasyIdentifyDirection(): Question {
  const dirIdx = randomInt(0, 3);
  const dir = CARDINALS[dirIdx];
  const positionLabels = ['上面', '下面', '右邊', '左邊'];
  // Compass standard: 北=上, 南=下, 東=右, 西=左
  const compassPositions: Record<string, string> = { '北': '上面', '南': '下面', '東': '右邊', '西': '左邊' };
  const position = compassPositions[dir];
  const prompt = `在指南針上，${dir}在哪個位置？`;
  const options = shuffleArray([...positionLabels]).slice(0, 4);
  // Ensure correct answer is in options
  if (!options.includes(position)) {
    options[0] = position;
  }
  const finalOptions = shuffleArray(options);
  return {
    id: generateId(),
    topicId: 'directions',
    difficulty: 'easy',
    prompt,
    options: finalOptions,
    correctAnswerIndex: finalOptions.indexOf(position),
    explanation: `在指南針上，${dir}在${position}。`,
    illustration: compassSvg(dir),
  };
}

/** easy variant: "指南針上面的方向是什麼？" → 北 */
function generateEasyWhichDirection(): Question {
  const compassMap: { position: string; dir: string }[] = [
    { position: '上面', dir: '北' },
    { position: '下面', dir: '南' },
    { position: '右邊', dir: '東' },
    { position: '左邊', dir: '西' },
  ];
  const choice = compassMap[randomInt(0, 3)];
  const prompt = `在指南針上，${choice.position}的方向是什麼？`;
  const options = buildDirectionOptions(choice.dir);
  return {
    id: generateId(),
    topicId: 'directions',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(choice.dir),
    explanation: `指南針${choice.position}的方向是${choice.dir}。`,
    illustration: compassSvg(choice.dir),
  };
}

// ─── MEDIUM: Left/right turns → resulting facing direction ───

/** medium: "小明面向X，向Y轉，現在面向哪個方向？" */
function generateMediumSingleTurn(): Question {
  const facingIdx = randomInt(0, 3);
  const facing = CARDINALS[facingIdx];
  const turn: '左' | '右' = randomInt(0, 1) === 0 ? '左' : '右';
  const result = turnResult(facing, turn);
  const prompt = `小明面向${facing}，向${turn}轉一次，現在面向哪個方向？`;
  const options = buildDirectionOptions(result);
  return {
    id: generateId(),
    topicId: 'directions',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(result),
    explanation: `面向${facing}，向${turn}轉一次後面向${result}。`,
    illustration: compassSvg(result),
  };
}

/** medium variant: "小明面向X，X的對面是什麼方向？" */
function generateMediumOpposite(): Question {
  const facingIdx = randomInt(0, 3);
  const facing = CARDINALS[facingIdx];
  const opp = OPPOSITE[facing];
  const prompt = `小明面向${facing}，他的背後是什麼方向？`;
  const options = buildDirectionOptions(opp);
  return {
    id: generateId(),
    topicId: 'directions',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(opp),
    explanation: `面向${facing}，背後就是${opp}。`,
    illustration: compassSvg(opp),
  };
}

// ─── HARD: Multi-step directional instructions on a grid ───

/** hard: "小明面向X，先向Y轉，再向Z轉，現在面向哪個方向？" */
function generateHardDoubleTurn(): Question {
  const facingIdx = randomInt(0, 3);
  const facing = CARDINALS[facingIdx];
  const turn1: '左' | '右' = randomInt(0, 1) === 0 ? '左' : '右';
  const turn2: '左' | '右' = randomInt(0, 1) === 0 ? '左' : '右';
  const after1 = turnResult(facing, turn1);
  const after2 = turnResult(after1, turn2);
  const prompt = `小明面向${facing}，先向${turn1}轉，再向${turn2}轉，現在面向哪個方向？`;
  const options = buildDirectionOptions(after2);
  return {
    id: generateId(),
    topicId: 'directions',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(after2),
    explanation: `面向${facing}→向${turn1}轉→${after1}→向${turn2}轉→${after2}。`,
    illustration: compassSvg(after2),
  };
}

/** hard variant: Grid movement — "從A走到B，要向哪個方向走？" */
function generateHardGridDirection(): Question {
  // Simple grid: places described by relative position
  const places: { name: string; row: number; col: number }[] = [
    { name: '學校', row: 0, col: 1 },
    { name: '公園', row: 1, col: 2 },
    { name: '圖書館', row: 1, col: 0 },
    { name: '超市', row: 2, col: 1 },
    { name: '家', row: 1, col: 1 },
  ];
  // Pick two different places
  const shuffled = shuffleArray(places);
  const from = shuffled[0];
  const to = shuffled[1];

  // Determine primary direction (row: 北=up/smaller, 南=down/larger; col: 西=left/smaller, 東=right/larger)
  let correct: string;
  const dr = to.row - from.row;
  const dc = to.col - from.col;
  if (Math.abs(dr) >= Math.abs(dc)) {
    correct = dr < 0 ? '北' : '南';
  } else {
    correct = dc > 0 ? '東' : '西';
  }

  const prompt = `在地圖上，${from.name}要去${to.name}，要先向哪個方向走？`;
  const options = buildDirectionOptions(correct);
  return {
    id: generateId(),
    topicId: 'directions',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `從${from.name}到${to.name}，要先向${correct}走。`,
    illustration: compassSvg(correct),
  };
}

// ─── CHALLENGE: Compass + grid navigation + distance ───

/** challenge: Multi-step grid navigation with distance */
function generateChallengeGridNavigation(): Question {
  const facingIdx = randomInt(0, 3);
  const facing = CARDINALS[facingIdx];
  const steps = randomInt(2, 4);
  const turnDir: '左' | '右' = randomInt(0, 1) === 0 ? '左' : '右';
  const steps2 = randomInt(1, 3);
  const totalSteps = steps + steps2;

  // After walking `steps` in `facing`, turn, walk `steps2`
  const afterTurn = turnResult(facing, turnDir);

  const prompt = `小明面向${facing}走了${steps}步，然後向${turnDir}轉走了${steps2}步，他一共走了多少步？`;
  const options = buildNumericOptions(totalSteps);
  return {
    id: generateId(),
    topicId: 'directions',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(totalSteps.toString()),
    explanation: `${steps} + ${steps2} = ${totalSteps}步。`,
    illustration: compassSvg(afterTurn),
  };
}

/** challenge variant: "小明面向X，向Y轉N次，現在面向哪個方向？" */
function generateChallengeMultipleTurns(): Question {
  const facingIdx = randomInt(0, 3);
  const facing = CARDINALS[facingIdx];
  const turnDir: '左' | '右' = randomInt(0, 1) === 0 ? '左' : '右';
  const turnCount = randomInt(2, 3);

  let current: string = facing;
  for (let i = 0; i < turnCount; i++) {
    current = turnResult(current, turnDir);
  }

  const prompt = `小明面向${facing}，連續向${turnDir}轉${turnCount}次，現在面向哪個方向？`;
  const options = buildDirectionOptions(current);
  return {
    id: generateId(),
    topicId: 'directions',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(current),
    explanation: `面向${facing}，向${turnDir}轉${turnCount}次後面向${current}。`,
    illustration: compassSvg(current),
  };
}

export function generateDirectionsQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateEasyIdentifyDirection, generateEasyWhichDirection],
    medium: [generateMediumSingleTurn, generateMediumOpposite],
    hard: [generateHardDoubleTurn, generateHardGridDirection],
    challenge: [generateChallengeGridNavigation, generateChallengeMultipleTurns],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}
