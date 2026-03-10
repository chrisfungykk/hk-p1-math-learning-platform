import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';

/**
 * 認識貨幣 (Recognizing Coins and Notes)
 * Easy: identify coins/notes, simple value
 * Medium: count 2-3 coins, simple purchase
 * Hard: make change, multi-item purchase, "enough money?"
 */
export function generateCoinsNotesQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    switch (difficulty) {
      case 'easy':
        questions.push(randomInt(0, 1) === 0 ? generateIdentify() : generateSimpleValue());
        break;
      case 'medium':
        questions.push(randomInt(0, 1) === 0 ? generateCountCoins() : generateSimplePurchase());
        break;
      case 'hard':
        questions.push([generateMakeChange, generateMultiItem, generateEnoughMoney][randomInt(0, 2)]());
        break;
    }
  }
  return questions;
}

const COINS = [
  { name: '1元', value: 1 }, { name: '2元', value: 2 },
  { name: '5元', value: 5 }, { name: '10元', value: 10 },
];

function generateIdentify(): Question {
  const coin = COINS[randomInt(0, COINS.length - 1)];
  const prompt = `一個 ${coin.name} 硬幣值多少錢？`;
  const correct = `${coin.value}元`;
  const d = new Set<string>([correct]);
  COINS.forEach(c => d.add(`${c.value}元`));
  const options = shuffleArray(Array.from(d).slice(0, 4));
  return { id: generateId(), topicId: 'coins-notes', difficulty: 'easy', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `一個 ${coin.name} 硬幣值 ${coin.value} 元。`, graphicType: 'money' };
}

function generateSimpleValue(): Question {
  const count = randomInt(2, 4);
  const coin = COINS[randomInt(0, 2)]; // 1, 2, or 5 yuan
  const total = count * coin.value;
  const prompt = `${count} 個 ${coin.name} 硬幣一共是多少錢？`;
  const correct = `${total}元`;
  const d = new Set<string>([correct]);
  d.add(`${total + coin.value}元`); d.add(`${Math.max(1, total - coin.value)}元`); d.add(`${count}元`);
  while (d.size < 4) d.add(`${randomInt(1, 20)}元`);
  const options = shuffleArray(Array.from(d).slice(0, 4));
  return { id: generateId(), topicId: 'coins-notes', difficulty: 'easy', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${count} × ${coin.value} = ${total}元。`, graphicType: 'money' };
}

function generateCountCoins(): Question {
  const c1 = COINS[randomInt(1, 3)];
  const c2 = COINS[randomInt(0, 2)];
  const total = c1.value + c2.value;
  const prompt = `一個 ${c1.name} 和一個 ${c2.name}，一共是多少錢？`;
  const correct = `${total}元`;
  const d = new Set<string>([correct]);
  d.add(`${total + 1}元`); d.add(`${Math.max(1, total - 1)}元`); d.add(`${total + 2}元`);
  while (d.size < 4) d.add(`${randomInt(1, 20)}元`);
  const options = shuffleArray(Array.from(d).slice(0, 4));
  return { id: generateId(), topicId: 'coins-notes', difficulty: 'medium', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${c1.value} + ${c2.value} = ${total}元。`, graphicType: 'money' };
}

function generateSimplePurchase(): Question {
  const items = ['鉛筆', '橡皮擦', '尺子', '練習簿', '貼紙'];
  const item = items[randomInt(0, items.length - 1)];
  const price = randomInt(2, 8);
  const paid = price <= 5 ? 5 : 10;
  const change = paid - price;
  const prompt = `一支${item}要 ${price} 元，小明付了 ${paid} 元。應找回多少錢？`;
  const correct = `${change}元`;
  const d = new Set<string>([correct]);
  d.add(`${change + 1}元`); d.add(`${Math.max(0, change - 1)}元`); d.add(`${price}元`);
  while (d.size < 4) d.add(`${randomInt(0, paid)}元`);
  const options = shuffleArray(Array.from(d).slice(0, 4));
  return { id: generateId(), topicId: 'coins-notes', difficulty: 'medium', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${paid} - ${price} = ${change}元。應找回 ${change} 元。`, graphicType: 'money' };
}

function generateMakeChange(): Question {
  const price = randomInt(6, 15);
  const paid = price <= 10 ? 10 : 20;
  const change = paid - price;
  const prompt = `買東西花了 ${price} 元，付了 ${paid} 元。應找回多少錢？`;
  const correct = `${change}元`;
  const d = new Set<string>([correct]);
  d.add(`${change + 1}元`); d.add(`${Math.max(0, change - 1)}元`); d.add(`${change + 2}元`);
  while (d.size < 4) d.add(`${randomInt(0, paid)}元`);
  const options = shuffleArray(Array.from(d).slice(0, 4));
  return { id: generateId(), topicId: 'coins-notes', difficulty: 'hard', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${paid} - ${price} = ${change}元。`, graphicType: 'money' };
}

function generateMultiItem(): Question {
  const items = [
    { name: '鉛筆', price: randomInt(2, 4) },
    { name: '橡皮擦', price: randomInt(1, 3) },
    { name: '尺子', price: randomInt(3, 5) },
  ];
  const picked = shuffleArray(items).slice(0, 2);
  const total = picked[0].price + picked[1].price;
  const prompt = `${picked[0].name} ${picked[0].price} 元，${picked[1].name} ${picked[1].price} 元。買這兩樣東西一共要多少錢？`;
  const correct = `${total}元`;
  const d = new Set<string>([correct]);
  d.add(`${total + 1}元`); d.add(`${total - 1}元`); d.add(`${total + 2}元`);
  while (d.size < 4) d.add(`${randomInt(2, 15)}元`);
  const options = shuffleArray(Array.from(d).slice(0, 4));
  return { id: generateId(), topicId: 'coins-notes', difficulty: 'hard', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `${picked[0].price} + ${picked[1].price} = ${total}元。`, graphicType: 'money' };
}

function generateEnoughMoney(): Question {
  const money = randomInt(8, 15);
  const price = randomInt(5, 18);
  const enough = money >= price;
  const prompt = `小明有 ${money} 元，一本書要 ${price} 元。小明的錢夠不夠買這本書？`;
  const correct = enough ? '夠' : '不夠';
  const options = shuffleArray(['夠', '不夠', `還差 ${Math.abs(money - price)} 元`, `剩餘 ${Math.abs(money - price)} 元`]);
  return { id: generateId(), topicId: 'coins-notes', difficulty: 'hard', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: enough ? `${money} 元 ≥ ${price} 元，所以夠買。` : `${money} 元 < ${price} 元，不夠買，還差 ${price - money} 元。`,
    graphicType: 'money' };
}
