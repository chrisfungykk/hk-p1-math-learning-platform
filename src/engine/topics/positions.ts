import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { positionGridSvg } from '../../utils/illustrations';

const EMOJI_POOL = ['🐱', '🐶', '🐰', '🌳', '🏠', '⭐', '🍎', '🐟'];

const DIRECTION_NAMES = ['上面', '下面', '左邊', '右邊'];

/** Combined direction vocabulary for medium+ */
const COMBINED_DIRECTIONS: { label: string; dr: number; dc: number }[] = [
  { label: '左上方', dr: -1, dc: -1 },
  { label: '右上方', dr: -1, dc: 1 },
  { label: '左下方', dr: 1, dc: -1 },
  { label: '右下方', dr: 1, dc: 1 },
  { label: '上面', dr: -1, dc: 0 },
  { label: '下面', dr: 1, dc: 0 },
  { label: '左邊', dr: 0, dc: -1 },
  { label: '右邊', dr: 0, dc: 1 },
];

/**
 * 位置 (Positions) — HK P1 Crescent syllabus
 * easy: 2×2 grid relative positions (上/下/左/右)
 * medium: Add front/behind, combine terms (左上方 etc.)
 * hard: 3×3 scene with 3+ objects
 * challenge: Multi-step positional reasoning
 */
export function generatePositionsQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateEasyRelative, generateEasyRelativeVariant],
    medium: [generateMediumCombined, generateMediumFrontBehind],
    hard: [generateHardScene, generateHardSceneVariant],
    challenge: [generateChallengeMultiStep, generateChallengeMultiStepVariant],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

// ─── Helpers ───

function pickEmojis(n: number): string[] {
  return shuffleArray(EMOJI_POOL).slice(0, n);
}

/**
 * Get simple direction from A to B (A is in this direction relative to B).
 * Returns one of 上面/下面/左邊/右邊 or null if not axis-aligned or same position.
 */
function getSimpleDirection(aRow: number, aCol: number, bRow: number, bCol: number): string | null {
  if (aRow < bRow && aCol === bCol) return '上面';
  if (aRow > bRow && aCol === bCol) return '下面';
  if (aCol < bCol && aRow === bRow) return '左邊';
  if (aCol > bCol && aRow === bRow) return '右邊';
  return null;
}

/**
 * Get combined direction from A to B (A is in this direction relative to B).
 */
function getCombinedDirection(aRow: number, aCol: number, bRow: number, bCol: number): string | null {
  if (aRow === bRow && aCol === bCol) return null;
  const dr = aRow - bRow;
  const dc = aCol - bCol;
  for (const dir of COMBINED_DIRECTIONS) {
    const matchR = (dir.dr === 0 && dr === 0) || (dir.dr !== 0 && Math.sign(dr) === Math.sign(dir.dr));
    const matchC = (dir.dc === 0 && dc === 0) || (dir.dc !== 0 && Math.sign(dc) === Math.sign(dir.dc));
    if (matchR && matchC) return dir.label;
  }
  return null;
}

function buildDirectionOptions(correct: string, pool: string[]): string[] {
  const seen = new Set<string>([correct]);
  const distractors: string[] = [];
  for (const d of pool) {
    if (!seen.has(d) && distractors.length < 3) {
      seen.add(d);
      distractors.push(d);
    }
  }
  const fallbacks = ['前面', '後面', '旁邊', '中間', '對面'];
  for (const fb of fallbacks) {
    if (!seen.has(fb) && distractors.length < 3) {
      seen.add(fb);
      distractors.push(fb);
    }
  }
  return shuffleArray([correct, ...distractors]).slice(0, 4);
}

function buildEmojiOptions(correct: string, pool: string[]): string[] {
  const seen = new Set<string>([correct]);
  const distractors: string[] = [];
  for (const e of pool) {
    if (!seen.has(e) && distractors.length < 3) {
      seen.add(e);
      distractors.push(e);
    }
  }
  const fallbacks = ['🔵', '🟢', '🔴', '🟡'];
  for (const fb of fallbacks) {
    if (!seen.has(fb) && distractors.length < 3) {
      seen.add(fb);
      distractors.push(fb);
    }
  }
  return shuffleArray([correct, ...distractors]).slice(0, 4);
}

