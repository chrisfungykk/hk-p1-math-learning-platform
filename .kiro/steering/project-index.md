# HK P1 Math Learning Platform — Project Index

## Overview
React + TypeScript + Vite app for Hong Kong Primary 1 math learning, tailored for 聖公會青衣主恩小學.
- Deployed to GitHub Pages: `https://chrisfungykk.github.io/hk-p1-math-learning-platform/`
- Deploy workflow: `.github/workflows/deploy.yml` (push to main triggers build+deploy)
- HashRouter, base path `/hk-p1-math-learning-platform/`
- Version: 1.0.0 (shown in footer with deploy timestamp via Vite `define`)

## Tech Stack
- React 18, TypeScript 5.6, Vite 6, Tailwind CSS 4
- Remotion (animations), react-router-dom 7 (HashRouter), Firebase SDK (planned)
- Vitest 4 + fast-check (property-based tests), Testing Library
- Build: `npm run build` · Test: `npx vitest run --testTimeout=15000`

## Authentication
- Client-side auth with 2 hardcoded users in `src/services/auth.tsx`
- Users: Nok (password: 111), Amelia (password: 000)
- Session: localStorage key `hk-p1-math-current-user`
- ProtectedRoute wrapper in App.tsx guards all routes except `/login`

## Curriculum — 13 Topics (7+6), based on Crescent Education HK P1 syllabus
DifficultyLevel: `'easy' | 'medium' | 'hard' | 'challenge'`

### 上學期 (sem1) — 7 Topics
1. counting · 2. addition-10 · 3. subtraction-10 · 4. addition-20 · 5. subtraction-20 · 6. shapes · 7. coins-notes

### 下學期 (sem2) — 6 Topics
8. word-problems · 9. composing-shapes · 10. compare-length-height · 11. telling-time · 12. ordering-sequences · 13. data-handling

## Key Types — #[[file:src/types.ts]]
- `Question` — id, topicId, difficulty, prompt, options[], correctAnswerIndex, explanation, illustration?
- `ScoreRecord` — id, topicId, semester, difficulty, score, totalQuestions, date, isExamPrep, topicBreakdown?
- `TopicDefinition` — id, name, semester, animationComposition, fallbackImage, generateQuestions
- `DifficultyLevel` — 'easy' | 'medium' | 'hard' | 'challenge'
- `User` — username, displayName

## Architecture Map

### Pages (`src/pages/`) — 9 files
| File | Route | Purpose |
|------|-------|---------|
| LoginPage | `/login` | User selection + password |
| HomeScreen | `/` | Hero buttons, collapsible semester sections, 成績記錄 link |
| LearningModule | `/learn/:topicId` | Animation → difficulty picker → 5 practice Qs with instant feedback + inline SVG illustrations |
| TestingModule | `/test/:topicId` | Single-topic 10-question exam paper + inline SVG illustrations |
| ExamPrepMode | `/exam/:semesterId` | Mixed-topic semester exam + inline SVG illustrations |
| PastPaperMode | `/past-paper` | Printable mock exam with school header + inline SVG illustrations |
| ScoreHistory | `/scores` | Per-user score records with filters |
| SemesterView | `/semester/:semesterId` | Legacy route (not linked from UI) |

### Services (`src/services/`)
- `auth.tsx` — AuthContext, AuthProvider, useAuth, hardcoded USERS, login/logout
- `storage.ts` — Per-user localStorage CRUD (key: `hk-p1-math-platform:{username}`)
- `firebase.ts` — Firebase config (planned cloud sync)

### Engine (`src/engine/`)
- `questionGenerator.ts` — `generateQuestions()`, `randomInt()`, `shuffleArray()`, `generateId()`
- `topics/*.ts` — 13 files, each exports `generate<Topic>Questions(difficulty, count)`
  - Pattern: `Record<DifficultyLevel, (() => Question)[]>` with all 4 difficulty keys
  - Many generators attach `illustration` field with inline SVG strings

### Data (`src/data/`)
- `topicRegistry.ts` — `TOPIC_REGISTRY` record mapping topicId → TopicDefinition; `getTopicById()`

### Constants (`src/constants.ts`)
- `SEMESTERS` — 2-element array: sem1 (7 topics), sem2 (6 topics)
- `DIFFICULTY_LABELS` — Chinese labels for each difficulty
- `STORAGE_KEY` — `hk-p1-math-platform`

