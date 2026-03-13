# Implementation Plan: Curriculum Syllabus Alignment

## Overview

Expand the platform from 13 to 24 topics (10 sem1 + 14 sem2) to align with the Crescent Education P1 syllabus. Coins-notes moves from sem1 to sem2. All difficulty levels are increased across existing and new topics. Implementation proceeds bottom-up: illustration utilities → question generators → animations → fallbacks → registry/constants → difficulty increase → tests → version bump.

## Tasks

- [x] 1. Add new illustration SVG generators
  - [x] 1.1 Implement `numberBondSvg(total, partA, partB?)` in `src/utils/illustrations.ts`
    - Render circle-branch-circle number bond diagram
    - Return string starting with `<svg` and ending with `</svg>`
    - Clamp inputs to sensible defaults for out-of-range values
    - _Requirements: 3.7, 15.7_

  - [x] 1.2 Implement `ordinalRowSvg(items, highlightIndex?)` in `src/utils/illustrations.ts`
    - Render a row of colored circles/objects with ordinal position labels
    - _Requirements: 2.7, 15.7_

  - [x] 1.3 Implement `positionGridSvg(objects)` in `src/utils/illustrations.ts`
    - Render a labeled grid with emoji objects at specified row/col positions
    - _Requirements: 4.7, 15.7_

  - [x] 1.4 Implement `verticalMathSvg(a, b, op)` in `src/utils/illustrations.ts`
    - Render vertical arithmetic layout with tens and units columns
    - Support both `'+'` and `'-'` operators
    - _Requirements: 6.7, 7.7, 15.7_

  - [x] 1.5 Implement `rulerSvg(lengthCm, objectLabel?)` in `src/utils/illustrations.ts`
    - Render ruler with cm markings and optional object being measured
    - Clamp lengthCm to [1, 30]
    - _Requirements: 8.7, 15.7_

  - [x] 1.6 Implement `compassSvg(highlighted?)` in `src/utils/illustrations.ts`
    - Render compass rose with labeled cardinal directions (東南西北)
    - Optionally highlight one direction
    - _Requirements: 10.7, 15.7_

  - [x] 1.7 Write property tests for new illustration SVG generators
    - **Property 6: Illustration SVG generators produce valid SVG**
    - Test all 6 new functions return strings starting with `<svg` and ending with `</svg>`
    - Add to `src/__tests__/properties/curriculum-alignment.property.test.ts`
    - **Validates: Requirements 2.7, 3.7, 4.7, 6.7, 7.7, 8.7, 10.7, 15.7**

- [x] 2. Checkpoint — Verify illustration generators
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Implement sem1 new question generators
  - [x] 3.1 Create `src/engine/topics/oddEven.ts` — 單數和雙數 generator
    - Implement `generateOddEvenQuestions(difficulty, count)` with `Record<DifficultyLevel, (() => Question)[]>` pattern
    - easy: Is N (1–20) odd or even? medium: Pick all odd/even from a set. hard: Odd/even arithmetic rules. challenge: Count even/odd numbers in a range
    - Use `countDotsSvg` for easy illustrations (grouped pairs)
    - All prompt/option text in 繁體中文, deterministic distractors
    - _Requirements: 1.1–1.5, 15.1–15.4_

  - [x] 3.2 Create `src/engine/topics/ordinalNumbers.ts` — 序數 generator
    - Implement `generateOrdinalNumbersQuestions(difficulty, count)`
    - easy: "第N個是什麼?" from left. medium: From left AND right. hard: Range counting. challenge: Two-directional reasoning
    - Use `ordinalRowSvg` for illustrations
    - _Requirements: 2.1–2.5, 15.1–15.4_

  - [x] 3.3 Create `src/engine/topics/numberComposition.ts` — 數的組合 generator
    - Implement `generateNumberCompositionQuestions(difficulty, count)`
    - easy: Number bonds within 10. medium: Bonds within 18 + missing-part. hard: Multiple decompositions. challenge: Composition + arithmetic
    - Use `numberBondSvg` for illustrations
    - _Requirements: 3.1–3.5, 15.1–15.4_

  - [x] 3.4 Create `src/engine/topics/positions.ts` — 位置 generator
    - Implement `generatePositionsQuestions(difficulty, count)`
    - easy: 2×2 grid relative positions. medium: Add front/behind, combine terms. hard: 3×3 scene. challenge: Multi-step positional reasoning
    - Use `positionGridSvg` for illustrations
    - _Requirements: 4.1–4.5, 15.1–15.4_

  - [x] 3.5 Write unit tests for sem1 new generators in `src/engine/topics/sem1-generators.test.ts`
    - Add `odd-even`, `ordinal-numbers`, `number-composition`, `positions` to the test loop
    - Verify structural validity across 3 difficulty levels
    - _Requirements: 16.1, 16.3_

