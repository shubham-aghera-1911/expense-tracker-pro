import { useState, useEffect, useCallback } from 'react';
import { Download, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import GlassCard from '../components/GlassCard';
import { SkeletonBlock, Spinner } from '../components/Loader';
import CategoryPieChart from '../components/charts/CategoryPieChart';
import RangeBarChart from '../components/charts/RangeBarChart';
import MonthlyTrendChart from '../components/charts/MonthlyTrendChart';
import { useCurrency } from '../context/CurrencyContext';

function formatMonthLabel(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function shiftMonth(monthStr, delta) {
  const [year, month] = monthStr.split('-').map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function Reports() {
  const { format, displayCurrency } = useCurrency();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [report, setReport] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const [reportRes, trendRes] = await Promise.all([
        api.get('/reports/monthly', { params: { month, currency: displayCurrency } }),
        api.get('/reports/trend', { params: { months: 6, currency: displayCurrency } }),
      ]);
      setReport(reportRes.data.data);
      setTrend(trendRes.data.data.trend);
    } catch (err) {
      toast.error('Could not load report');
    } finally {
      setLoading(false);
    }
  }, [month, displayCurrency]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const dailyData = report
    ? Object.entries(report.byDay).map(([day, total]) => ({ day: day.slice(8, 10), total }))
    : [];

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get('/reports/export/pdf', {
        params: { month, currency: displayCurrency },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `expense-report-${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Report exported');
    } catch (err) {
      toast.error('Could not export PDF');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Reports</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Monthly breakdown & exportable summaries</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || loading}
          className="focus-ring flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-glow hover:opacity-90 transition-opacity self-start disabled:opacity-60"
        >
          {exporting ? <Spinner size={16} /> : <Download size={16} />}
          Export PDF
        </button>
      </div>

      <GlassCard className="p-4 flex items-center justify-between">
        <button onClick={() => setMonth((m) => shiftMonth(m, -1))} className="focus-ring rounded-lg glass p-2 text-slate-600 dark:text-slate-300 hover:bg-white/10">
          <ChevronLeft size={16} />
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
          <Calendar size={16} className="text-brand-600 dark:text-brand-300" />
          {formatMonthLabel(month)}
        </div>
        <button
          onClick={() => setMonth((m) => shiftMonth(m, 1))}
          disabled={month >= new Date().toISOString().slice(0, 7)}
          className="focus-ring rounded-lg glass p-2 text-slate-600 dark:text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </GlassCard>

      <div className="grid grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonBlock key={i} className="h-24" />)
        ) : (
          <>
            <GlassCard className="p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Total spent</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white font-display mt-1 truncate">{format(report?.total || 0)}</p>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Transactions</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white font-display mt-1">{report?.count || 0}</p>
            </GlassCard>
            <GlassCard className="p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Avg / expense</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white font-display mt-1 truncate">{format(report?.average || 0)}</p>
            </GlassCard>
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <GlassCard className="p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Category breakdown</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{formatMonthLabel(month)}</p>
          {loading ? <SkeletonBlock className="h-64" /> : <CategoryPieChart data={report?.byCategory} />}
        </GlassCard>

        <GlassCard className="p-5 sm:p-6">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Daily spending</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{formatMonthLabel(month)}</p>
          {loading ? <SkeletonBlock className="h-64" /> : <RangeBarChart data={dailyData} />}
        </GlassCard>
      </div>

      <GlassCard className="p-5 sm:p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">6-month trend</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Total spend over time</p>
        {loading ? <SkeletonBlock className="h-64" /> : <MonthlyTrendChart data={trend} />}
      </GlassCard>
    </div>
  );
}
