import { Link, Navigate, useParams } from 'react-router-dom';
import { SEMESTERS } from '../constants';
import { TOPIC_REGISTRY } from '../data/topicRegistry';

const TOPIC_EMOJIS: Record<string, string> = {
  'counting': '🔢',
  'addition-10': '➕',
  'subtraction-10': '➖',
  'shapes': '🔷',
  'compare-length-height': '📏',
  'ordering-sequences': '🔄',
  'addition-20': '➕',
  'subtraction-20': '➖',
  'telling-time': '🕐',
  'coins-notes': '💰',
  'composing-shapes': '🧩',
  'data-handling': '📊',
};

const CARD_COLORS = [
  'from-pink-400 to-rose-400',
  'from-orange-400 to-amber-400',
  'from-yellow-400 to-lime-400',
  'from-green-400 to-emerald-400',
  'from-cyan-400 to-teal-400',
  'from-blue-400 to-indigo-400',
];

export default function SemesterView() {
  const { semesterId } = useParams<{ semesterId: string }>();
  const semester = SEMESTERS.find((s) => s.id === semesterId);

  if (!semester) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex items-center gap-4 w-full max-w-3xl">
        <Link
          to="/"
          className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 text-2xl transition-colors"
          aria-label="返回主頁"
        >
          ⬅️
        </Link>
        <h2 className="text-3xl md:text-4xl font-extrabold text-purple-700">
          {semester.name}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        {semester.topics.map((topicId, index) => {
          const topic = TOPIC_REGISTRY[topicId];
          if (!topic) return null;
          const emoji = TOPIC_EMOJIS[topicId] ?? '📖';
          const color = CARD_COLORS[index % CARD_COLORS.length];
          return (
            <Link
              key={topicId}
              to={`/learn/${topicId}`}
              className={`min-h-32 min-w-12 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg hover:scale-105 transition-transform p-4`}
            >
              <span className="text-4xl mb-2">{emoji}</span>
              <span className="text-lg md:text-xl font-bold text-center">{topic.name}</span>
            </Link>
          );
        })}
      </div>

      <Link
        to={`/exam/${semester.id}`}
        className="min-h-12 min-w-12 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-500 text-white text-xl font-bold px-8 py-4 shadow-lg hover:scale-105 transition-transform mt-4"
      >
        📝 考試準備
      </Link>
    </div>
  );
}
