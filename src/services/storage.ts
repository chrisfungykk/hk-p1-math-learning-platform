import type { ScoreRecord, DifficultyLevel, AppStorageData } from '../types';
import { STORAGE_KEY } from '../constants';

const AUTH_KEY = 'hk-p1-math-current-user';

/** Returns the per-user storage key, or the base key if no user is logged in. */
function getUserStorageKey(): string {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { username?: string };
      if (parsed.username) return `${STORAGE_KEY}:${parsed.username}`;
    }
  } catch { /* fall through */ }
  return STORAGE_KEY;
}

function loadStorageData(): AppStorageData {
  try {
    const raw = localStorage.getItem(getUserStorageKey());
    if (!raw) {
      return { scoreRecords: [] };
    }
    const parsed = JSON.parse(raw) as AppStorageData;
    return {
      scoreRecords: Array.isArray(parsed.scoreRecords) ? parsed.scoreRecords : [],
      lastDifficulty: parsed.lastDifficulty,
    };
  } catch {
    console.warn('Failed to parse localStorage data, returning defaults.');
    return { scoreRecords: [] };
  }
}

function saveStorageData(data: AppStorageData): void {
  try {
    localStorage.setItem(getUserStorageKey(), JSON.stringify(data));
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('儲存空間已滿，請清除舊記錄。');
    } else {
      throw error;
    }
  }
}

export function loadScoreRecords(): ScoreRecord[] {
  return loadStorageData().scoreRecords;
}

export function saveScoreRecord(record: ScoreRecord): void {
  const data = loadStorageData();
  data.scoreRecords.push(record);
  saveStorageData(data);
}

export function getFilteredRecords(filters: { semester?: string; topicId?: string }): ScoreRecord[] {
  const records = loadScoreRecords();
  return records.filter((r) => {
    if (filters.semester && r.semester !== filters.semester) return false;
    if (filters.topicId && r.topicId !== filters.topicId) return false;
    return true;
  });
}

export function loadLastDifficulty(): DifficultyLevel {
  const data = loadStorageData();
  return data.lastDifficulty ?? 'easy';
}

export function saveLastDifficulty(difficulty: DifficultyLevel): void {
  const data = loadStorageData();
  data.lastDifficulty = difficulty;
  saveStorageData(data);
}
