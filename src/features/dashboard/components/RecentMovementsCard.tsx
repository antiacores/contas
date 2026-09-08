import { Link } from 'react-router-dom'
import { EmptyState } from './EmptyState'
import type { Movement } from '../../movements/types'

interface RecentMovementsCardProps {
  movements: Movement[]
  loading: boolean
}

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' })

function signedAmount(movement: Movement): number {
  if (movement.type === 'gasto' || movement.type === 'transferencia') return -Math.abs(movement.amount)
  if (movement.type === 'ingreso') return Math.abs(movement.amount)
  return movement.amount // ajuste
}

export function RecentMovementsCard({ movements, loading }: RecentMovementsCardProps) {
  return (
    <div className="flex flex-col rounded-card border border-bone bg-ivory p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-taupe">Últimos movimientos</h2>
        <Link to="/movimientos" className="text-sm font-medium text-charcoal underline">
          Ver todos
        </Link>
      </div>

      {loading ? (
        <p className="py-6 text-center text-sm text-stone">Cargando…</p>
      ) : movements.length === 0 ? (
        <EmptyState message="No hay movimientos." />
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-bone">
          {movements.map((movement) => {
            const amount = signedAmount(movement)
            return (
              <li key={movement.id} className="flex items-center justify-between py-3">
                <div className="flex flex-col">
                  <span className="text-charcoal">
                    {movement.description || movement.category_name || 'Movimiento'}
                  </span>
                  <span className="text-xs text-stone">
                    {dateFormatter.format(new Date(`${movement.date}T00:00:00`))} ·{' '}
                    {movement.account_name}
                  </span>
                </div>
                <span className={amount < 0 ? 'font-medium text-error' : 'font-medium text-success'}>
                  {formatter.format(amount)}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}