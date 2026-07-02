import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Spinner } from './Loader';

export default function ConfirmDeleteModal({ open, onCancel, onConfirm, loading, itemLabel = 'this expense' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-strong w-full max-w-sm rounded-2xl p-6 shadow-glass-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-300 mb-4">
              <AlertTriangle size={20} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1.5">Delete {itemLabel}?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">This action can't be undone. Are you sure you want to proceed?</p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="focus-ring flex-1 rounded-xl glass px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="focus-ring flex-1 flex items-center justify-center gap-2 rounded-xl bg-rose-500/90 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-500 transition-colors disabled:opacity-60"
              >
                {loading ? <Spinner size={16} /> : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