function buildPositionDescOptions(correct: string, allDescs: string[]): string[] {
  const seen = new Set<string>([correct]);
  const distractors: string[] = [];
  for (const d of allDescs) {
    if (!seen.has(d) && distractors.length < 3) {
      seen.add(d);
      distractors.push(d);
    }
  }
  const fallbacks = ['左上方', '右上方', '左下方', '右下方', '中間'];
  for (const fb of fallbacks) {
    if (!seen.has(fb) && distractors.length < 3) {
      seen.add(fb);
      distractors.push(fb);
    }
  }
  return shuffleArray([correct, ...distractors]).slice(0, 4);
}

/** Generate two positions in a 2×2 sub-grid that differ in exactly one axis */
function generate2x2Pair(): [{ r: number; c: number }, { r: number; c: number }] {
  const pairs: [{ r: number; c: number }, { r: number; c: number }][] = [
    [{ r: 0, c: 0 }, { r: 1, c: 0 }],
    [{ r: 1, c: 0 }, { r: 0, c: 0 }],
    [{ r: 0, c: 1 }, { r: 1, c: 1 }],
    [{ r: 1, c: 1 }, { r: 0, c: 1 }],
    [{ r: 0, c: 0 }, { r: 0, c: 1 }],
    [{ r: 0, c: 1 }, { r: 0, c: 0 }],
    [{ r: 1, c: 0 }, { r: 1, c: 1 }],
    [{ r: 1, c: 1 }, { r: 1, c: 0 }],
  ];
  return pairs[randomInt(0, pairs.length - 1)];
}

/** Build all valid combined-direction pairs on a 3×3 grid */
function buildCombinedPairs(): { aR: number; aC: number; bR: number; bC: number; label: string }[] {
  const pairs: { aR: number; aC: number; bR: number; bC: number; label: string }[] = [];
  for (let aR = 0; aR < 3; aR++) {
    for (let aC = 0; aC < 3; aC++) {
      for (let bR = 0; bR < 3; bR++) {
        for (let bC = 0; bC < 3; bC++) {
          if (aR === bR && aC === bC) continue;
          const dir = getCombinedDirection(aR, aC, bR, bC);
          if (dir) pairs.push({ aR, aC, bR, bC, label: dir });
        }
      }
    }
  }
  return pairs;
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
  let fallback = correct + 4;
  while (distractors.length < 3) {
    if (!seen.has(fallback.toString())) {
      seen.add(fallback.toString());
      distractors.push(fallback.toString());
    }
    fallback++;
  }
  return shuffleArray([correctStr, ...distractors]).slice(0, 4);
}

// ─── EASY: 2×2 grid relative positions ───

/** easy: Place 2 objects on a 2×2 area, ask "A在B的哪個方向？" */
function generateEasyRelative(): Question {
  const emojis = pickEmojis(2);
  const [aPos, bPos] = generate2x2Pair();
  const direction = getSimpleDirection(aPos.r, aPos.c, bPos.r, bPos.c)!;
  const objects = [
    { emoji: emojis[0], row: aPos.r, col: aPos.c },
    { emoji: emojis[1], row: bPos.r, col: bPos.c },
  ];
  const prompt = `${emojis[0]}在${emojis[1]}的哪個方向？`;
  const options = buildDirectionOptions(direction, DIRECTION_NAMES);
  return {
    id: generateId(),
    topicId: 'positions',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(direction),
    explanation: `${emojis[0]}在${emojis[1]}的${direction}。`,
    illustration: positionGridSvg(objects),
  };
}

/** easy variant: "B的上面是什麼？" */
function generateEasyRelativeVariant(): Question {
  const emojis = pickEmojis(2);
  const [aPos, bPos] = generate2x2Pair();
  const direction = getSimpleDirection(aPos.r, aPos.c, bPos.r, bPos.c)!;
  const objects = [
    { emoji: emojis[0], row: aPos.r, col: aPos.c },
    { emoji: emojis[1], row: bPos.r, col: bPos.c },
  ];
  const prompt = `${emojis[1]}的${direction}是什麼？`;
  const options = buildEmojiOptions(emojis[0], EMOJI_POOL);
  return {
    id: generateId(),
    topicId: 'positions',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(emojis[0]),
    explanation: `${emojis[1]}的${direction}是${emojis[0]}。`,
    illustration: positionGridSvg(objects),
  };
}

// ─── MEDIUM: Combined directions + front/behind ───

