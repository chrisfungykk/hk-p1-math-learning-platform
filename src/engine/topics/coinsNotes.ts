import type { DifficultyLevel, Question } from '../../types';
import { generateId, randomInt, shuffleArray } from '../questionGenerator';
import { coinSvg } from '../../utils/illustrations';

/**
 * 認識貨幣 (Recognizing HK Coins and Notes) — HK P1 1M2 standard
 * Uses actual HK coin denominations: 1角, 2角, 5角, 1元, 2元, 5元, 10元
 * Easy: identify coins, simple value of same coins
 * Medium: count mixed coins, simple purchase with change
 * Hard: multi-item purchase, "enough money?", make exact amount
 */
export function generateCoinsNotesQuestions(difficulty: DifficultyLevel, count: number): Question[] {
  const questions: Question[] = [];
  const generators: Record<DifficultyLevel, (() => Question)[]> = {
    easy: [generateIdentify, generateSimpleValue, generateCoinRecognition],
    medium: [generateCountMixed, generateSimplePurchase, generateWhichMore],
    hard: [generateMakeChange, generateMultiItem, generateEnoughMoney, generateExactAmount],
    challenge: [generateMinCoins, generateMultiItemChange, generateCoinPuzzle, generateTrickyPurchase, generateBudgetProblem, generateSplitPayment],
  };
  const gens = generators[difficulty];
  for (let i = 0; i < count; i++) {
    questions.push(gens[randomInt(0, gens.length - 1)]());
  }
  return questions;
}

const HK_COINS = [
  { name: '1角', value: 0.1 }, { name: '2角', value: 0.2 },
  { name: '5角', value: 0.5 }, { name: '1元', value: 1 },
  { name: '2元', value: 2 }, { name: '5元', value: 5 }, { name: '10元', value: 10 },
];

const DOLLAR_COINS = HK_COINS.filter(c => c.value >= 1);

function makeMoneyQ(difficulty: DifficultyLevel, prompt: string, correct: string, pool: string[], explanation: string): Question {
  const distractors = new Set<string>();
  distractors.add(correct);
  for (const d of pool) { if (distractors.size < 4) distractors.add(d); }
  const fillers = ['1元', '2元', '3元', '5元', '7元', '8元', '10元', '12元', '15元'];
  for (const f of fillers) { if (distractors.size >= 4) break; distractors.add(f); }
  const options = shuffleArray(Array.from(distractors).slice(0, 4));
  return {
    id: generateId(), topicId: 'coins-notes', difficulty, prompt, options,
    correctAnswerIndex: options.indexOf(correct), explanation, graphicType: 'money',
  };
}

function generateIdentify(): Question {
  const coin = DOLLAR_COINS[randomInt(0, DOLLAR_COINS.length - 1)];
  const prompt = `一個 ${coin.name} 硬幣值多少錢？`;
  const correct = `${coin.value}元`;
  const q = makeMoneyQ('easy', prompt, correct,
    DOLLAR_COINS.map(c => `${c.value}元`),
    `一個 ${coin.name} 硬幣值 ${coin.value} 元。`);
  q.illustration = coinSvg(coin.value);
  return q;
}

