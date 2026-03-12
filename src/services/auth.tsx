import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface User {
  username: string;
  displayName: string;
}

const USERS: Record<string, { password: string; displayName: string }> = {
  Nok: { password: '111', displayName: 'Nok' },
  Amelia: { password: '000', displayName: 'Amelia' },
};

const AUTH_KEY = 'hk-p1-math-current-user';

interface AuthContextValue {
  user: User | null;
  login: (username: string, password: string) => string | null; // returns error or null
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => '未登入',
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function loadSavedUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    if (parsed.username && USERS[parsed.username]) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadSavedUser);

  const login = useCallback((username: string, password: string): string | null => {
    const entry = USERS[username];
    if (!entry) return '用戶名稱不正確';
    if (entry.password !== password) return '密碼不正確';
    const u: User = { username, displayName: entry.displayName };
    setUser(u);
    localStorage.setItem(AUTH_KEY, JSON.stringify(u));
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
