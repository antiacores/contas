import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { CategorySlice } from '../useStatistics'
import { useSettings } from '../../../lib/settings/useSettings'
import { formatCurrency } from '../../../lib/format'

export function CategoryBreakdownChart({ data }: { data: CategorySlice[] }) {
  const { settings } = useSettings()

  if (data.length === 0) {
    return <p className="py-16 text-center text-sm text-stone">No hay gastos en este periodo.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip formatter={(value: any) => formatCurrency(Number(value), settings.currency)} />
        <Legend verticalAlign="bottom" height={48} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}