function generateCoinRecognition(): Question {
  const scenarios = [
    { prompt: '香港最大面值的硬幣是多少？', correct: '10元', pool: ['1元', '2元', '5元', '10元'], exp: '香港最大面值的硬幣是 10 元。' },
    { prompt: '以下哪個不是香港的硬幣面值？', correct: '3元', pool: ['1元', '2元', '3元', '5元'], exp: '香港沒有 3 元硬幣。' },
    { prompt: '香港有幾種不同面值的元硬幣？', correct: '4種', pool: ['2種', '3種', '4種', '5種'], exp: '香港有 1元、2元、5元、10元 共4種元硬幣。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = shuffleArray(s.pool);
  return {
    id: generateId(), topicId: 'coins-notes', difficulty: 'easy', prompt: s.prompt, options,
    correctAnswerIndex: options.indexOf(s.correct), explanation: s.exp, graphicType: 'money',
  };
}

function generateSimpleValue(): Question {
  const coin = DOLLAR_COINS[randomInt(0, 2)]; // 1, 2, or 5 yuan
  const count = randomInt(3, 5);
  const total = count * coin.value;
  const prompt = `${count} 個 ${coin.name} 硬幣一共是多少錢？`;
  const correct = `${total}元`;
  return makeMoneyQ('easy', prompt, correct,
    [`${total}元`, `${total + coin.value}元`, `${Math.max(1, total - coin.value)}元`, `${count}元`],
    `${count} × ${coin.value} = ${total}元。`);
}

function generateCountMixed(): Question {
  const c1 = DOLLAR_COINS[randomInt(1, 3)];
  const c2 = DOLLAR_COINS[randomInt(0, 2)];
  const total = c1.value + c2.value;
  const prompt = `一個 ${c1.name} 和一個 ${c2.name}，一共是多少錢？`;
  const correct = `${total}元`;
  return makeMoneyQ('medium', prompt, correct,
    [`${total}元`, `${total + 1}元`, `${Math.max(1, total - 1)}元`, `${total + 2}元`],
    `${c1.value} + ${c2.value} = ${total}元。`);
}

function generateSimplePurchase(): Question {
  const items = ['鉛筆', '橡皮擦', '尺子', '練習簿', '貼紙'];
  const item = items[randomInt(0, items.length - 1)];
  const price = randomInt(3, 8);
  const paid = price <= 5 ? 5 : 10;
  const change = paid - price;
  const prompt = `一支${item}要 ${price} 元，小明付了一個 ${paid} 元硬幣。應找回多少錢？`;
  const correct = `${change}元`;
  return makeMoneyQ('medium', prompt, correct,
    [`${change}元`, `${change + 1}元`, `${Math.max(0, change - 1)}元`, `${price}元`],
    `${paid} - ${price} = ${change}元。`);
}

function generateWhichMore(): Question {
  const a1 = randomInt(2, 4);
  const a2 = randomInt(1, 3);
  const totalA = a1 * 2;
  const totalB = a2 * 5;
  const prompt = `小明有 ${a1} 個 2元硬幣，小華有 ${a2} 個 5元硬幣。誰的錢比較多？`;
  const correct = totalA > totalB ? '小明' : totalA < totalB ? '小華' : '一樣多';
  const options = shuffleArray(['小明', '小華', '一樣多', '不能比較']);
  return {
    id: generateId(), topicId: 'coins-notes', difficulty: 'medium', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: `小明有 ${totalA} 元，小華有 ${totalB} 元。${correct === '一樣多' ? '一樣多' : correct + '的錢比較多'}。`,
    graphicType: 'money',
  };
}

function generateMakeChange(): Question {
  const price = randomInt(7, 15);
  const paid = price <= 10 ? 10 : 20;
  const change = paid - price;
  const prompt = `買東西花了 ${price} 元，付了 ${paid} 元。應找回多少錢？`;
  const correct = `${change}元`;
  return makeMoneyQ('hard', prompt, correct,
    [`${change}元`, `${change + 1}元`, `${Math.max(0, change - 1)}元`, `${change + 2}元`],
    `${paid} - ${price} = ${change}元。`);
}

function generateMultiItem(): Question {
  const items = [
    { name: '鉛筆', price: randomInt(3, 5) },
    { name: '橡皮擦', price: randomInt(2, 4) },
    { name: '尺子', price: randomInt(4, 6) },
    { name: '練習簿', price: randomInt(5, 7) },
  ];
  const picked = shuffleArray(items).slice(0, 2);
  const total = picked[0].price + picked[1].price;
  const prompt = `${picked[0].name} ${picked[0].price} 元，${picked[1].name} ${picked[1].price} 元。買這兩樣東西一共要多少錢？`;
  const correct = `${total}元`;
  return makeMoneyQ('hard', prompt, correct,
    [`${total}元`, `${total + 1}元`, `${total - 1}元`, `${total + 2}元`],
    `${picked[0].price} + ${picked[1].price} = ${total}元。`);
}

function generateEnoughMoney(): Question {
  const money = randomInt(6, 12);
  const price = randomInt(4, 14);
  const enough = money >= price;
  const prompt = `小明有 ${money} 元，一本書要 ${price} 元。小明的錢夠不夠買這本書？`;
  const correct = enough ? '夠' : '不夠';
  const options = shuffleArray(['夠', '不夠', `還差 ${Math.abs(money - price)} 元`, `剩餘 ${Math.abs(money - price)} 元`]);
  return {
    id: generateId(), topicId: 'coins-notes', difficulty: 'hard', prompt, options,
    correctAnswerIndex: options.indexOf(correct),
    explanation: enough ? `${money} 元 ≥ ${price} 元，所以夠買。` : `${money} 元 < ${price} 元，不夠買，還差 ${price - money} 元。`,
    graphicType: 'money',
  };
}

function generateExactAmount(): Question {
  const target = randomInt(3, 10);
  // Generate a valid combination
  const scenarios = [
    { coins: `${target} 個 1元硬幣`, correct: '可以' },
    { coins: `1 個 ${target <= 5 ? 5 : 10}元硬幣`, correct: target <= 5 ? (target === 5 ? '可以' : '不可以') : (target === 10 ? '可以' : '不可以') },
  ];
  const s = scenarios[0]; // always use the first one which is always valid
  const prompt = `用 ${s.coins} 能剛好付 ${target} 元嗎？`;
  const options = shuffleArray(['可以', '不可以', '要找續', '不夠']);
  return {
    id: generateId(), topicId: 'coins-notes', difficulty: 'hard', prompt, options,
    correctAnswerIndex: options.indexOf(s.correct),
    explanation: `${s.coins} 剛好是 ${target} 元，所以${s.correct}。`, graphicType: 'money',
  };
}

// --- Challenge (HKIMO-style) ---

function generateMinCoins(): Question {
  const target = randomInt(8, 18);
  // Greedy: 10, 5, 2, 1
  let remaining = target;
  let coins = 0;
  for (const val of [10, 5, 2, 1]) {
    coins += Math.floor(remaining / val);
    remaining = remaining % val;
  }
  const correct = `${coins}個`;
  const pool = [`${coins}個`, `${coins + 1}個`, `${coins - 1 > 0 ? coins - 1 : coins + 2}個`, `${coins + 2}個`];
  return makeMoneyQ('challenge',
    `用最少的硬幣付 ${target} 元（只用 1元、2元、5元、10元硬幣），最少要幾個硬幣？`,
    correct, pool,
    `用最少硬幣付 ${target} 元需要 ${coins} 個硬幣。`);
}

function generateMultiItemChange(): Question {
  const price1 = randomInt(3, 6);
  const price2 = randomInt(3, 6);
  const total = price1 + price2;
  const paid = total <= 10 ? 10 : 20;
  const change = paid - total;
  const prompt = `鉛筆 ${price1} 元，橡皮擦 ${price2} 元。小明買了這兩樣東西，付了 ${paid} 元。應找回多少錢？`;
  const correct = `${change}元`;
  return makeMoneyQ('challenge', prompt, correct,
    [`${change}元`, `${change + 1}元`, `${Math.max(0, change - 1)}元`, `${total}元`],
    `${price1} + ${price2} = ${total} 元。${paid} - ${total} = ${change} 元。`);
}

function generateCoinPuzzle(): Question {
  // How many ways to make a small amount
  const scenarios = [
    { prompt: '用 1元和 2元硬幣湊出 4 元，有幾種不同的方法？', correct: '3種', pool: ['2種', '3種', '4種', '5種'], explanation: '方法：4個1元；2個1元+1個2元；2個2元。共3種。' },
    { prompt: '用 1元和 2元硬幣湊出 3 元，有幾種不同的方法？', correct: '2種', pool: ['1種', '2種', '3種', '4種'], explanation: '方法：3個1元；1個1元+1個2元。共2種。' },
    { prompt: '用 1元和 2元硬幣湊出 5 元，有幾種不同的方法？', correct: '3種', pool: ['2種', '3種', '4種', '5種'], explanation: '方法：5個1元；3個1元+1個2元；1個1元+2個2元。共3種。' },
    { prompt: '小明有3個硬幣，一共是 7 元。他有哪些硬幣？', correct: '5元+1元+1元', pool: ['5元+1元+1元', '2元+2元+2元', '5元+2元+1元', '10元+1元+1元'], explanation: '5 + 1 + 1 = 7 元，用3個硬幣。' },
  ];
  const s = scenarios[randomInt(0, scenarios.length - 1)];
  const options = shuffleArray(s.pool);
  return {
    id: generateId(), topicId: 'coins-notes', difficulty: 'challenge', prompt: s.prompt, options,
    correctAnswerIndex: options.indexOf(s.correct), explanation: s.explanation, graphicType: 'money',
  };
}

function generateTrickyPurchase(): Question {
  const money = randomInt(10, 18);
  const price1 = randomInt(4, 7);
  const price2 = randomInt(4, 7);
  const total = price1 + price2;
  const enough = money >= total;
  const prompt = `小明有 ${money} 元。蘋果 ${price1} 元，香蕉 ${price2} 元。他買了一個蘋果和一條香蕉後，還剩多少錢？`;
  if (!enough) {
    const correct = '不夠錢買';
    const options = shuffleArray(['不夠錢買', `${money - total}元`, `${total}元`, `${money}元`]);
    return {
      id: generateId(), topicId: 'coins-notes', difficulty: 'challenge', prompt, options,
      correctAnswerIndex: options.indexOf(correct),
      explanation: `${price1} + ${price2} = ${total} 元 > ${money} 元，不夠錢買。`,
      graphicType: 'money',
    };
  }
  const remaining = money - total;
  const correct = `${remaining}元`;
  return makeMoneyQ('challenge', prompt, correct,
    [`${remaining}元`, `${remaining + 1}元`, `${Math.max(0, remaining - 1)}元`, `${total}元`],
    `${price1} + ${price2} = ${total} 元。${money} - ${total} = ${remaining} 元。`);
}

function generateBudgetProblem(): Question {
  const budget = randomInt(12, 20);
  const price1 = randomInt(4, 7);
  const price2 = randomInt(4, 7);
  const price3 = randomInt(3, 5);
  const total = price1 + price2 + price3;
  const enough = budget >= total;
  const prompt = `小明有 ${budget} 元。鉛筆 ${price1} 元，橡皮擦 ${price2} 元，尺子 ${price3} 元。他買了這三樣東西，${enough ? '還剩多少錢？' : '夠不夠錢？'}`;
  if (!enough) {
    const correct = `還差 ${total - budget} 元`;
    const options = shuffleArray([correct, '夠', `剩 ${budget - total} 元`, `${total}元`]);
    return {
      id: generateId(), topicId: 'coins-notes', difficulty: 'challenge', prompt, options,
      correctAnswerIndex: options.indexOf(correct),
      explanation: `${price1} + ${price2} + ${price3} = ${total} 元 > ${budget} 元，還差 ${total - budget} 元。`,
      graphicType: 'money',
    };
  }
  const remaining = budget - total;
  const correct = `${remaining}元`;
  return makeMoneyQ('challenge', prompt, correct,
    [`${remaining}元`, `${remaining + 1}元`, `${total}元`, `${Math.max(0, remaining - 1)}元`],
    `${price1} + ${price2} + ${price3} = ${total} 元。${budget} - ${total} = ${remaining} 元。`);
}

function generateSplitPayment(): Question {
  const total = randomInt(8, 16);
  const mingPaid = randomInt(2, total - 2);
  const huaPaid = total - mingPaid;
  const prompt = `一本書 ${total} 元。小明付了 ${mingPaid} 元，小華付了剩下的。小華付了多少錢？`;
  const correct = `${huaPaid}元`;
  return makeMoneyQ('challenge', prompt, correct,
    [`${huaPaid}元`, `${huaPaid + 1}元`, `${Math.max(0, huaPaid - 1)}元`, `${total}元`],
    `${total} - ${mingPaid} = ${huaPaid} 元。`);
}
