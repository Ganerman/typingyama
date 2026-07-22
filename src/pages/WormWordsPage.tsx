import { Bug, Clock3, Pause, Play, RotateCcw, Sparkles, Trophy } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { saveLocalResult } from '../services/storage';
import type { TypingResult } from '../types';

type Bonus = '2L' | '2W' | '3W' | '+5' | null;
type Tile = { id: number; letter: string; bonus: Bonus };

const ROUND_SECONDS = 60;
const BOARD_SIZE = 5;
const initialLetters = 'CATSEDOGRAPINLTBUSOEMAPRD'.split('');
const vowels = 'AAAAAAEEEEEEEEIIIIIOOOOOUU';
const consonants = 'BBBBCCCDDDFFGGGHHHLLLMMMNNNNNPPQRRRRRSSSSSSTTTTTTVWXY';
const validWords = new Set([
  'ace', 'act', 'age', 'ago', 'air', 'ant', 'ape', 'apt', 'arc', 'are', 'art', 'ate', 'bad', 'bag', 'bar', 'bat',
  'bed', 'bee', 'big', 'bit', 'boat', 'bug', 'bus', 'can', 'cap', 'car', 'card', 'care', 'cat', 'cats', 'code', 'coin',
  'day', 'deal', 'dear', 'dig', 'dog', 'dogs', 'ear', 'eat', 'far', 'fast', 'game', 'gas', 'get', 'goat', 'good', 'hat',
  'ice', 'idea', 'lap', 'late', 'lead', 'learn', 'leg', 'let', 'line', 'map', 'mate', 'near', 'net', 'note', 'one',
  'pad', 'pan', 'pen', 'pet', 'pin', 'pins', 'rain', 'rat', 'rate', 'read', 'red', 'road', 'run', 'sea', 'seat',
  'set', 'sit', 'star', 'sun', 'tag', 'tap', 'tea', 'team', 'ten', 'test', 'tie', 'tin', 'toe', 'top', 'train',
  'use', 'van', 'war', 'wet', 'win', 'word', 'worm', 'write', 'ako', 'asa', 'ato', 'bata', 'balay', 'basa', 'dula',
  'gahi', 'game', 'ikaw', 'kaon', 'kusog', 'mata', 'paspas', 'sakto', 'sulat', 'tudlo', 'uban', 'wala',
]);

const letterPoints: Record<string, number> = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
};

const randomLetter = () => {
  const source = Math.random() < 0.4 ? vowels : consonants;
  return source[Math.floor(Math.random() * source.length)];
};

const randomBonus = (): Bonus => {
  const roll = Math.random();
  if (roll < 0.04) return '+5';
  if (roll < 0.09) return '3W';
  if (roll < 0.17) return '2W';
  if (roll < 0.28) return '2L';
  return null;
};

const createBoard = (): Tile[] => Array.from({ length: 25 }, (_, index) => ({
  id: index,
  letter: initialLetters[index],
  bonus: index === 6 ? '2L' : index === 13 ? '+5' : index === 18 ? '2W' : index === 22 ? '3W' : null,
}));

const adjacent = (first: number, second: number) => {
  const rowDistance = Math.abs(Math.floor(first / BOARD_SIZE) - Math.floor(second / BOARD_SIZE));
  const columnDistance = Math.abs((first % BOARD_SIZE) - (second % BOARD_SIZE));
  return rowDistance <= 1 && columnDistance <= 1 && first !== second;
};

