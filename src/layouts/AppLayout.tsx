import { Link, Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-yellow-50">
      <header className="bg-gradient-to-r from-pink-400 to-purple-400 px-6 py-4 shadow-lg">
        <Link to="/" className="inline-block min-h-12 min-w-12">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-md tracking-wide">
            🎓 小學一年級數學學習平台
          </h1>
        </Link>
      </header>

      <main className="p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
