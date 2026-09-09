import { Pencil, Trash2 } from 'lucide-react'
import type { BudgetWithProgress } from '../types'

interface BudgetProgressCardProps {
  budget: BudgetWithProgress
  isAnnual: boolean
  onEdit: () => void
  onDelete: () => void
}

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
})

export function BudgetProgressCard({ budget, isAnnual, onEdit, onDelete }: BudgetProgressCardProps) {
  const percent = Math.min((budget.spent / budget.target) * 100, 100)
  const isOver = budget.spent > budget.target
  const isNearLimit = !isOver && percent >= 80

  const barColor = isOver ? 'bg-error' : isNearLimit ? 'bg-warning' : 'bg-success'
  const textColor = isOver ? 'text-error' : 'text-charcoal'

  return (
    <div className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {budget.category_color && (
            <span
              aria-hidden="true"
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: budget.category_color }}
            />
          )}
          <span className="font-medium text-charcoal">{budget.category_name}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            aria-label={`Editar presupuesto de ${budget.category_name}`}
            className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            aria-label={`Eliminar presupuesto de ${budget.category_name}`}
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
        aria-label={`${budget.category_name}: ${Math.round(percent)}% del presupuesto usado`}
        className="h-2 w-full overflow-hidden rounded-full bg-bone"
      >
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className={textColor}>
          {formatter.format(budget.spent)} de {formatter.format(budget.target)}
        </span>
        {isOver && <span className="font-medium text-error">Excedido</span>}
        {isNearLimit && <span className="font-medium text-warning">Cerca del límite</span>}
      </div>

      {isAnnual && (
        <p className="text-xs text-stone">Presupuesto mensual: {formatter.format(budget.amount)}</p>
      )}
    </div>
  )
}