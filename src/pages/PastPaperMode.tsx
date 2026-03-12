import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SEMESTERS, DIFFICULTY_LABELS } from '../constants';
import { TOPIC_REGISTRY } from '../data/topicRegistry';
import type { DifficultyLevel, Question } from '../types';
import QuestionIllustration from '../components/QuestionIllustration';

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
      <div className="flex flex-col items-center gap-4 sm:gap-6 py-6 sm:py-8 px-2">
        <div className="flex items-center gap-3 w-full max-w-3xl">
          <Link to="/" className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 text-2xl" aria-label="返回主頁">⬅️</Link>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-700">📄 模擬試卷</h2>
        </div>
        <p className="text-gray-600 text-center max-w-md text-sm sm:text-base px-2">
          生成一份模擬考試試卷，涵蓋所有課題。可以列印出來給小朋友做練習。
        </p>

        <div className="grid grid-cols-2 sm:flex gap-3 justify-center px-2 w-full max-w-md">
          {DIFFICULTY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDifficulty(opt.value)}
              className={`min-h-14 min-w-12 px-4 sm:px-6 py-3 rounded-xl text-white font-bold text-base sm:text-lg transition-all ${
                difficulty === opt.value ? `${opt.color} scale-105 sm:scale-110 ring-4 ring-white shadow-xl` : `${opt.color} opacity-60 hover:opacity-80`
              }`}
            >
              {DIFFICULTY_LABELS[opt.value]}
            </button>
          ))}
        </div>

        <button
          onClick={generatePaper}
          className="min-h-14 min-w-12 px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg sm:text-xl font-bold shadow-lg hover:scale-105 transition-transform w-full max-w-xs sm:w-auto"
        >
          📄 生成試卷
        </button>
      </div>
    );
  }

  let questionNum = 0;

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 py-3 sm:py-4 px-1">
      <div className="flex items-center gap-2 sm:gap-3 w-full max-w-3xl print:hidden px-1">
        <button onClick={() => setPaper(null)} className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 text-2xl">⬅️</button>
        <h2 className="text-xl sm:text-2xl font-extrabold text-purple-700 flex-1">📄 模擬試卷</h2>
        <button onClick={() => setShowAnswers(!showAnswers)} className="min-h-11 px-3 sm:px-4 py-2 rounded-xl bg-blue-500 text-white font-bold text-xs sm:text-sm">
          {showAnswers ? '隱藏答案' : '顯示答案'}
        </button>
        <button onClick={handlePrint} className="min-h-11 px-3 sm:px-4 py-2 rounded-xl bg-green-500 text-white font-bold text-xs sm:text-sm">
          🖨️ 列印
        </button>
      </div>

      <div ref={printRef} className="w-full max-w-3xl bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 print:shadow-none print:p-2">
        <div className="text-center mb-4 sm:mb-6 border-b-2 border-gray-300 pb-3 sm:pb-4">
          <h1 className="text-xl sm:text-2xl font-bold">聖公會青衣主恩小學</h1>
          <h2 className="text-lg sm:text-xl font-bold mt-1">小一數學科 模擬測驗卷</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            難度：{DIFFICULTY_LABELS[difficulty]} ｜ 題目數量：{paper.reduce((s, sec) => s + sec.questions.length, 0)}
          </p>
          <div className="flex flex-col sm:flex-row justify-between mt-3 text-xs sm:text-sm gap-1 sm:gap-0">
            <span>姓名：_______________</span>
            <span>班別：_____ ( _____ )</span>
            <span>日期：_______________</span>
          </div>
        </div>

        {paper.map((section, sIdx) => (
          <div key={sIdx} className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-gray-700 border-b border-gray-200 pb-1 mb-2 sm:mb-3">
              {String.fromCharCode(0x7532 + sIdx) === '甲' || true
                ? `第${sIdx + 1}部分：${section.topicName}`
                : section.topicName}
            </h3>
            {section.questions.map((q) => {
              questionNum++;
              return (
                <div key={q.id} className="mb-3 sm:mb-4 pl-1 sm:pl-2">
                  <p className="font-medium text-gray-800 whitespace-pre-line text-sm sm:text-base">
                    {questionNum}. {q.prompt}
                  </p>
                  {q.illustration && <div className="pl-2 sm:pl-4"><QuestionIllustration svg={q.illustration} /></div>}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-y-1 mt-2 pl-2 sm:pl-4">
                    {q.options.map((opt, oIdx) => (
                      <label key={oIdx} className={`flex items-start gap-2 text-sm py-0.5 ${
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
          <div className="border-t-2 border-gray-300 pt-3 sm:pt-4 mt-3 sm:mt-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-2">答案欄</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2 text-xs sm:text-sm">
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
