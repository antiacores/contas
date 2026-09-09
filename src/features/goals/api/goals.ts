import { supabase } from '../../../lib/supabase'
import type { Goal, GoalInput } from '../types'

// Igual que con accounts: se lee de la VISTA (incluye current_amount calculado),
// pero insert/update/delete operan sobre la TABLA base `goals`.

export async function listGoals(): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('goals_with_progress')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as Goal[]
}

async function fetchWithProgress(id: string): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals_with_progress')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Goal
}

export async function createGoal(input: GoalInput): Promise<Goal> {
  const { data, error } = await supabase.from('goals').insert(input).select().single()
  if (error) throw error
  return fetchWithProgress(data.id)
}

export async function updateGoal(id: string, input: GoalInput): Promise<Goal> {
  const { error } = await supabase.from('goals').update(input).eq('id', id)
  if (error) throw error
  return fetchWithProgress(id)
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase.from('goals').delete().eq('id', id)
  if (error) throw error
}