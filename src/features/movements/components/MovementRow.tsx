import { ArrowRightLeft, Pencil, Repeat, Trash2 } from 'lucide-react'
import type { Movement } from '../types'
import { useSettings } from '../../../lib/settings/useSettings'
import { formatCurrency } from '../../../lib/format'

interface MovementRowProps {
  movement: Movement
  onEdit: () => void
  onDelete: () => void
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' })

function signedAmount(movement: Movement): number {
  if (movement.type === 'gasto') return -Math.abs(movement.amount)
  if (movement.type === 'ingreso') return Math.abs(movement.amount)
  if (movement.type === 'transferencia') return -Math.abs(movement.amount) // vista desde la cuenta origen
  return movement.amount // ajuste ya viene con su signo real
}

export function MovementRow({ movement, onEdit, onDelete }: MovementRowProps) {
  const { settings } = useSettings()
  const amount = signedAmount(movement)
  const title =
    movement.description ||
    movement.category_name ||
    (movement.type === 'transferencia' ? 'Transferencia' : 'Ajuste')

  return (
    <div className="flex items-center justify-between rounded-card border border-bone bg-ivory p-4">
      <div className="flex items-center gap-3">
        {movement.category_color && (
          <span
            aria-hidden="true"
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: movement.category_color }}
          />
        )}
        {movement.type === 'transferencia' && (
          <ArrowRightLeft size={16} className="shrink-0 text-stone" />
        )}
        <div>
          <p className="text-charcoal">{title}</p>
          <p className="flex items-center gap-1 text-xs text-stone">
            {dateFormatter.format(new Date(`${movement.date}T00:00:00`))} · {movement.account_name}
            {movement.type === 'transferencia' && movement.transfer_account_name
              ? ` → ${movement.transfer_account_name}`
              : ''}
            {movement.subscription_name && (
              <span className="ml-1 flex items-center gap-0.5 text-stone">
                <Repeat size={11} />
                {movement.subscription_name}
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`font-medium ${amount < 0 ? 'text-error' : 'text-success'}`}>
          {formatCurrency(amount, settings.currency)}
        </span>
        <div className="flex gap-1">
          <button
            onClick={onEdit}
            aria-label="Editar movimiento"
            className="rounded-button p-2 text-taupe hover:bg-bone focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            aria-label="Eliminar movimiento"
            className="rounded-button p-2 text-taupe hover:bg-bone hover:text-error focus:outline-none focus:ring-2 focus:ring-slate/40"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}