import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

interface PictogramItem { name: string; emoji: string; }

const ITEMS: PictogramItem[] = [
  { name: '蘋果', emoji: '🍎' }, { name: '香蕉', emoji: '🍌' },
  { name: '橙', emoji: '🍊' }, { name: '草莓', emoji: '🍓' },
  { name: '葡萄', emoji: '🍇' }, { name: '西瓜', emoji: '🍉' },
];

interface PictogramData { items: { item: PictogramItem; count: number }[]; }

/**
 * 數據處理 (Simple Data Handling / Pictograms)
 * Easy: read pictogram, count items
 * Medium: compare most/least, "how many more"
 * Hard: find totals, difference, multi-step questions
 */
export function generateDataHandlingQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const data = genData(difficulty);
    switch (difficulty) {
      case 'easy':
        questions.push(randomInt(0, 1) === 0 ? generateRead(data) : generateCountAll(data));
        break;
      case 'medium':
        questions.push(randomInt(0, 1) === 0 ? generateCompare(data) : generateHowManyMore(data));
        break;
      case 'hard':
        questions.push([() => generateTotal(data), () => generateDifference(data), () => generateMultiStep(data)][randomInt(0, 2)]());
        break;
      case 'challenge': {
        const cData = genData('hard');
        questions.push([() => generateMissingData(cData), () => generateMultiStepAnalysis(cData), () => generateReverseData(cData), () => generateCompareAndReason(cData)][randomInt(0, 3)]());
        break;
      }
    }
  }
  return questions;
}

function genData(difficulty: DifficultyLevel): PictogramData {
  const n = difficulty === 'easy' ? randomInt(2, 3) : difficulty === 'medium' ? 3 : randomInt(3, 4);
  const maxC = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 8 : 10;
  const selected = shuffleArray(ITEMS).slice(0, n);
  return { items: selected.map(item => ({ item, count: randomInt(1, maxC) })) };
}

function display(data: PictogramData): string {
  return data.items.map(d => `${d.item.emoji} ${d.item.name}：${d.item.emoji.repeat(d.count)}`).join('\n');
}

function makeQ(difficulty: DifficultyLevel, prompt: string, correct: number, min: number, max: number, explanation: string): Question {
  const d = new Set<number>([correct]);
  d.add(correct + 1); if (correct - 1 >= min) d.add(correct - 1); d.add(correct + 2 <= max ? correct + 2 : randomInt(min, max));
  while (d.size < 4) d.add(randomInt(min, max));
  const options = shuffleArray(Array.from(d).slice(0, 4).map(String));
  return { id: generateId(), topicId: 'data-handling', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct.toString()), explanation, graphicType: 'pictogram' };
}

function generateRead(data: PictogramData): Question {
  const t = data.items[randomInt(0, data.items.length - 1)];
  return makeQ('easy', `圖表中，${t.item.name}有幾個？\n${display(data)}`, t.count, 1, 10,
    `數一數，${t.item.name}有 ${t.count} 個。`);
}

function generateCountAll(data: PictogramData): Question {
  const total = data.items.reduce((s, d) => s + d.count, 0);
  return makeQ('easy', `圖表中所有東西加起來一共有幾個？\n${display(data)}`, total, 1, 30,
    `全部加起來：${data.items.map(d => d.count).join(' + ')} = ${total}。`);
}

function generateCompare(data: PictogramData): Question {
  const sorted = [...data.items].sort((a, b) => b.count - a.count);
  const isMost = randomInt(0, 1) === 0;
  const target = isMost ? sorted[0] : sorted[sorted.length - 1];
  const label = isMost ? '最多' : '最少';
  const prompt = `哪種東西${label}？\n${display(data)}`;
  const options = shuffleArray(data.items.map(d => d.item.name));
  return { id: generateId(), topicId: 'data-handling', difficulty: 'medium', prompt, options,
    correctAnswerIndex: options.indexOf(target.item.name),
    explanation: `${target.item.name}${label}，有 ${target.count} 個。`, graphicType: 'pictogram' };
}

