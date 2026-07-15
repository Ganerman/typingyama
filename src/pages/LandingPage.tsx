import { motion } from 'framer-motion';
import { BookOpenCheck, Code2, Gamepad2, Keyboard, Medal, Rocket, Target, Trophy } from 'lucide-react';
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

        <section className="mx-auto max-w-7xl px-4 py-10">
          <Card className="overflow-hidden bg-gradient-to-br from-rush-green/10 via-white/[0.03] to-rush-blue/10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:p-3">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-bold text-rush-green"><Code2 className="h-4 w-4" /> Developer Profile</p>
                <div className="mt-4 grid items-start gap-5 sm:grid-cols-[160px_1fr]">
                  <div className="relative mx-auto w-full max-w-48 overflow-hidden rounded-xl border border-rush-green/30 bg-rush-ink p-1 shadow-glow sm:mx-0">
                    <img className="aspect-[4/5] w-full rounded-lg object-cover object-top" src="/assets/developer-fritz-joshua-santiago.jpg" alt="Fritz Joshua Santiago, developer of TypeRush" />
                    <span className="absolute bottom-3 left-3 rounded-md bg-rush-ink/85 px-2 py-1 text-xs font-bold text-rush-green backdrop-blur">Student Developer</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">Fritz Joshua Santiago</h2>
                    <p className="mt-1 font-bold text-rush-green">Student Developer &amp; IT Enthusiast</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="grid min-h-36 place-items-center rounded-lg border border-white/10 bg-rush-ink/70 p-3 text-center">
                        <img className="h-24 w-24 rounded-full border border-white/20 object-cover shadow-lg" src="/assets/college-information-technology-logo.jpg" alt="College of Information Technology logo" />
                        <p className="mt-2 text-xs font-bold leading-4 text-rush-blue">College of Information Technology</p>
                      </div>
                      <div className="grid min-h-36 place-items-center rounded-lg border border-white/10 bg-rush-ink/70 p-3 text-center">
                        <img className="h-24 w-full object-contain drop-shadow-lg" src="/assets/iba-college-of-mindanao-logo.png" alt="IBA College of Mindanao Inc. logo" />
                        <p className="mt-2 text-xs font-bold leading-4 text-rush-blue">IBA College of Mindanao Inc.</p>
                      </div>
                    </div>
                    <p className="mt-3 font-bold text-rush-blue">College of Information Technology Student</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">Valencia City, Bukidnon</p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">Fritz Joshua Santiago is an Information Technology student at IBA College of Mindanao Inc. in Valencia City. Originally from San Fernando, Bukidnon, he is passionate about web development, interactive learning tools, and using technology to solve practical problems.</p>
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-black text-white">Building practical technology for better learning.</h3>
                <p className="mt-3 leading-7 text-slate-300">TypeRush reflects his commitment to creating a useful and engaging educational experience. The platform combines structured typing practice, programming-related content, performance tracking, and interactive game modes to help learners develop speed, accuracy, and confidence.</p>
                <p className="mt-3 leading-7 text-slate-300">His vision is to keep TypeRush free, accessible, and account-optional so students, aspiring IT professionals, programmers, and everyday computer users can strengthen essential keyboard skills at their own pace.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/student"><Button icon={<BookOpenCheck className="h-5 w-5" />}>Explore Student Lessons</Button></Link>
                  <Link to="/library"><Button variant="ghost">Open IT Library</Button></Link>
                </div>
              </div>
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">How to use TypeRush</p>
                <div className="grid gap-3">
                  {[
                    { number: '01', title: 'Choose your practice', text: 'Start with a classic test, student lesson, code exercise, or arcade game.' },
                    { number: '02', title: 'Focus on accuracy', text: 'Build a steady rhythm first. Speed improves naturally when mistakes decrease.' },
                    { number: '03', title: 'Track your improvement', text: 'Review your WPM, accuracy, scores, levels, history, and personal bests.' },
                  ].map((step) => <div key={step.number} className="flex gap-4 rounded-lg border border-white/10 bg-rush-ink/70 p-4"><span className="font-mono text-xl font-black text-rush-green">{step.number}</span><div><h3 className="font-black text-white">{step.title}</h3><p className="mt-1 text-sm leading-6 text-slate-300">{step.text}</p></div></div>)}
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm text-slate-400"><Target className="h-4 w-4 text-rush-blue" /> Practice consistently—even ten focused minutes a day can make a difference.</p>
              </div>
            </div>
          </Card>
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
