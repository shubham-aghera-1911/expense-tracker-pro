import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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

export default function RangeBarChart({ data }) {
  const { isDark } = useTheme();
  const tickColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  const cursorColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)';

  if (!data || !data.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-16">No daily spending recorded yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="day" tick={{ fill: tickColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: tickColor, fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorColor }} />
        <Bar dataKey="total" radius={[6, 6, 0, 0]} animationDuration={800}>
          {data.map((entry, index) => (
            <Cell key={index} fill="#34d8b5" fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
