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

const DAYS_OF_WEEK = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

/**
 * 認識時間 (Telling Time) — HK P1 1M4 standard
 * Hour and half-hour, days of week, months
 * Easy: exact hours, daily routine
 * Medium: half hours, "how long", days of week
 * Hard: quarter hours, elapsed time, schedule, calendar
 */
export function generateTellingTimeQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateExactHour, generateDailyRoutine, generateDayOfWeek],
    medium: [generateHalfHour, generateHowLong, generateDaysOrder, generateMonthQuestion],
    hard: [generateQuarterHour, generateElapsedTime, generateScheduleProblem, generateCalendarProblem],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

function fmt(h: number, m: number): string { return `${h}:${m.toString().padStart(2, '0')}`; }

function generateExactHour(): Question {
  const hour = randomInt(1, 12);
  const emoji = CLOCK_EMOJIS[hour];
  const correct = fmt(hour, 0);
  const d = new Set<string>([correct]);
  while (d.size < 4) d.add(fmt(randomInt(1, 12), 0));
  const options = shuffleArray(Array.from(d));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'easy',
    prompt: `時鐘顯示幾點？${emoji}`, options,
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
  const d = new Set<string>([correct]);
  while (d.size < 4) d.add(fmt(randomInt(1, 12), 0));
  const options = shuffleArray(Array.from(d));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'easy',
    prompt: `小明通常幾點${r.activity}？${CLOCK_EMOJIS[r.hour]}`, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `小明通常${r.label}${r.activity}。`, graphicType: 'clock' };
}

function generateDayOfWeek(): Question {
  const idx = randomInt(0, 6);
  const day = DAYS_OF_WEEK[idx];
  const nextIdx = (idx + 1) % 7;
  const correct = DAYS_OF_WEEK[nextIdx];
  const prompt = `今天是${day}，明天是星期幾？`;
  const pool = new Set<string>([correct]);
  for (const d of DAYS_OF_WEEK) { if (pool.size >= 4) break; pool.add(d); }
  const options = shuffleArray(Array.from(pool));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'easy',
    prompt, options, correctAnswerIndex: options.indexOf(correct),
    explanation: `${day}的下一天是${correct}。`, graphicType: 'clock' };
}

function generateHalfHour(): Question {
  const hour = randomInt(1, 12);
  const emoji = HALF_HOUR_EMOJIS[hour];
  const correct = fmt(hour, 30);
  const d = new Set<string>([correct]);
  while (d.size < 4) { const h = randomInt(1, 12); d.add(fmt(h, randomInt(0, 1) === 0 ? 0 : 30)); }
  const options = shuffleArray(Array.from(d));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'medium',
    prompt: `時鐘顯示幾點？${emoji}`, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `時鐘顯示 ${correct}，即是${hour}點半。`, graphicType: 'clock' };
}

function generateHowLong(): Question {
  const start = randomInt(1, 10);
  const duration = randomInt(1, 3);
  const end = start + duration;
  const correct = `${duration}小時`;
  const d = new Set<string>([correct]);
  d.add(`${duration + 1}小時`); d.add(`${Math.max(1, duration - 1)}小時`); d.add(`${duration + 2}小時`);
  const options = shuffleArray(Array.from(d).slice(0, 4));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'medium',
    prompt: `小明 ${start} 點開始做功課，${end} 點做完。他做了多久？`, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `從 ${start} 點到 ${end} 點，一共是 ${duration} 小時。`, graphicType: 'clock' };
}

function generateDaysOrder(): Question {
  const idx = randomInt(0, 4);
  const day = DAYS_OF_WEEK[idx];
  const afterTomorrow = DAYS_OF_WEEK[(idx + 2) % 7];
  const prompt = `今天是${day}，後天是星期幾？`;
  const pool = new Set<string>([afterTomorrow]);
  for (const d of DAYS_OF_WEEK) { if (pool.size >= 4) break; pool.add(d); }
  const options = shuffleArray(Array.from(pool));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'medium',
    prompt, options, correctAnswerIndex: options.indexOf(afterTomorrow),
    explanation: `${day}的後天是${afterTomorrow}。`, graphicType: 'clock' };
}

function generateMonthQuestion(): Question {
  const idx = randomInt(0, 10);
  const month = MONTHS[idx];
  const nextMonth = MONTHS[idx + 1];
  const prompt = `${month}的下一個月是什麼月份？`;
  const pool = new Set<string>([nextMonth]);
  for (const m of MONTHS) { if (pool.size >= 4) break; pool.add(m); }
  const options = shuffleArray(Array.from(pool));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'medium',
    prompt, options, correctAnswerIndex: options.indexOf(nextMonth),
    explanation: `${month}的下一個月是${nextMonth}。`, graphicType: 'clock' };
}

