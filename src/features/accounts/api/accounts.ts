import { supabase } from '../../../lib/supabase'
import type { Account, AccountInput } from '../types'

// No hace falta pasar user_id manualmente: la columna tiene
// `default auth.uid()` en Postgres, y RLS ya filtra el resto.

export async function listAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('position', { ascending: true })

  if (error) throw error
  return data as Account[]
}

export async function createAccount(input: AccountInput): Promise<Account> {
  // Nueva cuenta va al final del orden actual.
  const { count } = await supabase
    .from('accounts')
    .select('*', { count: 'exact', head: true })

  const { data, error } = await supabase
    .from('accounts')
    .insert({ ...input, position: count ?? 0 })
    .select()
    .single()

  if (error) throw error
  return data as Account
}

export async function updateAccount(id: string, input: AccountInput): Promise<Account> {
  const { data, error } = await supabase
    .from('accounts')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Account
}

export async function deleteAccount(id: string): Promise<void> {
  const { error } = await supabase.from('accounts').delete().eq('id', id)
  if (error) throw error
}

export async function reorderAccounts(orderedIds: string[]): Promise<void> {
  // Una actualización por fila: dnd-kit ya nos da el arreglo completo
  // en el nuevo orden, solo hay que persistir el índice de cada una.
  const updates = orderedIds.map((id, index) =>
    supabase.from('accounts').update({ position: index }).eq('id', id),
  )
  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}