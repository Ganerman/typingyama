import { BarChart3, BookOpen, CloudRain, Code2, Crown, Gauge, History, Home, Settings, Skull, Trophy, User, Zap } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/typing-test', label: 'Classic Test', icon: Gauge },
  { to: '/race', label: 'Typing Race', icon: Zap },
  { to: '/word-rain', label: 'Word Rain', icon: CloudRain },
  { to: '/boss-battle', label: 'Boss Battle', icon: Skull },
  { to: '/code', label: 'Code Mode', icon: Code2 },
  { to: '/student', label: 'Student Mode', icon: BarChart3 },
  { to: '/library', label: 'IT Library', icon: BookOpen },
  { to: '/daily', label: 'Daily Challenge', icon: Trophy },
  { to: '/leaderboard', label: 'Leaderboard', icon: Crown },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/history', label: 'History', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function AppLayout() {
  const { profile } = useAuth();
  const { toggleTheme, theme } = useSettings();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-white/10 bg-rush-ink/85 p-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <div className="mb-6 flex items-center justify-between">
          <Logo />
          <button aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} className="focus-ring rounded-lg border border-white/10 px-3 py-2 text-xs font-bold lg:hidden" onClick={toggleTheme} type="button">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
        <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `focus-ring flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-bold transition ${
                  isActive ? 'bg-rush-green text-rush-ink shadow-glow' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-rush-ink/75 px-4 py-3 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Welcome back</p>
            <h1 className="text-lg font-black text-white">{profile.username}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} className="focus-ring hidden rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-slate-200 lg:inline-flex" onClick={toggleTheme} type="button">
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
