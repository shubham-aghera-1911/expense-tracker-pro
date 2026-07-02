import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import GlassCard from '../components/GlassCard';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseFormModal from '../components/ExpenseFormModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import { useCurrency } from '../context/CurrencyContext';

const CATEGORIES = [
  'All', 'Food & Dining', 'Transportation', 'Housing', 'Utilities', 'Entertainment',
  'Healthcare', 'Shopping', 'Education', 'Travel', 'Groceries', 'Insurance', 'Investments', 'Other',
];

export default function Expenses() {
  const { displayCurrency } = useCurrency();
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/expenses', {
        params: { page, limit: 10, category, search: search || undefined },
      });
      setExpenses(data.data.expenses);
      setPagination(data.data.pagination);
    } catch (err) {
      toast.error('Could not load expenses');
    } finally {
      setLoading(false);
    }
  }, [page, category, search]);

  useEffect(() => {
    const timeout = setTimeout(loadExpenses, 250);
    return () => clearTimeout(timeout);
  }, [loadExpenses]);

  const handleAddOrEdit = async (payload) => {
    if (editing) {
      await api.put(`/expenses/${editing._id}`, payload);
      toast.success('Expense updated');
    } else {
      await api.post('/expenses', payload);
      toast.success('Expense added');
    }
    setEditing(null);
    loadExpenses();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/expenses/${deleteTarget._id}`);
      toast.success('Expense deleted');
      setDeleteTarget(null);
      loadExpenses();
    } catch (err) {
      toast.error('Could not delete expense');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Expenses</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{pagination.total} total transactions</p>
        </div>
        <button
          onClick={() => { setEditing(null); setFormOpen(true); }}
          className="focus-ring flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:opacity-90 transition-opacity self-start"
        >
          <Plus size={16} /> Add Expense
        </button>
      </div>

      <GlassCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search expenses..."
              className="focus-ring w-full rounded-xl glass pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-500"
            />
          </div>
          <div className="relative sm:w-56">
            <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="focus-ring w-full rounded-xl glass pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-white [&>option]:bg-[#1a0b2e] [&>option]:text-white appearance-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-4 sm:p-5">
        <ExpenseTable
          expenses={expenses}
          loading={loading}
          onEdit={(exp) => { setEditing(exp); setFormOpen(true); }}
          onDelete={(exp) => setDeleteTarget(exp)}
        />

        {!loading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="focus-ring rounded-lg glass p-2 text-slate-600 dark:text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="focus-ring rounded-lg glass p-2 text-slate-600 dark:text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </GlassCard>

      <ExpenseFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleAddOrEdit}
        initialData={editing}
        defaultCurrency={displayCurrency}
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        itemLabel={deleteTarget?.title}
      />
    </div>
  );
}
