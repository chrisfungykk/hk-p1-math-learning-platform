import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

interface Currency {
  name: string;
  value: number; // value in cents (毫 = 10 cents, 元 = 100 cents)
  type: 'coin' | 'note';
}

const COINS: Currency[] = [
  { name: '1毫', value: 10, type: 'coin' },
  { name: '2毫', value: 20, type: 'coin' },
  { name: '5毫', value: 50, type: 'coin' },
  { name: '1元', value: 100, type: 'coin' },
  { name: '2元', value: 200, type: 'coin' },
  { name: '5元', value: 500, type: 'coin' },
  { name: '10元', value: 1000, type: 'coin' },
];

const NOTES: Currency[] = [
  { name: '10元', value: 1000, type: 'note' },
  { name: '20元', value: 2000, type: 'note' },
  { name: '50元', value: 5000, type: 'note' },
  { name: '100元', value: 10000, type: 'note' },
];

const ALL_CURRENCY = [...COINS, ...NOTES];

/**
 * 認識貨幣 (Recognizing Coins and Notes)
 * Easy: identify single coins/notes
 * Medium: count 2-3 coins
 * Hard: make change
 */
export function generateCoinsNotesQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push(generateIdentifyQuestion());
        break;
      case 'medium':
        questions.push(generateCountCoinsQuestion());
        break;
      case 'hard':
        questions.push(generateMakeChangeQuestion());
        break;
    }
  }

  return questions;
}

function formatValue(cents: number): string {
  if (cents >= 100 && cents % 100 === 0) {
    return `${cents / 100}元`;
  }
  if (cents < 100) {
    return `${cents / 10}毫`;
  }
  const yuan = Math.floor(cents / 100);
  const hao = (cents % 100) / 10;
  return `${yuan}元${hao}毫`;
}

function generateIdentifyQuestion(): Question {
  const currency = ALL_CURRENCY[randomInt(0, ALL_CURRENCY.length - 1)];
  const typeLabel = currency.type === 'coin' ? '硬幣' : '紙幣';
  const prompt = `這是多少錢？（一個${currency.name}${typeLabel}）`;

  const distractors = new Set<string>();
  distractors.add(currency.name);
  const sametype = currency.type === 'coin' ? COINS : NOTES;
  while (distractors.size < 4) {
    distractors.add(sametype[randomInt(0, sametype.length - 1)].name);
    if (distractors.size < 4) {
      distractors.add(ALL_CURRENCY[randomInt(0, ALL_CURRENCY.length - 1)].name);
    }
  }

  const options = shuffleArray(Array.from(distractors));
  const correctAnswerIndex = options.indexOf(currency.name);

  return {
    id: generateId(),
    topicId: 'coins-notes',
    difficulty: 'easy',
    prompt,
    options,
    correctAnswerIndex,
    explanation: `這是${currency.name}${typeLabel}。`,
    graphicType: 'money',
  };
}

function generateCountCoinsQuestion(): Question {
  const numCoins = randomInt(2, 3);
  // Pick simple coins for counting
  const simpleCoins = COINS.filter(c => c.value >= 100); // 1元 and above
  const selected: Currency[] = [];
  let totalCents = 0;

  for (let i = 0; i < numCoins; i++) {
    const coin = simpleCoins[randomInt(0, simpleCoins.length - 1)];
    selected.push(coin);
    totalCents += coin.value;
  }

  const coinList = selected.map(c => c.name).join(' + ');
  const correctAnswer = formatValue(totalCents);
  const prompt = `這是多少錢？${coinList}`;

  const distractors = new Set<string>();
  distractors.add(correctAnswer);
  while (distractors.size < 4) {
    const offset = randomInt(-2, 3) * 100;
    const val = totalCents + offset;
    if (val > 0) {
      distractors.add(formatValue(val));
    }
  }

  const options = shuffleArray(Array.from(distractors));
  const correctAnswerIndex = options.indexOf(correctAnswer);

  return {
    id: generateId(),
    topicId: 'coins-notes',
    difficulty: 'medium',
    prompt,
    options,
    correctAnswerIndex,
    explanation: `${coinList} = ${correctAnswer}。把所有硬幣加起來就是答案。`,
    graphicType: 'money',
  };
}

function generateMakeChangeQuestion(): Question {
  const prices = [3, 5, 7, 8, 10, 12, 15];
  const price = prices[randomInt(0, prices.length - 1)];
  const paid = price <= 10 ? 10 : 20;
  const change = paid - price;

  const prompt = `買東西花了${price}元，付了${paid}元，應找回多少錢？`;
  const correctAnswer = `${change}元`;

  const distractors = new Set<string>();
  distractors.add(correctAnswer);
  while (distractors.size < 4) {
    const d = change + randomInt(-3, 3);
    if (d >= 0 && d <= paid) {
      distractors.add(`${d}元`);
    }
  }

  const options = shuffleArray(Array.from(distractors));
  const correctAnswerIndex = options.indexOf(correctAnswer);

  return {
    id: generateId(),
    topicId: 'coins-notes',
    difficulty: 'hard',
    prompt,
    options,
    correctAnswerIndex,
    explanation: `付了${paid}元，花了${price}元，找回 ${paid} - ${price} = ${change}元。`,
    graphicType: 'money',
  };
}
