import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

const CLOCK_EMOJIS: Record<number, string> = {
  1: '🕐', 2: '🕑', 3: '🕒', 4: '🕓', 5: '🕔', 6: '🕕',
  7: '🕖', 8: '🕗', 9: '🕘', 10: '🕙', 11: '🕚', 12: '🕛',
};
const HALF_HOUR_EMOJIS: Record<number, string> = {
  1: '🕜', 2: '🕝', 3: '🕞', 4: '🕟', 5: '🕠', 6: '🕡',
  7: '🕢', 8: '🕣', 9: '🕤', 10: '🕥', 11: '🕦', 12: '🕧',
};

/**
 * 認識時間 (Telling Time)
 * Easy: exact hours, daily routine matching
 * Medium: half hours, "how long" between hours
 * Hard: quarter hours, elapsed time, daily schedule problems
 */
export function generateTellingTimeQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push(randomInt(0, 1) === 0 ? generateExactHour() : generateDailyRoutine());
        break;
      case 'medium':
        questions.push(randomInt(0, 1) === 0 ? generateHalfHour() : generateHowLong());
        break;
      case 'hard':
        questions.push([generateQuarterHour, generateElapsedTime, generateScheduleProblem][randomInt(0, 2)]());
        break;
    }
  }
  return questions;
}

function fmt(h: number, m: number): string { return `${h}:${m.toString().padStart(2, '0')}`; }

function generateExactHour(): Question {
  const hour = randomInt(1, 12);
  const emoji = CLOCK_EMOJIS[hour];
  const correct = fmt(hour, 0);
  const prompt = `時鐘顯示幾點？${emoji}`;
  const d = new Set<string>([correct]);
  while (d.size < 4) d.add(fmt(randomInt(1, 12), 0));
  const options = shuffleArray(Array.from(d));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'easy', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `時鐘顯示 ${correct}，即是${hour}點正。`, graphicType: 'clock' };
}

function generateDailyRoutine(): Question {
  const routines = [
    { activity: '上學', hour: 8, label: '早上8點' },
    { activity: '午飯', hour: 12, label: '中午12點' },
    { activity: '放學', hour: 3, label: '下午3點' },
    { activity: '睡覺', hour: 9, label: '晚上9點' },
  ];
  const r = routines[randomInt(0, routines.length - 1)];
  const correct = fmt(r.hour, 0);
  const prompt = `小明通常幾點${r.activity}？${CLOCK_EMOJIS[r.hour]}`;
  const d = new Set<string>([correct]);
  while (d.size < 4) d.add(fmt(randomInt(1, 12), 0));
  const options = shuffleArray(Array.from(d));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'easy', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `小明通常${r.label}${r.activity}。`, graphicType: 'clock' };
}

function generateHalfHour(): Question {
  const hour = randomInt(1, 12);
  const emoji = HALF_HOUR_EMOJIS[hour];
  const correct = fmt(hour, 30);
  const prompt = `時鐘顯示幾點？${emoji}`;
  const d = new Set<string>([correct]);
  while (d.size < 4) { const h = randomInt(1, 12); d.add(fmt(h, randomInt(0, 1) === 0 ? 0 : 30)); }
  const options = shuffleArray(Array.from(d));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'medium', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `時鐘顯示 ${correct}，即是${hour}點半。`, graphicType: 'clock' };
}

function generateHowLong(): Question {
  const start = randomInt(1, 10);
  const duration = randomInt(1, 3);
  const end = start + duration;
  const prompt = `小明 ${start} 點開始做功課，${end} 點做完。他做了多久？`;
  const correct = `${duration}小時`;
  const d = new Set<string>([correct]);
  d.add(`${duration + 1}小時`); d.add(`${Math.max(1, duration - 1)}小時`); d.add(`${duration + 2}小時`);
  const options = shuffleArray(Array.from(d).slice(0, 4));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'medium', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `從 ${start} 點到 ${end} 點，一共是 ${duration} 小時。`, graphicType: 'clock' };
}

function generateQuarterHour(): Question {
  const hour = randomInt(1, 12);
  const mins = [0, 15, 30, 45][randomInt(0, 3)];
  const emoji = mins === 0 ? CLOCK_EMOJIS[hour] : mins === 30 ? HALF_HOUR_EMOJIS[hour]
    : mins === 15 ? CLOCK_EMOJIS[hour] : HALF_HOUR_EMOJIS[hour];
  const correct = fmt(hour, mins);
  const prompt = `時鐘顯示幾點？${emoji}\n（長針指向 ${mins === 0 ? '12' : mins === 15 ? '3' : mins === 30 ? '6' : '9'}）`;
  const d = new Set<string>([correct]);
  while (d.size < 4) d.add(fmt(randomInt(1, 12), [0, 15, 30, 45][randomInt(0, 3)]));
  const options = shuffleArray(Array.from(d));
  const label = mins === 0 ? `${hour}點正` : mins === 15 ? `${hour}點15分` : mins === 30 ? `${hour}點半` : `${hour}點45分`;
  return { id: generateId(), topicId: 'telling-time', difficulty: 'hard', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `時鐘顯示 ${correct}，即是${label}。`, graphicType: 'clock' };
}

function generateElapsedTime(): Question {
  const startH = randomInt(1, 9);
  const startM = [0, 30][randomInt(0, 1)];
  const addHours = randomInt(1, 2);
  const endH = startH + addHours;
  const endM = startM;
  const prompt = `現在是 ${fmt(startH, startM)}，${addHours} 小時後是幾點？`;
  const correct = fmt(endH, endM);
  const d = new Set<string>([correct]);
  d.add(fmt(endH + 1, endM)); d.add(fmt(endH - 1 < 1 ? 12 : endH - 1, endM)); d.add(fmt(endH, endM === 0 ? 30 : 0));
  while (d.size < 4) d.add(fmt(randomInt(1, 12), [0, 30][randomInt(0, 1)]));
  const options = shuffleArray(Array.from(d).slice(0, 4));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'hard', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${fmt(startH, startM)} 加 ${addHours} 小時 = ${correct}。`, graphicType: 'clock' };
}

function generateScheduleProblem(): Question {
  const startH = randomInt(8, 10);
  const classes = randomInt(2, 4);
  const endH = startH + classes;
  const prompt = `小明 ${startH} 點開始上課，每堂課 1 小時，上了 ${classes} 堂課。他幾點下課？`;
  const correct = fmt(endH, 0);
  const d = new Set<string>([correct]);
  d.add(fmt(endH + 1, 0)); d.add(fmt(endH - 1, 0)); d.add(fmt(startH + classes + 1, 0));
  while (d.size < 4) d.add(fmt(randomInt(10, 15), 0));
  const options = shuffleArray(Array.from(d).slice(0, 4));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'hard', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${startH} 點開始，上了 ${classes} 堂課（每堂1小時），${startH} + ${classes} = ${endH} 點下課。`, graphicType: 'clock' };
}