/** medium: Place 2 objects on 3×3 grid, ask combined direction (左上方 etc.) */
function generateMediumCombined(): Question {
  const emojis = pickEmojis(2);
  const validPairs = buildCombinedPairs();
  const pair = validPairs[randomInt(0, validPairs.length - 1)];
  const objects = [
    { emoji: emojis[0], row: pair.aR, col: pair.aC },
    { emoji: emojis[1], row: pair.bR, col: pair.bC },
  ];
  const allLabels = COMBINED_DIRECTIONS.map(d => d.label);
  const prompt = `${emojis[0]}在${emojis[1]}的哪個方向？`;
  const options = buildPositionDescOptions(pair.label, allLabels);
  return {
    id: generateId(),
    topicId: 'positions',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(pair.label),
    explanation: `${emojis[0]}在${emojis[1]}的${pair.label}。`,
    illustration: positionGridSvg(objects),
  };
}

/** medium variant: 3 objects in a column, ask about front/behind (前面/後面) */
function generateMediumFrontBehind(): Question {
  const emojis = pickEmojis(3);
  const col = randomInt(0, 2);
  // Assign rows 0, 1, 2 in random order — row 0 = front, row 2 = behind
  const rowOrder = shuffleArray([0, 1, 2]);
  const objects = emojis.map((e: string, i: number) => ({ emoji: e, row: rowOrder[i], col }));

  // Sort by row to find front-to-back order
  const sorted = objects.slice().sort((a, b) => a.row - b.row);
  // Ask: "X的後面是什麼？" where X is the front or middle object
  const askIdx = randomInt(0, 1); // 0 = front, 1 = middle
  const askObj = sorted[askIdx];
  const answerObj = sorted[askIdx + 1];

  const prompt = `${askObj.emoji}的後面是什麼？`;
  const options = buildEmojiOptions(answerObj.emoji, EMOJI_POOL);
  return {
    id: generateId(),
    topicId: 'positions',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(answerObj.emoji),
    explanation: `${answerObj.emoji}在${askObj.emoji}的後面。`,
    illustration: positionGridSvg(objects),
  };
}

// ─── HARD: 3×3 scene with 3+ objects ───

