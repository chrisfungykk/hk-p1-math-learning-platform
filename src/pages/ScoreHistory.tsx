import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { loadScoreRecords } from '../services/storage';
import { sortRecordsByDate } from '../utils/scoreHistory';
import { TOPIC_REGISTRY } from '../data/topicRegistry';
import { SEMESTERS, DIFFICULTY_LABELS } from '../constants';
import type { ScoreRecord } from '../types';

function getTopicName(topicId: string | null): string {
  if (!topicId) return '考試準備';
  return TOPIC_REGISTRY[topicId]?.name ?? topicId;
}

function getSemesterName(semesterId: string): string {
  return SEMESTERS.find((s) => s.id === semesterId)?.name ?? semesterId;
}

function formatDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('zh-HK', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return isoDate;
  }
}

function getPercentage(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
}

/** Collect unique topic IDs from records for the topic filter dropdown. */
function getAvailableTopics(records: ScoreRecord[]): { id: string; name: string }[] {
  const seen = new Set<string>();
  const topics: { id: string; name: string }[] = [];
  for (const r of records) {
    const key = r.topicId ?? '__exam_prep__';
    if (!seen.has(key)) {
      seen.add(key);
      topics.push({ id: key, name: r.isExamPrep ? '📝 考試準備' : getTopicName(r.topicId) });
    }
  }
  return topics.sort((a, b) => a.name.localeCompare(b.name, 'zh-Hant'));
}

export default function ScoreHistory() {
  const allRecords = useMemo(() => sortRecordsByDate(loadScoreRecords()), []);

  const [semesterFilter, setSemesterFilter] = useState<string>('all');
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    return allRecords.filter((r) => {
      if (semesterFilter !== 'all' && r.semester !== semesterFilter) return false;
      if (topicFilter !== 'all') {
        if (topicFilter === '__exam_prep__') {
          if (!r.isExamPrep) return false;
        } else if (r.topicId !== topicFilter) {
          return false;
        }
      }
      return true;
    });
  }, [allRecords, semesterFilter, topicFilter]);

  const availableTopics = useMemo(() => getAvailableTopics(allRecords), [allRecords]);

  return (
    <div className="flex flex-col gap-6 py-6 px-2 max-w-2xl mx-auto w-full">
      {/* Navigation */}
      <Link
        to="/"
        className="min-h-12 min-w-12 inline-flex items-center gap-2 self-start rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold px-5 py-3 transition-colors"
      >
        ← 返回主頁
      </Link>

      <h2 className="text-3xl font-extrabold text-teal-700 text-center">📊 成績記錄</h2>

      {/* Filter Controls */}
      <div className="flex flex-col gap-4 bg-white rounded-2xl shadow p-4">
        {/* Semester filter */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-gray-600">學期篩選</span>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: '全部' },
              { value: 'sem1', label: '上學期' },
              { value: 'sem2', label: '下學期' },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSemesterFilter(opt.value)}
                className={`min-h-12 min-w-12 px-5 py-3 rounded-xl font-bold text-base transition-colors ${
                  semesterFilter === opt.value
                    ? 'bg-teal-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Topic filter */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-gray-600">課題篩選</span>
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="min-h-12 min-w-12 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-base font-bold text-gray-700 focus:border-teal-400 focus:outline-none"
          >
            <option value="all">全部課題</option>
            {availableTopics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Records list */}
      {filteredRecords.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <span className="text-6xl">📝</span>
          <p className="text-xl font-bold text-gray-500">還沒有成績記錄，快去做測驗吧！</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredRecords.map((record) => {
            const pct = getPercentage(record.score, record.totalQuestions);
            const isExpanded = expandedId === record.id;
            return (
              <div
                key={record.id}
                className={`rounded-2xl shadow p-5 flex flex-col gap-2 ${
                  record.isExamPrep
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300'
                    : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {record.isExamPrep ? (
                      <span className="text-lg font-extrabold text-amber-600">📝 考試準備</span>
                    ) : (
                      <span className="text-lg font-extrabold text-teal-700">
                        {getTopicName(record.topicId)}
                      </span>
                    )}
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                      {getSemesterName(record.semester)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{formatDate(record.date)}</span>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm font-bold text-purple-600">
                    {DIFFICULTY_LABELS[record.difficulty]}
                  </span>
                  <span className="text-2xl font-extrabold text-teal-600">
                    {record.score}/{record.totalQuestions}
                  </span>
                  <span
                    className={`text-sm font-bold px-2 py-1 rounded-full ${
                      pct >= 80
                        ? 'bg-green-100 text-green-700'
                        : pct >= 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {pct}%
                  </span>
                </div>

                {/* Exam prep topic breakdown */}
                {record.isExamPrep && record.topicBreakdown && record.topicBreakdown.length > 0 && (
                  <div className="mt-1">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : record.id)}
                      className="min-h-12 min-w-12 text-sm font-bold text-amber-600 hover:text-amber-800 underline transition-colors"
                    >
                      {isExpanded ? '收起詳情 ▲' : '查看各課題成績 ▼'}
                    </button>
                    {isExpanded && (
                      <div className="mt-2 flex flex-col gap-1 pl-2 border-l-4 border-amber-200">
                        {record.topicBreakdown.map((tb) => (
                          <div key={tb.topicId} className="flex items-center justify-between text-sm">
                            <span className="font-bold text-gray-700">{getTopicName(tb.topicId)}</span>
                            <span className="text-gray-500">
                              {tb.correct}/{tb.total} ({tb.total > 0 ? Math.round((tb.correct / tb.total) * 100) : 0}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
