import type { LucideIcon } from 'lucide-react';

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';
export type TestLanguage = 'English' | 'Filipino' | 'Cebuano';
export type GameMode =
  | 'Classic'
  | 'Race'
  | 'Word Rain'
  | 'Boss Battle'
  | 'Code'
  | 'Student'
  | 'Daily Challenge';

export interface Rank {
  name: string;
  minXp: number;
  color: string;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  school: string;
  country: string;
  totalXp: number;
  coins: number;
  level: number;
  currentRank: string;
  currentStreak: number;
  longestStreak: number;
  bestWpm: number;
  averageWpm: number;
  bestAccuracy: number;
  totalTests: number;
}

export interface TypingResult {
  mode: GameMode;
  difficulty: Difficulty;
  language: TestLanguage;
  duration: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctCharacters: number;
  incorrectCharacters: number;
  totalCharacters: number;
  xpEarned: number;
  passed: boolean;
  completedAt: string;
  speedSeries: Array<{ second: number; wpm: number }>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  xpReward: number;
  requirementType: string;
  requirementValue: number;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatarUrl: string;
  rankBadge: string;
  score: number;
  wpm: number;
  accuracy: number;
  country: string;
  isCurrentUser?: boolean;
}

export interface Activity {
  id: string;
  mode: GameMode;
  date: string;
  detail: string;
  wpm: number;
  accuracy: number;
  xp: number;
}
