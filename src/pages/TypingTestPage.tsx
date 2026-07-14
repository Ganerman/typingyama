import { Play, RotateCcw, Share2, Trophy } from 'lucide-react';
import { ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { SpeedChart } from '../components/Charts';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';
import { typingTexts } from '../data/typingTexts';
import { saveLocalResult } from '../services/storage';
import type { Difficulty, TestLanguage, TypingResult } from '../types';
import { calculateAccuracy, calculateRawWpm, calculateWpm, calculateXp, detectPersonalBest, getRankProgress } from '../utils/calculations';

const durations = [15, 30, 60, 120];
const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Expert'];
const languages: TestLanguage[] = ['English', 'Filipino', 'Cebuano'];
const difficultyMultiplier: Record<Difficulty, number> = { Easy: 1, Medium: 1.15, Hard: 1.35, Expert: 1.6 };

export function TypingTestPage() {
  const { profile, updateProfile } = useAuth();
  const { fontSize, showLiveAccuracy, showLiveWpm } = useSettings();
  const [duration, setDuration] = useState(60);
  const [customDuration, setCustomDuration] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [language, setLanguage] = useState<TestLanguage>('English');
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<TypingResult | null>(null);
  const previousBestWpm = useRef(profile.bestWpm);
  const [, setTick] = useState(0);

  const targetText = useMemo(() => typingTexts[language][difficulty][0], [difficulty, language]);
  const effectiveDuration = Math.max(5, customDuration ? Number(customDuration) || duration : duration);
  const elapsedSeconds = startedAt ? Math.min(effectiveDuration, (Date.now() - startedAt) / 1000) : 0;
  const remaining = Math.max(0, Math.ceil(effectiveDuration - elapsedSeconds));
  const correctCharacters = typed.split('').filter((char, index) => char === targetText[index]).length;
  const incorrectCharacters = typed.length - correctCharacters;
  const wpm = calculateWpm(correctCharacters, Math.max(1, elapsedSeconds));
  const accuracy = calculateAccuracy(correctCharacters, typed.length);
  const progress = Math.min(100, (typed.length / targetText.length) * 100);
  const runnerPosition = startedAt ? Math.min(92, 8 + (elapsedSeconds / effectiveDuration) * 84) : 8;
  const chaserPosition = Math.min(92, 8 + (typed.length / targetText.length) * 84);
  const currentWord = targetText.slice(typed.length).trimStart().split(/\s+/)[0] || 'Finish';

  useEffect(() => {
    if (!startedAt || finished) return undefined;
    let frameId = 0;

    const updateFrame = () => {
      setTick((current) => current + 1);
      frameId = window.requestAnimationFrame(updateFrame);
    };

    frameId = window.requestAnimationFrame(updateFrame);
    return () => window.cancelAnimationFrame(frameId);
  }, [finished, startedAt]);

  useEffect(() => {
    if (startedAt && !finished && remaining <= 0) finishTest(typed, true);
  });

  const finishTest = (finalTyped = typed, timedOut = false) => {
    if (finished || !startedAt) return;
    const finalElapsed = Math.max(1, elapsedSeconds || effectiveDuration);
    const finalCorrect = finalTyped.split('').filter((char, index) => char === targetText[index]).length;
    const finalWpm = calculateWpm(finalCorrect, finalElapsed);
    const finalRawWpm = calculateRawWpm(finalTyped.length, finalElapsed);
    const finalAccuracy = calculateAccuracy(finalCorrect, finalTyped.length);
    const passed = !timedOut && finalTyped.length >= targetText.length;
    const xpEarned = passed ? calculateXp(finalWpm, finalAccuracy, effectiveDuration, difficultyMultiplier[difficulty]) : 0;
    const speedSeries = Array.from({ length: Math.max(3, Math.ceil(finalElapsed / 5)) }, (_, index) => ({
      second: Math.min(effectiveDuration, (index + 1) * 5),
      wpm: Math.max(0, Math.round(finalWpm * (0.72 + index * 0.06))),
    }));
    const nextResult: TypingResult = {
      mode: 'Classic',
      difficulty,
      language,
      duration: effectiveDuration,
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy: finalAccuracy,
      correctCharacters: finalCorrect,
      incorrectCharacters: finalTyped.length - finalCorrect,
      totalCharacters: finalTyped.length,
      xpEarned,
      passed,
      completedAt: new Date().toISOString(),
      speedSeries,
    };
    setFinished(true);
    setResult(nextResult);
    saveLocalResult(nextResult);
    updateProfile({
      ...profile,
      totalXp: profile.totalXp + xpEarned,
      bestWpm: passed ? Math.max(profile.bestWpm, Math.round(finalWpm)) : profile.bestWpm,
      averageWpm: passed ? Math.round((profile.averageWpm + finalWpm) / 2) : profile.averageWpm,
      bestAccuracy: passed ? Math.max(profile.bestAccuracy, finalAccuracy) : profile.bestAccuracy,
      totalTests: profile.totalTests + 1,
    });
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (finished) return;
    if (!startedAt) setStartedAt(Date.now());
    const value = event.target.value.slice(0, targetText.length);
    setTyped(value);
    if (value.length >= targetText.length) window.setTimeout(() => finishTest(value, false), 0);
  };

  const restart = () => {
    previousBestWpm.current = profile.bestWpm;
    setTyped('');
    setStartedAt(null);
    setFinished(false);
    setResult(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey && event.key.toLowerCase() === 'r') {
      event.preventDefault();
      restart();
    }
  };

  if (result) {
    const personalBest = result.passed && detectPersonalBest(result.wpm, previousBestWpm.current);
    return (
      <div className="grid gap-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className={`text-sm font-bold ${result.passed ? 'text-rush-green' : 'text-rose-300'}`}>{result.passed ? 'Chase Complete' : 'Chase Failed'}</p>
              <h1 className="text-3xl font-black text-white">{result.passed ? (personalBest ? 'New personal best.' : 'You caught the text!') : 'The text crossed the finish line.'}</h1>
              {!result.passed && <p className="mt-2 text-slate-300">Finish the entire paragraph before time runs out. No XP was awarded.</p>}
            </div>
            <Button onClick={restart} icon={<RotateCcw className="h-5 w-5" />}>Restart</Button>
          </div>
        </Card>
        <section className="grid gap-4 md:grid-cols-4">
          {[
            ['Final WPM', result.wpm],
            ['Raw WPM', result.rawWpm],
            ['Accuracy', `${result.accuracy}%`],
            ['XP Earned', `+${result.xpEarned}`],
          ].map(([label, value]) => (
            <Card key={String(label)}><p className="text-sm text-slate-400">{label}</p><p className="mt-1 text-3xl font-black text-white">{value}</p></Card>
          ))}
        </section>
        <Card>
          <div className="grid gap-3 md:grid-cols-3">
            <p>Correct: <strong className="text-rush-green">{result.correctCharacters}</strong></p>
            <p>Incorrect: <strong className="text-rose-300">{result.incorrectCharacters}</strong></p>
            <p>Total: <strong>{result.totalCharacters}</strong></p>
          </div>
          <div className="mt-5">
            <p className="mb-2 text-sm text-slate-400">New rank progress</p>
            <ProgressBar value={getRankProgress(profile.totalXp)} />
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-xl font-black text-white">Speed During Test</h2>
          <SpeedChart data={result.speedSeries} />
        </Card>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={restart}>Try Another Mode</Button>
          <Button variant="ghost" icon={<Share2 className="h-5 w-5" />} onClick={() => void navigator.clipboard?.writeText(`I typed ${result.wpm} WPM at ${result.accuracy}% on TypeRush!`)}>
            Share Result
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-rush-green">Classic Typing Test</p>
            <h1 className="text-3xl font-black text-white">Focus, start typing, climb.</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button disabled={Boolean(startedAt)} onClick={() => setStartedAt(Date.now())} icon={<Play className="h-5 w-5" />}>
              Start
            </Button>
            <Button variant="ghost" onClick={restart} icon={<RotateCcw className="h-5 w-5" />}>Restart</Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="grid gap-4 md:grid-cols-4">
          <label className="grid gap-2 text-sm font-bold text-slate-200">Duration
            <select className="focus-ring rounded-lg border border-white/10 bg-rush-ink px-3 py-3" value={duration} onChange={(event) => setDuration(Number(event.target.value))}>
              {durations.map((item) => <option key={item} value={item}>{item}s</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Custom seconds
            <input className="focus-ring rounded-lg border border-white/10 bg-rush-ink px-3 py-3" inputMode="numeric" value={customDuration} onChange={(event) => setCustomDuration(event.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Difficulty
            <select className="focus-ring rounded-lg border border-white/10 bg-rush-ink px-3 py-3" value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)}>
              {difficulties.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Language
            <select className="focus-ring rounded-lg border border-white/10 bg-rush-ink px-3 py-3" value={language} onChange={(event) => setLanguage(event.target.value as TestLanguage)}>
              {languages.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </Card>

      <Card>
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          {showLiveWpm && <p className="font-black text-rush-green">{wpm} WPM</p>}
          {showLiveAccuracy && <p className="font-black text-rush-blue">{accuracy}% accuracy</p>}
          <p className="font-black text-white">{remaining}s left</p>
          <p className="font-black text-rose-300">{incorrectCharacters} errors</p>
        </div>
        <ProgressBar value={progress} label="Typing progress" />

        <div className="relative mt-6 overflow-hidden rounded-lg border border-white/10 bg-rush-ink p-5">
          <div className="absolute bottom-4 top-4 w-px bg-rush-green/40" style={{ left: '92%' }} />
          <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wide text-slate-400">
            <span>Catch the running text before it escapes</span>
            <span>Current: {currentWord}</span>
          </div>

          <div className="relative h-20 rounded-lg border border-white/10 bg-white/[0.03]">
            <span className="absolute bottom-2 left-3 text-[10px] font-black uppercase tracking-widest text-slate-600">Start</span>
            <span className="absolute bottom-2 right-3 text-[10px] font-black uppercase tracking-widest text-rush-green">Finish</span>
            <div
              className="absolute top-4 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-lg border border-rush-blue/50 bg-rush-blue px-4 py-2 font-mono font-black text-rush-ink shadow-blueGlow will-change-[left]"
              style={{ left: `${runnerPosition}%`, fontSize: Math.max(14, fontSize - 4) }}
            >
              <Play className="h-4 w-4 fill-current" />
              {currentWord}
            </div>
            {!startedAt && <p className="absolute inset-0 grid place-items-center text-sm font-bold text-slate-400">Press Start or type your first letter</p>}
          </div>

          <div className="relative mt-3 h-12 rounded-lg border border-white/10 bg-white/[0.03]">
            <span
              className="absolute top-2 inline-flex -translate-x-1/2 rounded-lg bg-rush-green px-4 py-1.5 font-black text-rush-ink shadow-glow transition-[left] duration-100 ease-out will-change-[left]"
              style={{ left: `${chaserPosition}%` }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-rush-ink p-5 font-mono leading-9" style={{ fontSize }}>
          {targetText.split('').map((char, index) => {
            const typedChar = typed[index];
            const state = typedChar === undefined ? 'text-slate-500' : typedChar === char ? 'text-rush-green' : 'bg-rose-500/30 text-rose-100';
            const cursor = index === typed.length ? 'border-b-2 border-rush-green' : '';
            return <span key={`${char}-${index}`} className={`${state} ${cursor}`}>{char}</span>;
          })}
        </div>
        <textarea
          autoFocus
          aria-label="Typing input"
          className="focus-ring mt-5 min-h-36 w-full resize-none rounded-lg border border-white/10 bg-white/5 p-4 font-mono text-slate-100"
          disabled={finished}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={(event) => event.preventDefault()}
          placeholder={startedAt ? 'Keep typing before the text escapes.' : 'Start typing - the timer begins on your first key.'}
          value={typed}
        />
        <p className="mt-2 text-xs text-slate-500">Shortcut: Ctrl+R restarts the test. Copy and paste is disabled.</p>
        <Button className="mt-4" disabled={!startedAt} onClick={() => finishTest(typed, typed.length < targetText.length)} icon={<Trophy className="h-5 w-5" />}>Finish Now</Button>
      </Card>
    </div>
  );
}
