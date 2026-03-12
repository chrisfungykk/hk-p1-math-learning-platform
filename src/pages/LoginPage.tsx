import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

const USERS = [
  { username: 'Nok', emoji: '🧒', color: 'from-blue-400 to-cyan-400' },
  { username: 'Amelia', emoji: '👧', color: 'from-pink-400 to-rose-400' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSelect = (username: string) => {
    setSelected(username);
    setPassword('');
    setError('');
  };

  const handleLogin = () => {
    if (!selected) return;
    const err = login(selected, password);
    if (err) {
      setError(err);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4 gap-6">
      <h1 className="text-3xl font-extrabold text-purple-700">🎓 你是誰？</h1>
      <p className="text-gray-500 text-sm">聖公會青衣主恩小學 · 小一數學</p>

      <div className="flex gap-6">
        {USERS.map((u) => (
          <button
            key={u.username}
            onClick={() => handleSelect(u.username)}
            className={`flex flex-col items-center gap-2 rounded-3xl px-8 py-6 text-white font-extrabold text-xl shadow-xl transition-all bg-gradient-to-br ${u.color} ${
              selected === u.username ? 'scale-110 ring-4 ring-yellow-300' : 'opacity-80 hover:opacity-100 hover:scale-105'
            }`}
          >
            <span className="text-5xl">{u.emoji}</span>
            <span>{u.username}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="flex flex-col items-center gap-3 w-full max-w-xs">
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            className="min-h-12 w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg font-bold text-center focus:border-purple-400 focus:outline-none"
            autoFocus
            autoComplete="current-password"
          />
          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          <button
            onClick={handleLogin}
            className="min-h-12 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xl font-extrabold py-3 shadow-lg hover:scale-[1.02] transition-transform"
          >
            登入
          </button>
        </div>
      )}
    </div>
  );
}
