import { Keyboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="focus-ring inline-flex items-center gap-2 rounded-lg">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-rush-green text-rush-ink shadow-glow">
        <Keyboard className="h-5 w-5" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-lg font-black leading-5 text-white">TypeRush</span>
        <span className="text-xs font-semibold text-rush-green">Type Fast. Rank Higher.</span>
      </span>
    </Link>
  );
}