- [x] 4. Implement sem2 new question generators (batch 1)
  - [x] 4.1 Create `src/engine/topics/numbers100.ts` — 100以內的數 generator
    - Implement `generateNumbers100Questions(difficulty, count)`
    - easy: Read/write two-digit numbers, tens and units. medium: Place value + ordering. hard: Compare with >, <, = and gap sequences. challenge: Place value reasoning + patterns
    - Use `countDotsSvg` for visual tens-and-units
    - _Requirements: 5.1–5.5, 15.1–15.4_

  - [x] 4.2 Create `src/engine/topics/twoDigitAddition.ts` — 兩位數加法 generator
    - Implement `generateTwoDigitAdditionQuestions(difficulty, count)`
    - easy: 2-digit + 1-digit no carry. medium: 2-digit + 2-digit no carry. hard: With carry. challenge: Multi-step or missing addend
    - Use `verticalMathSvg` for illustrations
    - _Requirements: 6.1–6.5, 15.1–15.4_

  - [x] 4.3 Create `src/engine/topics/twoDigitSubtraction.ts` — 兩位數減法 generator
    - Implement `generateTwoDigitSubtractionQuestions(difficulty, count)`
    - easy: 2-digit − 1-digit no borrow. medium: 2-digit − 2-digit no borrow. hard: With borrow. challenge: Multi-step or missing value
    - Use `verticalMathSvg` for illustrations
    - _Requirements: 7.1–7.5, 15.1–15.4_

  - [x] 4.4 Create `src/engine/topics/measurement.ts` — 量度 generator
    - Implement `generateMeasurementQuestions(difficulty, count)`
    - easy: Compare by length/height/weight. medium: Non-standard units + ruler reading. hard: Estimate/calculate + capacity. challenge: Measurement + arithmetic
    - Use `rulerSvg` for illustrations
    - _Requirements: 8.1–8.5, 15.1–15.4_

  - [x] 4.5 Write property tests for two-digit arithmetic generators
    - **Property 4: Two-digit addition difficulty-carry alignment**
    - **Property 5: Two-digit subtraction difficulty-borrow alignment**
    - Add to `src/__tests__/properties/curriculum-alignment.property.test.ts`
    - **Validates: Requirements 6.2, 6.3, 6.4, 7.2, 7.3, 7.4**

- [x] 5. Implement sem2 new question generators (batch 2)
  - [x] 5.1 Create `src/engine/topics/skipCounting.ts` — 2、5、10的倍數 generator
    - Implement `generateSkipCountingQuestions(difficulty, count)`
    - easy: Count by 2s up to 20. medium: By 5s and 10s up to 100. hard: Mixed sequences + identify rule. challenge: Pattern extension + reverse reasoning
    - Use `countDotsSvg` for grouped objects
    - _Requirements: 9.1–9.5, 15.1–15.4_

  - [x] 5.2 Create `src/engine/topics/directions.ts` — 方向 generator
    - Implement `generateDirectionsQuestions(difficulty, count)`
    - easy: Identify 東南西北. medium: Left/right turns. hard: Multi-step grid instructions. challenge: Compass + grid + distance
    - Use `compassSvg` for illustrations
    - _Requirements: 10.1–10.5, 15.1–15.4_

  - [x] 5.3 Create `src/engine/topics/flatShapes.ts` — 平面圖形 generator
    - Implement `generateFlatShapesQuestions(difficulty, count)`
    - easy: Identify 2D shapes (圓形、三角形、正方形、長方形). medium: Count sides/corners. hard: Compare properties, composite figures. challenge: Symmetry, transformation
    - Reuse existing `shapeSvg()` for 2D shape illustrations
    - _Requirements: 13.4, 15.1–15.4_

  - [x] 5.4 Write unit tests for sem2 new generators in `src/engine/topics/sem2-generators.test.ts`
    - Add `numbers-100`, `two-digit-addition`, `two-digit-subtraction`, `measurement`, `skip-counting`, `directions`, `flat-shapes` with dedicated describe blocks
    - Verify structural validity across 3 difficulty levels
    - _Requirements: 16.2, 16.3_

