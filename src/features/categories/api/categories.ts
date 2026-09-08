import { supabase } from '../../../lib/supabase'
import type { Category, CategoryInput } from '../types'

export async function listCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('position', { ascending: true })

  if (error) throw error
  return data as Category[]
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const { count } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })

  const { data, error } = await supabase
    .from('categories')
    .insert({ ...input, position: count ?? 0 })
    .select()
    .single()

  if (error) throw error
  return data as Category
}

export async function createCategories(inputs: CategoryInput[]): Promise<void> {
  const { count } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })

  const rows = inputs.map((input, index) => ({ ...input, position: (count ?? 0) + index }))
  const { error } = await supabase.from('categories').insert(rows)
  if (error) throw error
}

export async function updateCategory(id: string, input: CategoryInput): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Category
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}