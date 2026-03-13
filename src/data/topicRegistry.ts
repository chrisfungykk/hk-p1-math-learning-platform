import type { TopicDefinition } from '../types';
import { generateCountingQuestions } from '../engine/topics/counting';
import { generateOddEvenQuestions } from '../engine/topics/oddEven';
import { generateOrdinalNumbersQuestions } from '../engine/topics/ordinalNumbers';
import { generateNumberCompositionQuestions } from '../engine/topics/numberComposition';
import { generateAddition10Questions } from '../engine/topics/addition10';
import { generateSubtraction10Questions } from '../engine/topics/subtraction10';
import { generateAddition20Questions } from '../engine/topics/addition20';
import { generateSubtraction20Questions } from '../engine/topics/subtraction20';
import { generatePositionsQuestions } from '../engine/topics/positions';
import { generateShapesQuestions } from '../engine/topics/shapes';
import { generateNumbers100Questions } from '../engine/topics/numbers100';
import { generateTwoDigitAdditionQuestions } from '../engine/topics/twoDigitAddition';
import { generateTwoDigitSubtractionQuestions } from '../engine/topics/twoDigitSubtraction';
import { generateCompareLengthQuestions } from '../engine/topics/compareLength';
import { generateMeasurementQuestions } from '../engine/topics/measurement';
import { generateFlatShapesQuestions } from '../engine/topics/flatShapes';
import { generateTellingTimeQuestions } from '../engine/topics/tellingTime';
import { generateOrderingQuestions } from '../engine/topics/ordering';
import { generateDataHandlingQuestions } from '../engine/topics/dataHandling';
import { generateWordProblemsQuestions } from '../engine/topics/wordProblems';
import { generateSkipCountingQuestions } from '../engine/topics/skipCounting';
import { generateComposingShapesQuestions } from '../engine/topics/composingShapes';
import { generateDirectionsQuestions } from '../engine/topics/directions';
import { generateCoinsNotesQuestions } from '../engine/topics/coinsNotes';
import { CountingAnimation } from '../animations/CountingAnimation';
import { OddEvenAnimation } from '../animations/OddEvenAnimation';
import { OrdinalNumbersAnimation } from '../animations/OrdinalNumbersAnimation';
import { NumberCompositionAnimation } from '../animations/NumberCompositionAnimation';
import { Addition10Animation } from '../animations/Addition10Animation';
import { Subtraction10Animation } from '../animations/Subtraction10Animation';
import { Addition20Animation } from '../animations/Addition20Animation';
import { Subtraction20Animation } from '../animations/Subtraction20Animation';
import { PositionsAnimation } from '../animations/PositionsAnimation';
import { ShapesAnimation } from '../animations/ShapesAnimation';
import { Numbers100Animation } from '../animations/Numbers100Animation';
import { TwoDigitAdditionAnimation } from '../animations/TwoDigitAdditionAnimation';
import { TwoDigitSubtractionAnimation } from '../animations/TwoDigitSubtractionAnimation';
import { CompareLengthAnimation } from '../animations/CompareLengthAnimation';
import { MeasurementAnimation } from '../animations/MeasurementAnimation';
import { FlatShapesAnimation } from '../animations/FlatShapesAnimation';
import { TellingTimeAnimation } from '../animations/TellingTimeAnimation';
import { OrderingAnimation } from '../animations/OrderingAnimation';
import { DataHandlingAnimation } from '../animations/DataHandlingAnimation';
import { WordProblemsAnimation } from '../animations/WordProblemsAnimation';
import { SkipCountingAnimation } from '../animations/SkipCountingAnimation';
import { ComposingShapesAnimation } from '../animations/ComposingShapesAnimation';
import { DirectionsAnimation } from '../animations/DirectionsAnimation';
import { CoinsNotesAnimation } from '../animations/CoinsNotesAnimation';

/**
 * Static registry mapping all 24 HK P1 math topic IDs to their metadata,
 * Remotion animation compositions, fallback image paths, and generator references.
 */
