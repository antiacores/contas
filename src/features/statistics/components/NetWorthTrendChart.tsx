import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { NetWorthPoint } from '../netWorthHistory'

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

export function NetWorthTrendChart({ data }: { data: NetWorthPoint[] }) {
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
          tickFormatter={(v) => formatter.format(v)}
        />
        <Tooltip formatter={(value: any) => formatter.format(Number(value))} />
        <Line type="monotone" dataKey="total" name="Patrimonio" stroke="#2F2B28" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}