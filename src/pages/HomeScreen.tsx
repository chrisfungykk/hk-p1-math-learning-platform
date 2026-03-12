import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEMESTERS } from '../constants';
import { TOPIC_REGISTRY } from '../data/topicRegistry';

const TOPIC_EMOJIS: Record<string, string> = {
  'counting': '🔢',
  'addition-10': '➕',
  'subtraction-10': '➖',
  'addition-20': '🧮',
  'subtraction-20': '📐',
  'shapes': '🔷',
  'coins-notes': '💰',
  'word-problems': '📝',
  'composing-shapes': '🧩',
  'compare-length-height': '📏',
  'telling-time': '🕐',
  'ordering-sequences': '🔄',
  'data-handling': '📊',
};

const CARD_COLORS = [
  'from-pink-400 to-rose-400',
  'from-orange-400 to-amber-400',
  'from-yellow-400 to-lime-400',
  'from-green-400 to-emerald-400',
  'from-cyan-400 to-teal-400',
  'from-blue-400 to-indigo-400',
  'from-violet-400 to-purple-400',
  'from-fuchsia-400 to-pink-400',
  'from-rose-400 to-red-400',
  'from-amber-400 to-orange-400',
  'from-lime-400 to-green-400',
  'from-teal-400 to-cyan-400',
];

const SEMESTER_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  sem1: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  sem2: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
};

export default function HomeScreen() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    sem1: true,
    sem2: false,
  });

  const toggle = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-3xl md:text-4xl font-extrabold text-purple-700 text-center">
        📚 小一數學
      </h2>
      <p className="text-gray-500 text-sm">聖公會青衣主恩小學</p>

      {/* Hero section — 考試準備 + 模擬試卷 */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl">
        <Link
          to={`/exam/${SEMESTERS[0].id}`}
          className="flex-1 min-h-20 min-w-12 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xl md:text-2xl font-extrabold px-4 py-5 shadow-xl hover:scale-[1.03] transition-transform ring-2 ring-purple-300"
        >
          📝 考試準備
        </Link>
        <Link
          to="/past-paper"
          className="flex-1 min-h-20 min-w-12 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xl md:text-2xl font-extrabold px-4 py-5 shadow-xl hover:scale-[1.03] transition-transform ring-2 ring-amber-300"
        >
          📄 模擬試卷
        </Link>
      </div>

      {/* Semester sections */}
      {SEMESTERS.map((semester, semIdx) => {
        const isOpen = expanded[semester.id] ?? false;
        const style = SEMESTER_STYLES[semester.id] ?? SEMESTER_STYLES.sem1;
        return (
          <div key={semester.id} className={`w-full max-w-3xl rounded-2xl border-2 ${style.border} ${style.bg} overflow-hidden`}>
            <button
              onClick={() => toggle(semester.id)}
              className={`w-full flex items-center justify-between px-5 py-4 ${style.text} font-extrabold text-xl md:text-2xl transition-colors hover:opacity-80`}
              aria-expanded={isOpen}
            >
              <span>{semester.name}</span>
              <span className="text-2xl transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
            </button>
            {isOpen && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 px-4 pb-4">
                {semester.topics.map((topicId, index) => {
                  const topic = TOPIC_REGISTRY[topicId];
                  if (!topic) return null;
                  const emoji = TOPIC_EMOJIS[topicId] ?? '📖';
                  const colorIdx = semIdx * 6 + index;
                  const color = CARD_COLORS[colorIdx % CARD_COLORS.length];
                  return (
                    <Link
                      key={topicId}
                      to={`/learn/${topicId}`}
                      className={`min-h-28 min-w-12 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg hover:scale-105 transition-transform p-3`}
                    >
                      <span className="text-3xl mb-1">{emoji}</span>
                      <span className="text-base md:text-lg font-bold text-center leading-tight">{topic.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* Secondary action */}
      <div className="w-full max-w-3xl">
        <Link
          to="/scores"
          className="min-h-12 min-w-12 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold px-6 py-4 shadow-lg hover:scale-105 transition-transform"
        >
          📊 成績記錄
        </Link>
      </div>
    </div>
  );
}