### Layouts (`src/layouts/`)
- `AppLayout.tsx` — Header (title + user + logout), centered content (max-w-4xl), version footer

### Utils (`src/utils/`)
- `scoring.ts` — `evaluateAnswer`, `computeScoreSummary`, `createScoreRecord`
- `examPrep.ts` — `generateExamQuestions(semesterId, difficulty, totalCount?)`, `computeTopicBreakdown`
- `scoreHistory.ts` — `sortRecordsByDate`
- `illustrations.ts` — 7 SVG generator functions for inline question illustrations:
  - `clockSvg(hour, minute)` — analog clock ~100×88
  - `lengthBarsSvg(aLen, bLen, aLabel, bLabel)` — comparison bars ~100×60
  - `countDotsSvg(count, color?)` — dot array grid
  - `shapeSvg(shapeName)` — 2D/3D shape outlines ~60×60 (11 shapes)
  - `coinSvg(value)` — HK coin/note
  - `barChartSvg(data)` — simple bar chart
  - `tenFrameSvg(filled, total?)` — ten-frame grid

### Components (`src/components/`)
- `RemotionAnimationPlayer.tsx` — Remotion Player wrapper with play/pause/restart + error boundary
- `QuestionIllustration.tsx` — Renders SVG string via dangerouslySetInnerHTML (aria-hidden)

### Animations (`src/animations/`)
- 14 files: index.ts + 13 Remotion React components (one per topic)

### Illustrations Integration
Topics with inline SVG illustrations on specific generator functions:
- telling-time: clockSvg (exact hour, half hour, quarter hour)
- shapes: shapeSvg (identify, 3D recognition)
- coins-notes: coinSvg (identify)
- addition-10: tenFrameSvg (picture count, make ten)
- subtraction-10: tenFrameSvg (picture subtract, from ten)
- counting: countDotsSvg (count objects)
- compare-length-height: lengthBarsSvg (cm compare)
- data-handling: barChartSvg (read, compare)
- addition-20: countDotsSvg (picture add), tenFrameSvg (cross ten)
- subtraction-20: tenFrameSvg (cross ten / 破十法)
- ordering-sequences: countDotsSvg (arrange numbers)
- composing-shapes: shapeSvg (combine, identify parts)
- word-problems: countDotsSvg (shopping, group counting)

### Fallback Images (`public/fallbacks/`)
- 13 SVG files (640×360 viewBox), gradient backgrounds, visual representations, Chinese+English labels

### Build-time Injected Globals (`vite.config.ts` define)
- `__APP_VERSION__` — from package.json version (currently "1.0.0")
- `__BUILD_TIME__` — ISO 8601 build timestamp
- Declared in `src/vite-env.d.ts`, displayed in AppLayout footer

### Tests (`src/__tests__/`, `src/engine/topics/`, `src/utils/`)
- `properties/` — 6 property-based test files (fast-check)
- `unit/` — 7 unit test files (home-screen, learning-module, testing-module, localStorage, tap-targets, topic-lists)
- `sem1-generators.test.ts` — 7 sem1 topic generators × 3 difficulties
- `sem2-generators.test.ts` — 6 sem2 topic generators × 3 difficulties
- `questionGenerator.test.ts`, `examPrep.test.ts`
- Total: 102 tests across 16 files

## Conventions
- All UI text in 繁體中文 (Traditional Chinese)
- Question generators: `Record<DifficultyLevel, (() => Question)[]>` — must include all 4 difficulty keys
- Distractor generation: never use `while (set.size < N)` with random pool that might be too small — use deterministic fillers
- GitHub CLI: use `gh.exe` (not `gh`) on this Windows machine
- Vitest: always `npx vitest run --testTimeout=15000` (never watch mode)
- All back buttons link to `/` (home), not legacy `/semester/` routes
- Storage is per-user: key format `hk-p1-math-platform:{username}`
- Auth session key: `hk-p1-math-current-user`
- When using strReplace to add imports, be careful not to eat the next line (JSDoc comments, interface declarations)
- Version bumps: update `package.json` version field; Vite injects it at build time

## Pending / Known Issues
- Storage is localStorage only — not persistent across devices. Plan: integrate Firebase Realtime Database for cloud sync.
- `src/services/firebase.ts` exists but not yet wired up.
