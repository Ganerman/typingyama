import { ranks } from '../../data/ranks';

export function RankBadge({ rank }: { rank: string }) {
  const found = ranks.find((item) => item.name === rank) ?? ranks[0];
  return (
    <span className={`inline-flex rounded-md bg-gradient-to-r ${found.color} px-2.5 py-1 text-xs font-black text-rush-ink`}>
      {rank}
    </span>
  );
}
