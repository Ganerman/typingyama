import { Gauge, Pause, Play, RotateCcw, Target, Timer, Trophy, Zap } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { codeSnippets, studentLessons } from '../data/typingTexts';

const runningTexts = [
  'connected network',
  'correct program syntax',
  'reliable database system',
  'efficient search algorithm',
  'protected student portal',
  'responsive web application',
  'clean and readable code',
  'fast accurate typing',
  'computer hardware device',
  'operating system update',
  'secure user password',
  'wireless internet connection',
  'local area network',
  'central processing unit',
  'random access memory',
  'solid state storage',
  'graphics processing unit',
  'keyboard input device',
  'digital information system',
  'software development process',
  'object oriented programming',
  'structured query language',
  'hypertext markup language',
  'cascading style sheets',
  'javascript event listener',
  'python programming language',
  'version control repository',
  'command line interface',
  'application programming interface',
  'frontend user interface',
  'backend server logic',
  'cloud computing service',
  'virtual machine instance',
  'encrypted data transfer',
  'two factor authentication',
  'network security firewall',
  'malware detection software',
  'automatic file backup',
  'system recovery point',
  'database primary key',
  'database foreign key',
  'normalized table structure',
  'server request response',
  'domain name system',
  'internet protocol address',
  'dynamic host configuration',
  'router packet forwarding',
  'network switch connection',
  'fiber optic cable',
  'responsive mobile layout',
  'accessible website design',
  'semantic page structure',
  'browser developer tools',
  'source code compiler',
  'runtime error message',
  'logical condition statement',
  'reusable program function',
  'array data collection',
  'loop control structure',
  'software testing method',
  'debugging code issue',
  'data science workflow',
  'machine learning model',
  'artificial intelligence system',
  'large language model',
  'data visualization chart',
  'spreadsheet formula function',
  'computer science student',
  'information technology support',
  'cybersecurity risk assessment',
  'digital privacy protection',
  'open source project',
  'collaborative coding platform',
  'continuous software improvement',
  'accurate technical documentation',
  'professional typing skill',
];

const HITS_PER_LEVEL = 5;
const MAX_CHASE_LEVEL = 10;
const CHASE_HIT_GOAL = HITS_PER_LEVEL * MAX_CHASE_LEVEL;
type ChaseDifficulty = 'Beginner' | 'Normal' | 'Expert' | 'Pro';
const chaseDifficulties: Record<ChaseDifficulty, { multiplier: number; description: string }> = {
  Beginner: { multiplier: 0.55, description: 'Slow and relaxed' },
  Normal: { multiplier: 1, description: 'Standard speed' },
  Expert: { multiplier: 1.35, description: 'Fast challenge' },
  Pro: { multiplier: 1.75, description: 'Extreme speed' },
};

