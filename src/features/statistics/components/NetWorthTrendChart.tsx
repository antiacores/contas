import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { NetWorthPoint } from '../netWorthHistory'
import { useSettings } from '../../../lib/settings/useSettings'
import { formatCurrency } from '../../../lib/format'

export function NetWorthTrendChart({ data }: { data: NetWorthPoint[] }) {
  const { settings } = useSettings()
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ECE6DB" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#817768' }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 12, fill: '#817768' }}
          axisLine={false}
          tickLine={false}
          width={70}
          tickFormatter={(v) => formatCurrency(v, settings.currency)}
        />
        <Tooltip formatter={(value: any) => formatCurrency(Number(value), settings.currency)} />
        <Line type="monotone" dataKey="total" name="Patrimonio" stroke="#2F2B28" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}