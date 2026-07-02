import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Spinner } from './Loader';
import { CURRENCIES } from '../utils/currencies';

const CATEGORIES = [
  'Food & Dining', 'Transportation', 'Housing', 'Utilities', 'Entertainment',
  'Healthcare', 'Shopping', 'Education', 'Travel', 'Groceries', 'Insurance', 'Investments', 'Other',
];
const PAYMENT_METHODS = ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Wallet', 'Other'];

const emptyForm = {
  title: '',
  amount: '',
  currency: 'INR',
  category: 'Other',
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: 'Card',
  note: '',
};

export default function ExpenseFormModal({ open, onClose, onSubmit, initialData, defaultCurrency }) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          title: initialData.title || '',
          amount: initialData.amount ?? '',
          currency: initialData.currency || defaultCurrency || 'INR',
          category: initialData.category || 'Other',
          date: initialData.date ? initialData.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
          paymentMethod: initialData.paymentMethod || 'Card',
          note: initialData.note || '',
        });
      } else {
        setForm({ ...emptyForm, currency: defaultCurrency || 'INR' });
      }
      setErrors({});
    }
  }, [open, initialData, defaultCurrency]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 overflow-y-auto"
          onClick={onClose}
        >
          <motion.form
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="glass-strong my-auto w-full max-w-lg rounded-2xl p-6 shadow-glass-lg"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{initialData ? 'Edit Expense' : 'Add Expense'}</h3>
              <button type="button" onClick={onClose} className="focus-ring rounded-lg p-1.5 text-slate-600 dark:text-slate-300 hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => field('title', e.target.value)}
                  placeholder="e.g. Grocery shopping"
                  className="focus-ring w-full rounded-xl glass px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500"
                />
                {errors.title && <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.amount}
                    onChange={(e) => field('amount', e.target.value)}
                    placeholder="0.00"
                    className="focus-ring w-full rounded-xl glass px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500"
                  />
                  {errors.amount && <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">{errors.amount}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => field('currency', e.target.value)}
                    className="focus-ring w-full rounded-xl glass px-3.5 py-2.5 text-sm text-slate-900 dark:text-white [&>option]:bg-[#1a0b2e] [&>option]:text-white"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => field('category', e.target.value)}
                    className="focus-ring w-full rounded-xl glass px-3.5 py-2.5 text-sm text-slate-900 dark:text-white [&>option]:bg-[#1a0b2e] [&>option]:text-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Payment Method</label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => field('paymentMethod', e.target.value)}
                    className="focus-ring w-full rounded-xl glass px-3.5 py-2.5 text-sm text-slate-900 dark:text-white [&>option]:bg-[#1a0b2e] [&>option]:text-white"
                  >
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => field('date', e.target.value)}
                  className="focus-ring w-full rounded-xl glass px-3.5 py-2.5 text-sm text-slate-900 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
                />
                {errors.date && <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">Note (optional)</label>
                <textarea
                  value={form.note}
                  onChange={(e) => field('note', e.target.value)}
                  rows={2}
                  placeholder="Any extra details..."
                  className="focus-ring w-full resize-none rounded-xl glass px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="focus-ring flex-1 rounded-xl glass px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="focus-ring flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? <Spinner size={16} /> : initialData ? 'Save Changes' : 'Add Expense'}
              </button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
