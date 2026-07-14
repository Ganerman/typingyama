import { motion } from 'framer-motion';
import { Gamepad2, Keyboard, Medal, Rocket, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { leaderboard, weeklyProgress } from '../data/mockData';
import { WeeklyChart } from '../components/Charts';
import type { LucideIcon } from 'lucide-react';

const featureCards: Array<{ title: string; text: string; icon: LucideIcon }> = [
  { title: 'Classic Tests', text: 'Timed typing tests with live WPM, accuracy, and rank progress.', icon: Keyboard },
  { title: 'Arcade Modes', text: 'Race opponents, survive Word Rain, and complete daily challenges.', icon: Gamepad2 },
  { title: 'Progression', text: 'Earn XP, coins, badges, streaks, achievements, and leaderboard status.', icon: Trophy },
];

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link className="focus-ring rounded-lg px-3 py-2 text-sm font-bold text-slate-200 hover:text-white" to="/dashboard">Play Now</Link>
          <Link to="/race"><Button>Race Now</Button></Link>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-8 lg:min-h-[calc(100vh-92px)] lg:grid-cols-[1fr_520px]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mb-4 inline-flex rounded-md border border-rush-green/30 bg-rush-green/10 px-3 py-1 text-sm font-bold text-rush-green">
              Type Fast. Rank Higher.
            </p>
            <h1 className="max-w-4xl text-5xl font-black leading-tight text-white md:text-7xl">
              Master Your Keyboard. Beat Your Best Score.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Improve your typing speed, accuracy, and confidence through exciting challenges, competitive rankings, and interactive typing games.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/typing-test"><Button icon={<Keyboard className="h-5 w-5" />}>Start Typing</Button></Link>
              <Link to="/race"><Button variant="secondary" icon={<Gamepad2 className="h-5 w-5" />}>Join a Race</Button></Link>
            </div>
          </motion.div>
          <motion.div className="panel p-5" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="rounded-lg border border-white/10 bg-rush-ink p-4 font-mono text-sm leading-8 text-slate-300">
              {'const typerush = '}
              <span className="text-rush-green">{'{ speed: "fast", rank: "higher" }'}</span>
              <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-rush-green align-middle" />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {['QWERTY', 'ASDF', 'ZXCV'].map((row) => (
                <div key={row} className="rounded-lg border border-white/10 bg-white/5 p-4 text-center font-black text-slate-200 shadow-blueGlow">{row}</div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3">
          {featureCards.map(({ title, text, icon: Icon }) => (
            <Card key={title}>
              <Icon className="mb-4 h-7 w-7 text-rush-green" />
              <h2 className="text-xl font-black text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
            </Card>
          ))}
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 lg:grid-cols-[1fr_1.2fr]">
          <Card>
            <h2 className="mb-4 text-2xl font-black text-white">Weekly Stats Preview</h2>
            <WeeklyChart data={weeklyProgress} />
          </Card>
          <Card>
            <div className="mb-4 flex items-center gap-2">
              <Medal className="h-6 w-6 text-rush-green" />
              <h2 className="text-2xl font-black text-white">Leaderboard Preview</h2>
            </div>
            <LeaderboardTable entries={leaderboard.slice(0, 4)} />
          </Card>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="rounded-lg border border-rush-green/30 bg-rush-green/10 p-8 text-center shadow-glow">
            <Rocket className="mx-auto mb-4 h-10 w-10 text-rush-green" />
            <h2 className="text-3xl font-black text-white">Ready to climb the ranks?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-300">Start with a short test, unlock your first achievement, then push your daily streak higher.</p>
            <Link className="mt-6 inline-flex" to="/typing-test"><Button>Start Typing</Button></Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-slate-400">© 2026 TypeRush. Built for students, programmers, and casual speed hunters.</footer>
    </div>
  );
}
