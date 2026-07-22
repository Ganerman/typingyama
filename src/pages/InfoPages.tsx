import { Clock, Flame, Play, RotateCcw, Save, Share2, Trophy } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { WeeklyChart } from '../components/Charts';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { RankBadge } from '../components/ui/RankBadge';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { achievements, leaderboard, weeklyProgress } from '../data/mockData';
import { typingTexts } from '../data/typingTexts';
import { getDailyProgress, getLocalResults, saveDailyProgress, saveLocalResult } from '../services/storage';
import type { TypingResult } from '../types';
import { calculateAccuracy, calculateRawWpm, calculateWpm } from '../utils/calculations';
import { shareTypingResult } from '../utils/shareResult';

const DAILY_SECONDS = 90;
const DAILY_WPM = 35;
const DAILY_ACCURACY = 90;
const DAILY_XP = 120;
const DAILY_COINS = 45;

const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function DailyChallengePage() {
  const { profile, updateProfile } = useAuth();
  const today = localDateKey();
  const initialProgress = useRef(getDailyProgress());
  const passages = typingTexts.Cebuano.Medium;
  const passageIndex = Array.from(today).reduce((sum, char) => sum + char.charCodeAt(0), 0) % passages.length;
  const targetText = useMemo(() => passages[passageIndex], [passageIndex, passages]);
  const [dailyProgress, setDailyProgress] = useState(initialProgress.current);
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [result, setResult] = useState<TypingResult | null>(null);
  const [message, setMessage] = useState('');
  const [, setTick] = useState(0);
  const resultRef = useRef<TypingResult | null>(null);
  const completed = dailyProgress.completedDate === today;
  const elapsed = startedAt ? Math.min(DAILY_SECONDS, (Date.now() - startedAt) / 1000) : 0;
  const remaining = Math.max(0, Math.ceil(DAILY_SECONDS - elapsed));
  const correct = typed.split('').filter((char, index) => char === targetText[index]).length;
  const accuracy = calculateAccuracy(correct, typed.length);
  const wpm = calculateWpm(correct, Math.max(1, elapsed));
  const typingProgress = Math.min(100, (typed.length / targetText.length) * 100);

  const finish = (finalTyped: string, timedOut: boolean) => {
    if (!startedAt || resultRef.current) return;
    const finalElapsed = Math.max(1, timedOut ? DAILY_SECONDS : (Date.now() - startedAt) / 1000);
    const finalCorrect = finalTyped.split('').filter((char, index) => char === targetText[index]).length;
    const finalAccuracy = calculateAccuracy(finalCorrect, finalTyped.length);
    const finalWpm = calculateWpm(finalCorrect, finalElapsed);
    const passed = !timedOut && finalTyped.length >= targetText.length && finalWpm >= DAILY_WPM && finalAccuracy >= DAILY_ACCURACY;
    const firstCompletionToday = passed && !completed;
    const nextResult: TypingResult = {
      mode: 'Daily Challenge', difficulty: 'Medium', language: 'Cebuano', duration: Math.round(finalElapsed),
      wpm: finalWpm, rawWpm: calculateRawWpm(finalTyped.length, finalElapsed), accuracy: finalAccuracy,
      correctCharacters: finalCorrect, incorrectCharacters: finalTyped.length - finalCorrect,
      totalCharacters: finalTyped.length, xpEarned: firstCompletionToday ? DAILY_XP : 0, passed,
      completedAt: new Date().toISOString(), speedSeries: [],
    };
    resultRef.current = nextResult;
    setResult(nextResult);
    saveLocalResult(nextResult);

    if (firstCompletionToday) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const nextStreak = dailyProgress.lastPlayedDate === localDateKey(yesterday) ? dailyProgress.streak + 1 : 1;
      const nextDaily = {
        completedDate: today, lastPlayedDate: today, streak: nextStreak,
        longestStreak: Math.max(dailyProgress.longestStreak, nextStreak),
        bestWpm: Math.max(dailyProgress.bestWpm, finalWpm),
        bestAccuracy: Math.max(dailyProgress.bestAccuracy, finalAccuracy),
      };
      saveDailyProgress(nextDaily);
      setDailyProgress(nextDaily);
      updateProfile({
        ...profile, totalXp: profile.totalXp + DAILY_XP, coins: profile.coins + DAILY_COINS,
        currentStreak: nextStreak, longestStreak: Math.max(profile.longestStreak, nextStreak),
        bestWpm: Math.max(profile.bestWpm, finalWpm), bestAccuracy: Math.max(profile.bestAccuracy, finalAccuracy),
        averageWpm: Math.round((profile.averageWpm + finalWpm) / 2), totalTests: profile.totalTests + 1,
      });
    }
  };

  useEffect(() => {
    if (!startedAt || result) return undefined;
    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
      if ((Date.now() - startedAt) / 1000 >= DAILY_SECONDS) finish(typed, true);
    }, 250);
    return () => window.clearInterval(timer);
  });

  const handleTyping = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (completed || result) return;
    const value = event.target.value.slice(0, targetText.length);
    if (!startedAt) setStartedAt(Date.now());
    setTyped(value);
    if (value.length === targetText.length) window.setTimeout(() => finish(value, false), 0);
  };

  const retry = () => {
    resultRef.current = null;
    setTyped('');
    setStartedAt(null);
    setResult(null);
    setMessage('');
  };

  return (
    <div className="grid gap-5">
      <Card>
        <p className="text-sm font-bold text-rush-green">Daily Challenge</p>
        <h1 className="text-3xl font-black text-white">Bisaya challenge kada adlaw.</h1>
        <p className="mt-2 text-slate-300">Kompletoha ang passage, labaw sa {DAILY_WPM} WPM ug {DAILY_ACCURACY}% accuracy.</p>
      </Card>
      <Card>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <p className="rounded-lg bg-white/5 p-3 text-center"><strong className="block text-rush-green">{startedAt ? wpm : 0}</strong><span className="text-xs text-slate-400">WPM</span></p>
              <p className="rounded-lg bg-white/5 p-3 text-center"><strong className="block text-rush-blue">{accuracy}%</strong><span className="text-xs text-slate-400">Accuracy</span></p>
              <p className="rounded-lg bg-white/5 p-3 text-center"><strong className="block text-white">{remaining}s</strong><span className="text-xs text-slate-400">Time</span></p>
              <p className="rounded-lg bg-white/5 p-3 text-center"><strong className="block text-orange-300">{dailyProgress.streak}</strong><span className="text-xs text-slate-400">Streak</span></p>
            </div>
            <div className="rounded-lg bg-rush-ink p-5 font-mono leading-8">
              {targetText.split('').map((char, index) => <span key={`${char}-${index}`} className={typed[index] === undefined ? 'text-slate-500' : typed[index] === char ? 'text-rush-green' : 'bg-rose-500/30 text-rose-100'}>{char}</span>)}
            </div>
            <ProgressBar value={completed ? 100 : typingProgress} label="Challenge progress" />
            <textarea autoFocus aria-label="Daily challenge typing input" className="mt-4 min-h-32 w-full resize-none rounded-lg border border-white/10 bg-white/5 p-4 font-mono" disabled={completed || Boolean(result)} value={typed} onChange={handleTyping} onPaste={(event) => event.preventDefault()} placeholder={completed ? 'Nahuman na nimo ang challenge karong adlawa.' : 'Sugdi og type—automatic magsugod ang timer.'} />
            <div className="mt-4 grid gap-2 text-sm text-slate-300">
              <p>Required WPM: <strong className="text-white">{DAILY_WPM}</strong></p>
              <p>Required accuracy: <strong className="text-white">{DAILY_ACCURACY}%</strong></p>
              <p>Rewards: <strong className="text-rush-green">120 XP + 45 coins</strong></p>
              <p>Reset: <strong className="text-rush-blue">local midnight</strong></p>
            </div>
            {!startedAt && !completed && <Button className="mt-4" icon={<Play className="h-4 w-4" />} onClick={() => setStartedAt(Date.now())}>Start Challenge</Button>}
            {result && <div className={`mt-4 rounded-lg border p-4 ${result.passed ? 'border-rush-green/40 bg-rush-green/10' : 'border-rose-400/40 bg-rose-500/10'}`}><h2 className="text-xl font-black text-white">{result.passed ? 'Pasar ka!' : 'Sulayi pag-usab!'}</h2><p className="mt-1 text-sm text-slate-300">{result.wpm} WPM • {result.accuracy}% accuracy {result.xpEarned ? `• +${result.xpEarned} XP` : ''}</p><div className="mt-3 flex flex-wrap gap-2"><Button variant="ghost" icon={<RotateCcw className="h-4 w-4" />} disabled={completed} onClick={retry}>Retry</Button><Button variant="secondary" icon={<Share2 className="h-4 w-4" />} onClick={() => void shareTypingResult(result).then((action) => setMessage(action === 'shared' ? 'Na-share na!' : 'Na-save na ang result card!')).catch(() => setMessage('Wala nadayon ang pag-share.'))}>Share Result</Button></div>{message && <p className="mt-2 text-sm text-rush-blue">{message}</p>}</div>}
            {completed && !result && <p className="mt-4 rounded-lg border border-rush-green/30 bg-rush-green/10 p-4 font-bold text-rush-green"><Trophy className="mr-2 inline h-5 w-5" />Reward claimed na karong adlawa. Balik ugma!</p>}
          </div>
          <div>
            <h2 className="mb-3 text-xl font-black text-white">Daily Leaders</h2>
            <LeaderboardTable entries={leaderboard.slice(0, 3)} />
            <div className="mt-4 grid gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-slate-300"><p><Flame className="mr-2 inline h-4 w-4 text-orange-300" />Current streak: <strong className="text-white">{dailyProgress.streak} days</strong></p><p><Trophy className="mr-2 inline h-4 w-4 text-rush-green" />Longest streak: <strong className="text-white">{dailyProgress.longestStreak} days</strong></p><p><Clock className="mr-2 inline h-4 w-4 text-rush-blue" />Usa ra ka reward matag local calendar day.</p></div>
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
          {['All', 'Classic', 'Race', 'Word Rain', 'Worm Words', 'Code', 'Daily Challenge'].map((item) => <Button key={item} variant={mode === item ? 'primary' : 'ghost'} onClick={() => setMode(item)}>{item}</Button>)}
        </div>
        {results.length === 0 ? <p className="rounded-lg border border-white/10 bg-white/5 p-6 text-slate-300">No local test history yet. Complete a classic test to log your first result.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-400"><tr>{['Date', 'Mode', 'Duration', 'Performance', 'Accuracy', 'Errors', 'XP', 'PB'].map((item) => <th key={item} className="px-3 py-3">{item}</th>)}</tr></thead>
              <tbody>{results.map((result) => <tr key={result.completedAt} className="border-t border-white/10"><td className="px-3 py-3">{new Date(result.completedAt).toLocaleString()}</td><td className="px-3 py-3">{result.mode}</td><td className="px-3 py-3">{result.duration}s</td><td className="px-3 py-3">{result.mode === 'Worm Words' ? `${result.score ?? 0} pts / ${result.wordsFound ?? 0} words` : `${result.wpm} WPM`}</td><td className="px-3 py-3">{result.accuracy}%</td><td className="px-3 py-3">{result.incorrectCharacters}</td><td className="px-3 py-3">+{result.xpEarned}</td><td className="px-3 py-3">{result.mode !== 'Worm Words' && result.wpm > 90 ? 'Yes' : '-'}</td></tr>)}</tbody>
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
