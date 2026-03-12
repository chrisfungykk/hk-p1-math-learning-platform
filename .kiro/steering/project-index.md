# HK P1 Math Learning Platform — Project Index

## Overview
React + TypeScript + Vite app for Hong Kong Primary 1 math learning, tailored for 聖公會青衣主恩小學.
Deployed to GitHub Pages at `https://chrisfungykk.github.io/hk-p1-math-learning-platform/` via `.github/workflows/deploy.yml`.
Uses HashRouter, base path `/hk-p1-math-learning-platform/`.

## Tech Stack
- React 18, TypeScript 5.6, Vite 6, Tailwind CSS 4
- Remotion (animations), react-router-dom 7 (HashRouter)
- Vitest 4 + fast-check (property-based tests), Testing Library
- Build: `npm run build` (tsc -b && vite build)
- Test: `npx vitest run --testTimeout=15000`
- Deploy: push to main triggers GitHub Actions

## Curriculum Structure
All 12 topics under single semester (sem1/上學期). No sem2 in UI.
DifficultyLevel: `'easy' | 'medium' | 'hard' | 'challenge'`

### 12 Topics (order in SEMESTERS constant)
1. counting (數數)
2. addition-10 (基本加法)
3. subtraction-10 (基本減法)
4. addition-20 (20以內加法)
5. subtraction-20 (20以內減法)
6. ordering-sequences (排列和序列)
7. shapes (認識形狀)
8. composing-shapes (圖形拼砌)
9. compare-length-height (比較長短和高矮)
10. telling-time (認識時間)
11. coins-notes (認識貨幣)
12. data-handling (數據處理)

## Key Types — #[[file:src/types.ts]]
- `Question` — id, topicId, difficulty, prompt, options[], correctAnswerIndex, explanation
- `ScoreRecord` — id, topicId, semester, difficulty, score, totalQuestions, date, isExamPrep
- `TopicDefinition` — id, name, semester, animationComposition, fallbackImage, generateQuestions
- `DifficultyLevel` — 'easy' | 'medium' | 'hard' | 'challenge'

## Architecture Map

### Pages (`src/pages/`)
| File | Route | Purpose |
|------|-------|---------|
| HomeScreen.tsx | `/` | Main menu — hero 考試準備 button, 12 topic cards, 模擬試卷, 成績記錄 |
| LearningModule.tsx | `/learn/:topicId` | Remotion animation + practice questions |
| TestingModule.tsx | `/test/:topicId` | Single-topic exam paper |
| ExamPrepMode.tsx | `/exam/:semesterId` | Mixed-topic exam (all topics) |
| PastPaperMode.tsx | `/past-paper` | Printable mock exam with school header |
| ScoreHistory.tsx | `/scores` | Score records list |
| SemesterView.tsx | `/semester/:semesterId` | Legacy route (not linked from HomeScreen) |

### Engine (`src/engine/`)
- `questionGenerator.ts` — `generateQuestions()`, `randomInt()`, `shuffleArray()`, `generateId()`
- `topics/*.ts` — 12 files, each exports `generate<Topic>Questions(difficulty, count)` using `Record<DifficultyLevel, (() => Question)[]>` pattern

### Data (`src/data/`)
- `topicRegistry.ts` — `TOPIC_REGISTRY` record mapping topicId → TopicDefinition; `getTopicById()`

### Constants (`src/constants.ts`)
- `SEMESTERS` — single-element array with all 12 topic IDs
- `DIFFICULTY_LABELS` — Chinese labels for each difficulty
- `STORAGE_KEY` — localStorage key

### Services (`src/services/`)
- `storage.ts` — localStorage CRUD: `loadScoreRecords`, `saveScoreRecord`, `getFilteredRecords`, `loadLastDifficulty`, `saveLastDifficulty`

### Utils (`src/utils/`)
- `scoring.ts` — `evaluateAnswer`, `computeScoreSummary`, `createScoreRecord`
- `examPrep.ts` — `generateExamQuestions(semesterId, difficulty, totalCount?)`, `computeTopicBreakdown`
- `scoreHistory.ts` — `sortRecordsByDate`

### Animations (`src/animations/`)
- 12 Remotion React components, one per topic
- Used in LearningModule via RemotionAnimationPlayer

### Tests (`src/__tests__/`)
- `properties/` — 6 property-based test files (fast-check)
- `unit/` — 6 unit test files (component + logic)
- `src/engine/topics/sem1-generators.test.ts`, `sem2-generators.test.ts` — generator tests
- `src/engine/questionGenerator.test.ts`, `src/utils/examPrep.test.ts`

## Conventions
- All UI text in 繁體中文 (Traditional Chinese)
- Question generators: `Record<DifficultyLevel, (() => Question)[]>` — must include all 4 difficulty keys
- Distractor generation: never use `while (set.size < N)` with random pool that might be too small — use deterministic fillers
- GitHub CLI: use `gh.exe` (not `gh`) on this Windows machine
- Vitest: always `npx vitest run` (never watch mode), add `--testTimeout=15000` for property tests
