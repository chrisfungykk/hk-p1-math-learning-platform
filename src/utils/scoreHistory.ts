import type { ScoreRecord } from '../types';

/**
 * Returns a new array of ScoreRecords sorted by date in descending order (newest first).
 * Does not mutate the input array.
 */
export function sortRecordsByDate(records: ScoreRecord[]): ScoreRecord[] {
  return [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
