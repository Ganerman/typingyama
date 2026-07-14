import type { Rank } from '../types';

export const ranks: Rank[] = [
  { name: 'Beginner', minXp: 0, color: 'from-slate-400 to-slate-200' },
  { name: 'Bronze', minXp: 500, color: 'from-amber-700 to-orange-300' },
  { name: 'Silver', minXp: 1500, color: 'from-slate-300 to-white' },
  { name: 'Gold', minXp: 3000, color: 'from-yellow-400 to-amber-200' },
  { name: 'Platinum', minXp: 6000, color: 'from-cyan-300 to-slate-100' },
  { name: 'Diamond', minXp: 10000, color: 'from-sky-400 to-fuchsia-300' },
  { name: 'Master', minXp: 20000, color: 'from-violet-400 to-rush-blue' },
  { name: 'Grandmaster', minXp: 35000, color: 'from-rush-green to-rush-purple' },
  { name: 'Typing Legend', minXp: 50000, color: 'from-rush-green via-rush-blue to-rush-purple' },
];
