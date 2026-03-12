import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set } from 'firebase/database';
import type { AppStorageData } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/** Load user data from Firebase. Returns null if not found or on error. */
export async function loadFromFirebase(username: string): Promise<AppStorageData | null> {
  try {
    const snapshot = await get(ref(db, `users/${username}`));
    if (snapshot.exists()) {
      const data = snapshot.val() as AppStorageData;
      return {
        scoreRecords: Array.isArray(data.scoreRecords) ? data.scoreRecords : [],
        lastDifficulty: data.lastDifficulty,
      };
    }
    return null;
  } catch (err) {
    console.warn('Firebase read failed:', err);
    return null;
  }
}

/** Save user data to Firebase. Silently fails on error. */
export async function saveToFirebase(username: string, data: AppStorageData): Promise<void> {
  try {
    await set(ref(db, `users/${username}`), data);
  } catch (err) {
    console.warn('Firebase write failed:', err);
  }
}
