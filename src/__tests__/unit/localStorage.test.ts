import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { STORAGE_KEY } from '../../constants';
import type { ScoreRecord } from '../../types';

function makeRecord(overrides: Partial<ScoreRecord> = {}): ScoreRecord {
  return {
    id: 'test-1',
    topicId: 'counting',
    semester: 'sem1',
    difficulty: 'easy',
    score: 8,
    totalQuestions: 10,
    date: '2026-01-15T10:00:00.000Z',
    isExamPrep: false,
    ...overrides,
  };
}

// Create a simple in-memory localStorage mock
function createLocalStorageMock() {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach((k) => delete store[k]); }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
    _store: store,
  };
}

describe('localStorage utilities', () => {
  let mockStorage: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    mockStorage = createLocalStorageMock();
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    });
    // Clear module cache so storage.ts re-reads localStorage each call
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function getStorage() {
    return await import('../../services/storage');
  }

  describe('loadScoreRecords', () => {
    it('returns empty array when localStorage is empty', async () => {
      const { loadScoreRecords } = await getStorage();
      expect(loadScoreRecords()).toEqual([]);
    });

    it('returns empty array when data is corrupt', async () => {
      mockStorage._store[STORAGE_KEY] = '{bad json!!!';
      const { loadScoreRecords } = await getStorage();
      expect(loadScoreRecords()).toEqual([]);
    });

    it('returns empty array when scoreRecords is not an array', async () => {
      mockStorage._store[STORAGE_KEY] = JSON.stringify({ scoreRecords: 'not-array' });
      const { loadScoreRecords } = await getStorage();
      expect(loadScoreRecords()).toEqual([]);
    });

    it('loads stored records correctly', async () => {
      const record = makeRecord();
      mockStorage._store[STORAGE_KEY] = JSON.stringify({ scoreRecords: [record] });
      const { loadScoreRecords } = await getStorage();
      expect(loadScoreRecords()).toEqual([record]);
    });
  });

  describe('saveScoreRecord', () => {
    it('appends a record to empty storage', async () => {
      const { saveScoreRecord } = await getStorage();
      const record = makeRecord();
      saveScoreRecord(record);
      const stored = JSON.parse(mockStorage._store[STORAGE_KEY]);
      expect(stored.scoreRecords).toEqual([record]);
    });

    it('appends to existing records', async () => {
      const { saveScoreRecord } = await getStorage();
      saveScoreRecord(makeRecord({ id: 'r1' }));
      saveScoreRecord(makeRecord({ id: 'r2' }));
      const stored = JSON.parse(mockStorage._store[STORAGE_KEY]);
      expect(stored.scoreRecords).toHaveLength(2);
    });

    it('logs warning on QuotaExceededError', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const err = new DOMException('quota exceeded', 'QuotaExceededError');
      mockStorage.setItem.mockImplementation(() => { throw err; });

      const { saveScoreRecord } = await getStorage();
      saveScoreRecord(makeRecord());
      expect(warnSpy).toHaveBeenCalledWith('儲存空間已滿，請清除舊記錄。');
    });
  });

  describe('getFilteredRecords', () => {
    const records: ScoreRecord[] = [
      makeRecord({ id: '1', semester: 'sem1', topicId: 'counting' }),
      makeRecord({ id: '2', semester: 'sem1', topicId: 'addition-10' }),
      makeRecord({ id: '3', semester: 'sem2', topicId: 'addition-20' }),
    ];

    it('returns all records with no filters', async () => {
      mockStorage._store[STORAGE_KEY] = JSON.stringify({ scoreRecords: records });
      const { getFilteredRecords } = await getStorage();
      expect(getFilteredRecords({})).toHaveLength(3);
    });

    it('filters by semester', async () => {
      mockStorage._store[STORAGE_KEY] = JSON.stringify({ scoreRecords: records });
      const { getFilteredRecords } = await getStorage();
      const result = getFilteredRecords({ semester: 'sem1' });
      expect(result).toHaveLength(2);
      expect(result.every((r) => r.semester === 'sem1')).toBe(true);
    });

    it('filters by topicId', async () => {
      mockStorage._store[STORAGE_KEY] = JSON.stringify({ scoreRecords: records });
      const { getFilteredRecords } = await getStorage();
      const result = getFilteredRecords({ topicId: 'counting' });
      expect(result).toHaveLength(1);
      expect(result[0].topicId).toBe('counting');
    });

    it('filters by both semester and topicId', async () => {
      mockStorage._store[STORAGE_KEY] = JSON.stringify({ scoreRecords: records });
      const { getFilteredRecords } = await getStorage();
      const result = getFilteredRecords({ semester: 'sem1', topicId: 'addition-10' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('2');
    });

    it('returns empty array when no records match', async () => {
      mockStorage._store[STORAGE_KEY] = JSON.stringify({ scoreRecords: records });
      const { getFilteredRecords } = await getStorage();
      expect(getFilteredRecords({ semester: 'sem2', topicId: 'counting' })).toEqual([]);
    });
  });

  describe('loadLastDifficulty', () => {
    it('defaults to easy when nothing stored', async () => {
      const { loadLastDifficulty } = await getStorage();
      expect(loadLastDifficulty()).toBe('easy');
    });

    it('returns stored difficulty', async () => {
      mockStorage._store[STORAGE_KEY] = JSON.stringify({ scoreRecords: [], lastDifficulty: 'hard' });
      const { loadLastDifficulty } = await getStorage();
      expect(loadLastDifficulty()).toBe('hard');
    });
  });

  describe('saveLastDifficulty', () => {
    it('persists difficulty preference', async () => {
      const { saveLastDifficulty } = await getStorage();
      saveLastDifficulty('medium');
      const stored = JSON.parse(mockStorage._store[STORAGE_KEY]);
      expect(stored.lastDifficulty).toBe('medium');
    });

    it('preserves existing score records', async () => {
      const { saveScoreRecord, saveLastDifficulty } = await getStorage();
      saveScoreRecord(makeRecord());
      saveLastDifficulty('hard');
      const stored = JSON.parse(mockStorage._store[STORAGE_KEY]);
      expect(stored.scoreRecords).toHaveLength(1);
      expect(stored.lastDifficulty).toBe('hard');
    });
  });
});
