import type { LucideIcon } from 'lucide-react';

export function StatCard({ label, value, icon: Icon, accent = 'text-rush-green' }: { label: string; value: string | number; icon: LucideIcon; accent?: string }) {
  return (
    <div className="panel flex items-center gap-3 p-4">
      <div className={`grid h-11 w-11 place-items-center rounded-lg bg-white/10 ${accent}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-xl font-black text-white">{value}</p>
      </div>
    </div>
  );
}
