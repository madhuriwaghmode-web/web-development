import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS = { low: '#1b8a5a', moderate: '#b8860b', high: '#c53030' }

export default function RiskDistributionChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={COLORS[entry.key] || '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} />
          <Legend verticalAlign="bottom" height={32} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      {total === 0 && (
        <div className="absolute inset-0 top-0 grid place-items-center text-sm text-slate-400 pb-8">
          No data yet
        </div>
      )}
    </div>
  )
}
