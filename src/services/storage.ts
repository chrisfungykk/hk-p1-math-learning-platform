import type { ScoreRecord, DifficultyLevel, AppStorageData } from '../types';
import { STORAGE_KEY } from '../constants';
import { loadFromFirebase, saveToFirebase } from './firebase';

const AUTH_KEY = 'hk-p1-math-current-user';

function getCurrentUsername(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as { username?: string };
      if (parsed.username) return parsed.username;
    }
  } catch { /* fall through */ }
  return null;
}

function getUserStorageKey(): string {
  const username = getCurrentUsername();
  return username ? `${STORAGE_KEY}:${username}` : STORAGE_KEY;
}

function loadLocalData(): AppStorageData {
  try {
    const raw = localStorage.getItem(getUserStorageKey());
    if (!raw) return { scoreRecords: [] };
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

function saveLocalData(data: AppStorageData): void {
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

/** Save to both localStorage and Firebase */
function saveAndSync(data: AppStorageData): void {
  saveLocalData(data);
  const username = getCurrentUsername();
  if (username) {
    saveToFirebase(username, data);
  }
}

/**
 * Sync localStorage with Firebase on login.
 * Firebase is source of truth — if it has data, overwrite local.
 * If Firebase is empty but local has data, push local to Firebase.
 */
export async function syncOnLogin(): Promise<void> {
  const username = getCurrentUsername();
  if (!username) return;

  const firebaseData = await loadFromFirebase(username);
  const localData = loadLocalData();

  if (firebaseData && firebaseData.scoreRecords.length > 0) {
    // Firebase has data — use it as source of truth
    saveLocalData(firebaseData);
  } else if (localData.scoreRecords.length > 0) {
    // Local has data but Firebase doesn't — push to Firebase
    await saveToFirebase(username, localData);
  }
}

export function loadScoreRecords(): ScoreRecord[] {
  return loadLocalData().scoreRecords;
}

export function saveScoreRecord(record: ScoreRecord): void {
  const data = loadLocalData();
  data.scoreRecords.push(record);
  saveAndSync(data);
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
  const data = loadLocalData();
  return data.lastDifficulty ?? 'easy';
}

export function saveLastDifficulty(difficulty: DifficultyLevel): void {
  const data = loadLocalData();
  data.lastDifficulty = difficulty;
  saveAndSync(data);
}
