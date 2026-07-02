import { Menu, Sun, Moon, LogOut, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CurrencySwitcher from './CurrencySwitcher';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (user?.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 glass border-b border-white/10 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="focus-ring rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-white/10 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="truncate font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{title}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <CurrencySwitcher compact />

          <button
            onClick={toggleTheme}
            className="focus-ring rounded-xl glass p-2.5 text-slate-800 dark:text-slate-200 hover:bg-white/10 transition-colors"
            aria-label="Toggle dark mode"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? 'moon' : 'sun'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="block"
              >
                {isDark ? <Moon size={17} /> : <Sun size={17} />}
              </motion.span>
            </AnimatePresence>
          </button>

          <div className="relative" ref={ref}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="focus-ring flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-mint-500 text-sm font-bold text-white shadow-glow"
            >
              {initials}
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl glass-strong shadow-glass-lg p-1"
                >
                  <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                    className="focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-800 dark:text-slate-200 hover:bg-white/10"
                  >
                    <User size={15} /> Profile & Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 dark:text-rose-300 hover:bg-rose-500/10"
                  >
                    <LogOut size={15} /> Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
