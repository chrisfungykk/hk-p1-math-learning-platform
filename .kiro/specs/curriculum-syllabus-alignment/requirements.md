# Requirements Document

## Introduction

This feature aligns the HK P1 Math Learning Platform with the full 聖公會青衣主恩小學 (Crescent Education) Primary 1 mathematics syllabus. The current platform covers 13 topics (7 sem1 + 6 sem2). The Crescent syllabus defines 13 units per semester (26 total). This effort adds 10 missing topics, improves existing topic generators for better syllabus alignment, restructures the semester topic lists to match the official curriculum order, moves `coins-notes` from sem1 to sem2, and increases difficulty across all topics so that each level is more challenging than before.

## Glossary

- **Platform**: The HK P1 Math Learning Platform React application
- **Question_Generator**: A TypeScript module that produces `Question` objects for a given topic, difficulty, and count
- **Topic_Registry**: The central `TOPIC_REGISTRY` record in `src/data/topicRegistry.ts` mapping topic IDs to `TopicDefinition` metadata
- **Semester_Constants**: The `SEMESTERS` array in `src/constants.ts` defining topic ordering per semester
- **Animation_Component**: A Remotion React component providing a short animated introduction for a topic
- **Fallback_SVG**: A static 640×360 SVG image displayed when the Remotion animation cannot load
- **Illustration_Generator**: A function in `src/utils/illustrations.ts` that returns an inline SVG string for embedding in question prompts
- **DifficultyLevel**: One of `'easy' | 'medium' | 'hard' | 'challenge'`
- **Crescent_Syllabus**: The 聖公會青衣主恩小學 P1 mathematics curriculum comprising 13 sem1 units and 13 sem2 units
- **EARS_Pattern**: A structured requirement format (Ubiquitous, Event-driven, State-driven, Unwanted-event, Optional, Complex)

## Requirements

### Requirement 1: Odd and Even Numbers Topic (單數和雙數)

**User Story:** As a P1 student, I want to practise identifying odd and even numbers, so that I can master the 單數和雙數 unit from the Crescent syllabus.

#### Acceptance Criteria

1. THE Question_Generator SHALL produce questions for the `odd-even` topic across all four DifficultyLevel values
2. WHEN difficulty is `easy`, THE Question_Generator SHALL produce questions asking whether a given number (1–20) is odd or even
3. WHEN difficulty is `medium`, THE Question_Generator SHALL produce questions asking the student to pick all odd or all even numbers from a set
4. WHEN difficulty is `hard`, THE Question_Generator SHALL produce questions involving odd/even patterns and rules (e.g., odd+odd=even)
5. WHEN difficulty is `challenge`, THE Question_Generator SHALL produce questions combining odd/even reasoning with arithmetic
6. THE Topic_Registry SHALL contain an entry for `odd-even` with semester `sem1`, a valid Animation_Component, and a Fallback_SVG
7. THE Animation_Component SHALL visually demonstrate the concept of odd and even numbers using grouped objects
8. THE Fallback_SVG SHALL display a 640×360 image representing odd and even number grouping

### Requirement 2: Ordinal Numbers Topic (序數)

**User Story:** As a P1 student, I want to learn ordinal numbers (第一、第二、第三…), so that I can master the 序數 unit from the Crescent syllabus.

#### Acceptance Criteria

1. THE Question_Generator SHALL produce questions for the `ordinal-numbers` topic across all four DifficultyLevel values
2. WHEN difficulty is `easy`, THE Question_Generator SHALL produce questions asking the student to identify the position of an item in a row (e.g., "第3個是什麼?")
3. WHEN difficulty is `medium`, THE Question_Generator SHALL produce questions asking the student to determine ordinal position from both left and right directions
4. WHEN difficulty is `hard`, THE Question_Generator SHALL produce questions combining ordinal positions with conditions (e.g., "從左邊數第4個到第7個共有幾個?")
5. WHEN difficulty is `challenge`, THE Question_Generator SHALL produce questions involving two-directional ordinal reasoning and counting subsets
6. THE Topic_Registry SHALL contain an entry for `ordinal-numbers` with semester `sem1`, a valid Animation_Component, and a Fallback_SVG
7. THE Illustration_Generator SHALL provide an inline SVG function that renders a row of distinct coloured objects for ordinal position questions
8. THE Animation_Component SHALL visually demonstrate ordinal positions using a queue of animated characters