- [x] 6. Checkpoint — Verify all new generators
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Modify existing generators for syllabus alignment
  - [x] 7.1 Update `src/engine/topics/counting.ts` — add Chinese number word matching
    - Add `generateChineseNumberWord()` to easy generators: match 一~二十 to numerals
    - Add `generateNumberSequenceWriting()` to easy generators: fill in missing number in 1–20 sequence
    - Retain all existing generators unchanged
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 7.2 Update `src/engine/topics/addition10.ts` — add zero-addend questions
    - Add `generateAdditionWithZero()` to easy generators: produces 0+N or N+0 questions
    - Retain all existing generators unchanged
    - _Requirements: 12.1, 12.3_

  - [x] 7.3 Update `src/engine/topics/subtraction10.ts` — add zero-related questions
    - Add `generateSubtractionWithZero()` to easy generators: produces N−0 or N−N questions
    - Retain all existing generators unchanged
    - _Requirements: 12.2, 12.4_

  - [x] 7.4 Update `src/engine/topics/shapes.ts` — refocus to 3D shapes only
    - Remove 2D shapes from the shape pool (圓形、三角形、正方形、長方形、菱形、五邊形、六邊形)
    - Keep only 3D shapes: 正方體、長方體、圓柱體、球體、圓錐體、三角錐
    - Adjust difficulty generators to focus on 3D properties (faces, edges, vertices)
    - _Requirements: 13.1, 13.3_

  - [x] 7.5 Write property tests for zero-addend and zero-subtraction inclusion
    - **Property 8: Zero-addend inclusion in addition-10**
    - **Property 9: Zero-related inclusion in subtraction-10**
    - Add to `src/__tests__/properties/curriculum-alignment.property.test.ts`
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4**

  - [x] 7.6 Increase difficulty across all existing topic generators
    - Review and upgrade difficulty levels for all 13 existing generators so each level is harder:
      - `easy`: basic recognition → single-step reasoning (not trivial)
      - `medium`: single-step → two-step reasoning or unfamiliar contexts
      - `hard`: two-step → multi-step reasoning, combining concepts, larger numbers
      - `challenge`: multi-step → exam-level logical deduction, reverse reasoning, combining 3+ concepts
    - Files to update: `counting.ts`, `addition10.ts`, `subtraction10.ts`, `addition20.ts`, `subtraction20.ts`, `shapes.ts`, `coinsNotes.ts`, `wordProblems.ts`, `composingShapes.ts`, `compareLength.ts`, `tellingTime.ts`, `ordering.ts`, `dataHandling.ts`
    - Retain existing generator functions but add harder variants or replace weaker ones
    - _Requirements: 17.1–17.5_

- [x] 8. Create Remotion animation components
  - [x] 8.1 Create 11 new animation components in `src/animations/`
    - `OddEvenAnimation.tsx` — objects grouping into pairs; leftover = odd
    - `OrdinalNumbersAnimation.tsx` — characters queuing with position labels
    - `NumberCompositionAnimation.tsx` — objects splitting into two groups with number bond
    - `PositionsAnimation.tsx` — objects moving to labeled grid positions
    - `Numbers100Animation.tsx` — tens blocks and unit cubes building numbers
    - `TwoDigitAdditionAnimation.tsx` — vertical column addition with carry animation
    - `TwoDigitSubtractionAnimation.tsx` — vertical column subtraction with borrow animation
    - `MeasurementAnimation.tsx` — ruler measuring objects, comparing lengths
    - `SkipCountingAnimation.tsx` — number line with hopping markers at intervals
    - `DirectionsAnimation.tsx` — character on grid with compass, turning and moving
    - `FlatShapesAnimation.tsx` — 2D shapes appearing with side/corner counts
    - All components: 640×360 dimensions, 30fps, Remotion React components
    - _Requirements: 1.7, 2.8, 3.8, 4.8, 5.7, 6.6, 7.6, 8.6, 9.7, 10.8, 13.5, 15.5_

  - [x] 8.2 Export all new animation components from `src/animations/index.ts`
    - Add 11 new exports to the barrel file
    - _Requirements: 14.5_

