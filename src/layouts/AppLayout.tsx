import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-yellow-50">
      <header className="bg-gradient-to-r from-pink-400 to-purple-400 px-6 py-4 shadow-lg flex items-center justify-between">
        <Link to="/" className="inline-block min-h-12 min-w-12">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-md tracking-wide">
            🎓 小學一年級數學學習平台
          </h1>
        </Link>
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-lg">👤 {user.displayName}</span>
            <button
              onClick={handleLogout}
              className="min-h-10 min-w-10 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-colors"
            >
              登出
            </button>
          </div>
        )}
      </header>

      <main className="p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
