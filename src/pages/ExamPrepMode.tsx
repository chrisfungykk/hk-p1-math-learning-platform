import { useState, useCallback, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import type { DifficultyLevel, Question, TopicScoreBreakdown } from '../types';
import { DIFFICULTY_LABELS, SEMESTERS } from '../constants';
import { TOPIC_REGISTRY } from '../data/topicRegistry';
import { generateExamQuestions, computeTopicBreakdown } from '../utils/examPrep';
import { evaluateAnswer, computeScoreSummary, createScoreRecord } from '../utils/scoring';
import { saveScoreRecord, loadLastDifficulty, saveLastDifficulty } from '../services/storage';

type Phase = 'setup' | 'exam' | 'summary';

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  easy: 'from-green-400 to-emerald-400',
  medium: 'from-yellow-400 to-amber-400',
  hard: 'from-red-400 to-rose-400',
  challenge: 'from-purple-500 to-indigo-500',
};

const DIFFICULTY_EMOJIS: Record<DifficultyLevel, string> = {
  easy: '🌟',
  medium: '⚡',
  hard: '🔥',
  challenge: '🏆',
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

function getScoreEmoji(percentage: number): string {
  if (percentage === 100) return '🏆';
  if (percentage >= 80) return '🌟';
  if (percentage >= 60) return '😊';
  if (percentage >= 40) return '💪';
  return '📚';
}

export default function ExamPrepMode() {
  const { semesterId } = useParams<{ semesterId: string }>();
  const semester = SEMESTERS.find((s) => s.id === semesterId);

  const [difficulty, setDifficulty] = useState<DifficultyLevel>(loadLastDifficulty);
  const [phase, setPhase] = useState<Phase>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [summary, setSummary] = useState<{ correct: number; incorrect: number; total: number } | null>(null);
  const [topicBreakdown, setTopicBreakdown] = useState<TopicScoreBreakdown[]>([]);
  const scoreRecorded = useRef(false);

  const handleDifficultyChange = useCallback((level: DifficultyLevel) => {
    setDifficulty(level);
    saveLastDifficulty(level);
  }, []);

  const handleStartExam = useCallback(() => {
    if (!semesterId || (semesterId !== 'sem1' && semesterId !== 'sem2')) return;
    const generated = generateExamQuestions(semesterId, difficulty);
    setQuestions(generated);
    setAnswers({});
    setShowResults(false);
    setSummary(null);
    setTopicBreakdown([]);
    scoreRecorded.current = false;
    setPhase('exam');
  }, [semesterId, difficulty]);

  const handleSelectAnswer = useCallback((questionIdx: number, optionIdx: number) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
  }, [showResults]);

  const handleSubmit = useCallback(() => {
    const answerList = questions.map((question, idx) => ({
      question,
      submittedIndex: answers[idx] ?? -1,
    }));
    const result = computeScoreSummary(answerList);
    setSummary(result);

    const breakdown = computeTopicBreakdown(answerList);
    setTopicBreakdown(breakdown);

    if (semester && !scoreRecorded.current) {
      scoreRecorded.current = true;
      const record = createScoreRecord({
        topicId: null,
        semester: semester.id,
        difficulty,
        score: result.correct,
        totalQuestions: result.total,
        isExamPrep: true,
        topicBreakdown: breakdown,
      });
      saveScoreRecord(record);
    }

    setShowResults(true);
    setPhase('summary');
  }, [questions, answers, semester, difficulty]);

  const handleRetry = useCallback(() => {
    setPhase('setup');
    setQuestions([]);
    setAnswers({});
    setShowResults(false);
    setSummary(null);
    setTopicBreakdown([]);
    scoreRecorded.current = false;
  }, []);

  if (!semester || !semesterId) {
    return <Navigate to="/" replace />;
  }

  const answeredCount = Object.keys(answers).length;

  // ── Setup Phase ──
  if (phase === 'setup') {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="flex items-center gap-4 w-full max-w-3xl">
          <Link to={`/semester/${semesterId}`}
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 text-2xl transition-colors"
            aria-label={`返回${semester.name}`}>⬅️</Link>
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-700">📝 考試準備 — {semester.name}</h2>
        </div>
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <p className="text-xl font-bold text-gray-700">選擇難度</p>
          <div className="flex gap-3 w-full">
            {(['easy', 'medium', 'hard', 'challenge'] as DifficultyLevel[]).map((level) => (
              <button key={level} onClick={() => handleDifficultyChange(level)}
                className={`flex-1 min-h-16 min-w-12 rounded-2xl text-lg font-bold shadow-md transition-all ${
                  difficulty === level
                    ? `bg-gradient-to-br ${DIFFICULTY_COLORS[level]} text-white scale-105 ring-4 ring-white`
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`} aria-pressed={difficulty === level}>
                {DIFFICULTY_EMOJIS[level]} {DIFFICULTY_LABELS[level]}
              </button>
            ))}
          </div>
          <button onClick={handleStartExam}
            className="min-h-12 min-w-12 w-full rounded-2xl bg-gradient-to-r from-red-400 to-pink-400 text-white text-xl font-bold py-4 shadow-lg hover:scale-105 transition-transform mt-4">
            📝 開始考試準備
          </button>
        </div>
      </div>
    );
  }

  // ── Exam Paper (1-page style with sections) ──
  const percentage = summary ? (summary.total > 0 ? Math.round((summary.correct / summary.total) * 100) : 0) : 0;

  // Group questions by topic for section display
  const topicGroups: { topicId: string; topicName: string; questions: { q: Question; globalIdx: number }[] }[] = [];
  const topicMap = new Map<string, { q: Question; globalIdx: number }[]>();
  questions.forEach((q, idx) => {
    const arr = topicMap.get(q.topicId) ?? [];
    arr.push({ q, globalIdx: idx });
    topicMap.set(q.topicId, arr);
  });
  for (const [topicId, qs] of topicMap) {
    const topicDef = TOPIC_REGISTRY[topicId];
    topicGroups.push({ topicId, topicName: topicDef?.name ?? topicId, questions: qs });
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4 px-2">
      {/* Header */}
      <div className="flex items-center gap-4 w-full max-w-3xl">
        <Link to={`/semester/${semesterId}`}
          className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 text-2xl transition-colors"
          aria-label={`返回${semester.name}`}>⬅️</Link>
        <h2 className="text-2xl md:text-3xl font-extrabold text-red-700">📝 考試準備 — {semester.name}</h2>
      </div>

      {/* Exam paper */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-4 md:p-6 border-2 border-red-200">
        {/* Paper header */}
        <div className="text-center border-b-2 border-gray-300 pb-3 mb-4">
          <h3 className="text-xl md:text-2xl font-extrabold text-gray-800">
            小一數學 {semester.name} 模擬試卷
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            難度：{DIFFICULTY_EMOJIS[difficulty]} {DIFFICULTY_LABELS[difficulty]} ｜ 共 {questions.length} 題
          </p>
          <p className="text-xs text-gray-400 mt-1">請選擇每題的正確答案，然後按「交卷」</p>
        </div>

        {/* Score banner */}
        {showResults && summary && (
          <div className="flex flex-col items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-4 border border-purple-200">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{getScoreEmoji(percentage)}</span>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-purple-700">{percentage}%</p>
                <p className="text-sm text-gray-600">✅ {summary.correct} 正確 ｜ ❌ {summary.incorrect} 錯誤 ｜ 共 {summary.total} 題</p>
              </div>
            </div>
            {/* Per-topic breakdown */}
            {topicBreakdown.length > 0 && (
              <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {topicBreakdown.map((tb) => {
                  const topicDef = TOPIC_REGISTRY[tb.topicId];
                  const topicName = topicDef?.name ?? tb.topicId;
                  const topicPct = tb.total > 0 ? Math.round((tb.correct / tb.total) * 100) : 0;
                  return (
                    <div key={tb.topicId} className="flex items-center justify-between bg-white rounded-xl shadow-sm px-3 py-2 text-sm">
                      <span className="font-bold text-gray-700 truncate">{topicName}</span>
                      <span className={`font-bold ml-2 ${topicPct >= 80 ? 'text-green-600' : topicPct >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {tb.correct}/{tb.total}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Questions grouped by topic (sections) */}
        {topicGroups.map((group, groupIdx) => (
          <div key={group.topicId} className="mb-6">
            <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
              <span className="text-sm font-bold text-white bg-red-400 rounded-full px-3 py-1">
                第{['甲', '乙', '丙', '丁', '戊', '己'][groupIdx] ?? (groupIdx + 1)}部
              </span>
              <span className="text-base font-bold text-gray-700">{group.topicName}</span>
            </div>

            <div className="flex flex-col gap-3">
              {group.questions.map(({ q, globalIdx }) => {
                const selected = answers[globalIdx];
                const isCorrect = selected !== undefined ? evaluateAnswer(q, selected) : undefined;

                return (
                  <div key={q.id} className={`rounded-2xl p-3 border-2 transition-colors ${
                    showResults
                      ? isCorrect ? 'border-green-300 bg-green-50' : selected !== undefined ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'
                      : selected !== undefined ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex gap-2 mb-2">
                      <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-red-100 text-red-700 font-bold text-xs">
                        {globalIdx + 1}
                      </span>
                      <p className="text-sm md:text-base font-bold text-gray-800 whitespace-pre-line flex-1">{q.prompt}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 ml-9">
                      {q.options.map((option, oIdx) => {
                        let btnClass = 'min-h-9 rounded-xl text-sm font-semibold py-1.5 px-3 transition-all text-left flex items-center gap-2 ';
                        if (showResults) {
                          if (oIdx === q.correctAnswerIndex) {
                            btnClass += 'bg-green-400 text-white ring-2 ring-green-300';
                          } else if (oIdx === selected && !isCorrect) {
                            btnClass += 'bg-red-400 text-white ring-2 ring-red-300';
                          } else {
                            btnClass += 'bg-gray-100 text-gray-400';
                          }
                        } else if (oIdx === selected) {
                          btnClass += 'bg-blue-500 text-white ring-2 ring-blue-300';
                        } else {
                          btnClass += 'bg-gray-100 text-gray-700 hover:bg-gray-200';
                        }
                        return (
                          <button key={oIdx} onClick={() => handleSelectAnswer(globalIdx, oIdx)}
                            disabled={showResults} className={btnClass}>
                            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white/30 text-xs font-bold flex-shrink-0">
                              {OPTION_LABELS[oIdx]}
                            </span>
                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {showResults && selected !== undefined && !isCorrect && (
                      <p className="text-xs text-gray-600 mt-2 ml-9 bg-yellow-50 rounded-lg p-2">💡 {q.explanation}</p>
                    )}
                    {showResults && selected === undefined && (
                      <p className="text-xs text-red-500 mt-2 ml-9">⚠️ 未作答</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Submit / Action buttons */}
        <div className="flex justify-center gap-4 mt-4 pt-4 border-t-2 border-gray-200">
          {!showResults ? (
            <button onClick={handleSubmit}
              className="min-h-12 min-w-12 rounded-2xl bg-gradient-to-r from-red-400 to-pink-400 text-white text-lg font-bold px-8 py-3 shadow-lg hover:scale-105 transition-transform">
              📝 交卷 ({answeredCount}/{questions.length})
            </button>
          ) : (
            <>
              <Link to="/"
                className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-lg font-bold px-6 py-3 shadow-lg hover:scale-105 transition-transform">
                🏠 返回主頁
              </Link>
              <button onClick={handleRetry}
                className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-400 to-pink-400 text-white text-lg font-bold px-6 py-3 shadow-lg hover:scale-105 transition-transform">
                🔄 再試一次
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
