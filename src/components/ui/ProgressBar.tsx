export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const safeValue = Math.min(Math.max(value, 0), 100);
  return (
    <div aria-label={label} aria-valuenow={safeValue} className="h-2 w-full rounded-full bg-white/10" role="progressbar">
      <div
        className="h-full rounded-full bg-gradient-to-r from-rush-green via-rush-blue to-rush-purple transition-all"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}