export function RacePage() {
  const [typed, setTyped] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const text = 'Typing races reward steady rhythm, clean corrections, and pressure-proof accuracy.';
  const progress = Math.min(100, (typed.length / text.length) * 100);
  const opponents = [
    { name: 'CPU Nova', progress: Math.min(96, progress * 0.88 + 12) },
    { name: 'CPU Bolt', progress: Math.min(92, progress * 0.75 + 18) },
    { name: 'CPU Byte', progress: Math.min(86, progress * 0.68 + 8) },
  ];
  const position = 1 + opponents.filter((opponent) => opponent.progress > progress).length;

  return (
    <div className="grid gap-5">
      <Card>
        <p className="text-sm font-bold text-rush-green">Single-player Race</p>
        <h1 className="text-3xl font-black text-white">Beat the CPU racers.</h1>
      </Card>
      <Card>
        <label className="grid max-w-xs gap-2 text-sm font-bold">Difficulty
          <select className="rounded-lg border border-white/10 bg-rush-ink px-3 py-3" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            {['Easy', 'Medium', 'Hard', 'Expert'].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <div className="mt-6 grid gap-5">
          <RaceLane name="You" progress={progress} active />
          {opponents.map((opponent) => <RaceLane key={opponent.name} name={opponent.name} progress={opponent.progress} />)}
        </div>
        <p className="mt-5 rounded-lg bg-white/5 p-4 font-mono text-slate-300">{text}</p>
        <textarea className="mt-4 min-h-28 w-full rounded-lg border border-white/10 bg-white/5 p-4" value={typed} onChange={(event) => setTyped(event.target.value.slice(0, text.length))} />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="font-black text-rush-green">Position #{position}</p>
          <p className="text-slate-300">{Math.round(progress)}% complete · {difficulty}</p>
          {progress >= 100 && <p className="font-black text-rush-blue">Race won. +140 XP +60 coins</p>}
        </div>
      </Card>
    </div>
  );
}

function RaceLane({ name, progress, active = false }: { name: string; progress: number; active?: boolean }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm"><span className="font-bold">{name}</span><span>{Math.round(progress)}%</span></div>
      <div className="relative h-12 rounded-lg border border-white/10 bg-white/5">
        <div className={`absolute top-2 grid h-8 w-12 place-items-center rounded-md transition-all ${active ? 'bg-rush-green text-rush-ink' : 'bg-rush-blue/70 text-white'}`} style={{ left: `calc(${Math.min(progress, 96)}% - 2rem)` }}>
          <Trophy className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export function WordRainPage() {
  const [difficulty, setDifficulty] = useState<ChaseDifficulty>('Beginner');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [paused, setPaused] = useState(false);
  const [targetIndex, setTargetIndex] = useState(0);
  const [runnerProgress, setRunnerProgress] = useState(8);
  const [misses, setMisses] = useState(0);
  const [hits, setHits] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const target = runningTexts[targetIndex % runningTexts.length];
  const combo = Math.max(1, Math.floor(score / 80) + 1);
  const level = Math.min(MAX_CHASE_LEVEL, Math.floor(hits / HITS_PER_LEVEL) + 1);
  const runnerSpeed = (0.38 + level * 0.14) * chaseDifficulties[difficulty].multiplier;
  const chaserProgress = Math.min(96, 8 + (input.length / target.length) * 88);
  const runnerTranslate = Math.max(0, Math.min(100, ((runnerProgress - 8) / 88) * 100));
  const chaserTranslate = Math.max(0, Math.min(100, ((chaserProgress - 8) / 88) * 100));
  const completedRounds = hits + misses;
  const finalAccuracy = completedRounds > 0 ? Math.round((hits / completedRounds) * 100) : 0;
  const passed = hits >= CHASE_HIT_GOAL && misses <= 2 && finalAccuracy >= 70;

  const advanceRound = useCallback((wasHit: boolean) => {
    if (wasHit) {
      setHits((current) => {
        const next = current + 1;
        if (next >= CHASE_HIT_GOAL) {
          setFinished(true);
          setPaused(true);
        }
        return next;
      });
    } else {
      setMisses((current) => current + 1);
      setLives((currentLives) => Math.max(0, currentLives - 1));
    }

    setInput('');
    setRunnerProgress(8);

    setTargetIndex((currentTarget) => currentTarget + 1);
  }, []);

  useEffect(() => {
    if (!started || paused || lives <= 0 || finished) return undefined;

    const interval = window.setInterval(() => {
      setRunnerProgress((current) => {
        const next = current + runnerSpeed / 2;
        if (next < 96) return next;

        advanceRound(false);
        return 8;
      });
    }, 40);

    return () => window.clearInterval(interval);
  }, [advanceRound, finished, lives, paused, runnerSpeed, started]);

  const type = (value: string) => {
    const nextInput = value.toLowerCase();
    setInput(nextInput);

    if (nextInput.trim() === target) {
      setScore((current) => current + combo * 20);
      advanceRound(true);
    }
  };

  const reset = () => {
    setInput('');
    setScore(0);
    setLives(3);
    setPaused(false);
    setMisses(0);
    setHits(0);
    setStarted(false);
    setFinished(false);
    setTargetIndex(0);
    setRunnerProgress(8);
  };

  return (
    <div className="grid gap-5">
      <Card>
        <p className="text-sm font-bold text-rush-green">Typing Chase</p>
        <h1 className="text-3xl font-black text-white">Apasa ang modagan nga word.</h1>
      </Card>
      <Card>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <label className="grid w-full max-w-sm gap-2 text-sm font-bold">Difficulty
            <select className="rounded-lg border border-white/10 bg-rush-ink px-3 py-3" disabled={started} value={difficulty} onChange={(event) => setDifficulty(event.target.value as ChaseDifficulty)}>
              {(Object.keys(chaseDifficulties) as ChaseDifficulty[]).map((item) => <option key={item} value={item}>{item} — {chaseDifficulties[item].description}</option>)}
            </select>
          </label>
          <p className="rounded-lg border border-rush-green/20 bg-rush-green/10 px-4 py-3 text-sm font-bold text-rush-green">{level < MAX_CHASE_LEVEL ? `${HITS_PER_LEVEL - (hits % HITS_PER_LEVEL)} hits to Level ${level + 1}` : 'Final Level'}</p>
        </div>
        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
          {[['Score', score], ['Lives', lives], ['Combo', `x${combo}`], ['Level', `${level}/${MAX_CHASE_LEVEL}`], ['Hits', hits], ['Misses', misses], ['Goal', `${hits}/${CHASE_HIT_GOAL}`]].map(([label, value]) => <div key={label} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-center"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-0.5 font-black text-white">{value}</p></div>)}
        </div>

        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-rush-ink p-4 sm:p-5">
          <div className="absolute bottom-4 right-4 top-4 w-px bg-rush-green/40 sm:bottom-5 sm:right-5 sm:top-5" />
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
            Type the word to catch it before it reaches the finish line
          </p>

          <div className="relative h-20 rounded-lg border border-white/10 bg-white/[0.03]">
            <span className="absolute left-3 top-3 text-xs font-bold text-slate-500">Target</span>
            <span
              className="absolute top-9 inline-flex max-w-[85%] items-center gap-2 whitespace-nowrap rounded-lg bg-rush-blue px-3 py-2 font-mono text-sm font-black text-rush-ink shadow-blueGlow transition-[left,transform] duration-75 ease-linear will-change-transform sm:px-4 sm:text-base"
              style={{ left: `${runnerProgress}%`, transform: `translateX(-${runnerTranslate}%)` }}
            >
              <Zap className="h-4 w-4" />
              {target}
            </span>
          </div>

          <div className="relative mt-3 h-20 rounded-lg border border-white/10 bg-white/[0.03]">
            <span className="absolute left-3 top-3 text-xs font-bold text-slate-500">User</span>
            <span
              className="absolute top-9 inline-flex max-w-[85%] items-center gap-2 whitespace-nowrap rounded-lg bg-rush-green px-3 py-2 text-sm font-black text-rush-ink shadow-glow transition-[left,transform] duration-100 ease-out will-change-transform sm:px-4 sm:text-base"
              style={{ left: `${chaserProgress}%`, transform: `translateX(-${chaserTranslate}%)` }}
            >
              <Target className="h-4 w-4" />
              {input || 'type'}
            </span>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs font-bold text-slate-400">
              <span>Catch progress</span>
              <span>{Math.round((input.length / target.length) * 100)}%</span>
            </div>
            <ProgressBar value={(input.length / target.length) * 100} />
          </div>
        </div>

        <input
          aria-label="Type the running word"
          autoComplete="off"
          className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 p-4 font-mono text-lg"
          disabled={!started || paused || lives <= 0 || finished}
          placeholder={started ? `Type "${target}"` : 'Click Start first'}
          value={input}
          onChange={(event) => type(event.target.value)}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <Button disabled={started && !paused} onClick={() => { setStarted(true); setPaused(false); }} icon={<Play className="h-5 w-5" />}>Start</Button>
          <Button variant="secondary" disabled={!started || finished} onClick={() => setPaused((current) => !current)} icon={paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}>{paused ? 'Resume' : 'Pause'}</Button>
          <Button variant="ghost" onClick={reset} icon={<RotateCcw className="h-5 w-5" />}>Reset</Button>
          <Button
            variant="danger"
            disabled={!started || finished}
            onClick={() => {
              advanceRound(false);
            }}
          >
            Miss Word
          </Button>
        </div>
        {(finished || lives <= 0) && (
          <div className={`mt-4 rounded-lg border p-5 ${passed ? 'border-rush-green/40 bg-rush-green/10' : 'border-rose-400/40 bg-rose-500/10'}`}>
            <p className={`text-xl font-black ${passed ? 'text-rush-green' : 'text-rose-100'}`}>
              {passed ? 'PASAR KA' : 'WALA PA NAKA PASAR'}
            </p>
            <div className="mt-3 grid gap-2 text-sm text-slate-200 md:grid-cols-4">
              <p>Final score: <strong>{score}</strong></p>
              <p>Hits: <strong>{hits}</strong></p>
              <p>Misses: <strong>{misses}</strong></p>
              <p>Accuracy: <strong>{finalAccuracy}%</strong></p>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Level increases every {HITS_PER_LEVEL} hits. Reach {CHASE_HIT_GOAL} hits to complete Level {MAX_CHASE_LEVEL}.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

export function CodeModePage() {
  const languages = Object.keys(codeSnippets) as Array<keyof typeof codeSnippets>;
  const [language, setLanguage] = useState<keyof typeof codeSnippets>('TypeScript');
  const [typed, setTyped] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedIn, setFinishedIn] = useState<number | null>(null);
  const [timeLimit, setTimeLimit] = useState(60);
  const [failed, setFailed] = useState(false);
  const [failureReason, setFailureReason] = useState<'timeout' | 'errors' | null>(null);
  const [, setClockTick] = useState(0);
  const snippet = codeSnippets[language];
  const correct = typed.split('').filter((char, index) => char === snippet[index]).length;
  const progress = Math.min(100, (typed.length / snippet.length) * 100);
  const elapsed = finishedIn ?? (startedAt ? (Date.now() - startedAt) / 1000 : 0);
  const remaining = Math.max(0, timeLimit - elapsed);
  const accuracy = typed.length ? Math.round((correct / typed.length) * 100) : 100;
  const wpm = elapsed > 0 ? Math.round((correct / 5 / (elapsed / 60)) * 10) / 10 : 0;
  const completed = finishedIn !== null;

  useEffect(() => {
    if (!startedAt || completed) return undefined;
    const timer = window.setInterval(() => {
      const currentElapsed = (Date.now() - startedAt) / 1000;
      setClockTick((current) => current + 1);
      if (currentElapsed >= timeLimit) {
        setFinishedIn(timeLimit);
        setFailed(true);
        setFailureReason('timeout');
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [completed, startedAt, timeLimit]);

  const reset = (nextLanguage = language) => {
    setLanguage(nextLanguage);
    setTyped('');
    setStartedAt(null);
    setFinishedIn(null);
    setFailed(false);
    setFailureReason(null);
  };

  const handleCodeTyping = (value: string) => {
    if (completed) return;
    const next = value.slice(0, snippet.length);
    const startTime = startedAt ?? Date.now();
    if (!startedAt && next.length > 0) setStartedAt(startTime);
    setTyped(next);
    if (next.length >= snippet.length) {
      setFinishedIn((Date.now() - startTime) / 1000);
      const hasErrors = next !== snippet;
      setFailed(hasErrors);
      setFailureReason(hasErrors ? 'errors' : null);
    }
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}.${Math.floor((seconds % 1) * 10)}`;

  return (
    <div className="grid gap-5">
      <Card>
        <p className="text-sm font-bold text-rush-green">Code Typing Mode</p>
        <h1 className="text-3xl font-black text-white">Practice syntax without editing the source.</h1>
      </Card>
      <Card>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap gap-3">
          <label className="grid gap-2 text-sm font-bold">Programming language
        <select className="rounded-lg border border-white/10 bg-rush-ink px-3 py-3" disabled={Boolean(startedAt) && !completed} value={language} onChange={(event) => reset(event.target.value as keyof typeof codeSnippets)}>
          {languages.map((item) => <option key={item}>{item}</option>)}
        </select>
          </label>
          <label className="grid gap-2 text-sm font-bold">Time limit
            <select className="rounded-lg border border-white/10 bg-rush-ink px-3 py-3" disabled={Boolean(startedAt) && !completed} value={timeLimit} onChange={(event) => { setTimeLimit(Number(event.target.value)); reset(); }}>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={180}>3 minutes</option>
            </select>
          </label>
          </div>
          <Button variant="ghost" onClick={() => reset()} icon={<RotateCcw className="h-4 w-4" />}>Restart</Button>
        </div>
        <div className="mb-4 grid gap-3 sm:grid-cols-4">
          <p className={`rounded-lg border border-white/10 bg-white/5 p-3 font-black ${remaining <= 10 && startedAt ? 'text-rose-300' : 'text-rush-blue'}`}><Timer className="mr-2 inline h-5 w-5" />{formatTime(remaining)} left</p>
          <p className="rounded-lg border border-white/10 bg-white/5 p-3 font-black text-rush-green"><Gauge className="mr-2 inline h-5 w-5" />{wpm} WPM</p>
          <p className="rounded-lg border border-white/10 bg-white/5 p-3 font-black">{accuracy}% accuracy</p>
          <p className="rounded-lg border border-white/10 bg-white/5 p-3 font-black">{Math.round(progress)}% done</p>
        </div>
        <pre className="overflow-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-rush-ink p-5 font-mono"><code>{snippet.split('').map((char, index) => { const typedChar = typed[index]; const color = typedChar === undefined ? 'text-slate-400' : typedChar === char ? 'text-rush-green' : 'bg-rose-500/30 text-rose-200'; return <span key={`${char}-${index}`} className={`${color} ${index === typed.length ? 'border-b-2 border-rush-green' : ''}`}>{char}</span>; })}</code></pre>
        <textarea autoFocus spellCheck={false} className="mt-4 min-h-36 w-full rounded-lg border border-white/10 bg-white/5 p-4 font-mono outline-none focus:border-rush-green" disabled={completed} placeholder="Start typing - the stopwatch begins on your first character." value={typed} onChange={(event) => handleCodeTyping(event.target.value)} onPaste={(event) => event.preventDefault()} />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <p>Progress {Math.round(progress)}%</p><p>Correct chars {correct}/{snippet.length}</p><p>Accuracy {accuracy}%</p>
        </div>
        <div className="mt-3"><ProgressBar value={progress} /></div>
        {completed && <div className={`mt-4 rounded-lg border p-5 text-center ${failed ? 'border-rose-400/30 bg-rose-500/10' : 'border-rush-green/30 bg-rush-green/10'}`}><Trophy className={`mx-auto h-8 w-8 ${failed ? 'text-rose-300' : 'text-amber-300'}`} /><h2 className="mt-2 text-2xl font-black text-white">{failureReason === 'timeout' ? `Time is up - ${formatTime(timeLimit)} limit reached` : failureReason === 'errors' ? 'Code finished, but it has typing errors' : `Perfect code completed in ${formatTime(finishedIn)}`}</h2><p className="mt-1 text-slate-300">{failureReason === 'timeout' ? `You completed ${Math.round(progress)}%. Try again and finish before the countdown ends.` : failureReason === 'errors' ? `${correct}/${snippet.length} characters correct · ${accuracy}% accuracy. You need 100% exact code to pass.` : `${wpm} WPM · 100% accuracy · ${correct}/${snippet.length} correct characters`}</p><Button className="mt-4" onClick={() => reset()} icon={<RotateCcw className="h-4 w-4" />}>Try Again</Button></div>}
      </Card>
    </div>
  );
}

export function StudentModePage() {
  const [level, setLevel] = useState('Beginner');
  const lessons = useMemo(() => studentLessons.filter((lesson) => lesson.level === level), [level]);
  return (
    <div className="grid gap-5">
      <Card>
        <p className="text-sm font-bold text-rush-green">Student Typing Mode</p>
        <h1 className="text-3xl font-black text-white">Academic paragraphs for practical typing.</h1>
      </Card>
      <div className="flex flex-wrap gap-2">{['Beginner', 'Intermediate', 'Advanced'].map((item) => <Button key={item} variant={level === item ? 'primary' : 'ghost'} onClick={() => setLevel(item)}>{item}</Button>)}</div>
      <section className="grid gap-4 md:grid-cols-2">
        {lessons.map((lesson) => <Card key={lesson.topic}><p className="text-sm text-rush-green">{lesson.topic}</p><h2 className="mt-2 text-xl font-black text-white">{lesson.level}</h2><p className="mt-3 leading-7 text-slate-300">{lesson.text}</p></Card>)}
      </section>
    </div>
  );
}
