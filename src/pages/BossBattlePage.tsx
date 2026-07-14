import { Heart, RotateCcw, Shield, Skull, Sparkles, Swords, Timer, Zap } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAuth } from '../contexts/AuthContext';
import type { Difficulty } from '../types';
import { getLevel, getRank } from '../utils/calculations';

const difficulties: Record<Difficulty, { hp: number; seconds: number; lives: number; reward: number; label: string }> = {
  Easy: { hp: 180, seconds: 90, lives: 6, reward: 100, label: 'Training beast' },
  Medium: { hp: 280, seconds: 80, lives: 5, reward: 160, label: 'Keyboard ogre' },
  Hard: { hp: 400, seconds: 70, lives: 4, reward: 240, label: 'Syntax dragon' },
  Expert: { hp: 560, seconds: 60, lives: 3, reward: 360, label: 'Compiler titan' },
};

const battleWords = [
  'keyboard warrior', 'typing velocity', 'critical accuracy', 'search algorithm', 'precision strike', 'compiler warning',
  'database guardian', 'javascript challenge', 'lightning response', 'secure connection', 'responsive interface', 'pure function',
  'constant variable', 'typescript defender', 'software developer', 'digital adventure', 'perfect victory', 'maximum combo',
  'terminal command', 'runtime exception', 'encrypted message', 'asynchronous battle', 'legendary programmer', 'final boss sequence',
];

