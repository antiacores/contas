import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import type { MonthlyTotal } from '../useStatistics'
import { useSettings } from '../../../lib/settings/useSettings'
import { formatCurrency } from '../../../lib/format'

export function MonthlyTrendChart({ data }: { data: MonthlyTotal[] }) {
  const { settings } = useSettings()
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid stroke="#ECE6DB" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#817768' }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 12, fill: '#817768' }}
          axisLine={false}
          tickLine={false}
          width={64}
          tickFormatter={(v) => formatCurrency(v, settings.currency)}
        />
        <Tooltip formatter={(value: any) => formatCurrency(Number(value), settings.currency)} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="ingresos" name="Ingresos" fill="#6F8E72" radius={[4, 4, 0, 0]} />
        <Bar dataKey="gastos" name="Gastos" fill="#A7645C" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}