export const TOPIC_REGISTRY: Record<string, TopicDefinition> = {
  // ── Semester 1 (上學期) — 10 topics ──────────────────────────
  'counting': {
    id: 'counting',
    name: '數數',
    semester: 'sem1',
    animationComposition: CountingAnimation,
    fallbackImage: '/fallbacks/counting.svg',
    generateQuestions: generateCountingQuestions,
  },
  'odd-even': {
    id: 'odd-even',
    name: '單數和雙數',
    semester: 'sem1',
    animationComposition: OddEvenAnimation,
    fallbackImage: '/fallbacks/odd-even.svg',
    generateQuestions: generateOddEvenQuestions,
  },
  'ordinal-numbers': {
    id: 'ordinal-numbers',
    name: '序數',
    semester: 'sem1',
    animationComposition: OrdinalNumbersAnimation,
    fallbackImage: '/fallbacks/ordinal-numbers.svg',
    generateQuestions: generateOrdinalNumbersQuestions,
  },
  'number-composition': {
    id: 'number-composition',
    name: '數的組合',
    semester: 'sem1',
    animationComposition: NumberCompositionAnimation,
    fallbackImage: '/fallbacks/number-composition.svg',
    generateQuestions: generateNumberCompositionQuestions,
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
  'addition-20': {
    id: 'addition-20',
    name: '20以內加法',
    semester: 'sem1',
    animationComposition: Addition20Animation,
    fallbackImage: '/fallbacks/addition-20.svg',
    generateQuestions: generateAddition20Questions,
  },
  'subtraction-20': {
    id: 'subtraction-20',
    name: '20以內減法',
    semester: 'sem1',
    animationComposition: Subtraction20Animation,
    fallbackImage: '/fallbacks/subtraction-20.svg',
    generateQuestions: generateSubtraction20Questions,
  },
  'positions': {
    id: 'positions',
    name: '位置',
    semester: 'sem1',
    animationComposition: PositionsAnimation,
    fallbackImage: '/fallbacks/positions.svg',
    generateQuestions: generatePositionsQuestions,
  },
  'shapes': {
    id: 'shapes',
    name: '立體圖形',
    semester: 'sem1',
    animationComposition: ShapesAnimation,
    fallbackImage: '/fallbacks/shapes.svg',
    generateQuestions: generateShapesQuestions,
  },

  // ── Semester 2 (下學期) — 14 topics ──────────────────────────
  'numbers-100': {
    id: 'numbers-100',
    name: '100以內的數',
    semester: 'sem2',
    animationComposition: Numbers100Animation,
    fallbackImage: '/fallbacks/numbers-100.svg',
    generateQuestions: generateNumbers100Questions,
  },
  'two-digit-addition': {
    id: 'two-digit-addition',
    name: '兩位數加法',
    semester: 'sem2',
    animationComposition: TwoDigitAdditionAnimation,
    fallbackImage: '/fallbacks/two-digit-addition.svg',
    generateQuestions: generateTwoDigitAdditionQuestions,
  },
  'two-digit-subtraction': {
    id: 'two-digit-subtraction',
    name: '兩位數減法',
    semester: 'sem2',
    animationComposition: TwoDigitSubtractionAnimation,
    fallbackImage: '/fallbacks/two-digit-subtraction.svg',
    generateQuestions: generateTwoDigitSubtractionQuestions,
  },
  'compare-length-height': {
    id: 'compare-length-height',
    name: '比較長短和高矮',
    semester: 'sem2',
    animationComposition: CompareLengthAnimation,
    fallbackImage: '/fallbacks/compare-length-height.svg',
    generateQuestions: generateCompareLengthQuestions,
  },
  'measurement': {
    id: 'measurement',
    name: '量度',
    semester: 'sem2',
    animationComposition: MeasurementAnimation,
    fallbackImage: '/fallbacks/measurement.svg',
    generateQuestions: generateMeasurementQuestions,
  },
  'flat-shapes': {
    id: 'flat-shapes',
    name: '平面圖形',
    semester: 'sem2',
    animationComposition: FlatShapesAnimation,
    fallbackImage: '/fallbacks/flat-shapes.svg',
    generateQuestions: generateFlatShapesQuestions,
  },
  'telling-time': {
    id: 'telling-time',
    name: '認識時間',
    semester: 'sem2',
    animationComposition: TellingTimeAnimation,
    fallbackImage: '/fallbacks/telling-time.svg',
    generateQuestions: generateTellingTimeQuestions,
  },
  'ordering-sequences': {
    id: 'ordering-sequences',
    name: '排列和序列',
    semester: 'sem2',
    animationComposition: OrderingAnimation,
    fallbackImage: '/fallbacks/ordering-sequences.svg',
    generateQuestions: generateOrderingQuestions,
  },
  'data-handling': {
    id: 'data-handling',
    name: '數據處理',
    semester: 'sem2',
    animationComposition: DataHandlingAnimation,
    fallbackImage: '/fallbacks/data-handling.svg',
    generateQuestions: generateDataHandlingQuestions,
  },
  'word-problems': {
    id: 'word-problems',
    name: '加減應用題',
    semester: 'sem2',
    animationComposition: WordProblemsAnimation,
    fallbackImage: '/fallbacks/word-problems.svg',
    generateQuestions: generateWordProblemsQuestions,
  },
  'skip-counting': {
    id: 'skip-counting',
    name: '2、5、10的倍數',
    semester: 'sem2',
    animationComposition: SkipCountingAnimation,
    fallbackImage: '/fallbacks/skip-counting.svg',
    generateQuestions: generateSkipCountingQuestions,
  },
  'composing-shapes': {
    id: 'composing-shapes',
    name: '圖形拼砌',
    semester: 'sem2',
    animationComposition: ComposingShapesAnimation,
    fallbackImage: '/fallbacks/composing-shapes.svg',
    generateQuestions: generateComposingShapesQuestions,
  },
  'directions': {
    id: 'directions',
    name: '方向',
    semester: 'sem2',
    animationComposition: DirectionsAnimation,
    fallbackImage: '/fallbacks/directions.svg',
    generateQuestions: generateDirectionsQuestions,
  },
  'coins-notes': {
    id: 'coins-notes',
    name: '認識貨幣',
    semester: 'sem2',
    animationComposition: CoinsNotesAnimation,
    fallbackImage: '/fallbacks/coins-notes.svg',
    generateQuestions: generateCoinsNotesQuestions,
  },
};

/**
 * Look up a topic definition by its ID.
 * Returns undefined if the topic ID is not found in the registry.
 */
export function getTopicById(topicId: string): TopicDefinition | undefined {
  return TOPIC_REGISTRY[topicId];
}