export function BossBattlePage() {
  const { profile, updateProfile } = useAuth();
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const config = difficulties[difficulty];
  const [battleLevel, setBattleLevel] = useState(1);
  const [status, setStatus] = useState<'ready' | 'playing' | 'won' | 'lost'>('ready');
  const [bossHp, setBossHp] = useState(config.hp);
  const [lives, setLives] = useState(config.lives);
  const [seconds, setSeconds] = useState(config.seconds);
  const [wordIndex, setWordIndex] = useState(0);
  const [input, setInput] = useState('');
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [damage, setDamage] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const rewarded = useRef(false);
  const shuffledWords = useMemo(() => {
    const offset = difficulty === 'Easy' ? 0 : difficulty === 'Medium' ? 4 : difficulty === 'Hard' ? 8 : 12;
    return [...battleWords.slice(offset), ...battleWords.slice(0, offset)];
  }, [difficulty]);
  const target = shuffledWords[wordIndex % shuffledWords.length];
  const accuracy = hits + misses ? Math.round((hits / (hits + misses)) * 100) : 100;
  const levelHp = config.hp + (battleLevel - 1) * Math.round(config.hp * 0.18);
  const levelTime = Math.max(25, config.seconds - (battleLevel - 1) * 5);
  const reward = config.reward + (battleLevel - 1) * 45 + bestCombo * 3;

  useEffect(() => {
    if (status !== 'playing') return undefined;
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    if (status === 'playing' && seconds === 0) setStatus('lost');
  }, [seconds, status]);

  useEffect(() => {
    if (status !== 'won' || rewarded.current) return;
    rewarded.current = true;
    const totalXp = profile.totalXp + reward;
    updateProfile({
      ...profile,
      totalXp,
      coins: profile.coins + Math.round(reward / 3),
      level: getLevel(totalXp),
      currentRank: getRank(totalXp).name,
    });
  }, [profile, reward, status, updateProfile]);

  const start = (nextLevel = battleLevel) => {
    const nextHp = config.hp + (nextLevel - 1) * Math.round(config.hp * 0.18);
    const nextTime = Math.max(25, config.seconds - (nextLevel - 1) * 5);
    setBattleLevel(nextLevel);
    setBossHp(nextHp);
    setLives(config.lives);
    setSeconds(nextTime);
    setWordIndex(0);
    setInput('');
    setCombo(0);
    setBestCombo(0);
    setDamage(0);
    setHits(0);
    setMisses(0);
    rewarded.current = false;
    setStatus('playing');
  };

  const changeDifficulty = (nextDifficulty: Difficulty) => {
    const nextConfig = difficulties[nextDifficulty];
    setDifficulty(nextDifficulty);
    setBattleLevel(1);
    setBossHp(nextConfig.hp);
    setLives(nextConfig.lives);
    setSeconds(nextConfig.seconds);
    setStatus('ready');
  };

  const landHit = () => {
    const nextCombo = combo + 1;
    const dealt = target.length * 2 + Math.min(20, nextCombo * 2);
    const remainingHp = Math.max(0, bossHp - dealt);
    setDamage(dealt);
    setBossHp(remainingHp);
    setCombo(nextCombo);
    setBestCombo((current) => Math.max(current, nextCombo));
    setHits((current) => current + 1);
    setInput('');
    setWordIndex((current) => (current + 1) % shuffledWords.length);
    if (remainingHp === 0) setStatus('won');
  };

  const miss = () => {
    if (!input) return;
    const remainingLives = lives - 1;
    setLives(remainingLives);
    setCombo(0);
    setMisses((current) => current + 1);
    setDamage(0);
    setInput('');
    setWordIndex((current) => (current + 1) % shuffledWords.length);
    if (remainingLives <= 0) setStatus('lost');
  };

  const type = (value: string) => {
    if (status !== 'playing') return;
    const normalized = value.toLowerCase().trimStart();
    setInput(normalized);
    if (normalized === target) landHit();
  };

  return (
    <div className="grid gap-5">
      <Card className="overflow-hidden bg-gradient-to-br from-rose-500/10 via-rush-ink to-violet-500/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold text-rose-300"><Swords className="h-4 w-4" /> Boss Battle</p>
            <h1 className="mt-1 text-3xl font-black text-white">Type fast. Hit hard. Survive.</h1>
            <p className="mt-2 text-slate-300">Complete each word to damage the boss. Press Enter on a wrong word and you lose a life.</p>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-200">Difficulty
            <select className="rounded-lg border border-white/10 bg-rush-ink px-4 py-3" disabled={status === 'playing'} value={difficulty} onChange={(event) => changeDifficulty(event.target.value as Difficulty)}>
              {Object.keys(difficulties).map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>
      </Card>

      <Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <BattleStat icon={<Swords />} label="Boss Level" value={`${battleLevel}`} tone="text-violet-300" />
          <BattleStat icon={<Timer />} label="Time" value={`${seconds}s`} tone="text-rush-blue" />
          <BattleStat icon={<Heart />} label="Lives" value={`${lives}/${config.lives}`} tone="text-rose-300" />
          <BattleStat icon={<Zap />} label="Combo" value={`x${combo}`} tone="text-amber-300" />
          <BattleStat icon={<Shield />} label="Accuracy" value={`${accuracy}%`} tone="text-rush-green" />
        </div>
      </Card>

      <Card className="relative overflow-hidden">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.2em] text-rose-300">{config.label}</p>
            <h2 className="text-2xl font-black text-white">The Bug Bringer</h2>
          </div>
          <Skull className={`h-14 w-14 text-rose-400 ${status === 'playing' ? 'animate-pulse' : ''}`} />
        </div>
        <ProgressBar value={(bossHp / levelHp) * 100} label="Boss health" />
        <div className="mt-2 flex justify-between text-sm font-bold">
          <span className="text-slate-400">Boss HP</span>
          <span className="text-rose-300">{bossHp} / {levelHp}</span>
        </div>

        <div className="mt-7 rounded-xl border border-white/10 bg-rush-ink p-6 text-center">
          {status === 'ready' && <BattleMessage title={`Ready for level ${battleLevel}?`} detail={`Defeat the boss in ${levelTime} seconds for ${reward}+ XP. Every new level removes 5 seconds and increases boss health.`} />}
          {status === 'won' && <BattleMessage title="Boss defeated!" detail={`Best combo x${bestCombo} · ${accuracy}% accuracy · +${reward} XP · +${Math.round(reward / 3)} coins`} won />}
          {status === 'lost' && <BattleMessage title="The boss survived." detail={`You dealt ${levelHp - bossHp} damage on level ${battleLevel}. Improve your rhythm and try again.`} />}
          {status === 'playing' && (
            <>
              <p className="text-xs font-bold uppercase tracking-[.3em] text-slate-500">Target word</p>
              <p className="mt-3 font-mono text-4xl font-black tracking-wide text-white">{target}</p>
              <p className="mt-3 h-6 text-sm font-bold text-amber-300">{damage > 0 ? `Last hit: -${damage} HP` : 'Build your first combo!'}</p>
            </>
          )}
        </div>

        <input
          aria-label="Type the boss battle word"
          autoComplete="off"
          autoFocus
          className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 p-4 text-center font-mono text-xl font-bold outline-none focus:border-rush-green"
          disabled={status !== 'playing'}
          placeholder={status === 'playing' ? `Type “${target}”` : 'Start the battle first'}
          value={input}
          onChange={(event) => type(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter' && input !== target) miss(); }}
        />

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {status === 'ready' ? (
            <Button onClick={() => start(battleLevel)} icon={<Swords className="h-5 w-5" />}>Start Battle</Button>
          ) : status === 'playing' ? (
            <Button variant="danger" onClick={miss}>Skip Word (-1 life)</Button>
          ) : status === 'won' ? (
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => start(battleLevel + 1)} icon={<Swords className="h-5 w-5" />}>Next Level</Button>
              <Button variant="ghost" onClick={() => start(battleLevel)} icon={<RotateCcw className="h-5 w-5" />}>Replay Level</Button>
            </div>
          ) : (
            <Button onClick={() => start(battleLevel)} icon={<RotateCcw className="h-5 w-5" />}>Retry Level</Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function BattleStat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <div className={`mb-2 h-5 w-5 ${tone}`}>{icon}</div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-black ${tone}`}>{value}</p>
    </div>
  );
}

function BattleMessage({ title, detail, won = false }: { title: string; detail: string; won?: boolean }) {
  return (
    <div className="py-5">
      {won && <Sparkles className="mx-auto mb-3 h-10 w-10 text-amber-300" />}
      <h3 className={`text-3xl font-black ${won ? 'text-rush-green' : 'text-white'}`}>{title}</h3>
      <p className="mt-2 text-slate-300">{detail}</p>
    </div>
  );
}
