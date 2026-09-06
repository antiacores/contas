import { EmptyState } from './EmptyState'

export interface Movement {
  id: string
  description: string
  amount: number
  date: string
}

interface RecentMovementsCardProps {
  movements: Movement[]
}

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
})

export function RecentMovementsCard({ movements }: RecentMovementsCardProps) {
  return (
    <div className="flex flex-col rounded-card border border-bone bg-ivory p-6">
      <h2 className="text-sm font-medium text-taupe">Últimos movimientos</h2>

      {movements.length === 0 ? (
        <EmptyState message="No hay movimientos." />
      ) : (
        <ul className="mt-4 flex flex-col divide-y divide-bone">
          {movements.map((movement) => (
            <li key={movement.id} className="flex items-center justify-between py-3">
              <div className="flex flex-col">
                <span className="text-charcoal">{movement.description}</span>
                <span className="text-xs text-stone">{movement.date}</span>
              </div>
              <span
                className={movement.amount < 0 ? 'font-medium text-error' : 'font-medium text-success'}
              >
                {formatter.format(movement.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}