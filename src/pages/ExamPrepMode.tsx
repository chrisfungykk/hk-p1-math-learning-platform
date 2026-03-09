import { useState, useCallback, useRef } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import type { DifficultyLevel, Question, TopicScoreBreakdown } from '../types';
import { DIFFICULTY_LABELS, SEMESTERS } from '../constants';
import { TOPIC_REGISTRY } from '../data/topicRegistry';
import { generateExamQuestions, computeTopicBreakdown } from '../utils/examPrep';
import { evaluateAnswer, computeScoreSummary, createScoreRecord } from '../utils/scoring';
import { saveScoreRecord, loadLastDifficulty, saveLastDifficulty } from '../services/storage';

type Phase = 'setup' | 'testing' | 'feedback' | 'summary';

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  easy: 'from-green-400 to-emerald-400',
  medium: 'from-yellow-400 to-amber-400',
  hard: 'from-red-400 to-rose-400',
};

const DIFFICULTY_EMOJIS: Record<DifficultyLevel, string> = {
  easy: '🌟',
  medium: '⚡',
  hard: '🔥',
};

const OPTION_COLORS = [
  'from-blue-400 to-blue-500',
  'from-purple-400 to-purple-500',
  'from-teal-400 to-teal-500',
  'from-orange-400 to-orange-500',
];

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const answers = useRef<{ question: Question; submittedIndex: number }[]>([]);
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
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    answers.current = [];
    setSummary(null);
    setTopicBreakdown([]);
    scoreRecorded.current = false;
    setPhase('testing');
  }, [semesterId, difficulty]);

  const handleAnswer = useCallback((optionIndex: number) => {
    if (selectedAnswer !== null) return;
    const question = questions[currentIndex];
    const correct = evaluateAnswer(question, optionIndex);
    setSelectedAnswer(optionIndex);
    setIsCorrect(correct);
    answers.current.push({ question, submittedIndex: optionIndex });
    setPhase('feedback');
  }, [questions, currentIndex, selectedAnswer]);

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      const result = computeScoreSummary(answers.current);
      setSummary(result);

      const breakdown = computeTopicBreakdown(answers.current);
      setTopicBreakdown(breakdown);

      // Record score with isExamPrep: true, topicId: null
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

      setPhase('summary');
    } else {
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setPhase('testing');
    }
  }, [currentIndex, questions.length, semester, difficulty]);

  const handleRetry = useCallback(() => {
    setPhase('setup');
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    answers.current = [];
    setSummary(null);
    setTopicBreakdown([]);
    scoreRecorded.current = false;
  }, []);

  // Invalid semester → redirect home
  if (!semester || !semesterId) {
    return <Navigate to="/" replace />;
  }

  // ── Setup Phase: Difficulty selector ──
  if (phase === 'setup') {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="flex items-center gap-4 w-full max-w-3xl">
          <Link
            to={`/semester/${semesterId}`}
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 text-2xl transition-colors"
            aria-label={`返回${semester.name}`}
          >
            ⬅️
          </Link>
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-700">
            📝 考試準備 — {semester.name}
          </h2>
        </div>

        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <p className="text-xl font-bold text-gray-700">選擇難度</p>
          <div className="flex gap-3 w-full">
            {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level)}
                className={`flex-1 min-h-16 min-w-12 rounded-2xl text-lg font-bold shadow-md transition-all ${
                  difficulty === level
                    ? `bg-gradient-to-br ${DIFFICULTY_COLORS[level]} text-white scale-105 ring-4 ring-white`
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                aria-pressed={difficulty === level}
              >
                {DIFFICULTY_EMOJIS[level]} {DIFFICULTY_LABELS[level]}
              </button>
            ))}
          </div>

          <button
            onClick={handleStartExam}
            className="min-h-12 min-w-12 w-full rounded-2xl bg-gradient-to-r from-red-400 to-pink-400 text-white text-xl font-bold py-4 shadow-lg hover:scale-105 transition-transform mt-4"
          >
            📝 開始考試準備
          </button>
        </div>
      </div>
    );
  }

  // ── Summary Phase with per-topic breakdown ──
  if (phase === 'summary' && summary) {
    const percentage = summary.total > 0 ? Math.round((summary.correct / summary.total) * 100) : 0;
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <div className="flex items-center gap-4 w-full max-w-3xl">
          <Link
            to={`/semester/${semesterId}`}
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 text-2xl transition-colors"
            aria-label={`返回${semester.name}`}
          >
            ⬅️
          </Link>
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-700">
            📊 考試準備結果
          </h2>
        </div>

        {/* Overall score */}
        <div className="flex flex-col items-center gap-4 bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
          <span className="text-6xl">{getScoreEmoji(percentage)}</span>
          <p className="text-4xl font-extrabold text-purple-700">{percentage}%</p>
          <div className="flex gap-6 text-lg">
            <span className="text-green-600 font-bold">✅ 正確: {summary.correct}</span>
            <span className="text-red-500 font-bold">❌ 錯誤: {summary.incorrect}</span>
          </div>
          <p className="text-gray-500">共 {summary.total} 題</p>
        </div>

        {/* Per-topic breakdown */}
        {topicBreakdown.length > 0 && (
          <div className="w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-700 mb-3 text-center">📋 各主題成績</h3>
            <div className="flex flex-col gap-2">
              {topicBreakdown.map((tb) => {
                const topicDef = TOPIC_REGISTRY[tb.topicId];
                const topicName = topicDef?.name ?? tb.topicId;
                const topicPct = tb.total > 0 ? Math.round((tb.correct / tb.total) * 100) : 0;
                return (
                  <div
                    key={tb.topicId}
                    className="flex items-center justify-between bg-white rounded-2xl shadow-md px-4 py-3"
                  >
                    <span className="text-lg font-bold text-gray-800">{topicName}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {tb.correct}/{tb.total}
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          topicPct >= 80
                            ? 'text-green-600'
                            : topicPct >= 50
                              ? 'text-yellow-600'
                              : 'text-red-500'
                        }`}
                      >
                        {topicPct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Link
            to="/"
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-lg font-bold px-6 py-3 shadow-lg hover:scale-105 transition-transform"
          >
            🏠 返回主頁
          </Link>
          <button
            onClick={handleRetry}
            className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-400 to-pink-400 text-white text-lg font-bold px-6 py-3 shadow-lg hover:scale-105 transition-transform"
          >
            🔄 再試一次
          </button>
        </div>
      </div>
    );
  }

  // ── Testing / Feedback Phase: Question display ──
  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex items-center gap-4 w-full max-w-3xl">
        <Link
          to={`/semester/${semesterId}`}
          className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 text-2xl transition-colors"
          aria-label={`返回${semester.name}`}
        >
          ⬅️
        </Link>
        <h2 className="text-2xl md:text-3xl font-extrabold text-red-700">
          📝 考試準備 — {semester.name}
        </h2>
      </div>

      {/* Progress indicator */}
      <p className="text-lg font-bold text-gray-600">
        第 {currentIndex + 1} 題 / 共 {questions.length} 題
      </p>

      {/* Question prompt */}
      <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-lg">
        <p className="text-2xl font-bold text-center text-gray-800">{currentQuestion.prompt}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
        {currentQuestion.options.map((option, idx) => {
          let btnClass = 'min-h-12 min-w-12 rounded-2xl text-lg font-bold py-4 px-4 shadow-md transition-all text-center ';
          if (phase === 'feedback') {
            if (idx === currentQuestion.correctAnswerIndex) {
              btnClass += 'bg-green-400 text-white ring-4 ring-green-200';
            } else if (idx === selectedAnswer && !isCorrect) {
              btnClass += 'bg-red-400 text-white ring-4 ring-red-200';
            } else {
              btnClass += 'bg-gray-200 text-gray-500';
            }
          } else {
            btnClass += `bg-gradient-to-br ${OPTION_COLORS[idx % OPTION_COLORS.length]} text-white hover:scale-105`;
          }
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={phase === 'feedback'}
              className={btnClass}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback message */}
      {phase === 'feedback' && (
        <div className="flex flex-col items-center gap-3 w-full max-w-lg">
          {isCorrect ? (
            <p className="text-2xl font-bold text-green-600">✅ 正確！</p>
          ) : (
            <div className="flex flex-col items-center gap-2 bg-red-50 rounded-2xl p-4 w-full">
              <p className="text-2xl font-bold text-red-500">❌ 錯誤</p>
              <p className="text-lg text-gray-700">
                正確答案: <span className="font-bold text-green-600">{currentQuestion.options[currentQuestion.correctAnswerIndex]}</span>
              </p>
              <p className="text-base text-gray-600">{currentQuestion.explanation}</p>
            </div>
          )}
          <button
            onClick={handleNext}
            className="min-h-12 min-w-12 rounded-2xl bg-gradient-to-r from-purple-400 to-indigo-400 text-white text-lg font-bold px-8 py-3 shadow-lg hover:scale-105 transition-transform"
          >
            {currentIndex + 1 < questions.length ? '下一題 ➡️' : '查看結果 📊'}
          </button>
        </div>
      )}
    </div>
  );
}
