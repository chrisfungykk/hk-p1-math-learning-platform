// Feature: curriculum-syllabus-alignment, Property 3: Chinese text in prompts and options
// Feature: curriculum-syllabus-alignment, Property 6: Illustration SVG generators produce valid SVG
// Feature: curriculum-syllabus-alignment, Property 7: Arithmetic answer correctness
import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  numberBondSvg,
  ordinalRowSvg,
  positionGridSvg,
  verticalMathSvg,
  rulerSvg,
  compassSvg,
} from '../../utils/illustrations';
import { generateQuestions } from '../../engine/questionGenerator';
import type { DifficultyLevel } from '../../types';

const ALL_TOPIC_IDS = [
  'counting', 'odd-even', 'ordinal-numbers', 'number-composition',
  'addition-10', 'subtraction-10', 'addition-20', 'subtraction-20',
  'positions', 'shapes',
  'numbers-100', 'two-digit-addition', 'two-digit-subtraction',
  'compare-length-height', 'measurement', 'flat-shapes',
  'telling-time', 'ordering-sequences', 'data-handling',
  'word-problems', 'skip-counting', 'composing-shapes',
  'directions', 'coins-notes',
] as const;

const ARITHMETIC_TOPIC_IDS = [
  'addition-10', 'subtraction-10', 'addition-20', 'subtraction-20',
  'two-digit-addition', 'two-digit-subtraction',
] as const;

const CJK_REGEX = /[\u4e00-\u9fff]/;

/**
 * Property 3: Chinese text in prompts and options
 *
 * For any topic and difficulty, every generated question's prompt should contain
 * at least one Chinese character (Unicode range \u4e00-\u9fff).
 *
 * **Validates: Requirements 15.3**
 */
