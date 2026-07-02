import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';

function CustomTooltip({ active, payload, label }) {
  const { format } = useCurrency();
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-lg px-3 py-2 text-xs shadow-glass-lg">
        <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
        <p className="text-slate-600 dark:text-slate-300">{format(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export default function MonthlyTrendChart({ data }) {
  const { isDark } = useTheme();
  const tickColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';

  if (!data || !data.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-16">Not enough data to show a trend yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.55} />
            <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="month" tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="total" stroke="#a78bfa" strokeWidth={2.5} fill="url(#trendFill)" animationDuration={900} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