- [x] 9. Create fallback SVGs
  - [x] 9.1 Create 11 new fallback SVGs in `public/fallbacks/`
    - `odd-even.svg`, `ordinal-numbers.svg`, `number-composition.svg`, `positions.svg`, `numbers-100.svg`, `two-digit-addition.svg`, `two-digit-subtraction.svg`, `measurement.svg`, `skip-counting.svg`, `directions.svg`, `flat-shapes.svg`
    - All: 640×360 viewBox, gradient background, visual representation of topic, Chinese+English labels
    - _Requirements: 1.8, 2.6, 3.6, 4.6, 5.6, 6.6, 7.6, 8.6, 9.6, 10.6, 13.6, 15.6_

- [x] 10. Update semester constants and topic registry
  - [x] 10.1 Update `src/constants.ts` — reorder SEMESTERS array
    - sem1 (10 topics): counting, odd-even, ordinal-numbers, number-composition, addition-10, subtraction-10, addition-20, subtraction-20, positions, shapes
    - sem2 (14 topics): numbers-100, two-digit-addition, two-digit-subtraction, compare-length-height, measurement, flat-shapes, telling-time, ordering-sequences, data-handling, word-problems, skip-counting, composing-shapes, directions, coins-notes
    - _Requirements: 14.1, 14.2_

  - [x] 10.2 Update `src/data/topicRegistry.ts` — add 11 new entries
    - Add entries for all new topics with correct id, name, semester, animationComposition, fallbackImage, generateQuestions
    - Update `shapes` entry name from '認識形狀' to '立體圖形'
    - Move `coins-notes` entry semester from `sem1` to `sem2`
    - Total: 24 entries (10 sem1 + 14 sem2)
    - _Requirements: 1.6, 2.6, 3.6, 4.6, 5.6, 6.6, 7.6, 8.6, 9.6, 10.6, 13.1, 13.2, 14.3_

  - [x] 10.3 Update `src/engine/topics/index.ts` — export all new generators
    - Add exports for all 11 new generator modules
    - _Requirements: 14.4_

- [x] 11. Checkpoint — Verify full integration
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Update and add test coverage
  - [x] 12.1 Update `src/__tests__/properties/question-generator.property.test.ts`
    - Expand `ALL_TOPIC_IDS` to include all 24 topics
    - **Property 1: Universal generator validity** — already implemented, just needs topic list update
    - **Validates: Requirements 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1, 15.1, 15.4, 16.3**

  - [x] 12.2 Update `src/__tests__/properties/topic-registry.property.test.ts`
    - **Property 2: Registry-semester consistency** — verify 24 topics, correct semester assignments (10 sem1 + 14 sem2)
    - **Validates: Requirements 14.1, 14.2, 14.3**

  - [x] 12.3 Create `src/__tests__/properties/curriculum-alignment.property.test.ts`
    - **Property 3: Chinese text in prompts and options**
    - **Property 7: Arithmetic answer correctness**
    - Use fast-check with `{ numRuns: 100 }`
    - **Validates: Requirements 15.3, 16.4**

  - [x] 12.4 Create `src/__tests__/unit/new-topics.test.ts` — content-specific unit tests
    - Verify odd-even easy questions contain 單數/雙數 in options
    - Verify ordinal-numbers easy questions contain 第 in prompt
    - Verify number-composition easy questions involve bonds within 10
    - Verify counting easy questions include Chinese number words
    - Verify shapes only produces 3D shape names
    - Verify flat-shapes only produces 2D shape names
    - _Requirements: 1.2, 2.2, 3.2, 11.1, 13.1, 13.2_

- [x] 13. Version bump and deploy
  - [x] 13.1 Bump version in `package.json`
    - Update version field (e.g., from 1.0.0 to 2.0.0 — major version for curriculum expansion)
    - _Requirements: Completion 1_

  - [x] 13.2 Run full test suite and verify build
    - Run `npx vitest run --testTimeout=15000` to verify all tests pass
    - Run `npx tsc -b` to verify no TypeScript compilation errors
    - _Requirements: Completion 2_

- [x] 14. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- All generators must use deterministic distractor generation (no `while (set.size < N)` loops)
- All UI text must be in 繁體中文
- CI uses strict `tsc -b` — unused variables cause build failure
- Test command: `npx vitest run --testTimeout=15000`
- GitHub CLI: use `gh.exe` (not `gh`) on this Windows machine
