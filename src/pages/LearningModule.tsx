import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { TOPIC_REGISTRY } from '../data/topicRegistry';
import { SEMESTERS } from '../constants';
import RemotionAnimationPlayer from '../components/RemotionAnimationPlayer';

export default function LearningModule() {
  const { topicId } = useParams<{ topicId: string }>();
  const [completed, setCompleted] = useState(false);

  const topic = topicId ? TOPIC_REGISTRY[topicId] : undefined;

  if (!topic || !topicId) {
    return <Navigate to="/" replace />;
  }

  const semester = SEMESTERS.find((s) => s.id === topic.semester);

  const handleComplete = () => {
    setCompleted(true);
  };

  const handleReplay = () => {
    setCompleted(false);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Back button */}
      <div className="flex items-center gap-4 w-full max-w-3xl">
        <Link
          to={`/semester/${topic.semester}`}
          className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gray-200 hover:bg-gray-300 text-2xl transition-colors"
          aria-label={`返回${semester?.name ?? '主題列表'}`}
        >
          ⬅️
        </Link>
        <h2 className="text-3xl md:text-4xl font-extrabold text-green-700">
          📖 {topic.name}
        </h2>
      </div>

      {/* Animation player */}
      <div className="w-full max-w-3xl">
        {!completed ? (
          <RemotionAnimationPlayer topicId={topicId} onComplete={handleComplete} />
        ) : (
          <div className="flex flex-col items-center gap-6 py-8">
            <p className="text-2xl font-bold text-purple-700">🎉 動畫播放完畢！</p>
            <div className="flex gap-4">
              <Link
                to={`/test/${topicId}`}
                className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xl font-bold px-8 py-4 shadow-lg hover:scale-105 transition-transform"
              >
                📝 開始測驗
              </Link>
              <button
                onClick={handleReplay}
                className="min-h-12 min-w-12 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-400 text-white text-xl font-bold px-8 py-4 shadow-lg hover:scale-105 transition-transform"
              >
                🔄 重新播放
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
