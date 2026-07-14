import { Save } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { WeeklyChart } from '../components/Charts';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { RankBadge } from '../components/ui/RankBadge';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { achievements, leaderboard, weeklyProgress } from '../data/mockData';
import { getLocalResults } from '../services/storage';

export function DailyChallengePage() {
  const [completed, setCompleted] = useState(localStorage.getItem('typerush-daily') === new Date().toDateString());
  const progress = completed ? 100 : 0;
  return (
    <div className="grid gap-5">
      <Card>
        <p className="text-sm font-bold text-rush-green">Daily Challenge</p>
        <h1 className="text-3xl font-black text-white">One challenge. One reward per day.</h1>
      </Card>
      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="rounded-lg bg-rush-ink p-5 font-mono leading-8 text-slate-300">Students who practice with clear goals and steady concentration develop speed, accuracy, and confidence across every digital task. Consistent keyboard training makes it easier to prepare reports, communicate ideas, write reliable programs, and collaborate with classmates under a limited amount of time.</p>
            <div className="mt-4 grid gap-2 text-sm text-slate-300">
              <p>Required WPM: <strong className="text-white">65</strong></p>
              <p>Required accuracy: <strong className="text-white">94%</strong></p>
              <p>Rewards: <strong className="text-rush-green">120 XP + 45 coins</strong></p>
              <p>Next challenge: <strong className="text-rush-blue">00:00 local midnight</strong></p>
            </div>
            <div className="mt-4"><ProgressBar value={progress} /></div>
            <Button className="mt-4" disabled={completed} onClick={() => { localStorage.setItem('typerush-daily', new Date().toDateString()); setCompleted(true); }}>{completed ? 'Reward Claimed' : 'Mark Complete'}</Button>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-black text-white">Daily Leaderboard</h2>
            <LeaderboardTable entries={leaderboard.slice(0, 3)} />
          </div>
        </div>
      </Card>
    </div>
  );
}

export function LeaderboardPage() {
  const categories = ['Daily', 'Weekly', 'Monthly', 'All-time', 'Highest WPM', 'Best accuracy', 'Most XP', 'Longest streak', 'Race wins'];
  const [category, setCategory] = useState('All-time');
  return (
    <div className="grid gap-5">
      <Card><p className="text-sm font-bold text-rush-green">Leaderboard</p><h1 className="text-3xl font-black text-white">Compete across every category.</h1></Card>
      <div className="flex flex-wrap gap-2">{categories.map((item) => <Button key={item} variant={category === item ? 'primary' : 'ghost'} onClick={() => setCategory(item)}>{item}</Button>)}</div>
      <Card><LeaderboardTable entries={leaderboard} /></Card>
    </div>
  );
}

export function AchievementsPage() {
  return (
    <div className="grid gap-5">
      <Card><p className="text-sm font-bold text-rush-green">Achievements</p><h1 className="text-3xl font-black text-white">Unlock milestones and collect XP.</h1></Card>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={achievement.unlockedAt ? 'border-rush-green/30' : ''}>
            <achievement.icon className={`h-7 w-7 ${achievement.unlockedAt ? 'text-rush-green' : 'text-slate-500'}`} />
            <h2 className="mt-3 text-xl font-black text-white">{achievement.name}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">{achievement.description}</p>
            <p className="mt-3 text-sm text-slate-400">Reward: +{achievement.xpReward} XP</p>
            <p className="mt-1 text-xs text-slate-500">{achievement.unlockedAt ? `Unlocked ${achievement.unlockedAt}` : `Locked · ${achievement.requirementType} ${achievement.requirementValue}`}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}

export function ProfilePage() {
  const { profile, updateProfile } = useAuth();
  const [draft, setDraft] = useState(profile);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    updateProfile(draft);
  };

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <img src={profile.avatarUrl} alt="" className="h-20 w-20 rounded-lg bg-white/10" />
          <div><RankBadge rank={profile.currentRank} /><h1 className="mt-2 text-3xl font-black text-white">{profile.fullName}</h1><p className="text-slate-300">@{profile.username}</p></div>
        </div>
      </Card>
      <section className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <Card>
          <form className="grid gap-4" onSubmit={submit}>
            {(['username', 'fullName', 'bio', 'school', 'country'] as const).map((field) => (
              <label key={field} className="grid gap-2 text-sm font-bold capitalize">{field}
                <input className="rounded-lg border border-white/10 bg-white/5 px-3 py-3" value={draft[field]} onChange={(event) => setDraft({ ...draft, [field]: event.target.value })} />
              </label>
            ))}
            <Button icon={<Save className="h-5 w-5" />}>Save Profile</Button>
          </form>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-black text-white">Progress</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <p>XP: <strong>{profile.totalXp.toLocaleString()}</strong></p><p>Coins: <strong>{profile.coins}</strong></p>
            <p>Best WPM: <strong>{profile.bestWpm}</strong></p><p>Average accuracy: <strong>{profile.bestAccuracy}%</strong></p>
            <p>Streak: <strong>{profile.currentStreak} days</strong></p><p>Total tests: <strong>{profile.totalTests}</strong></p>
          </div>
          <div className="mt-5"><WeeklyChart data={weeklyProgress} /></div>
        </Card>
      </section>
    </div>
  );
}

