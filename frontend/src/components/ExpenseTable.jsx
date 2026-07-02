import { motion } from 'framer-motion';
import { Pencil, Trash2, Receipt } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

const CATEGORY_COLORS = {
  'Food & Dining': 'bg-orange-500/15 text-orange-300',
  'Transportation': 'bg-sky-500/15 text-sky-300',
  'Housing': 'bg-violet-500/15 text-violet-300',
  'Utilities': 'bg-amber-500/15 text-amber-600 dark:text-amber-300',
  'Entertainment': 'bg-pink-500/15 text-pink-300',
  'Healthcare': 'bg-rose-500/15 text-rose-600 dark:text-rose-300',
  'Shopping': 'bg-fuchsia-500/15 text-fuchsia-300',
  'Education': 'bg-blue-500/15 text-blue-300',
  'Travel': 'bg-teal-500/15 text-teal-300',
  'Groceries': 'bg-lime-500/15 text-lime-300',
  'Insurance': 'bg-indigo-500/15 text-indigo-300',
  'Investments': 'bg-emerald-500/15 text-emerald-300',
  'Other': 'bg-slate-500/15 text-slate-600 dark:text-slate-300',
};

export default function ExpenseTable({ expenses, onEdit, onDelete, loading }) {
  const { convert, format } = useCurrency();

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="shimmer-bg h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!expenses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-300 mb-4">
          <Receipt size={24} />
        </div>
        <p className="text-slate-800 dark:text-slate-200 font-medium">No expenses yet</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Add your first expense to start tracking.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-left text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, i) => (
              <motion.tr
                key={exp._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-900 dark:text-white">{exp.title}</p>
                  {exp.note && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-xs">{exp.note}</p>}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.Other}`}>
                    {exp.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{exp.paymentMethod}</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900 dark:text-white">
                  {format(convert(exp.amount, exp.currency))}
                  {exp.currency !== undefined && (
                    <span className="block text-[10px] font-normal text-slate-500">orig. {exp.currency} {exp.amount}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onEdit(exp)} className="focus-ring rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-white/10 hover:text-brand-700 dark:hover:text-brand-300 transition-colors" aria-label="Edit">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => onDelete(exp)} className="focus-ring rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-rose-500/10 hover:text-rose-300 transition-colors" aria-label="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {expenses.map((exp, i) => (
          <motion.div
            key={exp._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.3) }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium text-slate-900 dark:text-white truncate">{exp.title}</p>
                <span className={`inline-flex mt-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.Other}`}>
                  {exp.category}
                </span>
              </div>
              <p className="font-semibold text-slate-900 dark:text-white shrink-0">{format(convert(exp.amount, exp.currency))}</p>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400">
              <span>{new Date(exp.date).toLocaleDateString()} · {exp.paymentMethod}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => onEdit(exp)} className="focus-ring rounded-lg p-1.5 hover:bg-white/10 hover:text-brand-700 dark:hover:text-brand-300" aria-label="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => onDelete(exp)} className="focus-ring rounded-lg p-1.5 hover:bg-rose-500/10 hover:text-rose-300" aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
