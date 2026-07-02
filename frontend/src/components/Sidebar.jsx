import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Settings, Wallet, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/reports', label: 'Reports', icon: PieChart },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function NavItems({ onNavigate }) {
  return (
    <nav className="flex flex-1 flex-col gap-1.5 px-3">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `focus-ring group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${
              isActive
                ? 'bg-gradient-to-r from-brand-600/80 to-brand-500/60 text-white shadow-glow'
                : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/8 hover:text-slate-900 dark:hover:text-white'
            }`
          }
        >
          <Icon size={18} strokeWidth={2} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-20 border-r border-white/10">
      <div className="glass-strong flex h-full flex-col py-6">
        <div className="flex items-center gap-2.5 px-5 pb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-mint-500 shadow-glow">
            <Wallet size={18} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold text-slate-900 dark:text-white tracking-tight">Expense<span className="text-gradient">Pro</span></span>
        </div>
        <NavItems />
        <div className="px-5 pt-6 mt-auto">
          <div className="glass rounded-xl p-3 text-xs text-slate-500 dark:text-slate-400">
            Track smarter. Spend wiser.
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileSidebar({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed inset-y-0 left-0 z-50 w-72 glass-strong lg:hidden flex flex-col py-6"
          >
            <div className="flex items-center justify-between px-5 pb-8">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-mint-500 shadow-glow">
                  <Wallet size={18} className="text-white" />
                </div>
                <span className="font-display text-lg font-bold text-slate-900 dark:text-white">Expense<span className="text-gradient">Pro</span></span>
              </div>
              <button onClick={onClose} className="focus-ring rounded-lg p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white/10">
                <X size={20} />
              </button>
            </div>
            <NavItems onNavigate={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
