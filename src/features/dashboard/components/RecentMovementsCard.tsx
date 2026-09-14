import { EmptyState } from './EmptyState'
import type { Movement } from '../../movements/types'
import { useSettings } from '../../../lib/settings/useSettings'
import { formatCurrency } from '../../../lib/format'

interface RecentMovementsCardProps {
  movements: Movement[]
  loading: boolean
  // Modo compacto: se usa en la fila de 4 cards del dashboard, junto a
  // Saldo/Patrimonio/Balance — menos padding y máximo 3 movimientos.
  compact?: boolean
}

const dateFormatter = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' })

function signedAmount(movement: Movement): number {
  if (movement.type === 'gasto' || movement.type === 'transferencia') return -Math.abs(movement.amount)
  if (movement.type === 'ingreso') return Math.abs(movement.amount)
  return movement.amount // ajuste
}

export function RecentMovementsCard({ movements, loading, compact = false }: RecentMovementsCardProps) {
  const { settings } = useSettings()
  const visibleMovements = compact ? movements.slice(0, 3) : movements

  return (
    <div
      className={`flex flex-col rounded-card border border-bone bg-ivory ${compact ? 'p-4' : 'p-6'}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-taupe">Últimos movimientos</h2>
      </div>

      {loading ? (
        <p className="py-6 text-center text-sm text-stone">Cargando…</p>
      ) : visibleMovements.length === 0 ? (
        <EmptyState message="No hay movimientos." />
      ) : (
        <ul className="mt-2 flex flex-col divide-y divide-bone">
          {visibleMovements.map((movement) => {
            const amount = signedAmount(movement)
            return (
              <li key={movement.id} className={`flex items-center justify-between ${compact ? 'py-2' : 'py-3'}`}>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm text-charcoal">
                    {movement.description || movement.category_name || 'Movimiento'}
                  </span>
                  {!compact && (
                    <span className="text-xs text-stone">
                      {dateFormatter.format(new Date(`${movement.date}T00:00:00`))} ·{' '}
                      {movement.account_name}
                    </span>
                  )}
                </div>
                <span
                  className={`shrink-0 pl-2 text-sm font-medium ${amount < 0 ? 'text-error' : 'text-success'}`}
                >
                  {formatCurrency(amount, settings.currency)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}