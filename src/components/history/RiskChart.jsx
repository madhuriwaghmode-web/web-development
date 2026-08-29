import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatDate } from '../../utils/formatters'

export default function RiskChart({ screenings }) {
  const data = [...screenings]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((s) => ({ date: formatDate(s.date, { day: '2-digit', month: 'short' }), risk: s.classification?.riskScore ?? 0 }))

  if (data.length < 2) {
    return <p className="text-sm text-slate-400 py-8 text-center">Risk progression will appear once at least two screenings are recorded.</p>
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13 }} formatter={(v) => [`${v}%`, 'Risk Score']} />
          <Line type="monotone" dataKey="risk" stroke="#c53030" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