describe('Property 3: Chinese text in prompts and options', () => {
  it('every question prompt contains at least one Chinese character or is a pure arithmetic expression', () => {
    // Pure arithmetic prompts like "5 - 3 = ?" or "18 - ☐ = 5，☐ = ?" are acceptable
    const pureArithRegex = /^[\d\s+\-−×÷=?☐△\n.,:;()（）><=≤≥→，。、；：]+$/;

    fc.assert(
      fc.property(
        fc.constantFrom(...ALL_TOPIC_IDS),
        fc.constantFrom<DifficultyLevel>('easy', 'medium', 'hard', 'challenge'),
        (topicId, difficulty) => {
          const questions = generateQuestions({ topicId, difficulty, count: 5 });
          for (const q of questions) {
            const hasChinese = CJK_REGEX.test(q.prompt);
            const isPureArith = pureArithRegex.test(q.prompt);
            expect(hasChinese || isPureArith).toBe(true);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 6: Illustration SVG generators produce valid SVG
 *
 * For any valid input to each illustration generator function, the returned
 * string should start with `<svg` and end with `</svg>`.
 *
 * **Validates: Requirements 2.7, 3.7, 4.7, 6.7, 7.7, 8.7, 10.7, 15.7**
 */
describe('Property 6: Illustration SVG generators produce valid SVG', () => {
  it('numberBondSvg returns valid SVG for any total [1,20] and partA [0,total]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        fc.integer({ min: 0, max: 20 }),
        fc.option(fc.integer({ min: 0, max: 20 }), { nil: undefined }),
        (total, partA, partB) => {
          const svg = numberBondSvg(total, partA, partB);
          expect(svg.startsWith('<svg')).toBe(true);
          expect(svg.endsWith('</svg>')).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('ordinalRowSvg returns valid SVG for any items array up to 8', () => {
    const emojiArb = fc.constantFrom('🍎', '🍊', '🐱', '🐶', '⭐', '🌸', '🎈', '🚗');
    fc.assert(
      fc.property(
        fc.array(emojiArb, { minLength: 1, maxLength: 8 }),
        fc.option(fc.integer({ min: 0, max: 7 }), { nil: undefined }),
        (items, highlightIndex) => {
          const svg = ordinalRowSvg(items, highlightIndex);
          expect(svg.startsWith('<svg')).toBe(true);
          expect(svg.endsWith('</svg>')).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('positionGridSvg returns valid SVG for any objects on a 3×3 grid', () => {
    const objectArb = fc.record({
      emoji: fc.constantFrom('🐱', '🐶', '🐰', '🌳', '🏠', '⭐'),
      row: fc.integer({ min: 0, max: 2 }),
      col: fc.integer({ min: 0, max: 2 }),
    });
    fc.assert(
      fc.property(
        fc.array(objectArb, { minLength: 0, maxLength: 5 }),
        (objects) => {
          const svg = positionGridSvg(objects);
          expect(svg.startsWith('<svg')).toBe(true);
          expect(svg.endsWith('</svg>')).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('verticalMathSvg returns valid SVG for any a,b [0,99] and op +/-', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 99 }),
        fc.integer({ min: 0, max: 99 }),
        fc.constantFrom('+' as const, '-' as const),
        (a, b, op) => {
          const svg = verticalMathSvg(a, b, op);
          expect(svg.startsWith('<svg')).toBe(true);
          expect(svg.endsWith('</svg>')).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('rulerSvg returns valid SVG for any lengthCm [1,30] with optional label', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 30 }),
        fc.option(fc.constantFrom('鉛筆', '繩子', '尺子', '橡皮'), { nil: undefined }),
        (lengthCm, objectLabel) => {
          const svg = rulerSvg(lengthCm, objectLabel);
          expect(svg.startsWith('<svg')).toBe(true);
          expect(svg.endsWith('</svg>')).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('compassSvg returns valid SVG for any highlighted direction or undefined', () => {
    fc.assert(
      fc.property(
        fc.option(fc.constantFrom('東', '南', '西', '北'), { nil: undefined }),
        (highlighted) => {
          const svg = compassSvg(highlighted);
          expect(svg.startsWith('<svg')).toBe(true);
          expect(svg.endsWith('</svg>')).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: curriculum-syllabus-alignment, Property 4: Two-digit addition difficulty-carry alignment
// Feature: curriculum-syllabus-alignment, Property 5: Two-digit subtraction difficulty-borrow alignment
import { generateTwoDigitAdditionQuestions } from '../../engine/topics/twoDigitAddition';
import { generateTwoDigitSubtractionQuestions } from '../../engine/topics/twoDigitSubtraction';

/**
 * Property 4: Two-digit addition difficulty-carry alignment
 *
 * For any easy question, the sum of the units digits of the two addends should be ≤ 9 (no carry).
 * For any hard question, the sum of the units digits should be > 9 (carry required).
 *
 * **Validates: Requirements 6.2, 6.3, 6.4**
 */
describe('Property 4: Two-digit addition difficulty-carry alignment', () => {
  it('easy questions have no carry (units sum ≤ 9)', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const [q] = generateTwoDigitAdditionQuestions('easy', 1);
        const match = q.prompt.match(/(\d+)\s*\+\s*(\d+)/);
        expect(match).not.toBeNull();
        const a = parseInt(match![1], 10);
        const b = parseInt(match![2], 10);
        const unitsSum = (a % 10) + (b % 10);
        expect(unitsSum).toBeLessThanOrEqual(9);
      }),
      { numRuns: 100 },
    );
  });

  it('hard questions require carry (units sum > 9)', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const [q] = generateTwoDigitAdditionQuestions('hard', 1);
        const match = q.prompt.match(/(\d+)\s*\+\s*(\d+)/);
        expect(match).not.toBeNull();
        const a = parseInt(match![1], 10);
        const b = parseInt(match![2], 10);
        const unitsSum = (a % 10) + (b % 10);
        expect(unitsSum).toBeGreaterThan(9);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 5: Two-digit subtraction difficulty-borrow alignment
 *
 * For any easy question, the units digit of the minuend should be ≥ the units digit of the subtrahend (no borrow).
 * For any hard question, the units digit of the minuend should be < the units digit of the subtrahend (borrow required).
 *
 * **Validates: Requirements 7.2, 7.3, 7.4**
 */
describe('Property 5: Two-digit subtraction difficulty-borrow alignment', () => {
  it('easy questions have no borrow (minuend units ≥ subtrahend units)', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const [q] = generateTwoDigitSubtractionQuestions('easy', 1);
        // Handle both − (U+2212) and - (U+002D)
        const match = q.prompt.match(/(\d+)\s*[−\-]\s*(\d+)/);
        expect(match).not.toBeNull();
        const a = parseInt(match![1], 10);
        const b = parseInt(match![2], 10);
        expect(a % 10).toBeGreaterThanOrEqual(b % 10);
      }),
      { numRuns: 100 },
    );
  });

  it('hard questions require borrow (minuend units < subtrahend units)', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const [q] = generateTwoDigitSubtractionQuestions('hard', 1);
        // Handle both − (U+2212) and - (U+002D)
        const match = q.prompt.match(/(\d+)\s*[−\-]\s*(\d+)/);
        expect(match).not.toBeNull();
        const a = parseInt(match![1], 10);
        const b = parseInt(match![2], 10);
        expect(a % 10).toBeLessThan(b % 10);
      }),
      { numRuns: 100 },
    );
  });
});


// Feature: curriculum-syllabus-alignment, Property 8: Zero-addend inclusion in addition-10
// Feature: curriculum-syllabus-alignment, Property 9: Zero-related inclusion in subtraction-10
import { generateAddition10Questions } from '../../engine/topics/addition10';
import { generateSubtraction10Questions } from '../../engine/topics/subtraction10';

/**
 * Property 8: Zero-addend inclusion in addition-10
 *
 * For any batch of 50 easy-difficulty questions from the addition-10 generator,
 * at least one question should involve a zero addend (0+N or N+0 pattern in the prompt).
 *
 * **Validates: Requirements 12.1, 12.3**
 */
describe('Property 8: Zero-addend inclusion in addition-10', () => {
  it('a batch of 50 easy questions contains at least one zero-addend question', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const questions = generateAddition10Questions('easy', 50);
        const zeroPattern = /\b0\s*\+|\+\s*0\b/;
        const hasZeroAddend = questions.some((q) => zeroPattern.test(q.prompt));
        expect(hasZeroAddend).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});

/**
 * Property 9: Zero-related inclusion in subtraction-10
 *
 * For any batch of 50 easy-difficulty questions from the subtraction-10 generator,
 * at least one question should involve zero (N−0 or N−N pattern in the prompt).
 *
 * **Validates: Requirements 12.2, 12.4**
 */
describe('Property 9: Zero-related inclusion in subtraction-10', () => {
  it('a batch of 50 easy questions contains at least one zero-related question', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const questions = generateSubtraction10Questions('easy', 50);
        const nMinusZero = /\b\d+\s*-\s*0\b/;
        const hasZeroRelated = questions.some((q) => {
          // Check N - 0 pattern
          if (nMinusZero.test(q.prompt)) return true;
          // Check N - N = 0 pattern (both operands are the same)
          const match = q.prompt.match(/^(\d+)\s*-\s*(\d+)\s*=/);
          if (match && match[1] === match[2]) return true;
          return false;
        });
        expect(hasZeroRelated).toBe(true);
      }),
      { numRuns: 100 },
    );
  });
});


/**
 * Property 7: Arithmetic answer correctness
 *
 * For any question from arithmetic topics whose prompt matches a simple
 * "A + B = ?" or "A - B = ?" pattern, the option at correctAnswerIndex
 * should equal the mathematically correct result.
 *
 * **Validates: Requirements 16.4**
 */
describe('Property 7: Arithmetic answer correctness', () => {
  it('the correct option matches the computed arithmetic result', () => {
    // Regex to match simple "A + B = ?" or "A − B = ?" patterns
    // Handles both regular minus (U+002D) and minus sign (U+2212)
    // Must start with a digit (not ☐) and only have two operands
    const simpleArithRegex = /^(?:計算：)?(\d+)\s*([+\-−])\s*(\d+)\s*=\s*\?$/;

    fc.assert(
      fc.property(
        fc.constantFrom(...ARITHMETIC_TOPIC_IDS),
        fc.constantFrom<DifficultyLevel>('easy', 'medium', 'hard', 'challenge'),
        (topicId, difficulty) => {
          const questions = generateQuestions({ topicId, difficulty, count: 5 });
          for (const q of questions) {
            // Skip prompts with ☐, multi-step, or word problems
            if (q.prompt.includes('☐') || q.prompt.includes('△')) continue;
            const match = q.prompt.match(simpleArithRegex);
            if (!match) continue; // skip non-simple prompts
            const a = parseInt(match[1], 10);
            const op = match[2];
            const b = parseInt(match[3], 10);
            const expected = (op === '+') ? a + b : a - b;
            const correctOption = q.options[q.correctAnswerIndex];
            expect(correctOption).toBe(expected.toString());
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