export function WormWordsPage() {
  const { profile, updateProfile } = useAuth();
  const [board, setBoard] = useState(() => createBoard());
  const [selected, setSelected] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [found, setFound] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [notice, setNotice] = useState('Pilia ang magkadikit nga letters aron makahimo og word.');
  const dragging = useRef(false);
  const awarded = useRef(false);
  const currentWord = useMemo(() => selected.map((index) => board[index].letter).join(''), [board, selected]);
  const trailPoints = useMemo(() => selected.map((index) => {
    const x = (index % BOARD_SIZE) * 20 + 10;
    const y = Math.floor(index / BOARD_SIZE) * 20 + 10;
    return `${x},${y}`;
  }).join(' '), [selected]);
  const accuracy = attempts ? Math.round((found.length / attempts) * 100) : 100;
  const bestScore = Number(localStorage.getItem('typerush-worm-best') || 0);

  const finishGame = () => {
    if (awarded.current) return;
    awarded.current = true;
    setFinished(true);
    setPaused(false);
    const xp = Math.min(250, Math.floor(score / 3) + found.length * 3);
    const result: TypingResult = {
      mode: 'Worm Words', difficulty: 'Medium', language: 'English', duration: ROUND_SECONDS,
      wpm: found.length, rawWpm: score, accuracy, correctCharacters: found.join('').length,
      incorrectCharacters: Math.max(0, attempts - found.length), totalCharacters: attempts,
      xpEarned: xp, passed: score > 0, completedAt: new Date().toISOString(), speedSeries: [], score, wordsFound: found.length,
    };
    saveLocalResult(result);
    localStorage.setItem('typerush-worm-best', String(Math.max(bestScore, score)));
    updateProfile({ ...profile, totalXp: profile.totalXp + xp, coins: profile.coins + Math.floor(score / 20), totalTests: profile.totalTests + 1 });
  };

  useEffect(() => {
    if (!started || paused || finished) return undefined;
    const timer = window.setInterval(() => setTimeLeft((value) => {
      if (value <= 1) {
        window.setTimeout(finishGame, 0);
        return 0;
      }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  });

  useEffect(() => {
    const releaseSelection = () => {
      if (!dragging.current) return;
      dragging.current = false;
      submitWord();
    };
    window.addEventListener('pointerup', releaseSelection);
    window.addEventListener('pointercancel', releaseSelection);
    return () => {
      window.removeEventListener('pointerup', releaseSelection);
      window.removeEventListener('pointercancel', releaseSelection);
    };
  });

  const selectTile = (index: number) => {
    if (!started || paused || finished) return;
    setSelected((current) => {
      const existingIndex = current.indexOf(index);
      if (existingIndex === current.length - 2) return current.slice(0, -1);
      if (existingIndex >= 0) return current;
      if (current.length && !adjacent(current[current.length - 1], index)) return current;
      return [...current, index];
    });
  };

  const submitWord = () => {
    if (finished || paused || currentWord.length < 3) {
      setNotice('Kinahanglan minimum 3 ka magkadikit nga letters.');
      return;
    }
    const normalized = currentWord.toLowerCase();
    setAttempts((value) => value + 1);
    if (!validWords.has(normalized)) {
      setNotice(`“${currentWord}” wala sa word list.`);
      setSelected([]);
      return;
    }
    if (found.includes(normalized)) {
      setNotice(`Nagamit na nimo ang “${currentWord}”.`);
      setSelected([]);
      return;
    }

    let wordMultiplier = 1;
    let gained = 0;
    let extraTime = 0;
    selected.forEach((index) => {
      const tile = board[index];
      gained += (letterPoints[tile.letter] || 1) * (tile.bonus === '2L' ? 2 : 1);
      if (tile.bonus === '2W') wordMultiplier *= 2;
      if (tile.bonus === '3W') wordMultiplier *= 3;
      if (tile.bonus === '+5') extraTime += 5;
    });
    gained = gained * wordMultiplier + Math.max(0, currentWord.length - 3) * 2;
    setScore((value) => value + gained);
    setTimeLeft((value) => value + extraTime);
    setFound((words) => [normalized, ...words]);
    setBoard((tiles) => tiles.map((tile, index) => selected.includes(index) ? { ...tile, letter: randomLetter(), bonus: randomBonus() } : tile));
    setNotice(`+${gained} points${extraTime ? ` ug +${extraTime}s` : ''}!`);
    setSelected([]);
  };

  const reset = () => {
    awarded.current = false;
    setBoard(createBoard());
    setSelected([]);
    setScore(0);
    setTimeLeft(ROUND_SECONDS);
    setStarted(false);
    setPaused(false);
    setFinished(false);
    setFound([]);
    setAttempts(0);
    setNotice('Pilia ang magkadikit nga letters aron makahimo og word.');
  };

  return (
    <div className="grid gap-5">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-sm font-bold text-rush-green">TypeRush Arcade</p><h1 className="flex items-center gap-3 text-3xl font-black text-white"><Bug className="h-8 w-8 text-rush-green" />Worm Words</h1><p className="mt-2 text-slate-300">Konektaha ang adjacent letters. Dili pwede balikon ang tile sa usa ka word.</p></div>
          <div className="flex gap-2"><Button disabled={started && !paused} icon={<Play className="h-4 w-4" />} onClick={() => { setStarted(true); setPaused(false); }}>{started ? 'Resume' : 'Start'}</Button><Button variant="ghost" icon={<RotateCcw className="h-4 w-4" />} onClick={reset}>New Board</Button></div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Card>
          <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Score" value={score} color="text-rush-green" />
            <Stat label="Time" value={`${timeLeft}s`} color={timeLeft <= 10 ? 'text-rose-300' : 'text-rush-blue'} />
            <Stat label="Words" value={found.length} color="text-white" />
            <Stat label="Best" value={Math.max(bestScore, score)} color="text-orange-300" />
          </div>

          <div
            className="relative mx-auto grid max-w-xl grid-cols-5 gap-2 touch-none"
            onPointerMove={(event) => {
              if (!dragging.current) return;
              const element = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-tile-index]');
              if (element) selectTile(Number(element.dataset.tileIndex));
            }}
          >
            {selected.length > 0 && (
              <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polyline points={trailPoints} fill="none" stroke="rgba(3, 15, 10, .8)" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                <polyline points={trailPoints} fill="none" stroke="#35f48c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ filter: 'drop-shadow(0 0 5px rgba(53, 244, 140, .95))' }} />
                {selected.map((index, order) => {
                  const x = (index % BOARD_SIZE) * 20 + 10;
                  const y = Math.floor(index / BOARD_SIZE) * 20 + 10;
                  return <circle key={`${index}-${order}`} cx={x} cy={y} r="1.35" fill="#f8fafc" stroke="#35f48c" strokeWidth="0.65" vectorEffect="non-scaling-stroke" />;
                })}
              </svg>
            )}
            {board.map((tile, index) => {
              const order = selected.indexOf(index);
              return <button key={tile.id} data-tile-index={index} type="button" aria-label={`${tile.letter}${tile.bonus ? ` bonus ${tile.bonus}` : ''}`} className={`relative z-10 aspect-square select-none rounded-xl border text-2xl font-black transition sm:text-3xl ${order >= 0 ? 'scale-95 border-rush-green bg-rush-green text-rush-ink shadow-glow' : 'border-white/10 bg-white/5 text-white hover:border-rush-blue/60 hover:bg-white/10'}`} onPointerDown={(event) => { event.preventDefault(); dragging.current = true; selectTile(index); }} onPointerEnter={() => { if (dragging.current) selectTile(index); }}>
                {tile.letter}{tile.bonus && <span className={`absolute right-1 top-1 rounded px-1 text-[9px] font-black sm:right-2 sm:top-2 sm:text-[10px] ${order >= 0 ? 'bg-rush-ink/20' : 'bg-rush-blue/20 text-rush-blue'}`}>{tile.bonus}</span>}{order >= 0 && <span className="absolute bottom-1 left-1 grid h-4 w-4 place-items-center rounded-full bg-rush-ink text-[9px] text-white sm:bottom-2 sm:left-2">{order + 1}</span>}
              </button>;
            })}
          </div>

          <div className="mx-auto mt-5 max-w-xl rounded-xl border border-white/10 bg-rush-ink p-4">
            <p className="min-h-10 break-all text-center font-mono text-3xl font-black tracking-[0.2em] text-rush-green">{currentWord || '...'}</p>
            <p className="mt-2 text-center text-sm text-slate-400">{notice}</p>
            <p className="mt-4 rounded-lg bg-rush-green/10 p-3 text-center text-sm font-bold text-rush-green">Hold ug drag • Balik sa previous tile para undo • Release para auto-submit</p>
            {selected.length > 0 && <Button className="mt-2 w-full" variant="ghost" onClick={() => setSelected([])}>Cancel Selection</Button>}
          </div>
        </Card>

        <div className="grid content-start gap-5">
          <Card><div className="flex items-center justify-between"><h2 className="font-black text-white">Round Controls</h2><Clock3 className="h-5 w-5 text-rush-blue" /></div><Button className="mt-4 w-full" variant="secondary" disabled={!started || finished} icon={paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />} onClick={() => setPaused((value) => !value)}>{paused ? 'Resume' : 'Pause'}</Button><div className="mt-4 grid grid-cols-2 gap-2 text-xs"><Bonus label="2L" text="Double letter" /><Bonus label="2W" text="Double word" /><Bonus label="3W" text="Triple word" /><Bonus label="+5" text="Extra seconds" /></div></Card>
          <Card><h2 className="flex items-center gap-2 font-black text-white"><Sparkles className="h-5 w-5 text-rush-green" />Found Words</h2><div className="mt-3 flex max-h-52 flex-wrap gap-2 overflow-y-auto">{found.length ? found.map((word) => <span key={word} className="rounded-lg bg-rush-green/10 px-2 py-1 text-sm font-bold uppercase text-rush-green">{word}</span>) : <p className="text-sm text-slate-400">Wala pay word. Sulayi ang CAT, DOG, RATE, LATE, PIN, o BUS sa first board.</p>}</div></Card>
          {finished && <Card className="border-rush-green/30 bg-rush-green/10"><Trophy className="h-7 w-7 text-rush-green" /><h2 className="mt-2 text-2xl font-black text-white">Round Complete!</h2><p className="mt-2 text-slate-300">{score} points • {found.length} words • {accuracy}% valid submissions</p><p className="mt-1 text-sm text-rush-green">Reward: +{Math.min(250, Math.floor(score / 3) + found.length * 3)} XP ug +{Math.floor(score / 20)} coins</p><Button className="mt-4 w-full" onClick={reset}>Play Again</Button></Card>}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-center"><p className={`text-2xl font-black ${color}`}>{value}</p><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p></div>;
}

function Bonus({ label, text }: { label: string; text: string }) {
  return <div className="rounded-lg bg-white/5 p-2"><strong className="text-rush-blue">{label}</strong><span className="ml-1 text-slate-400">{text}</span></div>;
}
