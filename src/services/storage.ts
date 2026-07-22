import type { TypingResult, UserProfile } from '../types';

const resultsKey = 'typerush-results';
const profileKey = 'typerush-profile';
const dailyKey = 'typerush-daily-progress';

export interface DailyProgress {
  completedDate: string | null;
  lastPlayedDate: string | null;
  streak: number;
  longestStreak: number;
  bestWpm: number;
  bestAccuracy: number;
}

const emptyDailyProgress: DailyProgress = {
  completedDate: null,
  lastPlayedDate: null,
  streak: 0,
  longestStreak: 0,
  bestWpm: 0,
  bestAccuracy: 0,
};

export const getLocalResults = (): TypingResult[] => {
  const raw = localStorage.getItem(resultsKey);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as TypingResult[];
  } catch {
    return [];
  }
};

export const saveLocalResult = (result: TypingResult): void => {
  localStorage.setItem(resultsKey, JSON.stringify([result, ...getLocalResults()].slice(0, 50)));
};

export const getLocalProfile = <T extends UserProfile>(fallback: T): T => {
  const raw = localStorage.getItem(profileKey);
  if (!raw) return fallback;
  try {
    return { ...fallback, ...(JSON.parse(raw) as Partial<T>) };
  } catch {
    return fallback;
  }
};

export const saveLocalProfile = (profile: UserProfile): void => {
  localStorage.setItem(profileKey, JSON.stringify(profile));
};

export const getDailyProgress = (): DailyProgress => {
  const raw = localStorage.getItem(dailyKey);
  if (!raw) return emptyDailyProgress;
  try {
    return { ...emptyDailyProgress, ...(JSON.parse(raw) as Partial<DailyProgress>) };
  } catch {
    return emptyDailyProgress;
  }
};

export const saveDailyProgress = (progress: DailyProgress): void => {
  localStorage.setItem(dailyKey, JSON.stringify(progress));
};
