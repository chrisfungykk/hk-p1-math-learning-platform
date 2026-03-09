import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

interface ShapeComposition {
  parts: string[];
  result: string;
  description: string;
}

const BASIC_COMPOSITIONS: ShapeComposition[] = [
  { parts: ['三角形', '三角形'], result: '正方形', description: '兩個三角形可以拼成一個正方形' },
  { parts: ['三角形', '三角形'], result: '長方形', description: '兩個三角形可以拼成一個長方形' },
  { parts: ['正方形', '正方形'], result: '長方形', description: '兩個正方形可以拼成一個長方形' },
  { parts: ['三角形', '三角形'], result: '菱形', description: '兩個三角形可以拼成一個菱形' },
];

const SHAPE_PARTS: Record<string, string[]> = {
  '正方形': ['三角形', '三角形'],
  '長方形': ['正方形', '正方形'],
  '六邊形': ['三角形', '三角形', '三角形', '三角形', '三角形', '三角形'],
};

const ALL_SHAPES = ['三角形', '正方形', '長方形', '圓形', '菱形', '六邊形'];

/**
 * 圖形拼砌 (Composing Shapes)
 * Easy: combine 2 shapes — what do they make?
 * Medium: identify parts of a shape
 * Hard: decompose complex shapes
 */
export function generateComposingShapesQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push(generateCombineQuestion());
        break;
      case 'medium':
        questions.push(generateIdentifyPartsQuestion());
        break;
      case 'hard':
        questions.push(generateDecomposeQuestion());
        break;
    }
  }

  return questions;
}

function generateCombineQuestion(): Question {
  const comp = BASIC_COMPOSITIONS[randomInt(0, BASIC_COMPOSITIONS.length - 1)];
  const prompt = `兩個${comp.parts[0]}可以拼成什麼形狀？`;

  const distractors = new Set<string>();
  distractors.add(comp.result);
  while (distractors.size < 4) {
    distractors.add(ALL_SHAPES[randomInt(0, ALL_SHAPES.length - 1)]);
  }

  const options = shuffleArray(Array.from(distractors));
  const correctAnswerIndex = options.indexOf(comp.result);

  return {
    id: generateId(),
    topicId: 'composing-shapes',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex,
    explanation: `${comp.description}。`,
    graphicType: 'shape-compose',
  };
}

function generateIdentifyPartsQuestion(): Question {
  const shapeNames = Object.keys(SHAPE_PARTS);
  const shapeName = shapeNames[randomInt(0, shapeNames.length - 1)];
  const parts = SHAPE_PARTS[shapeName];
  const partCount = parts.length;
  const partName = parts[0];

  const prompt = `一個${shapeName}可以分成幾個${partName}？`;
  const correctAnswer = `${partCount}個`;

  const distractors = new Set<string>();
  distractors.add(correctAnswer);
  while (distractors.size < 4) {
    const d = randomInt(1, 8);
    distractors.add(`${d}個`);
  }

  const options = shuffleArray(Array.from(distractors));
  const correctAnswerIndex = options.indexOf(correctAnswer);

  return {
    id: generateId(),
    topicId: 'composing-shapes',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex,
    explanation: `一個${shapeName}可以分成${partCount}個${partName}。`,
    graphicType: 'shape-compose',
  };
}

function generateDecomposeQuestion(): Question {
  const scenarios = [
    {
      prompt: '一個長方形剪一刀，可以變成哪兩個形狀？',
      correct: '兩個正方形',
      explanation: '把長方形從中間剪開，可以得到兩個正方形。',
    },
    {
      prompt: '一個正方形沿對角線剪一刀，可以變成什麼？',
      correct: '兩個三角形',
      explanation: '正方形沿對角線剪開，可以得到兩個三角形。',
    },
    {
      prompt: '用三個三角形可以拼成什麼形狀？',
      correct: '梯形',
      explanation: '三個三角形可以拼成一個梯形。',
    },
    {
      prompt: '一個圓形可以分成幾個半圓？',
      correct: '2個',
      explanation: '一個圓形從中間分開，可以得到2個半圓。',
    },
  ];

  const scenario = scenarios[randomInt(0, scenarios.length - 1)];

  const possibleAnswers = [
    '兩個正方形', '兩個三角形', '兩個長方形', '兩個圓形',
    '梯形', '菱形', '六邊形', '2個', '3個', '4個',
  ];

  const distractors = new Set<string>();
  distractors.add(scenario.correct);
  while (distractors.size < 4) {
    const d = possibleAnswers[randomInt(0, possibleAnswers.length - 1)];
    if (d !== scenario.correct) {
      distractors.add(d);
    }
  }

  const options = shuffleArray(Array.from(distractors));
  const correctAnswerIndex = options.indexOf(scenario.correct);

  return {
    id: generateId(),
    topicId: 'composing-shapes',
    difficulty: 'hard',
    prompt: scenario.prompt,
    options,
    correctAnswerIndex,
    explanation: scenario.explanation,
    graphicType: 'shape-compose',
  };
}