### Requirement 3: Number Composition Topic (數的組合)

**User Story:** As a P1 student, I want to practise number bonds and decomposition within 10 and within 18, so that I can master the 10以內的組合 and 18以內的組合 units from the Crescent syllabus.

#### Acceptance Criteria

1. THE Question_Generator SHALL produce questions for the `number-composition` topic across all four DifficultyLevel values
2. WHEN difficulty is `easy`, THE Question_Generator SHALL produce questions on number bonds within 10 (e.g., "5 可以分成 2 和 ?")
3. WHEN difficulty is `medium`, THE Question_Generator SHALL produce questions on number bonds within 18 and missing-part problems
4. WHEN difficulty is `hard`, THE Question_Generator SHALL produce questions requiring multiple decompositions of the same number
5. WHEN difficulty is `challenge`, THE Question_Generator SHALL produce questions combining composition with addition/subtraction reasoning
6. THE Topic_Registry SHALL contain an entry for `number-composition` with semester `sem1`, a valid Animation_Component, and a Fallback_SVG
7. THE Illustration_Generator SHALL provide an inline SVG function that renders a number bond diagram (circle-branch-circle layout)
8. THE Animation_Component SHALL visually demonstrate splitting a group of objects into two parts

### Requirement 4: Positions Topic (位置)

**User Story:** As a P1 student, I want to learn spatial position vocabulary (上下左右前後), so that I can master the 位置 unit from the Crescent syllabus.

#### Acceptance Criteria

1. THE Question_Generator SHALL produce questions for the `positions` topic across all four DifficultyLevel values
2. WHEN difficulty is `easy`, THE Question_Generator SHALL produce questions asking the student to identify the position of an object relative to another (above/below/left/right)
3. WHEN difficulty is `medium`, THE Question_Generator SHALL produce questions using front/behind and combining two positional terms
4. WHEN difficulty is `hard`, THE Question_Generator SHALL produce questions describing a scene and asking the student to determine relative positions of multiple objects
5. WHEN difficulty is `challenge`, THE Question_Generator SHALL produce questions requiring multi-step positional reasoning (e.g., "A在B的左邊，B在C的上面，A在C的什麼位置?")
6. THE Topic_Registry SHALL contain an entry for `positions` with semester `sem1`, a valid Animation_Component, and a Fallback_SVG
7. THE Illustration_Generator SHALL provide an inline SVG function that renders a grid scene with labelled objects at specified positions
8. THE Animation_Component SHALL visually demonstrate positional relationships using animated objects moving to labelled positions

### Requirement 5: Numbers to 100 Topic (100以內的數)

**User Story:** As a P1 student, I want to learn reading, writing, and understanding numbers up to 100, so that I can master the 100以內的數 unit from the Crescent syllabus.

#### Acceptance Criteria

1. THE Question_Generator SHALL produce questions for the `numbers-100` topic across all four DifficultyLevel values
2. WHEN difficulty is `easy`, THE Question_Generator SHALL produce questions on reading and writing two-digit numbers and identifying tens and units
3. WHEN difficulty is `medium`, THE Question_Generator SHALL produce questions on place value (e.g., "45 中的 4 代表什麼?") and ordering numbers
4. WHEN difficulty is `hard`, THE Question_Generator SHALL produce questions on comparing two-digit numbers using >, <, = and number sequences with gaps
5. WHEN difficulty is `challenge`, THE Question_Generator SHALL produce questions combining place value reasoning with number patterns up to 100
6. THE Topic_Registry SHALL contain an entry for `numbers-100` with semester `sem2`, a valid Animation_Component, and a Fallback_SVG
7. THE Animation_Component SHALL visually demonstrate place value using tens-and-units block representations

### Requirement 6: Two-Digit Addition Topic (兩位數加法)

**User Story:** As a P1 student, I want to practise adding two-digit numbers, so that I can master the 兩位數加法 unit from the Crescent syllabus.

#### Acceptance Criteria

