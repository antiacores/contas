import { supabase } from '../../../lib/supabase'
import type { Budget, BudgetInput } from '../types'

const SELECT_WITH_CATEGORY = `*, category:categories(name, color)`

function mapRow(row: any): Budget {
  return {
    ...row,
    category_name: row.category?.name,
    category_color: row.category?.color,
  }
}

export async function listBudgets(): Promise<Budget[]> {
  const { data, error } = await supabase
    .from('budgets')
    .select(SELECT_WITH_CATEGORY)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapRow)
}

export async function createBudget(input: BudgetInput): Promise<Budget> {
  const { data, error } = await supabase
    .from('budgets')
    .insert(input)
    .select(SELECT_WITH_CATEGORY)
    .single()

  if (error) throw error
  return mapRow(data)
}

export async function updateBudget(id: string, input: BudgetInput): Promise<Budget> {
  const { data, error } = await supabase
    .from('budgets')
    .update(input)
    .eq('id', id)
    .select(SELECT_WITH_CATEGORY)
    .single()

  if (error) throw error
  return mapRow(data)
}

export async function deleteBudget(id: string): Promise<void> {
  const { error } = await supabase.from('budgets').delete().eq('id', id)
  if (error) throw error
}