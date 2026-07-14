import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-rush-green text-rush-ink shadow-glow hover:bg-emerald-300',
  secondary: 'border border-rush-blue/50 bg-rush-blue/10 text-sky-100 hover:bg-rush-blue/20',
  ghost: 'border border-white/10 bg-white/5 text-slate-100 hover:bg-white/10',
  danger: 'border border-rose-400/50 bg-rose-500/10 text-rose-100 hover:bg-rose-500/20',
};

export function Button({ className = '', variant = 'primary', icon, children, ...props }: ButtonProps) {
  return (
    <button
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