1. THE Question_Generator SHALL produce questions for the `two-digit-addition` topic across all four DifficultyLevel values
2. WHEN difficulty is `easy`, THE Question_Generator SHALL produce questions adding a two-digit number and a one-digit number without carrying (e.g., 23+4)
3. WHEN difficulty is `medium`, THE Question_Generator SHALL produce questions adding two two-digit numbers without carrying (e.g., 32+15)
4. WHEN difficulty is `hard`, THE Question_Generator SHALL produce questions adding two two-digit numbers with carrying (e.g., 27+18)
5. WHEN difficulty is `challenge`, THE Question_Generator SHALL produce questions involving multi-step two-digit addition or finding missing addends
6. THE Topic_Registry SHALL contain an entry for `two-digit-addition` with semester `sem2`, a valid Animation_Component, and a Fallback_SVG
7. THE Illustration_Generator SHALL provide an inline SVG function that renders a vertical addition layout with tens and units columns

### Requirement 7: Two-Digit Subtraction Topic (兩位數減法)

**User Story:** As a P1 student, I want to practise subtracting two-digit numbers, so that I can master the 兩位數減法 unit from the Crescent syllabus.

#### Acceptance Criteria

1. THE Question_Generator SHALL produce questions for the `two-digit-subtraction` topic across all four DifficultyLevel values
2. WHEN difficulty is `easy`, THE Question_Generator SHALL produce questions subtracting a one-digit number from a two-digit number without borrowing (e.g., 38-5)
3. WHEN difficulty is `medium`, THE Question_Generator SHALL produce questions subtracting two two-digit numbers without borrowing (e.g., 47-23)
4. WHEN difficulty is `hard`, THE Question_Generator SHALL produce questions subtracting two two-digit numbers with borrowing (e.g., 43-17)
5. WHEN difficulty is `challenge`, THE Question_Generator SHALL produce questions involving multi-step two-digit subtraction or finding missing values
6. THE Topic_Registry SHALL contain an entry for `two-digit-subtraction` with semester `sem2`, a valid Animation_Component, and a Fallback_SVG
7. THE Illustration_Generator SHALL provide an inline SVG function that renders a vertical subtraction layout with tens and units columns

### Requirement 8: Measurement Topic (量度)

**User Story:** As a P1 student, I want to learn about measuring length, weight, and capacity using non-standard and standard units, so that I can master the 量度 unit from the Crescent syllabus.

#### Acceptance Criteria

1. THE Question_Generator SHALL produce questions for the `measurement` topic across all four DifficultyLevel values
2. WHEN difficulty is `easy`, THE Question_Generator SHALL produce questions on comparing two objects by length, height, or weight using direct comparison vocabulary
3. WHEN difficulty is `medium`, THE Question_Generator SHALL produce questions on measuring length using non-standard units (e.g., paper clips) and reading a simple ruler in cm
4. WHEN difficulty is `hard`, THE Question_Generator SHALL produce questions on estimating and calculating measurements, and comparing capacity of containers
5. WHEN difficulty is `challenge`, THE Question_Generator SHALL produce questions combining measurement with arithmetic (e.g., "A繩長12cm，B繩長8cm，兩條繩共長多少cm?")
6. THE Topic_Registry SHALL contain an entry for `measurement` with semester `sem2`, a valid Animation_Component, and a Fallback_SVG
7. THE Illustration_Generator SHALL provide an inline SVG function that renders a ruler with cm markings and an object being measured

### Requirement 9: Skip Counting Topic (2、5、10的倍數)

**User Story:** As a P1 student, I want to practise skip counting by 2, 5, and 10, so that I can master the 2、5、10的倍數 unit from the Crescent syllabus.

#### Acceptance Criteria

1. THE Question_Generator SHALL produce questions for the `skip-counting` topic across all four DifficultyLevel values
2. WHEN difficulty is `easy`, THE Question_Generator SHALL produce questions on counting by 2s up to 20 with one missing number in the sequence
3. WHEN difficulty is `medium`, THE Question_Generator SHALL produce questions on counting by 5s and 10s up to 100 with missing numbers
4. WHEN difficulty is `hard`, THE Question_Generator SHALL produce questions on mixed skip-counting sequences and identifying which skip-count rule a sequence follows
5. WHEN difficulty is `challenge`, THE Question_Generator SHALL produce questions combining skip counting with pattern extension and reverse reasoning
6. THE Topic_Registry SHALL contain an entry for `skip-counting` with semester `sem2`, a valid Animation_Component, and a Fallback_SVG
7. THE Animation_Component SHALL visually demonstrate skip counting using number lines with highlighted hops

