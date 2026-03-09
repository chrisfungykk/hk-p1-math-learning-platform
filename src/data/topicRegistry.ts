import type { TopicDefinition } from '../types';
import { generateCountingQuestions } from '../engine/topics/counting';
import { generateAddition10Questions } from '../engine/topics/addition10';
import { generateSubtraction10Questions } from '../engine/topics/subtraction10';
import { generateShapesQuestions } from '../engine/topics/shapes';
import { generateCompareLengthQuestions } from '../engine/topics/compareLength';
import { generateOrderingQuestions } from '../engine/topics/ordering';
import { generateAddition20Questions } from '../engine/topics/addition20';
import { generateSubtraction20Questions } from '../engine/topics/subtraction20';
import { generateTellingTimeQuestions } from '../engine/topics/tellingTime';
import { generateCoinsNotesQuestions } from '../engine/topics/coinsNotes';
import { generateComposingShapesQuestions } from '../engine/topics/composingShapes';
import { generateDataHandlingQuestions } from '../engine/topics/dataHandling';
import { CountingAnimation } from '../animations/CountingAnimation';
import { Addition10Animation } from '../animations/Addition10Animation';
import { Subtraction10Animation } from '../animations/Subtraction10Animation';
import { ShapesAnimation } from '../animations/ShapesAnimation';
import { CompareLengthAnimation } from '../animations/CompareLengthAnimation';
import { OrderingAnimation } from '../animations/OrderingAnimation';
import { Addition20Animation } from '../animations/Addition20Animation';
import { Subtraction20Animation } from '../animations/Subtraction20Animation';
import { TellingTimeAnimation } from '../animations/TellingTimeAnimation';
import { CoinsNotesAnimation } from '../animations/CoinsNotesAnimation';
import { ComposingShapesAnimation } from '../animations/ComposingShapesAnimation';
import { DataHandlingAnimation } from '../animations/DataHandlingAnimation';

/**
 * Static registry mapping all 12 HK P1 math topic IDs to their metadata,
 * Remotion animation compositions, fallback image paths, and generator references.
 */
export const TOPIC_REGISTRY: Record<string, TopicDefinition> = {
  // ── Semester 1 (上學期) ──────────────────────────────────────
  'counting': {
    id: 'counting',
    name: '數數',
    semester: 'sem1',
    animationComposition: CountingAnimation,
    fallbackImage: '/fallbacks/counting.svg',
    generateQuestions: generateCountingQuestions,
  },
  'addition-10': {
    id: 'addition-10',
    name: '基本加法',
    semester: 'sem1',
    animationComposition: Addition10Animation,
    fallbackImage: '/fallbacks/addition-10.svg',
    generateQuestions: generateAddition10Questions,
  },
  'subtraction-10': {
    id: 'subtraction-10',
    name: '基本減法',
    semester: 'sem1',
    animationComposition: Subtraction10Animation,
    fallbackImage: '/fallbacks/subtraction-10.svg',
    generateQuestions: generateSubtraction10Questions,
  },
  'shapes': {
    id: 'shapes',
    name: '認識形狀',
    semester: 'sem1',
    animationComposition: ShapesAnimation,
    fallbackImage: '/fallbacks/shapes.svg',
    generateQuestions: generateShapesQuestions,
  },

  'compare-length-height': {
    id: 'compare-length-height',
    name: '比較長短和高矮',
    semester: 'sem1',
    animationComposition: CompareLengthAnimation,
    fallbackImage: '/fallbacks/compare-length-height.svg',
    generateQuestions: generateCompareLengthQuestions,
  },
  'ordering-sequences': {
    id: 'ordering-sequences',
    name: '排列和序列',
    semester: 'sem1',
    animationComposition: OrderingAnimation,
    fallbackImage: '/fallbacks/ordering-sequences.svg',
    generateQuestions: generateOrderingQuestions,
  },

  // ── Semester 2 (下學期) ──────────────────────────────────────
  'addition-20': {
    id: 'addition-20',
    name: '20以內加法',
    semester: 'sem2',
    animationComposition: Addition20Animation,
    fallbackImage: '/fallbacks/addition-20.svg',
    generateQuestions: generateAddition20Questions,
  },
  'subtraction-20': {
    id: 'subtraction-20',
    name: '20以內減法',
    semester: 'sem2',
    animationComposition: Subtraction20Animation,
    fallbackImage: '/fallbacks/subtraction-20.svg',
    generateQuestions: generateSubtraction20Questions,
  },
  'telling-time': {
    id: 'telling-time',
    name: '認識時間',
    semester: 'sem2',
    animationComposition: TellingTimeAnimation,
    fallbackImage: '/fallbacks/telling-time.svg',
    generateQuestions: generateTellingTimeQuestions,
  },
  'coins-notes': {
    id: 'coins-notes',
    name: '認識貨幣',
    semester: 'sem2',
    animationComposition: CoinsNotesAnimation,
    fallbackImage: '/fallbacks/coins-notes.svg',
    generateQuestions: generateCoinsNotesQuestions,
  },
  'composing-shapes': {
    id: 'composing-shapes',
    name: '圖形拼砌',
    semester: 'sem2',
    animationComposition: ComposingShapesAnimation,
    fallbackImage: '/fallbacks/composing-shapes.svg',
    generateQuestions: generateComposingShapesQuestions,
  },
  'data-handling': {
    id: 'data-handling',
    name: '數據處理',
    semester: 'sem2',
    animationComposition: DataHandlingAnimation,
    fallbackImage: '/fallbacks/data-handling.svg',
    generateQuestions: generateDataHandlingQuestions,
  },
};

/**
 * Look up a topic definition by its ID.
 * Returns undefined if the topic ID is not found in the registry.
 */
export function getTopicById(topicId: string): TopicDefinition | undefined {
  return TOPIC_REGISTRY[topicId];
}