function generateQuarterHour(): Question {
  const hour = randomInt(1, 12);
  const mins = [0, 15, 30, 45][randomInt(0, 3)];
  const emoji = mins === 0 ? CLOCK_EMOJIS[hour] : mins === 30 ? HALF_HOUR_EMOJIS[hour]
    : mins === 15 ? CLOCK_EMOJIS[hour] : HALF_HOUR_EMOJIS[hour];
  const correct = fmt(hour, mins);
  const d = new Set<string>([correct]);
  while (d.size < 4) d.add(fmt(randomInt(1, 12), [0, 15, 30, 45][randomInt(0, 3)]));
  const options = shuffleArray(Array.from(d));
  const label = mins === 0 ? `${hour}點正` : mins === 15 ? `${hour}點15分` : mins === 30 ? `${hour}點半` : `${hour}點45分`;
  return { id: generateId(), topicId: 'telling-time', difficulty: 'hard',
    prompt: `時鐘顯示幾點？${emoji}\n（長針指向 ${mins === 0 ? '12' : mins === 15 ? '3' : mins === 30 ? '6' : '9'}）`,
    options, correctAnswerIndex: options.indexOf(correct),
    explanation: `時鐘顯示 ${correct}，即是${label}。`, graphicType: 'clock' };
}

function generateElapsedTime(): Question {
  const startH = randomInt(1, 9);
  const startM = [0, 30][randomInt(0, 1)];
  const addHours = randomInt(1, 2);
  const endH = startH + addHours;
  const endM = startM;
  const correct = fmt(endH, endM);
  const d = new Set<string>([correct]);
  d.add(fmt(endH + 1, endM)); d.add(fmt(endH - 1 < 1 ? 12 : endH - 1, endM)); d.add(fmt(endH, endM === 0 ? 30 : 0));
  while (d.size < 4) d.add(fmt(randomInt(1, 12), [0, 30][randomInt(0, 1)]));
  const options = shuffleArray(Array.from(d).slice(0, 4));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'hard',
    prompt: `現在是 ${fmt(startH, startM)}，${addHours} 小時後是幾點？`, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${fmt(startH, startM)} 加 ${addHours} 小時 = ${correct}。`, graphicType: 'clock' };
}

function generateScheduleProblem(): Question {
  const startH = randomInt(8, 10);
  const classes = randomInt(2, 4);
  const endH = startH + classes;
  const correct = fmt(endH, 0);
  const d = new Set<string>([correct]);
  d.add(fmt(endH + 1, 0)); d.add(fmt(endH - 1, 0)); d.add(fmt(startH + classes + 1, 0));
  while (d.size < 4) d.add(fmt(randomInt(10, 15), 0));
  const options = shuffleArray(Array.from(d).slice(0, 4));
  return { id: generateId(), topicId: 'telling-time', difficulty: 'hard',
    prompt: `小明 ${startH} 點開始上課，每堂課 1 小時，上了 ${classes} 堂課。他幾點下課？`, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${startH} + ${classes} = ${endH} 點下課。`, graphicType: 'clock' };
}

function generateCalendarProblem(): Question {
  const scenarios = [
    { prompt: '一個星期有幾天？', correct: '7天', pool: ['5天', '6天', '7天', '10天'], exp: '一個星期有7天。' },
    { prompt: '一年有幾個月？', correct: '12個月', pool: ['10個月', '11個月', '12個月', '13個月'], exp: '一年有12個月。' },
    () => {
      const idx = randomInt(0, 5);
      const day = DAYS_OF_WEEK[idx];
      const daysLater = randomInt(2, 4);
      const targetIdx = (idx + daysLater) % 7;
      const correct = DAYS_OF_WEEK[targetIdx];
      const pool = new Set<string>([correct]);
      for (const d of DAYS_OF_WEEK) { if (pool.size >= 4) break; pool.add(d); }
      return { prompt: `今天是${day}，${daysLater}天後是星期幾？`, correct,
        pool: Array.from(pool), exp: `${day}過${daysLater}天是${correct}。` };
    },
  ];
  const pick = scenarios[randomInt(0, scenarios.length - 1)];
  const s = typeof pick === 'function' ? pick() : pick;
  const options = shuffleArray(s.pool);
  return { id: generateId(), topicId: 'telling-time', difficulty: 'hard',
    prompt: s.prompt, options, correctAnswerIndex: options.indexOf(s.correct),
    explanation: s.exp, graphicType: 'clock' };
}
