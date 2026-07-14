import type { TypingResult, UserProfile } from '../types';

const resultsKey = 'typerush-results';
const profileKey = 'typerush-profile';

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
