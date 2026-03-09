# Requirements Document

## Introduction

An interactive math learning and testing platform designed for Hong Kong Primary 1 (小學一年級) students. The platform covers the full P1 math curriculum, organized by semester (上學期 and 下學期), and provides engaging learning modules with graphical animations (powered by Remotion), revision/exam preparation tools, score tracking, and adjustable difficulty levels. The goal is to make math revision fun and effective during exam periods.

## Glossary

- **Platform**: The HK P1 Math Learning Platform web application
- **Student**: A Hong Kong Primary 1 (小學一年級) child using the platform
- **Learning_Module**: An interactive lesson that teaches a specific math topic using animations and graphical elements
- **Testing_Module**: A set of questions on a specific math topic used for revision and exam preparation
- **Topic**: A math subject area from the HK Primary 1 curriculum (e.g., 數數 Counting, 加法 Addition)
- **Semester**: One of two academic periods — 上學期 (First Semester) or 下學期 (Second Semester) — for the 2026 school year
- **Question**: A single math problem presented to the Student within a Testing_Module
- **Score_Record**: A stored record of a Student's marks on a completed Testing_Module attempt
- **Difficulty_Level**: A configurable setting (Easy, Medium, Hard) that controls the complexity of Questions
- **Animation**: A Remotion-powered graphical or video element used to illustrate math concepts
- **Attempt**: A single completed session of a Testing_Module by a Student

## Requirements

### Requirement 1: Semester-Based Content Organization

**User Story:** As a student, I want to see math topics organized by semester, so that I can study content aligned with my school schedule.

#### Acceptance Criteria

1. THE Platform SHALL display math topics grouped under 上學期 (First Semester) and 下學期 (Second Semester) for the 2026 school year.
2. WHEN a Student selects a Semester, THE Platform SHALL display all Topics available for that Semester.
3. THE Platform SHALL include the following 上學期 Topics aligned with the HK Primary 1 curriculum: 數數 (Counting 1-20), 基本加法 (Addition within 10), 基本減法 (Subtraction within 10), 認識形狀 (Recognizing Shapes), 比較長短和高矮 (Comparing Length and Height), 排列和序列 (Ordering and Sequences).
4. THE Platform SHALL include the following 下學期 Topics aligned with the HK Primary 1 curriculum: 20以內加法 (Addition within 20), 20以內減法 (Subtraction within 20), 認識時間 (Telling Time — Hours), 認識貨幣 (Recognizing Coins and Notes), 圖形拼砌 (Composing Shapes), 數據處理 (Simple Data Handling / Pictograms).

### Requirement 2: Interactive Learning Module

**User Story:** As a student, I want to learn math concepts through fun animations and interactive visuals, so that I can understand topics more easily.

#### Acceptance Criteria

1. WHEN a Student selects a Topic from a Semester, THE Learning_Module SHALL present an interactive lesson for that Topic.
2. THE Learning_Module SHALL include at least one Remotion-powered Animation per Topic to visually demonstrate the math concept.
3. THE Learning_Module SHALL present content using age-appropriate language and large, colorful graphical elements suitable for Primary 1 students.
4. WHEN a Learning_Module lesson completes, THE Platform SHALL offer the Student an option to proceed to the corresponding Testing_Module or replay the lesson.

### Requirement 3: Testing Module for Revision

**User Story:** As a student, I want to answer practice questions on each topic, so that I can revise and prepare for exams.

#### Acceptance Criteria

1. WHEN a Student starts a Testing_Module for a Topic, THE Testing_Module SHALL present a set of Questions related to that Topic.
2. THE Testing_Module SHALL present each Question one at a time with clear graphical elements to support comprehension.
3. WHEN a Student submits an answer to a Question, THE Testing_Module SHALL immediately indicate whether the answer is correct or incorrect.
4. WHEN a Student answers a Question incorrectly, THE Testing_Module SHALL display the correct answer with a brief visual explanation.
5. WHEN a Student completes all Questions in a Testing_Module, THE Testing_Module SHALL display a summary showing the total score, number of correct answers, and number of incorrect answers.

### Requirement 4: Score Tracking and History

**User Story:** As a parent, I want to see my child's scores on revision tests, so that I can track learning progress over time.

#### Acceptance Criteria

1. WHEN a Student completes a Testing_Module Attempt, THE Platform SHALL store a Score_Record containing the Topic name, Semester, Difficulty_Level, score achieved, total possible score, and date of the Attempt.
2. THE Platform SHALL provide a score history view that lists all stored Score_Records ordered by date.
3. WHEN a parent or Student views the score history, THE Platform SHALL display Score_Records filterable by Semester and by Topic.
4. THE Platform SHALL persist all Score_Records in local storage so that data is retained across browser sessions.

### Requirement 5: Adjustable Difficulty

**User Story:** As a parent, I want to adjust the difficulty of test questions, so that the content matches my child's current ability.

#### Acceptance Criteria

1. THE Platform SHALL support three Difficulty_Levels: Easy (容易), Medium (中等), and Hard (困難).
2. WHEN a Student or parent selects a Difficulty_Level before starting a Testing_Module, THE Testing_Module SHALL generate Questions at the selected Difficulty_Level.
3. THE Platform SHALL default the Difficulty_Level to Easy (容易) when no explicit selection is made.
4. WHEN Difficulty_Level is set to Easy, THE Testing_Module SHALL generate Questions using smaller numbers and simpler operations within the Topic scope.
5. WHEN Difficulty_Level is set to Hard, THE Testing_Module SHALL generate Questions using larger numbers, multi-step problems, or additional constraints within the Topic scope.

### Requirement 6: Exam Preparation Mode

**User Story:** As a student, I want a dedicated exam revision mode, so that I can practice a mix of topics before my school exams.

#### Acceptance Criteria

1. THE Platform SHALL provide an Exam Preparation mode that generates a mixed set of Questions spanning multiple Topics within a selected Semester.
2. WHEN a Student starts Exam Preparation mode, THE Platform SHALL allow the Student to select which Semester to revise.
3. THE Platform SHALL generate a minimum of 15 and a maximum of 30 Questions for each Exam Preparation session.
4. WHEN a Student completes an Exam Preparation session, THE Testing_Module SHALL display a per-Topic score breakdown in addition to the overall score summary.
5. WHEN a Student completes an Exam Preparation session, THE Platform SHALL store the results as a Score_Record with a label indicating it is an Exam Preparation Attempt.

### Requirement 7: Navigation and User Interface

**User Story:** As a student, I want a simple and colorful interface, so that I can use the platform independently.

#### Acceptance Criteria

1. THE Platform SHALL provide a home screen with clear, large icons for selecting 上學期 and 下學期.
2. THE Platform SHALL use a consistent, child-friendly color scheme and large tap/click targets (minimum 48x48 pixels) throughout the interface.
3. WHEN a Student is within a Learning_Module or Testing_Module, THE Platform SHALL display a visible button to return to the Topic list.
4. THE Platform SHALL display all curriculum-specific labels in Traditional Chinese (繁體中文).

### Requirement 8: Remotion Animation Integration

**User Story:** As a developer, I want to use Remotion for rendering math animations, so that I can create engaging video-like content programmatically.

#### Acceptance Criteria

1. THE Platform SHALL use the Remotion library to render all math concept Animations within Learning_Modules.
2. WHEN a Learning_Module loads, THE Platform SHALL render the corresponding Remotion Animation inline within the lesson view.
3. THE Platform SHALL provide playback controls (play, pause, restart) for each Animation.
4. IF a Remotion Animation fails to render, THEN THE Platform SHALL display a static fallback image illustrating the math concept.
