import { Copy, Flag, Gauge, Link2, LogOut, Play, RotateCcw, Trophy, UserX, Users, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useAuth } from '../contexts/AuthContext';
import { typingTexts } from '../data/typingTexts';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import type { Difficulty, TestLanguage } from '../types';
import { calculateAccuracy, calculateWpm, getLevel, getRank } from '../utils/calculations';

type RaceStatus = 'lobby' | 'countdown' | 'racing' | 'finished';
type RaceMode = 'quick' | 'friends';
type Racer = { id: string; name: string; progress: number; wpm: number; accuracy: number; avatarIndex?: number; finishedAt?: number; isPlayer?: boolean };

const cpuProfiles = [
  { id: 'cpu-nova', name: 'Nova', speed: 0.115 },
  { id: 'cpu-bolt', name: 'Bolt', speed: 0.135 },
  { id: 'cpu-byte', name: 'Byte', speed: 0.095 },
];

const makeRoomCode = () => Math.random().toString(36).slice(2, 7).toUpperCase();
const FRIEND_RACE_SECONDS = 90;

export function MultiplayerRacePage() {
  const { profile, updateProfile } = useAuth();
  const playerId = useRef(crypto.randomUUID()).current;
  const channelRef = useRef<RealtimeChannel | null>(null);
  const raceStart = useRef(0);
  const rewarded = useRef(false);
  const [mode, setMode] = useState<RaceMode>('quick');
  const [raceLevel, setRaceLevel] = useState(1);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [status, setStatus] = useState<RaceStatus>('lobby');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [language, setLanguage] = useState<TestLanguage>('English');
  const [roomCode, setRoomCode] = useState(makeRoomCode);
  const [joinCode, setJoinCode] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [connected, setConnected] = useState(false);
  const [nickname, setNickname] = useState('');
  const [roomError, setRoomError] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [typed, setTyped] = useState('');
  const [errors, setErrors] = useState(0);
  const [, setTick] = useState(0);
  const [racers, setRacers] = useState<Racer[]>([]);
  const [endedIn, setEndedIn] = useState<number | null>(null);
  const playerName = nickname.trim() || profile.username;
  const text = typingTexts[language][difficulty][0];
  const correctCharacters = typed.split('').filter((char, index) => char === text[index]).length;
  const correctPrefixLength = typed.split('').findIndex((char, index) => char !== text[index]);
  const validatedCharacters = correctPrefixLength === -1 ? typed.length : correctPrefixLength;
  const elapsed = endedIn ?? (status === 'racing' || status === 'finished' ? Math.max(1, (Date.now() - raceStart.current) / 1000) : 1);
  const friendTimeLeft = Math.max(0, Math.ceil(FRIEND_RACE_SECONDS - elapsed));
  const progress = Math.min(100, (validatedCharacters / text.length) * 100);
  const wpm = calculateWpm(correctCharacters, elapsed);
  const accuracy = calculateAccuracy(correctCharacters, typed.length);

  const standings = (() => {
    const player: Racer = { id: playerId, name: playerName, progress, wpm, accuracy, avatarIndex: selectedAvatar, isPlayer: true, finishedAt: progress === 100 ? elapsed : undefined };
    return [player, ...racers.filter((racer) => racer.id !== playerId)].sort((a, b) => {
      if (a.finishedAt && b.finishedAt) return a.finishedAt - b.finishedAt;
      if (a.finishedAt) return -1;
      if (b.finishedAt) return 1;
      return b.progress - a.progress || b.wpm - a.wpm || b.accuracy - a.accuracy;
    });
  })();
  const position = standings.findIndex((racer) => racer.id === playerId) + 1;

  useEffect(() => () => { if (channelRef.current && supabase) void supabase.removeChannel(channelRef.current); }, []);

  useEffect(() => {
    if (connected && channelRef.current) void channelRef.current.track({ name: playerName, avatarIndex: selectedAvatar });
  }, [connected, playerName, selectedAvatar]);

  useEffect(() => {
    if (status !== 'racing') return undefined;
    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
      if (mode === 'quick') {
        setRacers((current) => current.map((racer) => {
          if (racer.progress >= 100) return racer;
          const cpu = cpuProfiles.find((item) => item.id === racer.id);
          const levelSpeed = [0.72, 1, 1.32, 1.75, 2.35][raceLevel - 1] ?? 2.35;
          const difficultySpeed = difficulty === 'Easy' ? 0.7 : difficulty === 'Hard' ? 1.15 : difficulty === 'Expert' ? 1.3 : 1;
          const next = Math.min(100, racer.progress + (cpu?.speed ?? 0.1) * difficultySpeed * levelSpeed);
          return { ...racer, progress: next, wpm: Math.round((cpu?.speed ?? 0.1) * 440 * difficultySpeed * levelSpeed), accuracy: 94 + (racer.id.length % 5), finishedAt: next === 100 ? (Date.now() - raceStart.current) / 1000 : undefined };
        }));
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [difficulty, mode, raceLevel, status]);

  useEffect(() => {
    if (status !== 'racing' || mode !== 'friends' || !channelRef.current) return;
    void channelRef.current.send({ type: 'broadcast', event: 'progress', payload: { id: playerId, name: playerName, progress, wpm, accuracy, avatarIndex: selectedAvatar, finishedAt: progress === 100 ? elapsed : undefined } });
  }, [accuracy, elapsed, mode, playerId, playerName, progress, selectedAvatar, status, wpm]);

  useEffect(() => {
    if (status !== 'racing') return;
    if (mode === 'quick' && typed === text) {
      setEndedIn(elapsed);
      setStatus('finished');
    }
    if (mode === 'friends' && (elapsed >= FRIEND_RACE_SECONDS || (typed === text && racers.every((racer) => racer.progress >= 100)))) {
      setEndedIn(Math.min(elapsed, FRIEND_RACE_SECONDS));
      setStatus('finished');
    }
  }, [elapsed, mode, racers, status, text, typed]);

  useEffect(() => {
    if (status !== 'finished' || rewarded.current) return;
    rewarded.current = true;
    const earnedXp = Math.max(40, 170 - (position - 1) * 35);
    const totalXp = profile.totalXp + earnedXp;
    updateProfile({ ...profile, totalXp, coins: profile.coins + Math.max(10, 55 - position * 10), level: getLevel(totalXp), currentRank: getRank(totalXp).name });
  }, [position, profile, status, updateProfile]);

  const resetRace = () => {
    setTyped('');
    setErrors(0);
    setCountdown(3);
    setStatus('lobby');
    setEndedIn(null);
    rewarded.current = false;
    if (mode === 'quick') setRacers([]);
  };

  const leaveRoom = async (message = '') => {
    const channel = channelRef.current;
    channelRef.current = null;
    if (channel && supabase) {
      await channel.untrack();
      await supabase.removeChannel(channel);
    }
    setConnected(false);
    setIsHost(false);
    setMode('quick');
    setRacers([]);
    setRoomCode(makeRoomCode());
    setJoinCode('');
    setRoomError(message);
  };

  const kickPlayer = (racer: Racer) => {
    if (!isHost || !channelRef.current) return;
    void channelRef.current.send({ type: 'broadcast', event: 'kick', payload: { id: racer.id } });
  };

  const beginCountdown = (remote = false) => {
    setTyped('');
    setErrors(0);
    setEndedIn(null);
    setEndedIn(null);
    setCountdown(3);
    setStatus('countdown');
    if (!remote && mode === 'friends') void channelRef.current?.send({ type: 'broadcast', event: 'start', payload: { difficulty, language } });
    let remaining = 3;
    const timer = window.setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        window.clearInterval(timer);
        raceStart.current = Date.now();
        setStatus('racing');
      }
    }, 1000);
  };

  const startQuickRace = (level = 1) => {
    setMode('quick');
    setRaceLevel(level);
    setTyped('');
    setErrors(0);
    rewarded.current = false;
    setRacers(cpuProfiles.map((cpu, index) => ({ id: cpu.id, name: cpu.name, progress: 0, wpm: 0, accuracy: 100, avatarIndex: index + 1 })));
    beginCountdown();
  };

  const connectRoom = (code: string, host: boolean) => {
    if (!supabase || !code) return;
    if (channelRef.current) void supabase.removeChannel(channelRef.current);
    const normalizedCode = code.toUpperCase();
    setRoomCode(normalizedCode);
    setMode('friends');
    setIsHost(host);
    setRacers([]);
    setRoomError('');
    const channel = supabase.channel(`typerush-race-${normalizedCode}`, { config: { presence: { key: playerId } } });
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<{ name: string; avatarIndex: number }>();
        // A presence key can temporarily contain several metas when track() is
        // called again (for example after choosing another avatar). It is still
        // one browser/player, so only render its latest presence entry.
        const present = Object.entries(state).flatMap(([id, entries]) => {
          const entry = entries[entries.length - 1];
          return entry ? [{ id, name: entry.name, progress: 0, wpm: 0, accuracy: 100, avatarIndex: entry.avatarIndex }] : [];
        });
        if (present.length > 5) setRoomError('Room is full. Private rooms allow a maximum of 5 players.');
        setRacers((current) => present.filter((racer) => racer.id !== playerId).map((racer) => current.find((item) => item.id === racer.id) ?? racer));
      })
      .on('broadcast', { event: 'progress' }, ({ payload }) => setRacers((current) => [...current.filter((racer) => racer.id !== payload.id), payload as Racer]))
      .on('broadcast', { event: 'start' }, ({ payload }) => {
        setDifficulty(payload.difficulty as Difficulty);
        setLanguage(payload.language as TestLanguage);
        beginCountdown(true);
      })
      .on('broadcast', { event: 'kick' }, ({ payload }) => {
        if (payload.id === playerId) void leaveRoom('You were removed from the lobby by the host.');
      })
      .subscribe((state) => {
        if (state === 'SUBSCRIBED') {
          setConnected(true);
        }
      });
    channelRef.current = channel;
  };

  const handleTyping = (value: string) => {
    if (status !== 'racing') return;
    const next = value.slice(0, text.length);
    if (next.length < typed.length) {
      setTyped(next);
      return;
    }
    if (next === text.slice(0, next.length)) {
      setTyped(next);
      return;
    }
    setErrors((current) => current + 1);
  };

  if (status === 'lobby') {
    return (
      <div className="grid gap-5">
        <Card className="bg-gradient-to-br from-rush-blue/10 via-rush-ink to-rush-green/10">
          <div className="grid items-center gap-5 md:grid-cols-[1fr_360px]">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-rush-green"><Flag className="h-4 w-4" /> TypeRush Live Race</p>
              <h1 className="mt-1 text-3xl font-black text-white">Race the world, one key at a time.</h1>
              <p className="mt-2 text-slate-300">Choose one ninja here. The same character races in Quick Race and Friend Rooms.</p>
            </div>
            <AvatarPicker selected={selectedAvatar} onSelect={setSelectedAvatar} />
          </div>
        </Card>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <Zap className="h-9 w-9 text-rush-green" />
            <h2 className="mt-3 text-2xl font-black text-white">Quick Race</h2>
            <p className="mt-1 text-slate-400">Instant TypeRacer-style match against three simulated racers.</p>
            <RaceOptions difficulty={difficulty} language={language} setDifficulty={setDifficulty} setLanguage={setLanguage} />
            <Button className="mt-5 w-full" onClick={() => startQuickRace(1)} icon={<Play className="h-5 w-5" />}>Start Level 1</Button>
          </Card>
          <Card>
            <Users className="h-9 w-9 text-rush-blue" />
            <h2 className="mt-3 text-2xl font-black text-white">Race Friends</h2>
            <p className="mt-1 text-slate-400">Create a private live room or enter a friend's room code.</p>
            <label className="mt-5 grid gap-2 text-sm font-bold">Your nickname
              <input className="rounded-lg border border-white/10 bg-rush-ink px-4 py-3" maxLength={20} placeholder="Enter nickname before joining" disabled={connected} value={nickname} onChange={(event) => setNickname(event.target.value)} />
            </label>
            {isSupabaseConfigured ? (
              <>
                {roomError && !connected && <p className="mt-4 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-200">{roomError}</p>}
                <Button className="mt-5 w-full" variant="secondary" disabled={!nickname.trim()} onClick={() => connectRoom(makeRoomCode(), true)} icon={<Link2 className="h-5 w-5" />}>Create Private Room</Button>
                <div className="mt-3 flex gap-2">
                  <input className="min-w-0 flex-1 rounded-lg border border-white/10 bg-rush-ink px-4 font-mono uppercase" maxLength={5} placeholder="ROOM CODE" value={joinCode} onChange={(event) => setJoinCode(event.target.value.toUpperCase())} />
                  <Button variant="ghost" disabled={joinCode.length < 5 || !nickname.trim()} onClick={() => connectRoom(joinCode, false)}>Join</Button>
                </div>
              </>
            ) : <p className="mt-5 rounded-lg border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">Add Supabase keys to enable real friend rooms. Quick Race is fully playable now.</p>}
          </Card>
        </div>
        {connected && mode === 'friends' && (
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div><p className="text-sm text-slate-400">Private room</p><p className="font-mono text-3xl font-black text-white">{roomCode}</p></div>
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" icon={<Copy className="h-4 w-4" />} onClick={() => void navigator.clipboard.writeText(roomCode)}>Copy Code</Button>
                <Button variant="ghost" icon={<LogOut className="h-4 w-4" />} onClick={() => void leaveRoom()}>Leave Lobby</Button>
              </div>
            </div>
            <p className="mt-4 font-bold text-rush-green">{racers.length + 1} racer(s) connected</p>
            {roomError && <p className="mt-3 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-200">{roomError}</p>}
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {[{ id: playerId, name: playerName, avatarIndex: selectedAvatar, isPlayer: true }, ...racers].slice(0, 5).map((racer) => <LobbyPlayer key={racer.id} name={racer.name} avatarIndex={racer.avatarIndex ?? 0} isPlayer={racer.isPlayer} onKick={isHost && !racer.isPlayer ? () => kickPlayer(racer as Racer) : undefined} />)}
            </div>
            {isHost ? <><RaceOptions difficulty={difficulty} language={language} setDifficulty={setDifficulty} setLanguage={setLanguage} /><p className="mt-4 text-sm text-slate-400">Timed race: {FRIEND_RACE_SECONDS} seconds · 2–5 players · Top 4 ranking</p><Button className="mt-3" disabled={racers.length + 1 < 2 || racers.length + 1 > 5} onClick={() => beginCountdown()}>Play ({racers.length + 1}/5)</Button>{racers.length === 0 && <p className="mt-2 text-xs text-amber-200">Waiting for at least one friend to join.</p>}</> : <p className="mt-4 text-slate-300">Waiting for the host to press Play…</p>}
          </Card>
        )}
      </div>
    );
  }

  if (status === 'countdown') return <Card className="grid min-h-[60vh] place-items-center text-center"><div><p className="text-lg font-bold text-slate-400">Get ready</p><p className="text-8xl font-black text-rush-green">{countdown || 'GO!'}</p></div></Card>;

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><p className="text-sm font-bold text-rush-green">{mode === 'friends' ? `Room ${roomCode}` : `Quick Race · Level ${raceLevel}/5`}</p><h1 className="text-3xl font-black text-white">{status === 'finished' ? `Finished #${position}` : `Current position #${position}`}</h1></div>
          <div className="flex gap-4 text-sm font-black"><span>{wpm} WPM</span><span className="text-rush-blue">{accuracy}% accuracy</span><span className="text-rose-300">{errors} errors</span>{mode === 'friends' && <span className="text-amber-300">{friendTimeLeft}s left</span>}</div>
        </div>
      </Card>
      <Card>
        <div className="grid gap-4">
          {standings.map((racer, index) => <RaceLane key={racer.id} racer={racer} position={index + 1} />)}
        </div>
      </Card>
      <Card>
        <ProgressBar value={progress} label="Race progress" />
        <div className="mt-5 rounded-lg bg-rush-ink p-5 font-mono text-lg leading-9">
          {text.split('').map((char, index) => {
            const typedChar = typed[index];
            const state = typedChar === undefined ? 'text-slate-500' : typedChar === char ? 'text-rush-green' : 'bg-rose-500/30 text-rose-100';
            return <span key={`${char}-${index}`} className={`${state} ${index === typed.length ? 'border-b-2 border-rush-green' : ''}`}>{char}</span>;
          })}
        </div>
        <textarea autoFocus autoComplete="off" aria-label="Race typing input" className="mt-4 min-h-28 w-full rounded-lg border border-white/10 bg-white/5 p-4 font-mono outline-none focus:border-rush-green" disabled={status === 'finished' || (mode === 'friends' && typed === text)} onPaste={(event) => event.preventDefault()} value={typed} onChange={(event) => handleTyping(event.target.value)} />
        {status === 'finished' && mode === 'quick' && (
          <div className={`mt-5 rounded-lg border p-5 text-center ${position === 1 ? 'border-rush-green/30 bg-rush-green/10' : 'border-rose-400/30 bg-rose-500/10'}`}>
            <Trophy className={`mx-auto h-10 w-10 ${position === 1 ? 'text-amber-300' : 'text-slate-400'}`} />
            <h2 className="mt-2 text-2xl font-black text-white">{position === 1 ? (raceLevel === 5 ? 'Congratulations! TypeRush Champion!' : `Congratulations! Level ${raceLevel} cleared!`) : `Finished #${position} - Level ${raceLevel} not cleared`}</h2>
            <p className="mt-2 text-slate-300">{wpm} WPM · {accuracy}% accuracy · {errors} errors</p>
            <p className="mt-1 text-sm text-slate-400">{position === 1 && raceLevel < 5 ? `Level ${raceLevel + 1} unlocks faster opponents.` : position === 1 ? 'You defeated the fastest Level 5 rivals.' : 'Improve your rhythm and retry this level.'}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {position === 1 && raceLevel < 5 && <Button onClick={() => startQuickRace(raceLevel + 1)} icon={<Play className="h-4 w-4" />}>Next Level {raceLevel + 1}</Button>}
              <Button variant={position === 1 && raceLevel < 5 ? 'ghost' : 'primary'} onClick={() => startQuickRace(raceLevel)} icon={<RotateCcw className="h-4 w-4" />}>Retry Level</Button>
              <Button variant="ghost" onClick={resetRace}>Back to Lobby</Button>
            </div>
          </div>
        )}
        {status === 'finished' && mode === 'friends' && <div className="mt-5 rounded-lg border border-rush-green/20 bg-rush-green/10 p-5"><div className="text-center"><Trophy className="mx-auto h-10 w-10 text-amber-300" /><h2 className="mt-2 text-2xl font-black text-white">Friend Race Results</h2><p className="text-slate-300">Champion: {standings[0]?.name} · ranked by completed text, progress, and speed</p></div><div className="mx-auto mt-4 grid max-w-2xl gap-2">{standings.slice(0, 4).map((racer, index) => <div key={racer.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-rush-ink/70 p-3"><span className="font-black text-white">{index === 0 ? '🏆' : `#${index + 1}`} {racer.name}{racer.isPlayer ? ' (You)' : ''}</span><span className="text-sm text-slate-300">{Math.round(racer.progress)}% · {racer.wpm} WPM</span></div>)}</div><div className="mt-4 text-center"><Button onClick={resetRace} icon={<RotateCcw className="h-4 w-4" />}>Back to Lobby</Button></div></div>}
      </Card>
    </div>
  );
}

function RaceOptions({ difficulty, language, setDifficulty, setLanguage }: { difficulty: Difficulty; language: TestLanguage; setDifficulty: (value: Difficulty) => void; setLanguage: (value: TestLanguage) => void }) {
  return <div className="mt-5 grid grid-cols-2 gap-3"><label className="grid gap-2 text-sm font-bold">Difficulty<select className="rounded-lg border border-white/10 bg-rush-ink px-3 py-3" value={difficulty} onChange={(event) => setDifficulty(event.target.value as Difficulty)}>{(['Easy', 'Medium', 'Hard', 'Expert'] as Difficulty[]).map((item) => <option key={item}>{item}</option>)}</select></label><label className="grid gap-2 text-sm font-bold">Language<select className="rounded-lg border border-white/10 bg-rush-ink px-3 py-3" value={language} onChange={(event) => setLanguage(event.target.value as TestLanguage)}>{(['English', 'Filipino', 'Cebuano'] as TestLanguage[]).map((item) => <option key={item}>{item}</option>)}</select></label></div>;
}

function RaceLane({ racer, position }: { racer: Racer; position: number }) {
  const avatarIndex = racer.avatarIndex ?? (racer.isPlayer ? 0 : ((position - 1) % 3) + 1);
  const positions = ['0% 0%', '100% 0%', '0% 100%', '100% 100%'];
  return <div><div className="mb-1 flex justify-between text-sm"><span className={`font-bold ${racer.isPlayer ? 'text-rush-green' : 'text-white'}`}>#{position} {racer.name}{racer.isPlayer ? ' (You)' : ''}</span><span className="text-slate-400"><Gauge className="mr-1 inline h-4 w-4" />{racer.wpm} WPM · {Math.round(racer.progress)}%</span></div><div className="relative h-14 overflow-hidden rounded-lg border border-white/10 bg-white/5"><div className="absolute bottom-0 top-0 right-4 w-px bg-rush-green/40" /><div className={`absolute top-1 h-12 w-12 overflow-hidden rounded-full border-2 transition-[left] duration-100 ${racer.isPlayer ? 'border-rush-green shadow-glow' : 'border-rush-blue shadow-blueGlow'}`} style={{ left: `calc(${Math.max(4, Math.min(racer.progress, 96))}% - 1.5rem)`, backgroundImage: "url('/assets/ninja-racers.png')", backgroundSize: '200% 200%', backgroundPosition: positions[avatarIndex] }}><span className="sr-only">{racer.name} ninja racer</span></div></div></div>;
}

function LobbyPlayer({ name, avatarIndex, isPlayer = false, onKick }: { name: string; avatarIndex: number; isPlayer?: boolean; onKick?: () => void }) {
  const positions = ['0% 0%', '100% 0%', '0% 100%', '100% 100%'];
  return <div className={`flex items-center gap-3 rounded-lg border p-3 ${isPlayer ? 'border-rush-green/40 bg-rush-green/10' : 'border-white/10 bg-white/5'}`}><span className="h-11 w-11 shrink-0 rounded-full border border-white/20 bg-cover" style={{ backgroundImage: "url('/assets/ninja-racers.png')", backgroundSize: '200% 200%', backgroundPosition: positions[avatarIndex] ?? positions[0] }} /><div className="min-w-0 flex-1"><p className="truncate font-bold text-white">{name}</p><p className="text-xs text-slate-400">{isPlayer ? 'You' : 'Ready'}</p></div>{onKick && <button type="button" title={`Kick ${name}`} aria-label={`Kick ${name} from lobby`} onClick={onKick} className="focus-ring rounded-lg border border-rose-400/30 bg-rose-500/10 p-2 text-rose-300 transition hover:bg-rose-500/20"><UserX className="h-4 w-4" /></button>}</div>;
}

function AvatarPicker({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  const names = ['Wind Ninja', 'Lightning Ninja', 'Fire Ninja', 'Shadow Ninja'];
  const positions = ['0% 0%', '100% 0%', '0% 100%', '100% 100%'];
  return (
    <div className="mt-5 md:mt-0">
      <p className="mb-2 text-sm font-bold text-slate-200">Choose Your Ninja</p>
      <div className="grid grid-cols-4 gap-2">
        {positions.map((backgroundPosition, index) => (
          <button key={names[index]} type="button" title={names[index]} aria-label={names[index]} aria-pressed={selected === index} onClick={() => onSelect(index)} className={`focus-ring rounded-lg border p-1.5 transition ${selected === index ? 'border-rush-green bg-rush-green/15 shadow-glow' : 'border-white/10 bg-white/5 hover:border-rush-blue/60'}`}>
            <span className="mx-auto block aspect-square w-full max-w-16 rounded-full bg-cover" style={{ backgroundImage: "url('/assets/ninja-racers.png')", backgroundSize: '200% 200%', backgroundPosition }} />
            <span className="mt-1 block truncate text-[10px] font-bold text-slate-300">{names[index].replace(' Ninja', '')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
