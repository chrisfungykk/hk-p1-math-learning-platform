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
      <header className="bg-gradient-to-r from-pink-400 to-purple-400 px-4 md:px-6 py-3 md:py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <Link to="/" className="inline-block min-h-12 min-w-12 shrink">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white drop-shadow-md tracking-wide">
              🎓 小一數學學習平台
            </h1>
          </Link>
          {user && (
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-white font-bold text-sm sm:text-lg">👤 {user.displayName}</span>
              <button
                onClick={handleLogout}
                className="min-h-10 min-w-10 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm transition-colors"
              >
                登出
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
