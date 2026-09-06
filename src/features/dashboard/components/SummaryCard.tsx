import type { ReactNode } from 'react'
import { EmptyState } from './EmptyState'

interface SummaryCardProps {
  label: string
  value: number | null
  currency?: string
  emptyMessage: string
  icon?: ReactNode
}

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
})

// Card de resumen usada para Saldo, Patrimonio y Balance mensual.
// value=null representa "todavía no hay datos", no "el saldo es cero" —
// son dos cosas distintas y no deben confundirse en la UI.
export function SummaryCard({ label, value, emptyMessage, icon }: SummaryCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-card border border-bone bg-ivory p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-taupe">{label}</span>
        {icon}
      </div>

      {value === null ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <span className="mt-4 text-2xl font-semibold text-charcoal">{formatter.format(value)}</span>
      )}
    </div>
  )
}