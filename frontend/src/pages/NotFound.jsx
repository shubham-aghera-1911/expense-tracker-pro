import { Link } from 'react-router-dom';
import { CompassIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="app-bg min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-300 mb-5">
        <CompassIcon size={28} />
      </div>
      <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2">Page not found</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">The page you're looking for doesn't exist or was moved.</p>
      <Link to="/" className="focus-ring rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:opacity-90 transition-opacity">
        Go home
      </Link>
    </div>
  );
}