/** hard: Place 3 objects on 3×3 grid, ask relative position between two */
function generateHardScene(): Question {
  const emojis = pickEmojis(4);
  // Place 4 objects at distinct positions on the 3×3 grid
  const allPositions = shuffleArray([
    { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
    { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 },
    { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 },
  ]);
  const positions = allPositions.slice(0, 4);
  const objects = emojis.map((e: string, i: number) => ({
    emoji: e, row: positions[i].r, col: positions[i].c,
  }));

  // Pick two objects and ask the direction from first to second
  const idx1 = 0;
  const idx2 = 1;
  const dir = getCombinedDirection(
    positions[idx1].r, positions[idx1].c,
    positions[idx2].r, positions[idx2].c,
  );
  const correct = dir ?? '同一位置';
  const allLabels = COMBINED_DIRECTIONS.map(d => d.label);
  const prompt = `在下面的圖中，${emojis[idx1]}在${emojis[idx2]}的哪個方向？`;
  const options = buildPositionDescOptions(correct, allLabels);
  return {
    id: generateId(),
    topicId: 'positions',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${emojis[idx1]}在${emojis[idx2]}的${correct}。`,
    illustration: positionGridSvg(objects),
  };
}

/** hard variant: 3 objects on grid, describe two positions, ask about the third */
function generateHardSceneVariant(): Question {
  const emojis = pickEmojis(3);
  const allPositions = shuffleArray([
    { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
    { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 },
    { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 },
  ]);
  const positions = allPositions.slice(0, 3);
  const objects = emojis.map((e: string, i: number) => ({
    emoji: e, row: positions[i].r, col: positions[i].c,
  }));

  // Describe position of obj0 relative to obj1, then ask obj2 relative to obj1
  const dir01 = getCombinedDirection(positions[0].r, positions[0].c, positions[1].r, positions[1].c) ?? '旁邊';
  const dir21 = getCombinedDirection(positions[2].r, positions[2].c, positions[1].r, positions[1].c) ?? '旁邊';

  const allLabels = COMBINED_DIRECTIONS.map(d => d.label);
  const prompt = `${emojis[0]}在${emojis[1]}的${dir01}，那麼${emojis[2]}在${emojis[1]}的哪個方向？`;
  const options = buildPositionDescOptions(dir21, allLabels);
  return {
    id: generateId(),
    topicId: 'positions',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(dir21),
    explanation: `${emojis[2]}在${emojis[1]}的${dir21}。`,
    illustration: positionGridSvg(objects),
  };
}

// ─── CHALLENGE: Multi-step positional reasoning ───

/**
 * challenge: "A在B的左邊，B在C的上面，A在C的什麼位置？"
 * We place 3 objects deterministically so the chain of relations is solvable.
 */
function generateChallengeMultiStep(): Question {
  const emojis = pickEmojis(3);
  // Pick positions for A, B, C such that A→B and B→C have clear simple directions
  // and A→C has a combined direction
  const configs: { a: { r: number; c: number }; b: { r: number; c: number }; c: { r: number; c: number }; abDir: string; bcDir: string }[] = [
    { a: { r: 1, c: 0 }, b: { r: 1, c: 1 }, c: { r: 2, c: 1 }, abDir: '左邊', bcDir: '上面' },
    { a: { r: 1, c: 2 }, b: { r: 1, c: 1 }, c: { r: 2, c: 1 }, abDir: '右邊', bcDir: '上面' },
    { a: { r: 0, c: 1 }, b: { r: 1, c: 1 }, c: { r: 1, c: 2 }, abDir: '上面', bcDir: '左邊' },
    { a: { r: 2, c: 1 }, b: { r: 1, c: 1 }, c: { r: 1, c: 0 }, abDir: '下面', bcDir: '右邊' },
    { a: { r: 0, c: 0 }, b: { r: 0, c: 1 }, c: { r: 1, c: 1 }, abDir: '左邊', bcDir: '上面' },
    { a: { r: 0, c: 2 }, b: { r: 1, c: 2 }, c: { r: 1, c: 1 }, abDir: '上面', bcDir: '右邊' },
    { a: { r: 2, c: 0 }, b: { r: 1, c: 0 }, c: { r: 1, c: 1 }, abDir: '下面', bcDir: '左邊' },
    { a: { r: 0, c: 0 }, b: { r: 1, c: 0 }, c: { r: 2, c: 0 }, abDir: '上面', bcDir: '上面' },
  ];
  const cfg = configs[randomInt(0, configs.length - 1)];
  const acDir = getCombinedDirection(cfg.a.r, cfg.a.c, cfg.c.r, cfg.c.c) ?? '旁邊';

  const objects = [
    { emoji: emojis[0], row: cfg.a.r, col: cfg.a.c },
    { emoji: emojis[1], row: cfg.b.r, col: cfg.b.c },
    { emoji: emojis[2], row: cfg.c.r, col: cfg.c.c },
  ];

  const allLabels = COMBINED_DIRECTIONS.map(d => d.label);
  const prompt = `${emojis[0]}在${emojis[1]}的${cfg.abDir}，${emojis[1]}在${emojis[2]}的${cfg.bcDir}，${emojis[0]}在${emojis[2]}的哪個方向？`;
  const options = buildPositionDescOptions(acDir, allLabels);
  return {
    id: generateId(),
    topicId: 'positions',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(acDir),
    explanation: `${emojis[0]}在${emojis[1]}的${cfg.abDir}，${emojis[1]}在${emojis[2]}的${cfg.bcDir}，所以${emojis[0]}在${emojis[2]}的${acDir}。`,
    illustration: positionGridSvg(objects),
  };
}

/** challenge variant: Count how many objects are in a given direction from a target */
function generateChallengeMultiStepVariant(): Question {
  const emojis = pickEmojis(5);
  const allPositions = shuffleArray([
    { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 },
    { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 1, c: 2 },
    { r: 2, c: 0 }, { r: 2, c: 1 }, { r: 2, c: 2 },
  ]);
  const positions = allPositions.slice(0, 5);
  const objects = emojis.map((e: string, i: number) => ({
    emoji: e, row: positions[i].r, col: positions[i].c,
  }));

  // Pick a reference object (index 0) and ask how many are above/below/left/right
  const refPos = positions[0];
  const dirChoice = randomInt(0, 3);
  const dirNames = ['上面', '下面', '左邊', '右邊'];
  const dirName = dirNames[dirChoice];

  let count = 0;
  for (let i = 1; i < 5; i++) {
    const p = positions[i];
    switch (dirChoice) {
      case 0: if (p.r < refPos.r) count++; break;  // 上面
      case 1: if (p.r > refPos.r) count++; break;  // 下面
      case 2: if (p.c < refPos.c) count++; break;  // 左邊
      case 3: if (p.c > refPos.c) count++; break;  // 右邊
    }
  }

  const prompt = `在下面的圖中，${emojis[0]}的${dirName}有幾個物品？`;
  const options = buildNumericOptions(count);
  return {
    id: generateId(),
    topicId: 'positions',
    difficulty: 'challenge',
    prompt,
    options,
    correctAnswerIndex: options.indexOf(count.toString()),
    explanation: `${emojis[0]}的${dirName}有 ${count} 個物品。`,
    illustration: positionGridSvg(objects),
  };
}
