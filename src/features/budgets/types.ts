export interface Budget {
  id: string
  user_id: string
  category_id: string
  amount: number
  created_at: string
  category_name?: string
  category_color?: string
}

export type BudgetInput = Pick<Budget, 'category_id' | 'amount'>

export interface BudgetWithProgress extends Budget {
  spent: number
  target: number // amount, o amount x 12 si se está viendo el año completo
}

// month: 0-11 (como Date de JS) — null significa "ver el año completo".
export interface BudgetPeriod {
  year: number
  month: number | null
}

export function currentPeriod(): BudgetPeriod {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() }
}