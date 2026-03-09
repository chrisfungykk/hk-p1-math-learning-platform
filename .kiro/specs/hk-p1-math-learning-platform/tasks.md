# Tasks

## Task 1: Project Setup and Configuration
- [x] 1.1 Initialize a new Vite + React + TypeScript project
- [x] 1.2 Install dependencies: react-router-dom, @remotion/player, remotion, fast-check, vitest, @testing-library/react
- [x] 1.3 Configure Vitest with React Testing Library support in vite.config.ts
- [x] 1.4 Set up project folder structure (src/components, src/data, src/utils, src/animations, src/__tests__)
- [x] 1.5 Configure Tailwind CSS or CSS Modules for styling

## Task 2: Data Models and Topic Registry
- [x] 2.1 Create TypeScript types: DifficultyLevel, Question, ScoreRecord, TopicScoreBreakdown, TopicDefinition, SemesterDefinition, AppStorageData
- [x] 2.2 Create the SEMESTERS constant with 上學期 and 下學期 topic lists
- [x] 2.3 Create the TOPIC_REGISTRY with all 12 topics (id, name, semester, placeholder animation, fallback image path, generator reference)
- [x] 2.4 Create DIFFICULTY_LABELS constant mapping difficulty levels to Chinese labels

## Task 3: LocalStorage Utilities
- [x] 3.1 Implement loadScoreRecords() with try/catch and empty-array fallback
- [x] 3.2 Implement saveScoreRecord() with QuotaExceededError handling
- [x] 3.3 Implement getFilteredRecords() with semester and topic filter support
- [x] 3.4 Write property test: Score record localStorage round trip (Property 7)

## Task 4: Question Generator Engine
- [x] 4.1 Implement base generateQuestions() function that dispatches to topic-specific generators
- [x] 4.2 Implement 上學期 topic generators: counting (1-20), addition within 10, subtraction within 10, shapes, comparing length/height, ordering/sequences
- [x] 4.3 Implement 下學期 topic generators: addition within 20, subtraction within 20, telling time, coins/notes, composing shapes, data handling
- [x] 4.4 Implement difficulty scaling logic for each generator (Easy: smaller numbers; Medium: mid-range; Hard: larger numbers/multi-step)
- [x] 4.5 Write property test: Question generator produces valid questions (Property 1)
- [x] 4.6 Write property test: Difficulty level scales numeric range (Property 8)

## Task 5: Answer Evaluation and Score Computation
- [x] 5.1 Implement evaluateAnswer() function that compares submitted index to correctAnswerIndex
- [x] 5.2 Implement computeScoreSummary() that calculates correct count, incorrect count, and total from answer list
- [x] 5.3 Implement createScoreRecord() that builds a complete ScoreRecord from attempt data
- [x] 5.4 Write property test: Answer evaluation correctness (Property 2)
- [x] 5.5 Write property test: Score summary invariant (Property 3)
- [x] 5.6 Write property test: Score record completeness (Property 4)

## Task 6: Exam Preparation Logic
- [x] 6.1 Implement generateExamQuestions() that produces 15-30 mixed-topic questions for a semester
- [x] 6.2 Implement computeTopicBreakdown() that calculates per-topic scores from exam answers
- [x] 6.3 Write property test: Exam preparation covers multiple topics (Property 9)
- [x] 6.4 Write property test: Exam preparation question count bounds (Property 10)
- [x] 6.5 Write property test: Exam preparation per-topic breakdown invariant (Property 11)

## Task 7: Score History Logic
- [x] 7.1 Implement sortRecordsByDate() to order ScoreRecords in descending chronological order
- [x] 7.2 Write property test: Score records are sorted by date (Property 5)
- [x] 7.3 Write property test: Score record filtering (Property 6)

## Task 8: Routing and App Shell
- [x] 8.1 Set up React Router with routes: /, /semester/:semesterId, /learn/:topicId, /test/:topicId, /exam/:semesterId, /scores
- [x] 8.2 Create App shell component with catch-all route redirecting to home
- [x] 8.3 Create a shared Layout component with consistent child-friendly styling and navigation

## Task 9: Home Screen and Semester View
- [x] 9.1 Create HomeScreen component with two large semester cards (上學期 / 下學期) and score history link
- [x] 9.2 Create SemesterView component displaying topic cards for the selected semester
- [x] 9.3 Ensure all tap/click targets are minimum 48x48 pixels
- [x] 9.4 Write unit test: Home screen renders two semester cards

## Task 10: Learning Module UI
- [x] 10.1 Create LearningModule page component that loads topic data and renders the animation player
- [x] 10.2 Create RemotionAnimationPlayer wrapper with play/pause/restart controls and error boundary fallback
- [x] 10.3 Add completion state with "Go to Test" and "Replay" buttons
- [x] 10.4 Add back-to-topic-list navigation button
- [x] 10.5 Write unit test: Fallback image renders on animation error

## Task 11: Testing Module UI
- [x] 11.1 Create TestingModule page component with difficulty selector and question display
- [x] 11.2 Implement one-question-at-a-time flow with answer submission
- [x] 11.3 Implement immediate correct/incorrect feedback with visual explanation on wrong answers
- [x] 11.4 Implement summary screen showing score, correct count, incorrect count
- [x] 11.5 Integrate score recording on test completion
- [x] 11.6 Add back-to-topic-list navigation button
- [x] 11.7 Write unit test: Default difficulty is Easy when unset

## Task 12: Exam Preparation Mode UI
- [x] 12.1 Create ExamPrepMode page component with semester selection
- [x] 12.2 Integrate mixed-topic question generation and testing flow
- [x] 12.3 Implement per-topic score breakdown display on completion
- [x] 12.4 Integrate exam prep score recording with isExamPrep flag

## Task 13: Score History UI
- [x] 13.1 Create ScoreHistory page component displaying records in date-descending order
- [x] 13.2 Add filter controls for semester and topic
- [x] 13.3 Display exam prep records with appropriate labeling

## Task 14: Remotion Animations
- [x] 14.1 Create Remotion composition scaffolding for each of the 12 topics
- [x] 14.2 Implement counting animation (objects appearing one by one)
- [x] 14.3 Implement addition/subtraction animations (combining/removing groups of objects)
- [x] 14.4 Implement shape recognition animation
- [x] 14.5 Implement remaining topic animations (time, coins, data handling, etc.)
- [x] 14.6 Create static fallback images for all 12 topics

## Task 15: Topic Registry and Curriculum Validation
- [x] 15.1 Wire all animation compositions and generators into TOPIC_REGISTRY
- [x] 15.2 Write property test: Topic registry completeness (Property 12)
- [x] 15.3 Write property test: Curriculum labels are in Traditional Chinese (Property 13)
- [x] 15.4 Write unit tests: Verify exact topic lists for 上學期 and 下學期

## Task 16: Styling and Accessibility
- [x] 16.1 Apply child-friendly color scheme with large fonts and rounded elements
- [x] 16.2 Ensure all interactive elements meet 48x48px minimum tap target
- [x] 16.3 Add Traditional Chinese (繁體中文) labels for all curriculum-specific UI text
- [x] 16.4 Write unit test: Minimum tap target sizes on interactive elements