function generateHowManyMore(data: PictogramData): Question {
  const sorted = [...data.items].sort((a, b) => b.count - a.count);
  const most = sorted[0];
  const least = sorted[sorted.length - 1];
  const diff = most.count - least.count;
  const prompt = `${most.item.name}比${least.item.name}多幾個？\n${display(data)}`;
  return makeQ('medium', prompt, diff, 0, 15,
    `${most.item.name}有 ${most.count} 個，${least.item.name}有 ${least.count} 個，相差 ${diff} 個。`);
}

function generateTotal(data: PictogramData): Question {
  const total = data.items.reduce((s, d) => s + d.count, 0);
  return makeQ('hard', `圖表中所有東西加起來一共有幾個？\n${display(data)}`, total, 1, 40,
    `全部加起來：${data.items.map(d => `${d.item.name}(${d.count})`).join(' + ')} = ${total}。`);
}

function generateDifference(data: PictogramData): Question {
  if (data.items.length < 2) return generateTotal(data);
  const a = data.items[0];
  const b = data.items[1];
  const diff = Math.abs(a.count - b.count);
  const prompt = `${a.item.name}和${b.item.name}相差幾個？\n${display(data)}`;
  return makeQ('hard', prompt, diff, 0, 15,
    `${a.item.name}有 ${a.count} 個，${b.item.name}有 ${b.count} 個，相差 ${diff} 個。`);
}

function generateMultiStep(data: PictogramData): Question {
  if (data.items.length < 2) return generateTotal(data);
  const a = data.items[0];
  const b = data.items[1];
  const sum = a.count + b.count;
  const prompt = `${a.item.name}和${b.item.name}一共有幾個？\n${display(data)}`;
  return makeQ('hard', prompt, sum, 1, 25,
    `${a.count} + ${b.count} = ${sum}。${a.item.name}和${b.item.name}一共有 ${sum} 個。`);
}

// --- Challenge (HKIMO-style) ---

function generateMissingData(data: PictogramData): Question {
  if (data.items.length < 2) return generateTotal(data);
  const total = data.items.reduce((s, d) => s + d.count, 0);
  const hidden = data.items[randomInt(0, data.items.length - 1)];
  const knownTotal = total - hidden.count;
  const displayItems = data.items.map(d =>
    d.item.name === hidden.item.name
      ? `${d.item.emoji} ${d.item.name}：？`
      : `${d.item.emoji} ${d.item.name}：${d.item.emoji.repeat(d.count)}`
  ).join('\n');
  const prompt = `圖表中所有東西加起來一共有 ${total} 個。${hidden.item.name}有幾個？\n${displayItems}`;
  return makeQ('challenge', prompt, hidden.count, 0, 20,
    `其他東西共 ${knownTotal} 個。${total} - ${knownTotal} = ${hidden.count}。`);
}

function generateMultiStepAnalysis(data: PictogramData): Question {
  if (data.items.length < 3) return generateTotal(data);
  const sorted = [...data.items].sort((a, b) => b.count - a.count);
  const most = sorted[0];
  const least = sorted[sorted.length - 1];
  const sum = most.count + least.count;
  const prompt = `最多的和最少的加起來一共有幾個？\n${display(data)}`;
  return makeQ('challenge', prompt, sum, 0, 25,
    `最多的是${most.item.name}（${most.count}個），最少的是${least.item.name}（${least.count}個）。${most.count} + ${least.count} = ${sum}。`);
}

function generateReverseData(data: PictogramData): Question {
  if (data.items.length < 2) return generateTotal(data);
  const a = data.items[0];
  const b = data.items[1];
  const total = a.count + b.count;
  const prompt = `${a.item.name}和${b.item.name}一共有 ${total} 個。${a.item.name}有 ${a.count} 個。${b.item.name}有幾個？`;
  return makeQ('challenge', prompt, b.count, 0, 20,
    `${total} - ${a.count} = ${b.count}。${b.item.name}有 ${b.count} 個。`);
}

function generateCompareAndReason(data: PictogramData): Question {
  if (data.items.length < 3) return generateTotal(data);
  const sorted = [...data.items].sort((a, b) => b.count - a.count);
  const most = sorted[0];
  const second = sorted[1];
  const diff = most.count - second.count;
  const prompt = `最多的比第二多的多幾個？\n${display(data)}`;
  return makeQ('challenge', prompt, diff, 0, 15,
    `最多的是${most.item.name}（${most.count}個），第二多的是${second.item.name}（${second.count}個）。${most.count} - ${second.count} = ${diff}。`);
}