export function HistoryPage() {
  const [mode, setMode] = useState('All');
  const results = getLocalResults().filter((result) => mode === 'All' || result.mode === mode);
  return (
    <div className="grid gap-5">
      <Card><p className="text-sm font-bold text-rush-green">Typing History</p><h1 className="text-3xl font-black text-white">Track improvements over time.</h1></Card>
      <Card>
        <div className="mb-4 flex flex-wrap gap-2">
          {['All', 'Classic', 'Race', 'Word Rain', 'Code'].map((item) => <Button key={item} variant={mode === item ? 'primary' : 'ghost'} onClick={() => setMode(item)}>{item}</Button>)}
        </div>
        {results.length === 0 ? <p className="rounded-lg border border-white/10 bg-white/5 p-6 text-slate-300">No local test history yet. Complete a classic test to log your first result.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-400"><tr>{['Date', 'Mode', 'Duration', 'WPM', 'Accuracy', 'Errors', 'XP', 'PB'].map((item) => <th key={item} className="px-3 py-3">{item}</th>)}</tr></thead>
              <tbody>{results.map((result) => <tr key={result.completedAt} className="border-t border-white/10"><td className="px-3 py-3">{new Date(result.completedAt).toLocaleString()}</td><td className="px-3 py-3">{result.mode}</td><td className="px-3 py-3">{result.duration}s</td><td className="px-3 py-3">{result.wpm}</td><td className="px-3 py-3">{result.accuracy}%</td><td className="px-3 py-3">{result.incorrectCharacters}</td><td className="px-3 py-3">+{result.xpEarned}</td><td className="px-3 py-3">{result.wpm > 90 ? 'Yes' : '-'}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </Card>
      <Card><WeeklyChart data={weeklyProgress} /></Card>
    </div>
  );
}

export function SettingsPage() {
  const settings = useSettings();

  return (
    <div className="grid gap-5">
      <Card><p className="text-sm font-bold text-rush-green">Settings</p><h1 className="text-3xl font-black text-white">Tune your typing experience.</h1></Card>
      <Card>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4">Dark or light mode <Button type="button" variant="ghost" onClick={settings.toggleTheme}>{settings.theme}</Button></label>
          <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4">Typing sound effects <input type="checkbox" checked={settings.soundEnabled} onChange={(event) => settings.setSoundEnabled(event.target.checked)} /></label>
          <label className="grid gap-2 rounded-lg border border-white/10 bg-white/5 p-4">Keyboard sound volume <input type="range" min="0" max="100" defaultValue="60" /></label>
          <label className="grid gap-2 rounded-lg border border-white/10 bg-white/5 p-4">Font size <input type="range" min="16" max="28" value={settings.fontSize} onChange={(event) => settings.setFontSize(Number(event.target.value))} /></label>
          <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4">Show live WPM <input type="checkbox" checked={settings.showLiveWpm} onChange={(event) => settings.setShowLiveWpm(event.target.checked)} /></label>
          <label className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/5 p-4">Show live accuracy <input type="checkbox" checked={settings.showLiveAccuracy} onChange={(event) => settings.setShowLiveAccuracy(event.target.checked)} /></label>
          <label className="grid gap-2 rounded-lg border border-white/10 bg-white/5 p-4">Default typing duration <select className="rounded-lg bg-rush-ink px-3 py-2"><option>60 seconds</option><option>30 seconds</option><option>120 seconds</option></select></label>
          <label className="grid gap-2 rounded-lg border border-white/10 bg-white/5 p-4">Test language <select className="rounded-lg bg-rush-ink px-3 py-2"><option>English</option><option>Filipino</option><option>Cebuano</option></select></label>
        </div>
      </Card>
    </div>
  );
}
