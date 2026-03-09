import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

// Clock emojis for hours 1-12 (🕐 through 🕛)
const CLOCK_EMOJIS: Record<number, string> = {
  1: '🕐', 2: '🕑', 3: '🕒', 4: '🕓',
  5: '🕔', 6: '🕕', 7: '🕖', 8: '🕗',
  9: '🕘', 10: '🕙', 11: '🕚', 12: '🕛',
};

// Half-hour clock emojis (🕜 through 🕧)
const HALF_HOUR_EMOJIS: Record<number, string> = {
  1: '🕜', 2: '🕝', 3: '🕞', 4: '🕟',
  5: '🕠', 6: '🕡', 7: '🕢', 8: '🕣',
  9: '🕤', 10: '🕥', 11: '🕦', 12: '🕧',
};

/**
 * 認識時間 (Telling Time — Hours)
 * Easy: exact hours (1:00-12:00)
 * Medium: half hours (e.g. 3:30)
 * Hard: quarter hours (e.g. 3:15, 3:45)
 */
export function generateTellingTimeQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push(generateExactHourQuestion());
        break;
      case 'medium':
        questions.push(generateHalfHourQuestion());
        break;
      case 'hard':
        questions.push(generateQuarterHourQuestion());
        break;
    }
  }

  return questions;
}

function formatTime(hour: number, minutes: number): string {
  return `${hour}:${minutes.toString().padStart(2, '0')}`;
}

function generateExactHourQuestion(): Question {
  const hour = randomInt(1, 12);
  const emoji = CLOCK_EMOJIS[hour];
  const correctAnswer = formatTime(hour, 0);

  const prompt = `時鐘顯示幾點？${emoji}`;

  const distractors = new Set<string>();
  distractors.add(correctAnswer);
  while (distractors.size < 4) {
    const h = randomInt(1, 12);
    distractors.add(formatTime(h, 0));
  }

  const options = shuffleArray(Array.from(distractors));
  const correctAnswerIndex = options.indexOf(correctAnswer);

  return {
    id: generateId(),
    topicId: 'telling-time',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex,
    explanation: `時鐘顯示 ${correctAnswer}，即是${hour}點正。`,
    graphicType: 'clock',
  };
}

function generateHalfHourQuestion(): Question {
  const hour = randomInt(1, 12);
  const emoji = HALF_HOUR_EMOJIS[hour];
  const correctAnswer = formatTime(hour, 30);

  const prompt = `時鐘顯示幾點？${emoji}`;

  const distractors = new Set<string>();
  distractors.add(correctAnswer);
  while (distractors.size < 4) {
    const h = randomInt(1, 12);
    const m = randomInt(0, 1) === 0 ? 0 : 30;
    distractors.add(formatTime(h, m));
  }

  const options = shuffleArray(Array.from(distractors));
  const correctAnswerIndex = options.indexOf(correctAnswer);

  return {
    id: generateId(),
    topicId: 'telling-time',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex,
    explanation: `時鐘顯示 ${correctAnswer}，即是${hour}點半。`,
    graphicType: 'clock',
  };
}

function generateQuarterHourQuestion(): Question {
  const hour = randomInt(1, 12);
  const minuteChoices = [0, 15, 30, 45];
  const minutes = minuteChoices[randomInt(0, minuteChoices.length - 1)];

  // Use appropriate emoji
  let emoji: string;
  if (minutes === 0) {
    emoji = CLOCK_EMOJIS[hour];
  } else if (minutes === 30) {
    emoji = HALF_HOUR_EMOJIS[hour];
  } else {
    // No exact emoji for :15/:45, use the closest hour emoji
    emoji = minutes === 15 ? CLOCK_EMOJIS[hour] : HALF_HOUR_EMOJIS[hour];
  }

  const correctAnswer = formatTime(hour, minutes);
  const prompt = `時鐘顯示幾點？${emoji}`;

  const distractors = new Set<string>();
  distractors.add(correctAnswer);
  while (distractors.size < 4) {
    const h = randomInt(1, 12);
    const m = minuteChoices[randomInt(0, minuteChoices.length - 1)];
    distractors.add(formatTime(h, m));
  }

  const options = shuffleArray(Array.from(distractors));
  const correctAnswerIndex = options.indexOf(correctAnswer);

  const minuteLabel = minutes === 0 ? `${hour}點正`
    : minutes === 15 ? `${hour}點15分`
    : minutes === 30 ? `${hour}點半`
    : `${hour}點45分`;

  return {
    id: generateId(),
    topicId: 'telling-time',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex,
    explanation: `時鐘顯示 ${correctAnswer}，即是${minuteLabel}。`,
    graphicType: 'clock',
  };
}
