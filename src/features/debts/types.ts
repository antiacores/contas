export interface Debt {
  id: string
  user_id: string
  name: string
  total_amount: number
  interest_rate: number | null
  monthly_payment: number
  next_due_date: string
  account_id: string
  color: string
  active: boolean
  created_at: string
  remaining_balance: number // calculado en la vista debts_with_balance
  // Enriquecido vía join, solo lectura:
  account_name?: string
}

export type DebtInput = Pick<
  Debt,
  'name' | 'total_amount' | 'interest_rate' | 'monthly_payment' | 'next_due_date' | 'account_id' | 'color' | 'active'
>

export interface DebtPayment {
  id: string
  user_id: string
  debt_id: string
  amount: number
  date: string
  created_at: string
}