import { supabase } from '../../../lib/supabase'
import type { GoalContribution, GoalContributionInput } from '../types'

export async function listContributions(goalId: string): Promise<GoalContribution[]> {
  const { data, error } = await supabase
    .from('goal_contributions')
    .select('*')
    .eq('goal_id', goalId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as GoalContribution[]
}

export async function createContribution(input: GoalContributionInput): Promise<GoalContribution> {
  const { data, error } = await supabase.from('goal_contributions').insert(input).select().single()
  if (error) throw error
  return data as GoalContribution
}

export async function deleteContribution(id: string): Promise<void> {
  const { error } = await supabase.from('goal_contributions').delete().eq('id', id)
  if (error) throw error
}