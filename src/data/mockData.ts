import { Award, Flame, Medal, Rocket, ShieldCheck, Trophy, Zap } from 'lucide-react';
import type { Achievement, Activity, LeaderboardEntry, UserProfile } from '../types';

export const currentUser: UserProfile = {
  id: 'demo-user',
  username: 'rushpilot',
  fullName: 'Demo Student',
  avatarUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=TypeRush',
  bio: 'Practicing cleaner typing for school, projects, and late-night bug fixing.',
  school: 'TypeRush Academy',
  country: 'Philippines',
  totalXp: 7420,
  coins: 1180,
  level: 8,
  currentRank: 'Platinum',
  currentStreak: 9,
  longestStreak: 21,
  bestWpm: 92,
  averageWpm: 68,
  bestAccuracy: 98.7,
  totalTests: 136,
};

export const activities: Activity[] = [
  { id: 'a1', mode: 'Classic', date: 'Today', detail: '60s Expert English', wpm: 84, accuracy: 97.2, xp: 98 },
  { id: 'a2', mode: 'Race', date: 'Yesterday', detail: 'Won against 3 CPU racers', wpm: 79, accuracy: 95.4, xp: 120 },
  { id: 'a3', mode: 'Word Rain', date: '2 days ago', detail: 'Reached level 7', wpm: 71, accuracy: 93.8, xp: 88 },
  { id: 'a4', mode: 'Code', date: '3 days ago', detail: 'TypeScript snippet', wpm: 55, accuracy: 96.1, xp: 82 },
];

export const weeklyProgress = [
  { day: 'Mon', wpm: 62, accuracy: 93 },
  { day: 'Tue', wpm: 65, accuracy: 94 },
  { day: 'Wed', wpm: 68, accuracy: 95 },
  { day: 'Thu', wpm: 66, accuracy: 96 },
  { day: 'Fri', wpm: 74, accuracy: 95 },
  { day: 'Sat', wpm: 80, accuracy: 97 },
  { day: 'Sun', wpm: 84, accuracy: 98 },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, username: 'syntaxace', avatarUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=syntaxace', rankBadge: 'Typing Legend', score: 48200, wpm: 121, accuracy: 99.1, country: 'PH' },
  { rank: 2, username: 'keynova', avatarUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=keynova', rankBadge: 'Grandmaster', score: 36780, wpm: 113, accuracy: 98.4, country: 'US' },
  { rank: 3, username: 'byteblade', avatarUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=byteblade', rankBadge: 'Master', score: 24120, wpm: 104, accuracy: 97.9, country: 'JP' },
  { rank: 4, username: 'rushpilot', avatarUrl: currentUser.avatarUrl, rankBadge: 'Platinum', score: 7420, wpm: 92, accuracy: 98.7, country: 'PH', isCurrentUser: true },
  { rank: 5, username: 'capslockzero', avatarUrl: 'https://api.dicebear.com/9.x/shapes/svg?seed=capslockzero', rankBadge: 'Gold', score: 6110, wpm: 88, accuracy: 96.8, country: 'CA' },
];

export const achievements: Achievement[] = [
  { id: 'first-test', name: 'First Test', description: 'Complete your first typing test.', icon: Rocket, xpReward: 25, requirementType: 'tests_completed', requirementValue: 1, unlockedAt: '2026-07-01' },
  { id: 'speed-starter', name: 'Speed Starter', description: 'Reach 30 WPM in any mode.', icon: Zap, xpReward: 50, requirementType: 'wpm', requirementValue: 30, unlockedAt: '2026-07-02' },
  { id: 'reach-50', name: 'Reach 50 WPM', description: 'Break the 50 WPM barrier.', icon: Flame, xpReward: 80, requirementType: 'wpm', requirementValue: 50, unlockedAt: '2026-07-04' },
  { id: 'perfect', name: 'Perfect Accuracy', description: 'Finish a test at 100% accuracy.', icon: ShieldCheck, xpReward: 150, requirementType: 'accuracy', requirementValue: 100 },
  { id: 'race-champion', name: 'Race Champion', description: 'Win 10 typing races.', icon: Trophy, xpReward: 200, requirementType: 'race_wins', requirementValue: 10 },
  { id: 'daily-winner', name: 'Daily Challenge Winner', description: 'Complete the daily challenge.', icon: Medal, xpReward: 120, requirementType: 'daily_challenge', requirementValue: 1 },
  { id: 'legend-path', name: 'Typing Legend', description: 'Reach 50,000 XP.', icon: Award, xpReward: 500, requirementType: 'xp', requirementValue: 50000 },
];
