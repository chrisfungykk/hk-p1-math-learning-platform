import { describe, it, expect } from 'vitest';
import { generateOddEvenQuestions } from '../../engine/topics/oddEven';
import { generateOrdinalNumbersQuestions } from '../../engine/topics/ordinalNumbers';
import { generateNumberCompositionQuestions } from '../../engine/topics/numberComposition';
import { generateCountingQuestions } from '../../engine/topics/counting';
import { generateShapesQuestions } from '../../engine/topics/shapes';
import { generateFlatShapesQuestions } from '../../engine/topics/flatShapes';

/**
 * Content-specific unit tests for new and modified topics.
 * Validates: Requirements 1.2, 2.2, 3.2, 11.1, 13.1, 13.2
 */

describe('odd-even easy questions', () => {
  it('should contain 單數 or 雙數 in options', () => {
    const questions = generateOddEvenQuestions('easy', 10);
    for (const q of questions) {
      const hasParityOption = q.options.some(
        (opt) => opt.includes('單數') || opt.includes('雙數'),
      );
      expect(hasParityOption).toBe(true);
    }
  });
});

describe('ordinal-numbers easy questions', () => {
  it('should contain 第 in prompt', () => {
    const questions = generateOrdinalNumbersQuestions('easy', 10);
    for (const q of questions) {
      expect(q.prompt).toContain('第');
    }
  });
});

describe('number-composition easy questions', () => {
  it('should involve bonds within 10 (prompt contains numbers ≤ 10)', () => {
    const questions = generateNumberCompositionQuestions('easy', 10);
    for (const q of questions) {
      // Extract all numbers from the prompt
      const numbers = q.prompt.match(/\d+/g)?.map(Number) ?? [];
      // All numbers in easy bond prompts should be ≤ 10
      for (const n of numbers) {
        expect(n).toBeLessThanOrEqual(10);
      }
    }
  });
});

describe('counting easy questions', () => {
  it('should include Chinese number words (一~二十) in at least one of 50 questions', () => {
    const chineseNumberWords = [
      '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    ];
    const questions = generateCountingQuestions('easy', 50);
    const hasChineseWord = questions.some((q) =>
      chineseNumberWords.some((word) => q.prompt.includes(word)),
    );
    expect(hasChineseWord).toBe(true);
  });
});

describe('shapes questions (3D only)', () => {
  it('should only produce 3D shape names', () => {
    const valid3DNames = ['正方體', '長方體', '圓柱體', '球體', '圓錐體', '三角錐'];
    const questions = generateShapesQuestions('easy', 20);
    for (const q of questions) {
      // Check that any shape name in options is a valid 3D shape
      for (const opt of q.options) {
        // Only check options that look like shape names (contain 體 or 錐)
        if (/[體錐]/.test(opt) || valid3DNames.includes(opt)) {
          expect(valid3DNames).toContain(opt);
        }
      }
    }
  });
});

describe('flat-shapes questions (2D only)', () => {
  it('should only produce 2D shape names', () => {
    const valid2DNames = ['圓形', '三角形', '正方形', '長方形'];
    const questions = generateFlatShapesQuestions('easy', 20);
    for (const q of questions) {
      for (const opt of q.options) {
        // Only check options that look like 2D shape names (contain 形)
        if (/形$/.test(opt) || valid2DNames.includes(opt)) {
          expect(valid2DNames).toContain(opt);
        }
      }
    }
  });
});
