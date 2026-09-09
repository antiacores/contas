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
}