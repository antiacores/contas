export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  target_date: string | null
  color: string
  created_at: string
  current_amount: number // calculado en la vista goals_with_progress
}

export type GoalInput = Pick<Goal, 'name' | 'target_amount' | 'target_date' | 'color'>

export interface GoalContribution {
  id: string
  user_id: string
  goal_id: string
  amount: number
  date: string
  note: string | null
  created_at: string
}

export type GoalContributionInput = Pick<GoalContribution, 'goal_id' | 'amount' | 'date' | 'note'>