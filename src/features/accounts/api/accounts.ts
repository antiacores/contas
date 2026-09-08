import { supabase } from '../../../lib/supabase'
import type { Account, AccountInput } from '../types'

// Se lee de la VISTA (incluye current_balance calculado).
// Los CRUD (insert/update/delete) siguen operando sobre la TABLA base `accounts`,
// porque una vista con agregación no se puede escribir directamente.

export async function listAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts_with_balance')
    .select('*')
    .order('position', { ascending: true })

  if (error) throw error
  return data as Account[]
}

async function fetchWithBalance(id: string): Promise<Account> {
  const { data, error } = await supabase
    .from('accounts_with_balance')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Account
}

export async function createAccount(input: AccountInput): Promise<Account> {
  const { count } = await supabase
    .from('accounts')
    .select('*', { count: 'exact', head: true })

  const { data, error } = await supabase
    .from('accounts')
    .insert({ ...input, position: count ?? 0 })
    .select()
    .single()

  if (error) throw error
  return fetchWithBalance(data.id)
}

export async function updateAccount(id: string, input: AccountInput): Promise<Account> {
  const { error } = await supabase.from('accounts').update(input).eq('id', id)
  if (error) throw error
  return fetchWithBalance(id)
}

export async function deleteAccount(id: string): Promise<void> {
  const { error } = await supabase.from('accounts').delete().eq('id', id)
  if (error) throw error
}

export async function reorderAccounts(orderedIds: string[]): Promise<void> {
  const updates = orderedIds.map((id, index) =>
    supabase.from('accounts').update({ position: index }).eq('id', id),
  )
  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}