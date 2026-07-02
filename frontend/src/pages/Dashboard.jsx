import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Receipt, Target, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import GlassCard from '../components/GlassCard';
import { SkeletonBlock } from '../components/Loader';
import BudgetAlertBanner from '../components/BudgetAlertBanner';
import ExpenseFormModal from '../components/ExpenseFormModal';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import toast from 'react-hot-toast';

const statCard = (icon, label, value, accent) => (
  <GlassCard hover className="p-5">
    <div className="flex items-center justify-between mb-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>{icon}</div>
    </div>
    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
    <p className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1 truncate">{value}</p>
  </GlassCard>
);

export default function Dashboard() {
  const { user } = useAuth();
  const { format, convert, displayCurrency } = useCurrency();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [budget, setBudget] = useState(null);
  const [trend, setTrend] = useState([]);
  const [recent, setRecent] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryRes, budgetRes, trendRes, recentRes] = await Promise.all([
        api.get('/expenses/meta/summary', { params: { currency: displayCurrency } }),
        api.get('/budgets', { params: {} }),
        api.get('/reports/trend', { params: { months: 6, currency: displayCurrency } }),
        api.get('/expenses', { params: { limit: 5, sortBy: 'date', order: 'desc' } }),
      ]);
      setSummary(summaryRes.data.data);
      setBudget(budgetRes.data.data);
      setTrend(trendRes.data.data.trend);
      setRecent(recentRes.data.data.expenses);
    } catch (err) {
      toast.error('Could not load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [displayCurrency]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = async (payload) => {
    await api.post('/expenses', payload);
    toast.success('Expense added');
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Hey {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Here's what's happening with your money.</p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="focus-ring flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:opacity-90 transition-opacity self-start"
        >
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {!loading && budget && (
        <BudgetAlertBanner percentUsed={budget.overall.percentUsed} limit={budget.overall.limit} currencyLabel={displayCurrency} />
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-28" />)
        ) : (
          <>
            {statCard(<TrendingUp size={18} className="text-brand-600 dark:text-brand-300" />, 'This month', format(summary?.totalThisMonth || 0), 'bg-brand-500/15')}
            {statCard(<Receipt size={18} className="text-mint-600 dark:text-mint-300" />, 'Transactions', summary?.expenseCount ?? 0, 'bg-mint-500/15')}
            {statCard(<Target size={18} className="text-amber-600 dark:text-amber-300" />, 'Monthly budget', budget?.overall.limit ? format(budget.overall.limit) : 'Not set', 'bg-amber-500/15')}
            {statCard(<Wallet size={18} className="text-pink-300" />, 'Budget used', budget?.overall.limit ? `${budget.overall.percentUsed}%` : '—', 'bg-pink-500/15')}
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <GlassCard className="lg:col-span-3 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Spending trend</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Last 6 months</p>
          {loading ? <SkeletonBlock className="h-64" /> : <MonthlyTrendChart data={trend} />}
        </GlassCard>

        <GlassCard className="lg:col-span-2 p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">By category</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">This month</p>
          {loading ? <SkeletonBlock className="h-64" /> : <CategoryPieChart data={summary?.byCategory} />}
        </GlassCard>
      </div>

      <GlassCard className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recent expenses</h3>
          <button onClick={() => navigate('/expenses')} className="focus-ring text-xs font-semibold text-brand-600 dark:text-brand-300 hover:text-brand-800 dark:hover:text-brand-200">
            View all
          </button>
        </div>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonBlock key={i} className="h-12" />)}
          </div>
        ) : recent.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">No expenses yet. Add your first one!</p>
        ) : (
          <div className="divide-y divide-white/5">
            {recent.map((exp, i) => (
              <motion.div key={exp._id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{exp.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{exp.category} · {new Date(exp.date).toLocaleDateString()}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white shrink-0 ml-3">{format(convert(exp.amount, exp.currency))}</p>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>

      <ExpenseFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleAdd} defaultCurrency={displayCurrency} />
    </div>
  );
}
