import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CURRENCIES } from '../utils/currencies';
import { useCurrency } from '../context/CurrencyContext';

export default function CurrencySwitcher({ compact = false }) {
  const { displayCurrency, setDisplayCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = CURRENCIES.find((c) => c.code === displayCurrency) || CURRENCIES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`focus-ring flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 hover:bg-white/10 transition-colors ${compact ? '' : 'min-w-[110px]'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-brand-600 dark:text-brand-300 font-semibold">{current.symbol}</span>
        <span>{current.code}</span>
        <ChevronDown size={14} className={`ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            role="listbox"
            className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-xl glass-menu shadow-glass-lg p-1"
          >
            {CURRENCIES.map((c) => (
              <li key={c.code}>
                <button
                  onClick={() => {
                    setDisplayCurrency(c.code);
                    setOpen(false);
                  }}
                  className="focus-ring flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-900 dark:text-slate-100 hover:bg-white/10 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-6 text-brand-600 dark:text-brand-300 font-semibold">{c.symbol}</span>
                    <span>{c.name}</span>
                  </span>
                  {c.code === displayCurrency && <Check size={14} className="text-mint-400" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
