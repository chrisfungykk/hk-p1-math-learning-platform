import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = login(username, password);
    if (err) {
      setError(err);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 flex flex-col items-center gap-6">
        <h1 className="text-3xl font-extrabold text-purple-700">🎓 登入</h1>
        <p className="text-gray-500 text-sm">聖公會青衣主恩小學 · 小一數學</p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            placeholder="用戶名稱"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(''); }}
            className="min-h-12 w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg font-bold focus:border-purple-400 focus:outline-none"
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            className="min-h-12 w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg font-bold focus:border-purple-400 focus:outline-none"
            autoComplete="current-password"
          />
          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
          <button
            type="submit"
            className="min-h-12 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xl font-extrabold py-3 shadow-lg hover:scale-[1.02] transition-transform"
          >
            登入
          </button>
        </form>
      </div>
    </div>
  );
}
