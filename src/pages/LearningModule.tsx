import { useState, useCallback } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { TOPIC_REGISTRY } from '../data/topicRegistry';
import { DIFFICULTY_LABELS } from '../constants';
import RemotionAnimationPlayer from '../components/RemotionAnimationPlayer';
import type { DifficultyLevel, Question } from '../types';
import QuestionIllustration from '../components/QuestionIllustration';

const DIFFICULTY_OPTIONS: DifficultyLevel[] = ['easy', 'medium', 'hard', 'challenge'];
const PRACTICE_COUNT = 5;

export default function LearningModule() {
  const { topicId } = useParams<{ topicId: string }>();
  const [animationDone, setAnimationDone] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [showQuestions, setShowQuestions] = useState(false);

  const topic = topicId ? TOPIC_REGISTRY[topicId] : undefined;

  if (!topic || !topicId) {
    return <Navigate to="/" replace />;
  }

  const handleAnimationComplete = useCallback(() => {
    setAnimationDone(true);
  }, []);

  const handleReplay = () => {
    setAnimationDone(false);
    setShowQuestions(false);
    setQuestions([]);
    setSelected({});
    setRevealed({});
  };

  const handleStartPractice = () => {
    const qs = topic.generateQuestions(difficulty, PRACTICE_COUNT);
    setQuestions(qs);
    setSelected({});
    setRevealed({});
    setShowQuestions(true);
  };

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (revealed[qIdx]) return;
    setSelected((prev) => ({ ...prev, [qIdx]: optIdx }));
    setRevealed((prev) => ({ ...prev, [qIdx]: true }));
  };

  const correctCount = questions.reduce(
    (acc, q, i) => acc + (selected[i] === q.correctAnswerIndex ? 1 : 0),
    0
  );
  const allAnswered = questions.length > 0 && Object.keys(revealed).length === questions.length;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Back button */}
      <div className="flex items-center gap-4 w-full max-w-3xl">
        <Link
          to="/"
          className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 text-2xl transition-colors"
          aria-label="返回主頁"
        >
          ⬅️
        </Link>
        <h2 className="text-3xl md:text-4xl font-extrabold text-green-700">
          📖 {topic.name}
        </h2>
      </div>

      {/* Animation player */}
      <div className="w-full max-w-3xl">
        {!animationDone ? (
          <RemotionAnimationPlayer topicId={topicId} onComplete={handleAnimationComplete} />
        ) : !showQuestions ? (
          /* Post-animation: difficulty picker + start practice */
          <div className="flex flex-col items-center gap-6 py-8">
            <p className="text-2xl font-bold text-purple-700">🎉 動畫播放完畢！</p>
            <p className="text-lg text-gray-600">選擇難度，開始練習題目：</p>

            {/* Difficulty selector */}
            <div className="flex flex-wrap gap-3 justify-center">
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`min-h-12 min-w-12 px-5 py-3 rounded-2xl text-lg font-bold transition-all ${
                    difficulty === d
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {DIFFICULTY_LABELS[d]}
                </button>
              ))}
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={handleStartPractice}
                className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xl font-bold px-8 py-4 shadow-lg hover:scale-105 transition-transform"
              >
                ✏️ 開始練習
              </button>
              <Link
                to={`/test/${topicId}`}
                className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-400 to-amber-400 text-white text-xl font-bold px-8 py-4 shadow-lg hover:scale-105 transition-transform"
              >
                📝 正式測驗
              </Link>
              <button
                onClick={handleReplay}
                className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-xl font-bold px-8 py-4 shadow-lg hover:scale-105 transition-transform"
              >
                🔄 重新播放
              </button>
            </div>
          </div>
        ) : (
          /* Practice questions */
          <div className="flex flex-col gap-6 py-4">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-purple-700">
                練習題 — {DIFFICULTY_LABELS[difficulty]}
              </p>
              <span className="text-sm text-gray-500">{questions.length} 題</span>
            </div>

            {questions.map((q, qIdx) => {
              const isRevealed = revealed[qIdx];
              const isCorrect = selected[qIdx] === q.correctAnswerIndex;
              return (
                <div key={q.id} className="bg-white rounded-2xl shadow-md p-5">
                  <p className="text-lg font-bold mb-3">
                    {qIdx + 1}. {q.prompt}
                  </p>
                  {q.illustration && <QuestionIllustration svg={q.illustration} />}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      let btnClass = 'bg-gray-100 hover:bg-gray-200 text-gray-800';
                      if (isRevealed) {
                        if (optIdx === q.correctAnswerIndex) {
                          btnClass = 'bg-green-100 text-green-800 ring-2 ring-green-400';
                        } else if (optIdx === selected[qIdx] && !isCorrect) {
                          btnClass = 'bg-red-100 text-red-800 ring-2 ring-red-400';
                        } else {
                          btnClass = 'bg-gray-50 text-gray-400';
                        }
                      }
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelect(qIdx, optIdx)}
                          disabled={isRevealed}
                          className={`min-h-12 min-w-12 text-left px-4 py-3 rounded-xl font-medium transition-all ${btnClass}`}
                        >
                          {String.fromCharCode(65 + optIdx)}. {opt}
                        </button>
                      );
                    })}
                  </div>
                  {isRevealed && !isCorrect && (
                    <p className="mt-2 text-sm text-orange-600">💡 {q.explanation}</p>
                  )}
                </div>
              );
            })}

            {/* Summary + actions after all answered */}
            {allAnswered && (
              <div className="flex flex-col items-center gap-4 py-4 border-t border-gray-200">
                <p className="text-2xl font-bold">
                  {correctCount === questions.length
                    ? '🌟 全部正確！'
                    : `✅ ${correctCount} / ${questions.length} 正確`}
                </p>
                <div className="flex gap-4 flex-wrap justify-center">
                  <button
                    onClick={handleStartPractice}
                    className="min-h-12 min-w-12 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-lg font-bold px-6 py-3 shadow-lg hover:scale-105 transition-transform"
                  >
                    🔄 再練習
                  </button>
                  <Link
                    to={`/test/${topicId}`}
                    className="min-h-12 min-w-12 rounded-2xl bg-gradient-to-r from-orange-400 to-amber-400 text-white text-lg font-bold px-6 py-3 shadow-lg hover:scale-105 transition-transform"
                  >
                    📝 正式測驗
                  </Link>
                  <button
                    onClick={handleReplay}
                    className="min-h-12 min-w-12 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-lg font-bold px-6 py-3 shadow-lg hover:scale-105 transition-transform"
                  >
                    🔄 重看動畫
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
