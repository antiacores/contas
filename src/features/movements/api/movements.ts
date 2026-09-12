import { supabase } from '../../../lib/supabase'
import type { Movement, MovementFilters, MovementInput } from '../types'

const SELECT_WITH_JOINS = `
  *,
  account:accounts!movements_account_id_fkey(name),
  transfer_account:accounts!movements_transfer_account_id_fkey(name),
  category:categories(name, color),
  subscription:subscriptions(name)
`

// Supabase devuelve los joins anidados; esta función los "aplana"
// a los campos *_name que usa la UI, para no repetir este mapeo en cada pantalla.
function mapRow(row: any): Movement {
  return {
    ...row,
    account_name: row.account?.name,
    transfer_account_name: row.transfer_account?.name ?? null,
    category_name: row.category?.name ?? null,
    category_color: row.category?.color ?? null,
    subscription_name: row.subscription?.name ?? null,
  }
}

export async function listMovements(filters: MovementFilters, limit?: number): Promise<Movement[]> {
  let query = supabase
    .from('movements')
    .select(SELECT_WITH_JOINS)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filters.type !== 'todos') {
    query = query.eq('type', filters.type)
  }
  if (filters.accountId !== 'todas') {
    query = query.eq('account_id', filters.accountId)
  }
  if (filters.dateFrom) {
    query = query.gte('date', filters.dateFrom)
  }
  if (filters.dateTo) {
    query = query.lte('date', filters.dateTo)
  }
  if (limit) {
    query = query.limit(limit)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(mapRow)
}

export async function createMovement(input: MovementInput): Promise<Movement> {
  const { data, error } = await supabase
    .from('movements')
    .insert(input)
    .select(SELECT_WITH_JOINS)
    .single()

  if (error) throw error
  return mapRow(data)
}

export async function updateMovement(id: string, input: MovementInput): Promise<Movement> {
  const { data, error } = await supabase
    .from('movements')
    .update(input)
    .eq('id', id)
    .select(SELECT_WITH_JOINS)
    .single()

  if (error) throw error
  return mapRow(data)
}

export async function deleteMovement(id: string): Promise<void> {
  const { error } = await supabase.from('movements').delete().eq('id', id)
  if (error) throw error
}