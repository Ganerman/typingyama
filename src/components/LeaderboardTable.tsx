import type { LeaderboardEntry } from '../types';
import { RankBadge } from './ui/RankBadge';

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="text-xs uppercase text-slate-400">
          <tr>
            <th className="px-3 py-3">Rank</th>
            <th className="px-3 py-3">User</th>
            <th className="px-3 py-3">Badge</th>
            <th className="px-3 py-3">Score</th>
            <th className="px-3 py-3">WPM</th>
            <th className="px-3 py-3">Accuracy</th>
            <th className="px-3 py-3">Country</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.username} className={`border-t border-white/10 ${entry.isCurrentUser ? 'bg-rush-green/10' : ''}`}>
              <td className="px-3 py-3 font-black text-rush-green">#{entry.rank}</td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-3">
                  <img src={entry.avatarUrl} alt="" className="h-9 w-9 rounded-lg bg-white/10" />
                  <span className="font-bold text-white">{entry.username}</span>
                </div>
              </td>
              <td className="px-3 py-3"><RankBadge rank={entry.rankBadge} /></td>
              <td className="px-3 py-3">{entry.score.toLocaleString()}</td>
              <td className="px-3 py-3">{entry.wpm}</td>
              <td className="px-3 py-3">{entry.accuracy}%</td>
              <td className="px-3 py-3">{entry.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
