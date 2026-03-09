import { Link } from 'react-router-dom';
import { SEMESTERS } from '../constants';

const SEMESTER_STYLES: Record<string, { bg: string; emoji: string }> = {
  sem1: { bg: 'from-orange-400 to-pink-400', emoji: '🌸' },
  sem2: { bg: 'from-cyan-400 to-blue-400', emoji: '☀️' },
};

export default function HomeScreen() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <h2 className="text-3xl md:text-4xl font-extrabold text-purple-700 text-center">
        📚 選擇學期
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        {SEMESTERS.map((semester) => {
          const style = SEMESTER_STYLES[semester.id] ?? SEMESTER_STYLES.sem1;
          return (
            <Link
              key={semester.id}
              to={`/semester/${semester.id}`}
              className={`min-h-48 min-w-12 flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${style.bg} text-white shadow-xl hover:scale-105 transition-transform p-8`}
            >
              <span className="text-6xl mb-4">{style.emoji}</span>
              <span className="text-3xl md:text-4xl font-extrabold">{semester.name}</span>
            </Link>
          );
        })}
      </div>

      <Link
        to="/scores"
        className="min-h-12 min-w-12 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold px-8 py-4 shadow-lg hover:scale-105 transition-transform"
      >
        📊 成績記錄
      </Link>
    </div>
  );
}