### Requirement 10: Directions Topic (方向)

**User Story:** As a P1 student, I want to learn compass directions and turning, so that I can master the 方向 unit from the Crescent syllabus.

#### Acceptance Criteria

1. THE Question_Generator SHALL produce questions for the `directions` topic across all four DifficultyLevel values
2. WHEN difficulty is `easy`, THE Question_Generator SHALL produce questions on identifying the four cardinal directions (東南西北) on a compass or map
3. WHEN difficulty is `medium`, THE Question_Generator SHALL produce questions on left/right turns and determining the resulting facing direction
4. WHEN difficulty is `hard`, THE Question_Generator SHALL produce questions on following multi-step directional instructions on a simple grid map
5. WHEN difficulty is `challenge`, THE Question_Generator SHALL produce questions combining compass directions with grid navigation and distance reasoning
6. THE Topic_Registry SHALL contain an entry for `directions` with semester `sem2`, a valid Animation_Component, and a Fallback_SVG
7. THE Illustration_Generator SHALL provide an inline SVG function that renders a compass rose with labelled cardinal directions
8. THE Animation_Component SHALL visually demonstrate compass directions and turning using an animated character on a grid


### Requirement 11: Existing Topic Alignment — Counting (20以內的數)

**User Story:** As a P1 student, I want the counting topic to properly cover reading and writing numbers to 20, number names in Chinese, and number ordering, so that the topic aligns with the 20以內的數 syllabus unit.

#### Acceptance Criteria

1. WHEN difficulty is `easy`, THE Question_Generator for `counting` SHALL include questions on reading Chinese number words (一、二、三…二十) and matching them to numerals
2. WHEN difficulty is `easy`, THE Question_Generator for `counting` SHALL include questions on writing numbers in sequence from 1 to 20
3. THE Question_Generator for `counting` SHALL retain all existing question types while adding the new syllabus-aligned generators

### Requirement 12: Existing Topic Alignment — Addition/Subtraction within 10 (0的認識)

**User Story:** As a P1 student, I want the addition-10 and subtraction-10 topics to include questions involving zero, so that the topics align with the 0的認識及有關0的加減法 syllabus unit.

#### Acceptance Criteria

1. THE Question_Generator for `addition-10` SHALL include questions where one addend is 0 (e.g., 0+5, 7+0)
2. THE Question_Generator for `subtraction-10` SHALL include questions where the subtrahend is 0 or the result is 0 (e.g., 5-0, 3-3)
3. WHEN difficulty is `easy`, THE Question_Generator for `addition-10` SHALL include at least one generator function that produces addition-with-zero questions
4. WHEN difficulty is `easy`, THE Question_Generator for `subtraction-10` SHALL include at least one generator function that produces subtraction-with-zero questions

### Requirement 13: Existing Topic Alignment — Shapes Split (立體圖形 / 平面圖形)

**User Story:** As a P1 student, I want 3D shapes to be covered in sem1 and 2D shapes to be covered in sem2, so that the shapes topics align with the Crescent syllabus which separates 立體圖形 (sem1) and 平面圖形 (sem2).

#### Acceptance Criteria

1. THE Topic_Registry SHALL contain a `shapes` entry in semester `sem1` focused on 3D shapes (立體圖形: 正方體、長方體、圓柱體、球體、圓錐體、三角錐)
2. THE Topic_Registry SHALL contain a `flat-shapes` entry in semester `sem2` focused on 2D shapes (平面圖形: 圓形、三角形、正方形、長方形)
3. THE Question_Generator for `shapes` SHALL produce questions on identifying, naming, and comparing 3D shapes across all four DifficultyLevel values
4. THE Question_Generator for `flat-shapes` SHALL produce questions on identifying, naming, counting sides/corners, and comparing 2D shapes across all four DifficultyLevel values
5. THE Animation_Component for `flat-shapes` SHALL visually demonstrate 2D shape properties
6. THE Fallback_SVG for `flat-shapes` SHALL display a 640×360 image representing 2D shapes

