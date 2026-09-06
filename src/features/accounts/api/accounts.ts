import { supabase } from '../../../lib/supabase'
import type { Account, AccountInput } from '../types'

// No hace falta pasar user_id manualmente: la columna tiene
// `default auth.uid()` en Postgres, y RLS ya filtra el resto.

export async function listAccounts(): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data as Account[]
}

export async function createAccount(input: AccountInput): Promise<Account> {
  const { data, error } = await supabase.from('accounts').insert(input).select().single()

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