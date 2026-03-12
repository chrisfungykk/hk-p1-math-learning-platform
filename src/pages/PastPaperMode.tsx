import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SEMESTERS, DIFFICULTY_LABELS } from '../constants';
import { TOPIC_REGISTRY } from '../data/topicRegistry';
import type { DifficultyLevel, Question } from '../types';

const DIFFICULTY_OPTIONS: { value: DifficultyLevel; color: string }[] = [
  { value: 'easy', color: 'bg-green-500' },
  { value: 'medium', color: 'bg-yellow-500' },
  { value: 'hard', color: 'bg-red-500' },
  { value: 'challenge', color: 'bg-purple-600' },
];

interface PaperSection {
  topicName: string;
  questions: Question[];
}

export default function PastPaperMode() {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [paper, setPaper] = useState<PaperSection[] | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const generatePaper = () => {
    const semester = SEMESTERS[0];
    const sections: PaperSection[] = [];
    for (const topicId of semester.topics) {
      const topic = TOPIC_REGISTRY[topicId];
      if (!topic) continue;
      const qs = topic.generateQuestions(difficulty, 3);
      sections.push({ topicName: topic.name, questions: qs });
    }
    setPaper(sections);
    setShowAnswers(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!paper) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="flex items-center gap-4 w-full max-w-3xl">
          <Link to="/" className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 text-2xl" aria-label="返回主頁">⬅️</Link>
          <h2 className="text-3xl font-extrabold text-purple-700">📄 模擬試卷</h2>
        </div>
        <p className="text-gray-600 text-center max-w-md">
          生成一份模擬考試試卷，涵蓋所有課題。可以列印出來給小朋友做練習。
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDifficulty(opt.value)}
              className={`min-h-12 min-w-12 px-6 py-3 rounded-xl text-white font-bold text-lg transition-all ${
                difficulty === opt.value ? `${opt.color} scale-110 ring-4 ring-white shadow-xl` : `${opt.color} opacity-60 hover:opacity-80`
              }`}
            >
              {DIFFICULTY_LABELS[opt.value]}
            </button>
          ))}
        </div>

        <button
          onClick={generatePaper}
          className="min-h-12 min-w-12 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl font-bold shadow-lg hover:scale-105 transition-transform"
        >
          📄 生成試卷
        </button>
      </div>
    );
  }

  let questionNum = 0;

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex items-center gap-3 w-full max-w-3xl print:hidden">
        <button onClick={() => setPaper(null)} className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 text-2xl">⬅️</button>
        <h2 className="text-2xl font-extrabold text-purple-700 flex-1">📄 模擬試卷</h2>
        <button onClick={() => setShowAnswers(!showAnswers)} className="min-h-10 px-4 py-2 rounded-xl bg-blue-500 text-white font-bold text-sm">
          {showAnswers ? '隱藏答案' : '顯示答案'}
        </button>
        <button onClick={handlePrint} className="min-h-10 px-4 py-2 rounded-xl bg-green-500 text-white font-bold text-sm">
          🖨️ 列印
        </button>
      </div>

      <div ref={printRef} className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 print:shadow-none print:p-2">
        <div className="text-center mb-6 border-b-2 border-gray-300 pb-4">
          <h1 className="text-2xl font-bold">聖公會青衣主恩小學</h1>
          <h2 className="text-xl font-bold mt-1">小一數學科 模擬測驗卷</h2>
          <p className="text-sm text-gray-500 mt-1">
            難度：{DIFFICULTY_LABELS[difficulty]} ｜ 題目數量：{paper.reduce((s, sec) => s + sec.questions.length, 0)}
          </p>
          <div className="flex justify-between mt-3 text-sm">
            <span>姓名：_______________</span>
            <span>班別：_____ ( _____ )</span>
            <span>日期：_______________</span>
          </div>
        </div>

        {paper.map((section, sIdx) => (
          <div key={sIdx} className="mb-6">
            <h3 className="text-lg font-bold text-gray-700 border-b border-gray-200 pb-1 mb-3">
              {String.fromCharCode(0x7532 + sIdx) === '甲' || true
                ? `第${sIdx + 1}部分：${section.topicName}`
                : section.topicName}
            </h3>
            {section.questions.map((q) => {
              questionNum++;
              return (
                <div key={q.id} className="mb-4 pl-2">
                  <p className="font-medium text-gray-800 whitespace-pre-line">
                    {questionNum}. {q.prompt}
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 pl-4">
                    {q.options.map((opt, oIdx) => (
                      <label key={oIdx} className={`flex items-start gap-2 text-sm ${
                        showAnswers && oIdx === q.correctAnswerIndex ? 'text-green-600 font-bold' : 'text-gray-700'
                      }`}>
                        <span className="font-mono">{'ABCD'[oIdx]}.</span>
                        <span>{opt}</span>
                        {showAnswers && oIdx === q.correctAnswerIndex && <span className="ml-1">✓</span>}
                      </label>
                    ))}
                  </div>
                  {showAnswers && (
                    <p className="text-xs text-blue-600 mt-1 pl-4">💡 {q.explanation}</p>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {showAnswers && (
          <div className="border-t-2 border-gray-300 pt-4 mt-4">
            <h3 className="text-lg font-bold text-gray-700 mb-2">答案欄</h3>
            <div className="grid grid-cols-6 gap-2 text-sm">
              {(() => {
                let num = 0;
                return paper.flatMap((sec) =>
                  sec.questions.map((q) => {
                    num++;
                    return (
                      <div key={q.id} className="text-center">
                        <span className="font-mono">{num}.</span>{' '}
                        <span className="font-bold text-green-600">{'ABCD'[q.correctAnswerIndex]}</span>
                      </div>
                    );
                  })
                );
              })()}
            </div>
          </div>
        )}

        <div className="text-center text-sm text-gray-400 mt-6 pt-4 border-t border-gray-200">
          — 試卷完 —
        </div>
      </div>
    </div>
  );
}
