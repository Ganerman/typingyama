import { ranks } from '../data/ranks';
import type { Rank } from '../types';
import { getTypingEngine } from '../lib/typingEngine';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const calculateWpm = (correctCharacters: number, elapsedSeconds: number): number => {
  const engine = getTypingEngine();
  if (engine) return engine.calculate_wpm(correctCharacters, elapsedSeconds);
  if (correctCharacters <= 0 || elapsedSeconds <= 0) return 0;
  return Math.round((correctCharacters / 5 / (elapsedSeconds / 60)) * 10) / 10;
};

export const calculateRawWpm = (totalCharacters: number, elapsedSeconds: number): number => {
  const engine = getTypingEngine();
  if (engine) return engine.calculate_raw_wpm(totalCharacters, elapsedSeconds);
  if (totalCharacters <= 0 || elapsedSeconds <= 0) return 0;
  return Math.round((totalCharacters / 5 / (elapsedSeconds / 60)) * 10) / 10;
};

export const calculateAccuracy = (correctCharacters: number, totalTypedCharacters: number): number => {
  const engine = getTypingEngine();
  if (engine) return engine.calculate_accuracy(correctCharacters, totalTypedCharacters);
  if (correctCharacters <= 0 || totalTypedCharacters <= 0) return 0;
  return Math.round(clamp((correctCharacters / totalTypedCharacters) * 100, 0, 100) * 10) / 10;
};

export const calculateXp = (wpm: number, accuracy: number, duration: number, difficultyMultiplier = 1): number => {
  const engine = getTypingEngine();
  if (engine) return engine.calculate_xp(wpm, accuracy, duration, difficultyMultiplier);
  if (wpm <= 0 || accuracy <= 0 || duration <= 0) return 0;
  return Math.max(5, Math.round((wpm * (accuracy / 100) + duration / 10) * difficultyMultiplier));
};

export const getLevel = (xp: number): number => {
  const engine = getTypingEngine();
  return engine ? engine.calculate_level(xp) : Math.max(1, Math.floor(Math.sqrt(Math.max(0, xp) / 120)) + 1);
};

export const getRank = (xp: number): Rank => {
  const safeXp = Math.max(0, xp);
  return [...ranks].reverse().find((rank) => safeXp >= rank.minXp) ?? ranks[0];
};

export const getNextRank = (xp: number): Rank | undefined => ranks.find((rank) => rank.minXp > xp);

export const getRankProgress = (xp: number): number => {
  const rank = getRank(xp);
  const nextRank = getNextRank(xp);
  if (!nextRank) return 100;
  return Math.round(clamp(((xp - rank.minXp) / (nextRank.minXp - rank.minXp)) * 100, 0, 100));
};

export const detectPersonalBest = (wpm: number, bestWpm: number): boolean => {
  const engine = getTypingEngine();
  return engine ? Boolean(engine.is_personal_best(wpm, bestWpm)) : wpm > bestWpm;
};
