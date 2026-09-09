import { Link } from 'react-router-dom'
import type { Goal } from '../types'

interface GoalCardProps {
  goal: Goal
}

const formatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 2,
})

const dateFormatter = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })

function daysRemaining(targetDate: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${targetDate}T00:00:00`)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function GoalCard({ goal }: GoalCardProps) {
  const percent = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
  const reached = goal.current_amount >= goal.target_amount
  const days = goal.target_date ? daysRemaining(goal.target_date) : null

  return (
    <Link
      to={`/metas/${goal.id}`}
      className="flex flex-col gap-3 rounded-card border border-bone bg-ivory p-5 hover:bg-bone/40 focus:outline-none focus:ring-2 focus:ring-slate/40"
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: goal.color }}
        />
        <span className="font-medium text-charcoal">{goal.name}</span>
        {reached && <span className="text-xs font-medium text-success">¡Meta cumplida!</span>}
      </div>

      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-bone"
      >
        <div
          className={`h-full rounded-full transition-all ${reached ? 'bg-success' : 'bg-charcoal'}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-charcoal">
          {formatter.format(goal.current_amount)} de {formatter.format(goal.target_amount)}
        </span>
        {goal.target_date && days !== null && (
          <span className={days < 0 ? 'text-error' : 'text-stone'}>
            {days < 0 ? 'Fecha vencida' : `${days} días`}
          </span>
        )}
      </div>

      {goal.target_date && (
        <p className="text-xs text-stone">Meta: {dateFormatter.format(new Date(`${goal.target_date}T00:00:00`))}</p>
      )}
    </Link>
  )
}