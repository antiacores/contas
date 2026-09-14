import { CheckCircle2, Pause, Pencil, Play, Trash2 } from 'lucide-react'
import type { Debt } from '../types'
import { useSettings } from '../../../lib/settings/useSettings'
import { formatCurrency } from '../../../lib/format'

interface DebtCardProps {
  debt: Debt
  onRegisterPayment: () => void
  onToggleActive: () => void
  onEdit: () => void
  onDelete: () => void
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' })

export function DebtCard({ debt, onRegisterPayment, onToggleActive, onEdit, onDelete }: DebtCardProps) {
  const { settings } = useSettings()
  const isPaidOff = debt.remaining_balance <= 0
  const paid = debt.total_amount - Math.max(debt.remaining_balance, 0)
  const percent = Math.min((paid / debt.total_amount) * 100, 100)

  return (
    <div className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: debt.color }}
          />
          <span className="font-medium text-charcoal">{debt.name}</span>
          {isPaidOff && (
            <span className="rounded-button bg-success/20 px-2 py-0.5 text-xs font-medium text-success">
              Liquidada
            </span>
          )}
          {!isPaidOff && !debt.active && (
            <span className="rounded-button bg-bone px-2 py-0.5 text-xs text-taupe">Archivada</span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            aria-label={`Editar ${debt.name}`}
            className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onToggleActive}
            aria-label={debt.active ? 'Archivar' : 'Reactivar'}
            className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            {debt.active ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            onClick={onDelete}
            aria-label={`Eliminar ${debt.name}`}
            className="rounded-button p-2 text-taupe hover:bg-bone hover:text-error focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-bone"
      >
        <div
          className={`h-full rounded-full transition-all ${isPaidOff ? 'bg-success' : 'bg-charcoal'}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-charcoal">
          {formatCurrency(Math.max(debt.remaining_balance, 0), settings.currency)} restante de{' '}
          {formatCurrency(debt.total_amount, settings.currency)}
        </span>
        <span className="text-stone">
          {debt.interest_rate ? `${debt.interest_rate}% interés` : 'Sin interés'}
        </span>
      </div>

      {debt.active && !isPaidOff && (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm text-stone">
            Pago mensual {formatCurrency(debt.monthly_payment, settings.currency)} · próximo:{' '}
            {dateFormatter.format(new Date(`${debt.next_due_date}T00:00:00`))}
          </span>
          <button
            onClick={onRegisterPayment}
            className="flex items-center gap-1.5 rounded-button bg-charcoal px-3 py-1.5 text-sm font-medium text-warm-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <CheckCircle2 size={14} />
            Registrar pago
          </button>
        </div>
      )}
    </div>
  )
}