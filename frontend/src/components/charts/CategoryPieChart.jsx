import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useCurrency } from '../../context/CurrencyContext';
import { useTheme } from '../../context/ThemeContext';

const COLORS = ['#a78bfa', '#34d8b5', '#f472b6', '#60a5fa', '#fbbf24', '#fb7185', '#4ade80', '#c084fc', '#38bdf8', '#facc15', '#f97316', '#94a3b8', '#e879f9'];

function CustomTooltip({ active, payload }) {
  const { format } = useCurrency();
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-lg px-3 py-2 text-xs shadow-glass-lg">
        <p className="font-semibold text-slate-900 dark:text-white">{payload[0].name}</p>
        <p className="text-slate-600 dark:text-slate-300">{format(payload[0].value)}</p>
      </div>
    );
  }
  return null;
}

export default function CategoryPieChart({ data }) {
  const { isDark } = useTheme();
  const entries = Object.entries(data || {}).filter(([, v]) => v > 0);

  if (!entries.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-16">No category data for this period yet.</p>;
  }

  const chartData = entries.map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={2}
          animationDuration={800}
        >
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} stroke="none" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          iconType="circle"
          wrapperStyle={{ fontSize: 12, color: isDark ? '#cbd5e1' : '#334155', maxHeight: 260, overflowY: 'auto' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