### Requirement 14: Semester Structure Alignment

**User Story:** As a platform maintainer, I want the semester topic lists to match the Crescent syllabus unit ordering, so that students see topics in the same sequence as their school curriculum.

#### Acceptance Criteria

1. THE Semester_Constants SHALL list sem1 topics in this order: `counting`, `odd-even`, `ordinal-numbers`, `number-composition`, `addition-10`, `subtraction-10`, `addition-20`, `subtraction-20`, `positions`, `shapes`
2. THE Semester_Constants SHALL list sem2 topics in this order: `numbers-100`, `two-digit-addition`, `two-digit-subtraction`, `compare-length-height`, `measurement`, `flat-shapes`, `telling-time`, `ordering-sequences`, `data-handling`, `word-problems`, `skip-counting`, `composing-shapes`, `directions`, `coins-notes`
3. THE Topic_Registry SHALL contain entries for all 24 topics (10 sem1 + 14 sem2) with correct semester assignments
4. WHEN a new topic is added, THE Platform SHALL export the topic generator from `src/engine/topics/index.ts`
5. WHEN a new topic is added, THE Platform SHALL export the Animation_Component from `src/animations/index.ts`

### Requirement 15: New Topic Integration Consistency

**User Story:** As a platform maintainer, I want every new topic to follow the established code patterns, so that the codebase remains consistent and maintainable.

#### Acceptance Criteria

1. THE Question_Generator for each new topic SHALL use the `Record<DifficultyLevel, (() => Question)[]>` pattern with all four difficulty keys populated
2. THE Question_Generator for each new topic SHALL use deterministic distractor generation and avoid `while (set.size < N)` loops with potentially insufficient random pools
3. THE Question_Generator for each new topic SHALL produce questions with all prompt text and option text in 繁體中文
4. THE Question_Generator for each new topic SHALL assign the correct `topicId` matching the Topic_Registry key
5. THE Animation_Component for each new topic SHALL be a Remotion React component using 640×360 dimensions at 30fps
6. THE Fallback_SVG for each new topic SHALL use a 640×360 viewBox with a gradient background and visual representation of the topic
7. IF a Question_Generator attaches an `illustration` field, THEN THE Illustration_Generator SHALL provide the corresponding SVG function in `src/utils/illustrations.ts`

### Requirement 16: Test Coverage for New Topics

**User Story:** As a developer, I want all new question generators to have test coverage, so that question generation correctness is verified.

#### Acceptance Criteria

1. WHEN a new sem1 topic generator is added, THE Platform SHALL include test cases for that generator in the sem1 generator test file covering at least 3 difficulty levels
2. WHEN a new sem2 topic generator is added, THE Platform SHALL include test cases for that generator in the sem2 generator test file covering at least 3 difficulty levels
3. THE test cases SHALL verify that generated questions have valid structure: non-empty prompt, exactly 4 options, correctAnswerIndex in range 0–3, non-empty explanation, and matching topicId
4. THE test cases SHALL verify that the correct answer option matches the expected computed answer

##### Completion
1. Update the versioning.
2. Publish and update the page.

### Requirement 17: Increase Difficulty Across All Topics

**User Story:** As a P1 student progressing through the curriculum, I want each difficulty level to be more challenging, so that I am better prepared for school exams.

#### Acceptance Criteria

1. FOR all existing and new topics, WHEN difficulty is `easy`, THE Question_Generator SHALL produce questions that require basic recognition or single-step reasoning (not just trivial identification)
2. FOR all existing and new topics, WHEN difficulty is `medium`, THE Question_Generator SHALL produce questions that require two-step reasoning or application of concepts in slightly unfamiliar contexts
3. FOR all existing and new topics, WHEN difficulty is `hard`, THE Question_Generator SHALL produce questions that require multi-step reasoning, combining two or more concepts, or working with larger numbers/more complex scenarios
4. FOR all existing and new topics, WHEN difficulty is `challenge`, THE Question_Generator SHALL produce questions at exam-level difficulty, requiring logical deduction, reverse reasoning, or combining three or more concepts
5. THE Question_Generator for each existing topic SHALL have its difficulty levels reviewed and increased to match the above criteria during this feature implementation