import type { Account } from '../accounts/types'
import type { Movement } from '../movements/types'
import type { GoalContribution } from '../goals/types'

const MONTH_ABBR = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export interface NetWorthPoint {
  label: string
  total: number
}

// Recalcula qué habría marcado accounts_with_balance en una fecha de corte pasada,
// replicando su misma fórmula pero "congelada" en el tiempo. No se guarda en la
// base de datos — se reconstruye en el cliente a partir del historial completo.
function totalNetWorthAt(
  accounts: Account[],
  movements: Movement[],
  contributions: GoalContribution[],
  cutoffDate: string,
): number {
  return accounts.reduce((total, account) => {
    let balance = account.initial_balance

    for (const m of movements) {
      if (m.date > cutoffDate) continue
      if (m.type === 'ingreso' && m.account_id === account.id) balance += m.amount
      else if (m.type === 'gasto' && m.account_id === account.id) balance -= m.amount
      else if (m.type === 'transferencia' && m.account_id === account.id) balance -= m.amount
      else if (m.type === 'transferencia' && m.transfer_account_id === account.id) balance += m.amount
      else if (m.type === 'ajuste' && m.account_id === account.id) balance += m.amount
    }

    for (const c of contributions) {
      if (c.date > cutoffDate) continue
      if (c.account_id === account.id) balance -= c.amount
    }

    return total + balance
  }, 0)
}

// Últimos `months` cierres de mes (incluye el mes actual, cortado a hoy).
export function buildNetWorthHistory(
  accounts: Account[],
  movements: Movement[],
  contributions: GoalContribution[],
  months = 6,
): NetWorthPoint[] {
  const points: NetWorthPoint[] = []
  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const year = now.getFullYear()
    const month = now.getMonth() - i
    const isCurrentMonth = i === 0

    const cutoff = isCurrentMonth
      ? now
      : new Date(year, month + 1, 0) // último día de ese mes

    const cutoffStr = cutoff.toISOString().slice(0, 10)
    const label = MONTH_ABBR[cutoff.getMonth()]

    points.push({
      label,
      total: totalNetWorthAt(accounts, movements, contributions, cutoffStr),
    })
  }

  return points
}