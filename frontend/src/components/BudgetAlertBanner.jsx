import { AlertTriangle, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Shows a banner when spend crosses 80% (warning) or 100% (danger) of the
// overall monthly budget. Silent when no budget is set or usage is healthy.
export default function BudgetAlertBanner({ percentUsed, limit, currencyLabel }) {
  if (!limit || limit <= 0) return null;
  if (percentUsed < 80) return null;

  const isOver = percentUsed >= 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`glass rounded-2xl border p-4 flex items-start gap-3 ${
          isOver ? 'border-rose-400/40' : 'border-amber-400/40'
        }`}
      >
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isOver ? 'bg-rose-500/20 text-rose-600 dark:text-rose-300' : 'bg-amber-500/20 text-amber-600 dark:text-amber-300'}`}>
          {isOver ? <AlertTriangle size={18} /> : <TrendingUp size={18} />}
        </div>
        <div>
          <p className={`text-sm font-semibold ${isOver ? 'text-rose-600 dark:text-rose-300' : 'text-amber-600 dark:text-amber-300'}`}>
            {isOver ? "You've exceeded your monthly budget" : 'Approaching your monthly budget'}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            You've used {percentUsed}% of your {currencyLabel} budget this month. {isOver ? 'Consider reviewing your spending.' : 'Keep an eye on your remaining spend.'}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
