import { supabase } from '../../../lib/supabase'
import type { GoalContribution, GoalContributionInput } from '../types'

const SELECT_WITH_ACCOUNT = `*, account:accounts(name)`

function mapRow(row: any): GoalContribution {
  return { ...row, account_name: row.account?.name ?? null }
}

export async function listContributions(goalId: string): Promise<GoalContribution[]> {
  const { data, error } = await supabase
    .from('goal_contributions')
    .select(SELECT_WITH_ACCOUNT)
    .eq('goal_id', goalId)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapRow)
}

export async function createContribution(input: GoalContributionInput): Promise<GoalContribution> {
  const { data, error } = await supabase
    .from('goal_contributions')
    .insert(input)
    .select(SELECT_WITH_ACCOUNT)
    .single()

  if (error) throw error
  return mapRow(data)
}

export async function deleteContribution(id: string): Promise<void> {
  const { error } = await supabase.from('goal_contributions').delete().eq('id', id)
  if (error) throw error
}