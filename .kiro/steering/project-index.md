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

## Authentication
- Simple client-side auth with 2 hardcoded users in `src/services/auth.tsx`
- Users: Nok (password: 111), Amelia (password: 000)
- Login page at `/login` — user selection buttons + password input
- Session persisted in localStorage key `hk-p1-math-current-user`
- All routes except `/login` are protected via `ProtectedRoute` wrapper in App.tsx
- AuthProvider wraps the app in main.tsx

## Curriculum Structure
12 topics split across 2 semesters in SEMESTERS constant:
DifficultyLevel: `'easy' | 'medium' | 'hard' | 'challenge'`

### 上學期 (sem1) — 6 Topics
1. counting (數數)
2. addition-10 (基本加法)
3. subtraction-10 (基本減法)
4. addition-20 (20以內加法)
5. subtraction-20 (20以內減法)
6. ordering-sequences (排列和序列)

### 下學期 (sem2) — 6 Topics
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
- `User` — username, displayName (from auth.tsx)

## Architecture Map

### Pages (`src/pages/`)
| File | Route | Purpose |
|------|-------|---------|
| LoginPage.tsx | `/login` | User selection (Nok/Amelia) + password |
| HomeScreen.tsx | `/` | Hero buttons (考試準備 + 模擬試卷), collapsible semester sections (上學期 expanded, 下學期 collapsed), 成績記錄 |
| LearningModule.tsx | `/learn/:topicId` | Remotion animation → difficulty selector → 5 practice questions with instant feedback |
| TestingModule.tsx | `/test/:topicId` | Single-topic 10-question exam paper |
| ExamPrepMode.tsx | `/exam/:semesterId` | Mixed-topic exam (all topics in semester) |
| PastPaperMode.tsx | `/past-paper` | Printable mock exam with school header |
| ScoreHistory.tsx | `/scores` | Per-user score records list with filters |
| SemesterView.tsx | `/semester/:semesterId` | Legacy route (not linked from UI) |

### Services (`src/services/`)
- `auth.tsx` — AuthContext, AuthProvider, useAuth hook, hardcoded USERS map, login/logout
- `storage.ts` — Per-user localStorage CRUD (key: `hk-p1-math-platform:{username}`)
  - `loadScoreRecords`, `saveScoreRecord`, `getFilteredRecords`
  - `loadLastDifficulty`, `saveLastDifficulty`

### Engine (`src/engine/`)
- `questionGenerator.ts` — `generateQuestions()`, `randomInt()`, `shuffleArray()`, `generateId()`
- `topics/*.ts` — 12 files, each exports `generate<Topic>Questions(difficulty, count)` using `Record<DifficultyLevel, (() => Question)[]>` pattern

### Data (`src/data/`)
- `topicRegistry.ts` — `TOPIC_REGISTRY` record mapping topicId → TopicDefinition; `getTopicById()`
  - sem1 topics have `semester: 'sem1'`, sem2 topics have `semester: 'sem2'`

### Constants (`src/constants.ts`)
- `SEMESTERS` — 2-element array: sem1 (6 topics), sem2 (6 topics)
- `DIFFICULTY_LABELS` — Chinese labels for each difficulty
- `STORAGE_KEY` — localStorage base key (`hk-p1-math-platform`)

### Layouts (`src/layouts/`)
- `AppLayout.tsx` — Full-width header with title + user display + logout button, centered content area (max-w-4xl)

### Utils (`src/utils/`)
- `scoring.ts` — `evaluateAnswer`, `computeScoreSummary`, `createScoreRecord`
- `examPrep.ts` — `generateExamQuestions(semesterId, difficulty, totalCount?)`, `computeTopicBreakdown`
- `scoreHistory.ts` — `sortRecordsByDate`

### Animations (`src/animations/`)
- 12 Remotion React components, one per topic
- Used in LearningModule via RemotionAnimationPlayer

### Components (`src/components/`)
- `RemotionAnimationPlayer.tsx` — Remotion Player wrapper with play/pause/restart + AnimationErrorBoundary

### Tests (`src/__tests__/`)
- `properties/` — 6 property-based test files (fast-check)
- `unit/` — 7 unit test files (home-screen, learning-module, testing-module, localStorage, tap-targets, topic-lists)
- `src/engine/topics/sem1-generators.test.ts` — 6 sem1 topic generators × 3 difficulties
- `src/engine/topics/sem2-generators.test.ts` — 8 sem2 topic generators × 3 difficulties
- `src/engine/questionGenerator.test.ts`, `src/utils/examPrep.test.ts`
- Total: 105 tests

## Conventions
- All UI text in 繁體中文 (Traditional Chinese)
- Question generators: `Record<DifficultyLevel, (() => Question)[]>` — must include all 4 difficulty keys
- Distractor generation: never use `while (set.size < N)` with random pool that might be too small — use deterministic fillers
- GitHub CLI: use `gh.exe` (not `gh`) on this Windows machine
- Vitest: always `npx vitest run` (never watch mode), add `--testTimeout=15000` for property tests
- All back buttons link to `/` (home), not legacy `/semester/` routes
- Storage is per-user: key format `hk-p1-math-platform:{username}`
- Auth session key: `hk-p1-math-current-user`

## Pending / Known Issues
- Storage is localStorage only — not persistent across devices. Plan: integrate Firebase Realtime Database for cloud sync.
