import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

interface ShapeInfo {
  name: string;
  emoji: string;
  sides: number;
  description: string;
}

const ALL_SHAPES: ShapeInfo[] = [
  { name: '圓形', emoji: '⚪', sides: 0, description: '沒有角，是圓圓的' },
  { name: '正方形', emoji: '🟧', sides: 4, description: '有4條一樣長的邊和4個角' },
  { name: '三角形', emoji: '🔺', sides: 3, description: '有3條邊和3個角' },
  { name: '長方形', emoji: '🟦', sides: 4, description: '有4條邊和4個角，對邊一樣長' },
];

const EXTRA_SHAPES: ShapeInfo[] = [
  { name: '菱形', emoji: '🔷', sides: 4, description: '有4條一樣長的邊，但角不是直角' },
  { name: '五邊形', emoji: '⬠', sides: 5, description: '有5條邊和5個角' },
];

/**
 * 認識形狀 (Recognizing Shapes)
 * Easy: 2-3 shapes (圓形, 正方形, 三角形)
 * Medium: 4 shapes (+ 長方形)
 * Hard: 4+ shapes with property questions
 */
export function generateShapesQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const question = difficulty === 'hard' && randomInt(0, 1) === 1
      ? generatePropertyQuestion(difficulty)
      : generateIdentifyQuestion(difficulty);
    questions.push(question);
  }

  return questions;
}

function getAvailableShapes(difficulty: DifficultyLevel): ShapeInfo[] {
  switch (difficulty) {
    case 'easy':
      return ALL_SHAPES.slice(0, 3);
    case 'medium':
      return ALL_SHAPES;
    case 'hard':
      return [...ALL_SHAPES, ...EXTRA_SHAPES];
  }
}

function generateIdentifyQuestion(difficulty: DifficultyLevel): Question {
  const shapes = getAvailableShapes(difficulty);
  const targetIndex = randomInt(0, shapes.length - 1);
  const target = shapes[targetIndex];

  const prompt = `哪一個是${target.name}？ ${target.emoji}`;

  // Build options from available shapes
  const optionShapes = new Set<string>();
  optionShapes.add(target.name);
  while (optionShapes.size < Math.min(4, shapes.length)) {
    optionShapes.add(shapes[randomInt(0, shapes.length - 1)].name);
  }

  const optionsArr = shuffleArray(Array.from(optionShapes));
  const correctAnswerIndex = optionsArr.indexOf(target.name);

  return {
    id: generateId(),
    topicId: 'shapes',
    difficulty,
    prompt,
    options: optionsArr,
    correctAnswerIndex,
    explanation: `這是${target.name}。${target.description}。`,
    graphicType: 'shape',
  };
}

function generatePropertyQuestion(difficulty: DifficultyLevel): Question {
  const shapes = getAvailableShapes(difficulty);
  const targetIndex = randomInt(0, shapes.length - 1);
  const target = shapes[targetIndex];

  const questionTypes = [
    {
      prompt: `${target.name}有幾條邊？`,
      answer: target.sides === 0 ? '0（沒有邊）' : `${target.sides}`,
      explanation: `${target.name}${target.description}。`,
    },
    {
      prompt: `${target.name}有幾個角？`,
      answer: target.sides === 0 ? '0（沒有角）' : `${target.sides}`,
      explanation: `${target.name}${target.description}。`,
    },
  ];

  const qt = questionTypes[randomInt(0, questionTypes.length - 1)];

  const distractors = new Set<string>();
  distractors.add(qt.answer);
  const possibleAnswers = ['0（沒有邊）', '0（沒有角）', '3', '4', '5', '6'];
  while (distractors.size < 4) {
    distractors.add(possibleAnswers[randomInt(0, possibleAnswers.length - 1)]);
  }

  const options = shuffleArray(Array.from(distractors));
  const correctAnswerIndex = options.indexOf(qt.answer);

  return {
    id: generateId(),
    topicId: 'shapes',
    difficulty,
    prompt: qt.prompt,
    options,
    correctAnswerIndex,
    explanation: qt.explanation,
    graphicType: 'shape',
  };
}
